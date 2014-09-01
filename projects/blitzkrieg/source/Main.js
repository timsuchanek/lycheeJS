
lychee.define('game.Main').requires([
	'game.Logic',
	'game.net.Client',
	'game.state.Game',
	'game.state.Menu'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({

			title: 'Game Boilerplate',

			// Is configured by Sorbet API
			client: '/api/Server?identifier=blitzkrieg',

			input: {
				delay:       0,
				key:         false,
				keymodifier: false,
				touch:       true,
				swipe:       true
			},

			jukebox: {
				music: false,
				sound: true
			},

			renderer: {
				id:     'boilerplate',
				width:  null,
				height: null
			},

			viewport: {
				fullscreen: false
			}

		}, data);


		lychee.game.Main.call(this, settings);


		this.TILE = {
			width:  65,
			height: 90,
			offset: 90 - 36
		};

	};


	Class.prototype = {

		load: function() {

			// 1. Initialize Client via Sorbet Gateway
			lychee.game.Main.prototype.load.call(this);

		},

		reshape: function(orientation, rotation) {

			lychee.game.Main.prototype.reshape.call(this, orientation, rotation);

		},

		init: function() {

			// Overwrite client with game.net.Client
			var clientsettings   = this.settings.client;
			this.settings.client = null;

			lychee.game.Main.prototype.init.call(this);


			if (clientsettings !== null) {
				this.client = new game.net.Client(clientsettings, this);
			}


			this.logic = new game.Logic(this);


			this.setState('game', new game.state.Game(this));
			this.setState('menu', new game.state.Menu(this));
			this.changeState('game');

		}

	};


	return Class;

});
