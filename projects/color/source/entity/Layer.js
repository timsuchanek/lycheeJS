
lychee.define('game.entity.Layer').includes([
	'lychee.game.Layer'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.alpha = 1;
		this.color = '#000000';


		this.setColor(settings.color);

		delete settings.color;


		settings.width   = 912;
		settings.height  = 512;
		settings.reshape = false;


		lychee.game.Layer.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		render: function(renderer, offsetX, offsetY) {

			var alpha    = this.alpha;
			var color    = this.color;
			var position = this.position;
			var width    = this.width;
			var height   = this.height;


			if (alpha !== 1) {
				renderer.setAlpha(alpha);
			}


			var x1 = offsetX + position.x - width  / 2;
			var x2 = offsetX + position.x + width  / 2;
			var y1 = offsetY + position.y - height / 2;
			var y2 = offsetY + position.y + height / 2;


			renderer.drawBox(
				x1,
				y1,
				x2,
				y2,
				color,
				true
			);


			if (alpha !== 1) {
				renderer.setAlpha(1);
			}


			lychee.game.Layer.prototype.render.call(this, renderer, offsetX, offsetY);

		},



		/*
		 * CUSTOM API
		 */

		setAlpha: function(alpha) {

			alpha = (typeof alpha === 'number' && alpha >= 0 && alpha <= 1) ? alpha : null;


			if (alpha !== null) {

				this.alpha = alpha;

				return true;

			}


			return false;

		},

		setColor: function(color) {

			color = typeof color === 'string' ? color : null;


			if (color !== null) {

				this.color = color;

				return true;

			}


			return false;

		}

	};


	return Class;

});

