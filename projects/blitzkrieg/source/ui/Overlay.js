
lychee.define('game.ui.Overlay').includes([
	'lychee.ui.Layer'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"].buffer;



	/*
	 * HELPERS
	 */

	var _get_map = function(state) {

		state = typeof state === 'string' ? state : null;


		if (state !== null) {

			if (_config.map[state] instanceof Array) {
				return _config.map[state][0];
			}

		}


		return null;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		lychee.ui.Layer.call(this, settings);

	};


	Class.prototype = {

		deserialize: function(blob) {

			lychee.ui.Layer.prototype.deserialize.call(this, blob);


			var entity = null;


			entity = this.getEntity('attack');
			if (entity !== null) {

				entity.bind('#touch', function(entity) {
					if (!entity.state.match(/disabled/)) {
						this.trigger('action', [ 'attack' ]);
					}
				}, this);

			}

			entity = this.getEntity('move');
			if (entity !== null) {

				entity.bind('#touch', function(entity) {
					if (!entity.state.match(/disabled/)) {
						this.trigger('action', [ 'move' ]);
					}
				}, this);

			}

			entity = this.getEntity('drop');
			if (entity !== null) {

				entity.bind('#touch', function(entity) {
					if (!entity.state.match(/disabled/)) {
						this.trigger('action', [ 'drop' ]);
					}
				}, this);

			}

			entity = this.getEntity('deselect');
			if (entity !== null) {

				entity.bind('#touch', function(entity) {
					if (!entity.state.match(/disabled/)) {
						this.trigger('action', [ 'deselect' ]);
					}
				}, this);

			}

		},

		reshape: function() {

			var entity = null;
			var width  = this.width;
			var height = this.height;


			entity = this.getEntity('attack');
			if (entity !== null) {
				entity.position.x = width / 2 - 96;
			}

			entity = this.getEntity('move');
			if (entity !== null) {
				entity.position.x = width / 2 - 32;
			}

			entity = this.getEntity('drop');
			if (entity !== null) {
				entity.position.x = width / 2 - 96;
			}

			entity = this.getEntity('deselect');
			if (entity !== null) {
				entity.position.x = width / 2 - 32;
			}

		},

		render: function(renderer, offsetX, offsetY) {

			var texture = _texture || null;
			if (texture !== null) {

				var alpha    = this.alpha;
				var position = this.position;

				var x1 = 0;
				var y1 = 0;


				if (alpha !== 1) {
					renderer.setAlpha(alpha);
				}


				var map = _get_map('background');
				if (map !== null) {

					x1 = position.x + offsetX - map.w / 2;
					y1 = position.y + offsetY - map.h / 2;

					renderer.drawSprite(
						x1,
						y1,
						texture,
						map
					);

				}


				if (alpha !== 1) {
					renderer.setAlpha(1);
				}

			}


			lychee.ui.Layer.prototype.render.call(this, renderer, offsetX, offsetY);

		}

	};


	return Class;

});

