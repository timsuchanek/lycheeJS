
lychee.define('game.ui.Path').includes([
	'lychee.ui.Entity',
	'game.logic.Path'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(settings) {

		lychee.ui.Entity.call(this, settings);
		game.logic.Path.call(this, settings);

	};


	Class.prototype = {

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var logic = this.logic;
			if (logic !== null) {

				var origin   = logic.toScreenPosition(this.origin,   'terrain');
				var position = logic.toScreenPosition(this.position, 'terrain');

				var x1 = origin.x   + offsetX;
				var x2 = position.x + offsetX;
				var y1 = origin.y   + offsetY;
				var y2 = position.y + offsetY;


				renderer.drawLine(
					x1,
					y1,
					x2,
					y2,
					'#ff0000',
					10
				);

			}

		},

		update: function(clock, delta) {
		}

	};


	return Class;

});

