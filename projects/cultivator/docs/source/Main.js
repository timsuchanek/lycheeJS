
lychee.define('tool.Main').requires([
	'lychee.data.JSON'
]).includes([
	'lychee.game.Main'
]).tags({
	platform: 'html'
}).exports(function(lychee, tool, global, attachments) {

	var _JSON = lychee.data.JSON;



	/*
	 * HELPERS
	 */

	var _load_api = function(callback, scope) {

		this.config = new Config('http://localhost:4848/api/Docs');

		this.config.onload = function(result) {
			callback.call(scope, result);
		};

		this.config.load();

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


		this.config = null;

		/*
		 * INITIALIZATION
		 */

		this.bind('init', function() {
			_load_api.call(this, function(result) {
				// walk...
				// lychee.deserialize
			}, this);

		}, this, true);

		this.bind('submit', function(id, settings) {


		}, this);

	};


	Class.prototype = {

	};


	return Class;

});
