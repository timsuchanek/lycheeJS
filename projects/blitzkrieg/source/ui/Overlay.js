
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


		this.__blitz = {
			start:    null,
			duration: 10000,
			map:      lychee.extend({}, _get_map('blitz-bar'))
		};

		this.__drop = {
			start:    null,
			duration: 1000,
			ready:    false,
			map:      lychee.extend({}, _get_map('drop-bar'))
		};


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

				entity.setState('drop-disabled');

				entity.bind('#touch', function(entity) {

					if (!entity.state.match(/disabled/)) {

						this.trigger('action', [ 'drop' ]);

						entity.setState('drop-disabled');
						this.__drop.start = null;
						this.__drop.ready = false;

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
				entity.position.x = 1/2 * width - 128;
			}

			entity = this.getEntity('move');
			if (entity !== null) {
				entity.position.x = 1/2 * width - 48;
			}

			entity = this.getEntity('drop');
			if (entity !== null) {
				entity.position.x = -1/2 * width + 128;
			}

			entity = this.getEntity('deselect');
			if (entity !== null) {
				entity.position.x = -1/2 * width + 48;
			}

		},

		render: function(renderer, offsetX, offsetY) {

			var texture = _texture || null;
			if (texture !== null) {

				var alpha    = this.alpha;
				var position = this.position;

				var map = null;
				var x1  = 0;
				var y1  = 0;


				if (alpha !== 1) {
					renderer.setAlpha(alpha);
				}


				map = _get_map('background');

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


				map = this.__blitz.map || null;

				if (map !== null) {

					x1 = position.x + offsetX - map.width / 2;
					y1 = position.y + offsetY - 12;

					renderer.drawSprite(
						x1,
						y1,
						texture,
						map
					);

				}


				map = this.__drop.map || null;

				if (map !== null) {

					x1 = position.x + offsetX - map.width / 2;
					y1 = position.y + offsetY + 20;

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

		},

		update: function(clock, delta) {

			lychee.ui.Layer.prototype.update.call(this, clock, delta);


			var blitz = this.__blitz;
			if (blitz.start === null) {
				blitz.start = clock;
			}

			var bt = (clock - blitz.start) / blitz.duration;
			if (bt > 1) {

				this.trigger('action', [ 'blitz' ]);
				blitz.start = null;

			} else {

				blitz.map.w = (bt * blitz.map.width) | 0;

			}


			var drop = this.__drop;
			if (drop.ready === false) {

				if (drop.start === null) {
					drop.start = clock;
				}

				var dt = (clock - drop.start) / drop.duration;
				if (dt > 1) {

					var entity = this.getEntity('drop');
					if (entity !== null) {
						entity.setState('drop');
					}

					drop.map.w = drop.map.width | 0;
					drop.ready = true;

				} else {

					drop.map.w = (dt * drop.map.width) | 0;

				}

			}

		},



		/*
		 * CUSTOM API
		 */

		showAction: function(action) {

			var entity = this.getEntity(action);
			if (entity !== null) {

				if (action === 'drop' && this.__drop.ready === false) {
					return false;
				}

				entity.setState(action);

				return true;

			}


			return false;

		},

		hideAction: function(action) {

			var entity = this.getEntity(action);
			if (entity !== null) {

				entity.setState(action + '-disabled');

				return true;

			}


			return false;

		}

	};


	return Class;

});

