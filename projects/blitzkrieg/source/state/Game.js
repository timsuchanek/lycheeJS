
lychee.define('game.state.Game').requires([
	'lychee.effect.Offset',
	'lychee.effect.Shake',
	'lychee.game.Background',
	'lychee.game.Layer',
	'game.ui.Cursor',
	'game.ui.Layer',
	'game.entity.Terrain',
	'game.entity.lycheeJS'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, game, global, attachments) {

	var _blob  = attachments["json"].buffer;
	var _fonts = {
		headline: attachments["headline.fnt"],
		normal:   attachments["normal.fnt"]
	};

	var _levels = {
		debug: attachments['debug.json'].buffer
	};



	/*
	 * HELPERS
	 */

	var _tilew = 0;
	var _tileh = 0;
	var _tiled = 0;

	(function() {

		var entity = new game.entity.Terrain({
			state: 'grass-free'
		});

		_tilew = entity.width;
		_tileh = entity.height;

		// _tiled = _tileh - 41; // This is correct
		_tiled = _tileh - 36; // This looks cooler

	})();


	var _deserialize_level = function(data) {

		if (data instanceof Object) {

			var level = {
				width:   0,
				height:  0,
				terrain: []
			};


			var offsetx = 0;
			var offsety = 0;

			if (typeof data.width === 'number') {
				level.width = data.width;
				offsetx     = -1/2 * level.width * _tilew + _tilew / 4;
			}

			if (typeof data.height === 'number') {
				level.height = data.height;
				offsety      = -1/2 * level.height * _tileh + _tileh;
			}


			if (data.terrain instanceof Array) {

				for (var y = 0; y < data.terrain.length; y++) {

					for (var x = 0; x < data.terrain[0].length; x++) {

						var type = data.terrain[y][x];
						var posx = Math.round(offsetx + x * _tilew);
						var posy = Math.round(offsety + y * _tiled);

						if (y % 2 === 1) {
							posx += Math.round(_tilew / 2);
						}


						level.terrain.push(new game.entity.Terrain({
							type:     type,
							position: {
								x: posx,
								y: posy
							}
						}));

					}

				}

			}


			return level;

		}


		return null;

	};



	var _process_swipe = function(id, state, position, delta, swipe) {

		var layer  = this.queryLayer('game', 'terrain');
		var locked = this.__locked;

		if (locked === false && state === 'end') {

			var ox = layer.offset.x;
			var oy = layer.offset.y;

			layer.addEffect(new lychee.effect.Offset({
				type:     lychee.effect.Offset.TYPE.easeout,
				duration: 500,
				offset:   {
					x: ox + swipe.x
				}
			}));

			layer.addEffect(new lychee.effect.Offset({
				type:     lychee.effect.Offset.TYPE.easeout,
				duration: 500,
				offset:   {
					y: oy + swipe.y
				}
			}));

			this.__locked = true;

			this.loop.setTimeout(500, function() {
				this.__locked = false;
			}, this);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.game.State.call(this, main);


		this.__locked = false;


		this.deserialize(_blob);
		this.reshape();

	};


	Class.prototype = {

		deserialize: function(blob) {

			lychee.game.State.prototype.deserialize.call(this, blob);

		},

		reshape: function(orientation, rotation) {

			lychee.game.State.prototype.reshape.call(this, orientation, rotation);


			var renderer = this.renderer;
			if (renderer !== null) {

				var entity = null;
				var width  = renderer.width;
				var height = renderer.height;


				entity = this.queryLayer('background', 'background');
				entity.width  = width;
				entity.height = height;

			}

		},

		update: function(clock, delta) {

			lychee.game.State.prototype.update.call(this, clock, delta);

		},

		enter: function(data) {

			var settings = lychee.extend({
				level: 'debug'
			}, data);


			lychee.game.State.prototype.enter.call(this);


			var entity = null;

			entity = this.queryLayer('background', 'background');
			entity.setColor('#000000');


			var level = _deserialize_level(_levels[settings.level] || null);
			if (level !== null) {

				var terrain = this.queryLayer('game', 'terrain');
				if (terrain !== null) {
					terrain.width    = level.width  * _tilew;
					terrain.height   = level.height * _tileh;
					terrain.offset.y = _tileh;
				}


				terrain.setReshape(true);

				for (var t = 0, tl = level.terrain.length; t < tl; t++) {
					terrain.addEntity(level.terrain[t]);
				}

				terrain.setReshape(false);

			}


			this.input.bind('swipe', _process_swipe, this);

		},

		leave: function() {

			lychee.game.State.prototype.leave.call(this);


			this.input.unbind('swipe', _process_swipe, this);

		}

	};


	return Class;

});
