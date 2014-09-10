
lychee.define('game.Main').requires([
	'game.state.Game',
	'game.net.Client'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({

			// Is configured by Sorbet API
			client: '/api/Server?identifier=dronecontrol',

			fullscreen: true,

			input: {
				delay:       0,
				key:         true,
				keymodifier: false,
				touch:       true,
				swipe:       true
			},

			renderer: {
				id:     'game',
				width:  null,
				height: null
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
				this.client = new game.net.Client(clientsettings, this);
			}

			this.setState('game', new game.state.Game(this));
			this.changeState('game');

		}, this, true);

	};


	Class.prototype = {

	};


	return Class;

});
