
lychee.define('game.Main').requires([
	'game.net.Client',
	'game.state.Game',
	'game.DeviceSpecificHacks'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({

			// Is configured by Sorbet API
			client: '/api/Server?identifier=render-test',

			input: {
				delay:       0,
				key:         false,
				keymodifier: false,
				touch:       true,
				swipe:       true
			},

			jukebox: {
				music: true,
				sound: true
			},

			renderer: {
				id:         'render-test',
				width:      null,
				height:     null,
				background: null
			},

			viewport: {
				fullscreen: false
			}

		}, data);


		lychee.game.Main.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('load', function(oncomplete) {

			this.settings.gameclient = this.settings.client;
			this.settings.client     = null;

			oncomplete(true);

		}, this, true);

		this.bind('init', function() {

			var settings = this.settings.gameclient || null;
			if (settings !== null) {
				this.client = new game.net.Client(settings, this);
			}

			this.setState('game', new game.state.Game(this));
			this.changeState('game');

		}, this, true);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.game.Main.prototype.serialize.call(this);
			data['constructor'] = 'game.Main';

			var settings = data['arguments'][0] || {};
			var blob     = data['blob'] || {};


			if (this.defaults.client !== null) { settings.client = this.defaults.client; }


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		reshape: function(orientation, rotation) {

			game.DeviceSpecificHacks.call(this);

			lychee.game.Main.prototype.reshape.call(this, orientation, rotation);

		}

	};


	return Class;

});
