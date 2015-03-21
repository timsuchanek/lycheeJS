
lychee.define('tool.Main').requires([
	'lychee.data.JSON',
	'tool.state.Status'
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

			loop: {
				update: 1/10,
				render: 0
			},

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

			this.setState('status',   new tool.state.Status(this));
			// this.setState('console',  new tool.state.Console(this));
			// this.setState('settings', new tool.state.Settings(this));
			// this.setState('help',     new tool.state.Help(this));

			this.changeState('status');

		}, this, true);


		this.bind('submit', function(id, settings) {

			if (id === 'settings') {

console.log('Settings Update', id, settings);

			}

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});
