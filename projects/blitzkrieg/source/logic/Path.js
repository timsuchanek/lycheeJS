
lychee.define('game.logic.Path').exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);

		this.logic    = null;

		this.origin   = { x: 0, y: 0 };
		this.position = { x: 0, y: 0 };


		this.setOrigin(settings.origin);
		this.setPosition(settings.position);


		settings = null;

	};


	Class.prototype = {

		setLogic: function(logic) {
			this.logic = logic;
			return true;
		},

		setOrigin: function(origin) {

			origin = origin instanceof Object ? origin : null;


			if (origin !== null) {

				this.origin.x = typeof origin.x === 'number' ? origin.x : this.origin.x;
				this.origin.y = typeof origin.y === 'number' ? origin.y : this.origin.y;

				return true;

			}


			return false;

		},

		setPosition: function(position) {

			position = position instanceof Object ? position : null;


			if (position !== null) {

				this.position.x = typeof position.x === 'number' ? position.x : this.position.x;
				this.position.y = typeof position.y === 'number' ? position.y : this.position.y;

				return true;

			}


			return false;

		}

	};


	return Class;

});

