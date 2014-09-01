
lychee.define('game.entity.Tank').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"].buffer;


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.action = 'idle';
		this.color  = 'red';
		this.path   = {
			current: null,
			stack:   []
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

		}

	};


	return Class;

});

