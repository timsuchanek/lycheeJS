
lychee.define('game.entity.Square').includes([
	'lychee.game.Entity'
]).exports(function(lychee, game, global, attachments) {

	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.color = '#888888';


		this.setColor(settings.color);

		delete settings.color;


		settings.width  = 48;
		settings.height = 48;
		settings.shape  = lychee.game.Entity.SHAPE.rectangle;


		lychee.game.Entity.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.game.Entity.prototype.serialize.call(this);
			data['constructor']  = 'game.entity.Square';


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			var alpha    = this.alpha;
			var position = this.position;
			var radius   = this.radius;
			var color    = this.color;


			if (alpha !== 1) {
				renderer.setAlpha(alpha);
			}


			var a  = this.width / 2; // square!
			var x1 = offsetX + position.x - a;
			var x2 = offsetX + position.x + a;
			var y1 = offsetY + position.y - a;
			var y2 = offsetY + position.y + a;


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

		},



		/*
		 * CUSTOM API
		 */

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

