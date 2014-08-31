
lychee.define('game.entity.Tank').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"].buffer;


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.color = 'red';


		settings.texture = _texture;
		settings.width   = _config.width;
		settings.height  = _config.height;
		settings.map     = _config.map;
		settings.states  = _config.states;
		settings.state   = this.color + '-01';


		this.setColor(settings.color);


		delete settings.color;


		lychee.game.Sprite.call(this, settings);

	};


	Class.prototype = {

		can: function(action) {
			return false;
		},



		/*
		 * CUSTOM API
		 */

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

