
lychee.define('game.Main').requires([
	'game.net.Client',
	'game.state.Game',
	'game.state.Menu',
	'game.DeviceSpecificHacks'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({

			// Is configured by Sorbet API
			client: '/api/Server?identifier=lethalmaze',

			input: {
				delay:       0,
				key:         true,
				keymodifier: false,
				touch:       true,
				swipe:       false
			},

			jukebox: {
				music: true,
				sound: true
			},

			logic: {
				projection: lychee.game.Logic.PROJECTION.tile,
				tile: {
					width:  32,
					height: 32,
					depth:  1
				}
			},

			renderer: {
				id:         'lethalmaze',
				width:      768,
				height:     768,
				background: '#67b843'
			},

			viewport: {
				fullscreen: false
			}

		}, data);


		lychee.game.Main.call(this, settings);


		this.bind('load', function() {

			this.settings.gameclient = this.settings.client;
			this.settings.client     = null;

		}, this, true);

		this.bind('init', function() {

			var settings = this.settings.gameclient || null;
			if (settings !== null) {
				this.client = new game.net.Client(settings, this);
			}

			this.setState('game', new game.state.Game(this));
			this.setState('menu', new game.state.Menu(this));
			this.changeState('menu');

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

		},

		show: function() {},
		hide: function() {}

	};


	return Class;

});
