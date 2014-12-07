
lychee.define('game.net.client.Multiplayer').includes([
	'lychee.net.client.Session'
]).exports(function(lychee, game, global, attachments) {

	var _SIDS = [
		'adiana',
		'alize',
		'amandaria',
		'benicia',
		'blissia',
		'bryanne',
		'celina',
		'celestia',
		'clementine',
		'clementine',
		'della',
		'drisana',
		'duscha',
		'electra',
		'eternia',
		'evania',
		'faith',
		'felicia',
		'fenella',
		'gratiana',
		'grizelda',
		'gwynth',
		'hyacinthie',
		'hylzarie',
		'honey',
		'ira',
		'iryne',
		'iram',
		'jada',
		'julius',
		'larissa',
		'leila',
		'lunaria',
		'marjalle',
		'matja',
		'mystique',
		'necia',
		'primaria',
		'serenity',
		'shanna',
		'simona',
		'tacita',
		'tamara',
		'speranza',
		'stardust',
		'valeria',
		'vartouhi',
		'xenia',
		'yashiana',
		'yoriara',
		'zulema'
	];

	var _sid = 0;

	var Class = function(client) {

		var settings = {};


		this.player = 'rainbow';


		settings.autostart = false;
		settings.autolock  = true;
		settings.min       = 2;
		settings.max       = 6;
		settings.sid       = '';
		settings.sid       = _SIDS[_sid++];


		this.setPlayer(settings.player);

		delete settings.player;


		lychee.net.client.Session.call(this, 'multiplayer', client, settings);


		/*
		 * INITIALIZATION
		 */

		this.bind('error', function(data) {

			var message = data.message;
			if (message === 'Session is full') {
				this.setSid(_SIDS[_sid++]);
			} else if (message === 'Session is active') {
				this.setSid(_SIDS[_sid++]);
			}

		}, this);

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

		setPlayer: function(player) {

			player = typeof player === 'string' ? player : null;


			if (player !== null) {

				this.player = player;

				return true;

			}


			return false;

		}

	};


	return Class;

});

