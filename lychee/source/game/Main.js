
lychee.define('lychee.game.Main').requires([
	'lychee.Input',
	'lychee.Renderer',
	'lychee.Storage',
	'lychee.Viewport',
	'lychee.event.Promise',
	'lychee.game.Jukebox',
	'lychee.game.Logic',
	'lychee.game.Loop',
	'lychee.game.State',
	'lychee.net.Client',
	'lychee.net.Server'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _load_api = function(url, callback, scope) {

		url = typeof url === 'string' ? url : 'http://lycheejs.org/api/Server?identifier=boilerplate';


		var config = new Config(url);

		config.onload = function(result) {
			callback.call(scope, result === true ? this.buffer : null);
		};

		config.load();

	};

	var _initialize = function() {

		this.trigger('load', []);


		var settings = this.settings;

		if (settings.client !== null) {
			this.client = new lychee.net.Client(settings.client);
			this.client.connect();
		}

		if (settings.server !== null) {
			this.server = new lychee.net.Server(settings.server);
			this.server.connect();
		}

		if (settings.input !== null) {
			this.input = new lychee.Input(settings.input);
		}

		if (settings.jukebox !== null) {
			this.jukebox = new lychee.game.Jukebox(settings.jukebox);
		}

		if (settings.logic !== null) {
			this.logic = new lychee.game.Logic(settings.logic);
		}

		if (settings.loop !== null) {
			this.loop = new lychee.game.Loop(settings.loop);
			this.loop.bind('render', this.render, this);
			this.loop.bind('update', this.update, this);
		}

		if (settings.renderer !== null) {
			this.renderer = new lychee.Renderer(settings.renderer);
		}

		if (settings.storage !== null) {
			this.storage = new lychee.Storage(settings.storage);
		}

		if (settings.viewport !== null) {

			this.viewport = new lychee.Viewport();
			this.viewport.bind('reshape', this.reshape, this);
			this.viewport.bind('hide',    this.hide,    this);
			this.viewport.bind('show',    this.show,    this);

			this.viewport.setFullscreen(settings.viewport.fullscreen);

		}


		this.trigger('init', []);

	};



	/*
	 * DEFAULT SETTINGS
	 * and SERIALIZATION CACHE
	 */

	var _defaults = {

		client: null,
		server: null,

		input: {
			delay:       0,
			key:         false,
			keymodifier: false,
			touch:       true,
			swipe:       false
		},

		jukebox: {
			channels: 8,
			music:    true,
			sound:    true
		},

		logic: {
			projection: lychee.game.Logic.PROJECTION.pixel
		},

		loop: {
			render: 60,
			update: 60
		},

		renderer: {
			width:      null,
			height:     null,
			id:         'game',
			background: '#222222'
		},

		storage: {
			id:    'game',
			model: {},
			type:  lychee.Storage.TYPE.persistent
		},

		viewport: {
			fullscreen: false
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(settings) {

		this.settings = lychee.extendunlink({}, _defaults, settings);
		this.defaults = lychee.extendunlink({}, this.settings);

		this.client   = null;
		this.server   = null;

		this.input    = null;
		this.jukebox  = null;
		this.logic    = null;
		this.loop     = null;
		this.renderer = null;
		this.storage  = null;
		this.viewport = null;

		this.state    = null;
		this.__states = {};


		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.client instanceof Object)   this.client   = lychee.deserialize(blob.client);
			if (blob.server instanceof Object)   this.server   = lychee.deserialize(blob.server);

			if (blob.input instanceof Object)    this.input    = lychee.deserialize(blob.input);
			if (blob.jukebox instanceof Object)  this.jukebox  = lychee.deserialize(blob.jukebox);
			if (blob.logic instanceof Object)    this.logic    = lychee.deserialize(blob.logic);
			if (blob.loop instanceof Object)     this.loop     = lychee.deserialize(blob.loop);
			if (blob.renderer instanceof Object) this.renderer = lychee.deserialize(blob.renderer);
			if (blob.storage instanceof Object)  this.storage  = lychee.deserialize(blob.storage);
			if (blob.viewport instanceof Object) this.viewport = lychee.deserialize(blob.viewport);


			if (blob.states instanceof Object) {

				for (var id in blob.states) {

					var stateblob = blob.states[id];

					for (var a = 0, al = stateblob.arguments.length; a < al; a++) {
						if (stateblob.arguments[a] === '#MAIN') {
							stateblob.arguments[a] = this;
						}
					}

					this.setState(id, lychee.deserialize(stateblob));

				}

			}

		},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.game.Main';

			var settings = lychee.extendunlink({}, this.settings);
			var blob     = data['blob'] || {};


			if (this.client !== null)   blob.client   = lychee.serialize(this.client);
			if (this.server !== null)   blob.server   = lychee.serialize(this.server);

			if (this.input !== null)    blob.input    = lychee.serialize(this.input);
			if (this.jukebox !== null)  blob.jukebox  = lychee.serialize(this.jukebox);
			if (this.logic !== null)    blob.logic    = lychee.serialize(this.logic);
			if (this.loop !== null)     blob.loop     = lychee.serialize(this.loop);
			if (this.renderer !== null) blob.renderer = lychee.serialize(this.renderer);
			if (this.storage !== null)  blob.storage  = lychee.serialize(this.storage);
			if (this.viewport !== null) blob.viewport = lychee.serialize(this.viewport);


			if (Object.keys(this.__states).length > 0) {

				blob.states = {};

				for (var id in this.__states) {
					blob.states[id] = lychee.serialize(this.__states[id]);
				}

			}


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * LOOP INTEGRATION
		 */

		render: function(clock, delta) {

			if (this.state !== null) {
				this.state.render(clock, delta);
			}

		},

		update: function(clock, delta) {

			if (this.state !== null) {
				this.state.update(clock, delta);
			}

		},



		/*
		 * VIEWPORT INTEGRATION
		 */

		show: function() {

			var loop = this.loop;
			if (loop !== null) {
				loop.resume();
			}

			var state = this.state;
			if (state !== null) {
				state.show();
			}

		},

		hide: function() {

			var loop = this.loop;
			if (loop !== null) {
				loop.pause();
			}

			var state = this.state;
			if (state !== null) {
				state.hide();
			}

		},

		reshape: function(orientation, rotation) {

			var renderer = this.renderer;
			if (renderer !== null) {

				var settings = this.settings;
				if (settings.renderer !== null) {
					renderer.setWidth(settings.renderer.width);
					renderer.setHeight(settings.renderer.height);
				}

			}


			for (var id in this.__states) {

				var state = this.__states[id];

				state.reshape(
					orientation,
					rotation
				);

			}

		},



		/*
		 * INITIALIZATION
		 */

		init: function() {

			var promise    = new lychee.event.Promise();
			var client_api = this.settings.client;
			var server_api = this.settings.server;


			if (typeof client_api === 'string') {

				promise.then(function(result) {

					_load_api(client_api, function(settings) {
						this.settings.client = lychee.extend({}, settings);
						result(settings !== null);
					}, this);

				}, this);

			}

			if (typeof server_api === 'string') {

				promise.then(function(result) {

					_load_api(server_api, function(settings) {
						this.settings.server = lychee.extend({}, settings);
						result(settings !== null);
					}, this);

				}, this);

			}


			promise.bind('ready', function() {
				_initialize.call(this);
			}, this, true);

			promise.bind('error', function() {
				_initialize.call(this);
			}, this, true);

			promise.init();

		},



		/*
		 * STATE MANAGEMENT
		 */

		setState: function(id, state) {

			id = typeof id === 'string' ? id : null;


			if (lychee.interfaceof(lychee.game.State, state)) {

				if (id !== null) {

					this.__states[id] = state;

					return true;

				}

			}


			return false;

		},

		getState: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.__states[id] !== undefined) {
				return this.__states[id];
			}


			return null;

		},

		removeState: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.__states[id] !== undefined) {

				delete this.__states[id];

				if (this.state === this.__states[id]) {
					this.changeState(null);
				}

				return true;

			}


			return false;

		},

		changeState: function(id, data) {

			id   = typeof id === 'string' ? id   : null;
			data = data instanceof Object ? data : null;


			var oldstate = this.state;
			var newstate = this.__states[id] || null;

			if (newstate !== null) {

				if (oldstate !== null) {
					oldstate.leave();
				}

				if (newstate !== null) {
					newstate.enter(data);
				}

				this.state = newstate;

			} else {

				if (oldstate !== null) {
					oldstate.leave();
				}

				this.state = null;

			}


			return true;

		}

	};


	return Class;

});

