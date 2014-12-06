
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
			client: '/api/Server?identifier=mazejam',

			input: {
				delay:       0,
				key:         true,
				keymodifier: false,
				touch:       false,
				swipe:       false
			},

			jukebox: {
				music: false,
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
				id:         'mazejam',
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
//			this.changeState('menu');
			this.changeState('game');

		}, this, true);

	};


	Class.prototype = {

		reshape: function(orientation, rotation) {

			game.DeviceSpecificHacks.call(this);

			lychee.game.Main.prototype.reshape.call(this, orientation, rotation);

		}

	};


	return Class;

});
