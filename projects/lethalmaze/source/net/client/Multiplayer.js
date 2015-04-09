
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


		settings.autostart = false;
		settings.autolock  = true;
		settings.min       = 2;
		settings.max       = 6;
		settings.sid       = _SIDS[_sid++];


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

		control: function(data) {

			if (data instanceof Object) {

				if (
					   typeof data.player === 'string'
					&& typeof data.action === 'string'
					&& data.position instanceof Object
				) {

					this.multicast({
						player:   data.player,
						action:   data.action,
						position: data.position
					});


					return true;

				}

			}


			return false;

		}

	};


	return Class;

});

