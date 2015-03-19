
lychee.define('tool.Main').requires([
	'lychee.data.JSON'
]).includes([
	'lychee.game.Main'
]).tags({
	platform: 'html'
}).exports(function(lychee, tool, global, attachments) {

	var _JSON = lychee.data.JSON;



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
		 * INITIALIZATION
		 */

		this.bind('load', function() {

		}, this, true);

		this.bind('init', function() {

		}, this, true);


		this.bind('submit', function(id, settings) {

			if (id === 'settings') {

console.log('Settings Update', id, settings);

			}

		}, this);

		this.bind('view', function(identifier) {

console.log('MAIN view event', identifier);

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});
