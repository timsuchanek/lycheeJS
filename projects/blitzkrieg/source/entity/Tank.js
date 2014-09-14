
lychee.define('game.entity.Tank').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"].buffer;



	/*
	 * HELPERS
	 */

	var _rotate_to_target = function() {

		var target_x = this.target.x;
		var target_y = this.target.y;

		var rotation = this.__rotation;


		var from = rotation.from;


		rotation.start    = null;
		rotation.duration = duration;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.action = 'idle';
		this.color  = 'red';
		this.health = 100;
		this.path   = {
			current: null,
			stack:   []
		};

		this.target = {
			start: null,

		};


		settings.texture = _texture;
		settings.map     = _config.map;
		settings.radius  = _config.radius;
		settings.shape   = _config.shape;
		settings.states  = _config.states;
		settings.state   = this.color + '-01';


		this.setAction(settings.action);
		this.setColor(settings.color);


		delete settings.color;


		lychee.game.Sprite.call(this, settings);

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

		canAction: function(action) {

			if (action === 'attack' || action === 'move') {
				return true;
			}


			return false;

		},

		setAction: function(action) {

			if (action === 'idle' || action === 'attack' || action === 'move') {

				this.action = action;

				return true;

			}


			return false;

		},

		setColor: function(color) {

			color = (typeof color === 'string' && color.match(/red|green/g)) ? color : null;

			if (color !== null) {

				this.color = color;
				this.state = color + '-01';

				return true;

			}


			return false;

		},

		setTarget: function(target) {

			if (target instanceof Object) {

				this.target.x = typeof target.x === 'number' ? (target.x | 0) : this.target.x;
				this.target.y = typeof target.y === 'number' ? (target.y | 0) : this.target.y;


				_rotate_to_target.call(this);


				return true;

			}


			return false;

		}

	};


	return Class;

});

