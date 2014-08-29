
lychee.define('game.state.Game').requires([
	'lychee.effect.Offset',
	'lychee.effect.Shake',
	'lychee.game.Background',
	'lychee.game.Layer',
	'game.ui.Cursor',
	'game.ui.Layer',
	'game.entity.Object',
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
				layer:   {
					width:  0,
					height: 0
				},
				terrain: [],
				objects: []
			};




			var offsetx = 0;
			var offsety = 0;

			if (typeof data.width === 'number') {
				level.width = data.width;
				offsetx     = -1/2 * level.width * _tilew + _tilew / 4;
			}

			if (typeof data.height === 'number') {
				level.height = data.height;
				// Note: 3/4 results of half of each tile bottom to next "real" tile bottom
				offsety      = -1/2 * level.height * _tiled + (_tileh - _tiled) * 3/4;
			}


			level.layer.width  = level.width  * _tilew + (_tilew / 2);
			level.layer.height = level.height * _tiled + (_tileh - _tiled);


			var x, y, posx, posy, type;


			if (data.terrain instanceof Array) {

				for (y = 0; y < data.terrain.length; y++) {

					for (x = 0; x < data.terrain[0].length; x++) {

						type = data.terrain[y][x];
						posx = Math.round(offsetx + x * _tilew);
						posy = Math.round(offsety + y * _tiled);

						if (y % 2 === 1) {
							posx += Math.round(_tilew / 2);
						}


						if (type > 0) {

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

			}

			if (data.objects instanceof Array) {

				for (y = 0; y < data.objects.length; y++) {

					for (x = 0; x < data.objects[0].length; x++) {

						type = data.objects[y][x];
						posx = Math.round(offsetx + x * _tilew);
						posy = Math.round(offsety + y * _tiled);

						if (y % 2 === 1) {
							posx += Math.round(_tilew / 2);
						}


						if (type > 0) {

							level.objects.push(new game.entity.Object({
								type:     type,
								position: {
									x: posx,
									y: posy
								}
							}));

						}

					}

				}

			}


			return level;

		}


		return null;

	};



	var _process_touch = function(id, position, delta, swipe) {

		var logic = this.logic;
		if (logic !== null) {

			this.loop.setTimeout(200, function() {

				if (this.__swiping === false || true) {

					var layer = this.queryLayer('game', 'objects');
					if (layer !== null) {

						var tile = {
							x: (position.x - (-1/2 * (layer.width  -  _tilew / 2)) + _tilew / 4) / _tilew,
							y: (position.y - (-1/2 * (layer.height - (_tileh - _tiled) * 1/4)) ) / _tiled
						};


						tile.y |= 0;

						if (tile.y % 2 === 1) {
							tile.x -= 0.5;
						}

						tile.x |= 0;


						var entity = layer.getEntity(null, position);
						if (entity !== null) {
							logic.trigger('select', [ entity, tile ]);
						} else {
							logic.trigger('select', [ entity, tile ]);
						}

					}

				}

			}, this);

		}

	};

	var _process_swipe = function(id, state, position, delta, swipe) {

		var terrain = this.queryLayer('game', 'terrain');
		var objects = this.queryLayer('game', 'objects');
		var ui      = this.queryLayer('ui',   'game');

		if (this.__scrolling === false && state === 'move') {
			this.__swiping = true;
		}

		if (this.__scrolling === false && state === 'end') {

			if (Math.abs(swipe.x) < _tilew && Math.abs(swipe.y) < _tiled) {
				this.__swiping = false;
				return;
			}


			var ox = terrain.offset.x;
			var oy = terrain.offset.y;
			var tx = ox + swipe.x;
			var ty = oy + swipe.y;
			var dx = this.renderer.width  - terrain.width;
			var dy = this.renderer.height - terrain.height;


			var bx1 = -1/2 * Math.abs(dx);
			var bx2 =  1/2 * Math.abs(dx);
			var by1 = -1/2 * Math.abs(dy);
			var by2 =  1/2 * Math.abs(dy);
			var tx2 = Math.min(Math.max(tx, bx1), bx2);
			var ty2 = Math.min(Math.max(ty, by1), by2);


			var type = lychee.effect.Offset.TYPE.easeout;
			if (tx !== tx2 || ty !== ty2) {
				type = lychee.effect.Offset.TYPE.bounceeaseout;
			}


			terrain.addEffect(new lychee.effect.Offset({
				type:     type,
				duration: 500,
				offset:   {
					x: tx2,
					y: ty2
				}
			}));

			objects.addEffect(new lychee.effect.Offset({
				type:     type,
				duration: 500,
				offset:   {
					x: tx2,
					y: ty2
				}
			}));

			ui.addEffect(new lychee.effect.Offset({
				type:     type,
				duration: 500,
				offset:   {
					x: tx2,
					y: ty2
				}
			}));


			this.__scrolling = true;

			this.loop.setTimeout(500, function() {
				this.__swiping   = false;
				this.__scrolling = false;
			}, this);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.game.State.call(this, main);


		this.logic = main.logic || null;

		this.__swiping   = false;
		this.__scrolling = false;


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

					terrain.width  = level.layer.width;
					terrain.height = level.layer.height;

					for (var t = 0, tl = level.terrain.length; t < tl; t++) {
						terrain.addEntity(level.terrain[t]);
					}

				}

				var objects = this.queryLayer('game', 'objects');
				if (objects !== null) {

					objects.width  = level.layer.width;
					objects.height = level.layer.height;

					for (var o = 0, ol = level.objects.length; o < ol; o++) {
						objects.addEntity(level.objects[o]);
					}

				}


				var ui = this.queryLayer('ui', 'game');
				if (ui !== null) {

					ui.width  = level.layer.width;
					ui.height = level.layer.height;

				}

			}


			var uilayer = this.queryLayer('ui', 'game');
			if (uilayer !== null) {
				uilayer.bind('touch', _process_touch, this);
			}


			this.input.bind('swipe', _process_swipe, this);

		},

		leave: function() {

			lychee.game.State.prototype.leave.call(this);


			var uilayer = this.queryLayer('ui', 'game');
			if (uilayer !== null) {
				uilayer.unbind('touch', _process_touch, this);
			}


			this.input.unbind('swipe', _process_swipe, this);

		}

	};


	return Class;

});
