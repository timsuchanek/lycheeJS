
lychee.define('game.ui.Bubble').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global, game, attachments) {

	var _font    = attachments["fnt"];
	var _config  = attachments["json"].buffer;
	var _texture = attachments["png"];

	var _faces = {
		'FE-1': attachments["fe-1.png"],
		'FE-2': attachments["fe-2.png"],
		'FE-3': attachments["fe-3.png"],
		'FE-4': attachments["fe-4.png"],
		'FE-5': attachments["fe-5.png"],
		'FE-6': attachments["fe-6.png"]
	};


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.key        = settings.key   || 'urine';
		this.value      = settings.value || '0%';


		settings.radius = 48;
		settings.shape  = lychee.ui.Entity.SHAPE.circle;
		settings.tt

		lychee.ui.Entity.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		render: function(renderer, offsetX, offsetY) {

			var position = this.position;
			var radius   = this.radius;


			renderer.setAlpha(0.6);

			renderer.drawCircle(
				position.x + offsetX,
				position.y + offsetY,
				radius - 1,
				'#00000',
				true
			);

			renderer.setAlpha(1);

			renderer.drawCircle(
				position.x + offsetX,
				position.y + offsetY,
				radius,
				'#0ba2ff',
				false,
				1
			);


			if (this.key === 'face') {
				var png = _faces[this.value] || null;

				if (png !== null) {

						renderer.drawSprite(
							position.x + offsetX - 24,
							position.y + offsetY - 24,
							png
						);

				}


			} else {

				if (this.value === 'sleep') {
					this.value = 'sleeping';
				}

				var map = _config.map[this.key] || _config.map[this.value] || null;

				var iconWorks = false;

				if (map !== null) {

					var frame = map[0] || null;
					if (frame !== null) {

						renderer.drawSprite(
							position.x + offsetX - 16,
							position.y + offsetY - 30,
							_texture,
							frame
						);

						iconWorks = true;
					}

				}


				var textPositon = {
					x: position.x + offsetX,
					y: position.y + offsetY + 12
				};

				if (!iconWorks) {
					textPositon.y -= 10;
				}

				renderer.drawText(
					textPositon.x,
					textPositon.y,
					this.value,
					_font,
					true
				);

			}

		}

	};


	return Class;

});

