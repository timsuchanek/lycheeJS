
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

			title: 'Blitzkrieg',

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
				music: true,
				sound: true
			},

			renderer: {
				id:     'blitzkrieg',
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


		this.bind('load', function() {

			this.settings.gameclient = this.settings.client;
			this.settings.client     = null;

		}, this, true);

		this.bind('init', function() {

			var settings = this.settings.gameclient || null;
			if (settings !== null) {
				this.client = new game.net.Client(settings, this);
			}

			this.logic = new game.Logic(this);

			this.setState('game', new game.state.Game(this));
			this.setState('menu', new game.state.Menu(this));
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

		}

	};


	return Class;

});
