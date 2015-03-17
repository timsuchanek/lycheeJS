
lychee.define('tool.Main').requires([
	'lychee.data.JSON',
	'tool.data.SPRITE'
]).includes([
	'lychee.game.Main'
]).tags({
	platform: 'html'
}).exports(function(lychee, tool, global, attachments) {

	var _SPRITE     = tool.data.SPRITE;
	var _JSON       = lychee.data.JSON;

	var _definition = attachments["Entity.tpl"];



	/*
	 * HELPERS
	 */

	var _download = function(filename, buffer) {

		filename = typeof filename === 'string' ? filename : null;
		buffer   = buffer instanceof Buffer     ? buffer   : null;


		if (filename !== null && buffer !== null) {

			var ext  = filename.split('.').pop();
			var type = 'plain/text';
			if (ext.match(/fnt|json/)) {
				type = 'application/json';
			} else if (ext.match(/png/)) {
				type = 'image/png';
			} else if (ext.match(/js/)) {
				type = 'text/javascript';
			}

			var url     = 'data:' + type + ';base64,' + buffer.toString('base64');
			var event   = document.createEvent('MouseEvents');
			var element = document.createElement('a');


			element.download = filename;
			element.href     = url;

			event.initMouseEvent(
				'click',
				true,
				false,
				window,
				0,
				0,
				0,
				0,
				0,
				false,
				false,
				false,
				false,
				0,
				null
			);

			element.dispatchEvent(event);


			return true;

		}


		return false;

	};

	var _update_preview = function(blob) {

		var data = _JSON.decode(blob);
		if (data instanceof Object) {

			if (data.texture !== null) {

				var img = document.querySelector('img#preview-texture');
				if (img !== null) {
					img.src = data.texture;
				}

			}


			var button1 = document.querySelector('button#preview-download-definition');
			if (button1 !== null) {

				var buffer1 = new Buffer(_definition.buffer, 'utf8');

				button1.onclick = function() {
					_download('Entity.js', buffer1);
				};

			}

			var button2 = document.querySelector('button#preview-download-config');
			if (button2 !== null) {

				var buffer2 = new Buffer(data.config.substr(29), 'base64');

				button2.onclick = function() {
					_download('Entity.json', buffer2);
				};

			}

			var button3 = document.querySelector('button#preview-download-texture');
			if (button3 !== null) {

				var buffer3 = new Buffer(data.texture.substr(22), 'base64');

				button3.onclick = function() {
					_download('Entity.png', buffer3);
				};

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var _SIZES = {
		1: 64,
		2: 128,
		3: 256,
		4: 512,
		5: 1024,
		6: 2048,
		7: 4096,
		8: 8192
	};

	var Class = function(data) {

		var settings = lychee.extend({

			client:   null,
			input:    null,
			jukebox:  null,
			renderer: null,
			server:   null,

			viewport: {
				fullscreen: false
			}

		}, data);


		this.locked  = false;

		this.__files = [];


		lychee.game.Main.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('init', function() {

		}, this, true);

		this.bind('upload', function(instance) {

			this.__files.push(instance);

		}, this);

		this.bind('submit', function(id, settings) {

			if (id === 'settings') {

				if (this.locked === false) {

					this.locked = true;

					this.loop.setTimeout(100, function() {

						settings.files   = [].slice.call(this.__files);
						settings.texture = _SIZES[settings.size];


						var sprite = _SPRITE.encode(settings);
						if (sprite !== null) {
							_update_preview(sprite);
						}

						this.locked = false;

					}, this);

				}

			}

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});
