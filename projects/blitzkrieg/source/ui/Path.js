
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

				var buffer = this.buffer;
				if (buffer.length > 1) {

					var lastposition = logic.toScreenPosition(this.origin, 'terrain');

					for (var b = 1, bl = buffer.length; b < bl; b++) {

						var position = logic.toScreenPosition(buffer[b], 'terrain');


						var x1 = lastposition.x + offsetX;
						var y1 = lastposition.y + offsetY;
						var x2 = position.x     + offsetX;
						var y2 = position.y     + offsetY;


						renderer.drawLine(
							x1,
							y1,
							x2,
							y2,
							'#ff0000',
							10
						);


						lastposition = position;

					}

				}

			}

		},

		update: function(clock, delta) {
		}

	};


	return Class;

});

