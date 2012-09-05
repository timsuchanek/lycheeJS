
// Preloader is platform specific and required for lychee.Builder
(function(lychee, global) {

	var _loading = {},
		_assets = {},
		_data = {},
		_alreadyFired = {},
		_globalIntervalId = null;


	var Class = function(settings) {

		this.settings = lychee.extend({}, this.defaults, settings);

		this.__events = {};
		this.__lastLoadStart = null;

	};


	Class.prototype = {

		defaults: {
			interval:  100,
			timeout:  5000
		},

		bind: function(event, callback, scope) {

			event = typeof event === 'string' ? event : null;
			callback = callback instanceof Function ? callback : null;
			scope = scope !== undefined ? scope : this;


			if (event !== null && callback !== null) {

				this.__events[event] = {
					callback: callback,
					scope: scope
				};

			}

		},

		unbind: function(event) {

			event = typeof event === 'string' ? event : null;


			if (event !== null && this.__events[event] !== undefined) {
				delete this.__events[event];
			}

		},

		trigger: function(event, args) {

			args = Object.prototype.toString.call(args) === '[object Array]' ? args : [];


			if (this.__events[event] !== undefined) {
				this.__events[event].callback.apply(this.__events[event].scope, args);
			}

		},

		load: function(urls, data, forced) {

			data = data !== undefined ? data : null;
			forced = typeof forced === 'string' ? forced : null;


			this.__lastLoadStart = Date.now();

			if (Object.prototype.toString.call(urls) !== '[object Array]') {
				urls = [ urls ];
			}

			if (_globalIntervalId === null) {

				var that = this;
				_globalIntervalId = global.setInterval(function() {
					that.__loop();
				}, this.settings.interval);

			}


			for (var u = 0, l = urls.length; u < l; u++) {

				var url = urls[u];
				var tmp = url.split(/\./);
				var ext = tmp[tmp.length - 1];


				_data[url] = data;

				this.__load(url, forced || ext);

			}

		},

		get: function(url) {

			if (_assets[url] !== undefined) {
				return _assets[url];
			}


			return null;

		},

		__loop: function() {

			var isReady = true;

			var url;
			for (url in _loading) {
				if (_assets[url] === undefined) {
					isReady = false;
				}
			}


			var timedOut = false;
			if (this.__lastLoadStart !== null) {
				timedOut = Date.now() >= this.__lastLoadStart + this.settings.timeout;
			}


			var filtered = {};
			var data = {};
			var errors = {};
			if (
				isReady === true
				|| (timedOut && _globalIntervalId !== null)
			) {


				global.clearInterval(_globalIntervalId);
				_globalIntervalId = null;


				// 1. Handle Loading Failures
				if (timedOut) {

					for (var id in _loading) {
						if (timedOut && _loading[id] === true && _alreadyFired[id] !== true) {
							_alreadyFired[id] = true;
							errors[id] = _data[id] || null;
						}
					}

				}


				// 2. Handle (parsed) Assets
				for (var id in _assets) {
					if (_alreadyFired[id] !== true) {

						_alreadyFired[id] = true;

						// 2.1. Handle incorrect MIME types
						if (_assets[id] === null) {

							errors[id] = _data[id] || null;


						// 2.2. Handle correct MIME types
						} else {

							filtered[id] = _assets[id];
							data[id] = _data[id] || null;

						}

					}
				}

				if (Object.keys(errors).length > 0) {
					this.trigger('error', [ errors ]);
				}


				this.trigger('ready', [ filtered, data ]);

			}

		},

		__load: function(url, type) {

			var that = this;

			if (type.match(/jpg|jpeg|png|bmp|gif/)) {

				_loading[url] = true;

				var texture = new Texture(url);

				texture.onload = function() {
					_loading[url] = false;
					_assets[url] = this;
				};

				texture.load();

			} else if (type === 'css') {

				// Ignore CSS in V8GL

				_loading[url] = false;
				_assets[url] = '';

			} else if (type === 'js') {

				_loading[url] = true;

				var script = new Script(url);

				script.onload = function() {
					_loading[url] = false;
					_assets[url] = this.data;
				};

				script.load();
				script.execute();

			} else if (type === 'json') {

				_loading[url] = true;

				var text = new Text(url);

				text.onload = function() {

					var raw = this.data;
					var data = null;
					try {
						data = JSON.parse(raw);
					} catch(e) {
						console.warn('JSON file at ' + url + ' is invalid.');
					}


					_loading[url] = false;
					_assets[url] = data;

				};

				text.load();

			} else {

				_loading[url] = true;

				var text = new Text(url);

				text.onload = function() {

					_loading[url] = false;
					_assets[url] = this.data;

				};

				text.load();

			}

		}

	};


	lychee.Preloader = Class;

})(this.lychee, this);

