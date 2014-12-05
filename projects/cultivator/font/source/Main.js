
lychee.define('tool.Main').requires([
	'lychee.data.JSON',
	'tool.data.FNT'
]).includes([
	'lychee.game.Main'
]).tags({
	platform: 'html'
}).exports(function(lychee, tool, global, attachments) {

	var _FNT  = tool.data.FNT;
	var _JSON = lychee.data.JSON;



	/*
	 * HELPERS
	 */

	var _update_preview = function(image, json) {

		var img = document.querySelector('img#preview-texture');
		if (img !== null) {
			img.src = image;
		}

		var pre = document.querySelector('pre#preview-json');
		if (pre !== null) {
			pre.innerText = json;
		}

	};



	/*
	 * IMPLEMENTATION
	 */

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


		lychee.game.Main.call(this, settings);



		/*
		 * INITIALIZATIOn
		 */

		this.bind('load', function() {

		}, this, true);

		this.bind('init', function() {

			var onsubmit = document.querySelector('form').onsubmit;
			if (onsubmit instanceof Function) {
				onsubmit();
			}

		}, this, true);


		this.bind('submit', function(id, settings) {

			if (id === 'settings') {

				var json = _FNT.encode(settings);
				if (json !== null) {

					var data = _JSON.decode(json);
					if (data instanceof Object && data.texture !== null) {
						_update_preview(data.texture, json);
					}

				}

			}

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});
