
lychee.define('game.Logic').requires([
	'lychee.effect.Alpha',
	'lychee.effect.Color',
	'lychee.effect.Lightning',
	'lychee.effect.Position',
	'lychee.effect.Shake',
	'game.entity.Tank',
	'game.logic.Level'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, game, global, attachments) {

	/*
	 * HELPERS
	 */

	var _screen_to_tile_position = function(screenposition, offset) {

		offset = offset === true;


		var state = this.state;
		var tile  = this.TILE;
		if (state !== null && tile !== null) {

			var layer = state.queryLayer('game', 'objects');
			if (layer !== null) {

				var tileposition = {
					x: screenposition.x,
					y: screenposition.y,
					z: 0
				};

				if (offset === true) {
					tileposition.x -= layer.offset.x;
					tileposition.y -= layer.offset.y;
				}

				tileposition.x -= -1/2 * (layer.width - tile.width / 2) + tile.width / 4;
				tileposition.y -= -1/2 * (layer.height - (tile.height - tile.offset) * 1/4);

				tileposition.x /= tile.width;
				tileposition.y /= tile.offset;

				tileposition.y |= 0;

				if (tileposition.y % 2 === 1) {
					tileposition.x -= 0.5;
				}

				tileposition.x = Math.round(tileposition.x) | 0;


				return tileposition;

			}

		}


		return null;

	};

	var _tile_to_screen_position = function(tileposition, offset) {

		offset = offset === true;


		var state = this.state;
		var tile  = this.TILE;
		if (state !== null && tile !== null) {

			var layer = state.queryLayer('game', 'objects');
			if (layer !== null) {

				tileposition.z = typeof tileposition.z === 'number' ? (tileposition.z | 0) : 0;


				var screenposition = {
					x: tileposition.x,
					y: tileposition.y
				};

				if (screenposition.y % 2 === 1) {
					screenposition.x += 0.5;
				}

				screenposition.x *= tile.width;
				screenposition.y *= tile.offset;


				screenposition.x += -1/2 * (layer.width - tile.width / 2) + tile.width / 4;
				screenposition.y += -1/2 * (layer.height - (tile.height - tile.offset) * 1/4);

				if (offset === true) {
					screenposition.x += layer.offset.x;
					screenposition.y += layer.offset.y;
				}


				if (tileposition.z !== 0) {
					screenposition.y -= tileposition.z * (tile.height - tile.offset);
				}


				return screenposition;

			}

		}


		return null;

	};

	var _enter = function() {

		var state = this.state;
		var level = this.level;
		var layer = null;


		if (state !== null && level !== null) {

			if (state.main !== null) {
				this.TILE = state.main.TILE;
			}


			layer = state.queryLayer('game', 'terrain');

			if (layer !== null) {

				layer.width  = level.width;
				layer.height = level.height;

				for (var t = 0, tl = level.terrain.length; t < tl; t++) {
					layer.addEntity(level.terrain[t]);
				}

			}


			layer = state.queryLayer('game', 'objects');

			if (layer !== null) {

				layer.width  = level.width;
				layer.height = level.height;

				for (var o = 0, ol = level.objects.length; o < ol; o++) {
					layer.addEntity(level.objects[o]);
				}

			}


			for (var b = 0, bl = level.blitzes.length; b < bl; b++) {
				this.__blitzes.push(level.blitzes[b]);
			}


			var cursor = state.queryLayer('ui', 'game > cursor');
			if (cursor !== null) {
				this.__cursor = cursor;
			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.TILE  = null;

		this.state = null;
		this.level = null;

		this.__blitzes = [];
		this.__cursor  = null;
		this.__focus   = {
			entity:   null,
			position: { x: null, y: null }
		};


		lychee.event.Emitter.call(this);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('select', function(entity, tileposition) {

console.log('SELECT', entity, tileposition);

// TODO: Selection of Entity

			var cursor = this.__cursor;
			if (cursor !== null) {

				var cursorposition = {
					x: tileposition.x,
					y: tileposition.y,
					z: tileposition.z
				};


				if (entity !== null) {
					cursor.setState('active');
					cursorposition.z = 1;
				} else {
					cursor.setState('default');
				}

				cursor.setVisible(true);

				cursor.addEffect(new lychee.effect.Position({
					type:     lychee.effect.Position.TYPE.easeout,
					position: this.toScreenPosition(cursorposition)
				}));

				cursor.addEffect(new lychee.effect.Lightning({
					type:     lychee.effect.Lightning.TYPE.bounceeaseout,
					duration: 500,
					position: this.toScreenPosition({
						x: cursorposition.x,
						y: cursorposition.y,
						z: 0
					})
				}));

			}


			this.__focus.entity     = entity;
			this.__focus.position.x = tileposition.x;
			this.__focus.position.y = tileposition.y;
			this.__focus.position.z = 0;

		}, this);

		this.bind('deselect', function() {

			this.__focus.entity     = null;
			this.__focus.position.x = null;
			this.__focus.position.y = null;
			this.__focus.position.z = null;

console.log('DESELECT');

// TODO: Deselection of Entity

			var cursor = this.__cursor;
			if (cursor !== null) {
				cursor.setVisible(false);
			}

		}, this);


		this.bind('blitz', function() {
console.log('BLITZ');
		}, this);

		this.bind('attack', function() {
console.log('ATTACK');
		}, this);

		this.bind('move', function() {
console.log('MOVE');
		}, this);

		this.bind('drop', function() {

			var state    = this.state;
			var entity   = this.__focus.entity;
			var position = this.__focus.position;
			if (
				   state !== null
				&& entity === null
				&& position.x !== null
				&& position.y !== null
			) {


				var terrain = state.queryLayer('game', 'terrain');
				var objects = state.queryLayer('game', 'objects');
				if (terrain !== null && objects !== null) {

					var tile   = terrain.getEntity(null, this.toScreenPosition(position));
					var object = objects.getEntity(null, this.toScreenPosition(position));

					if (
						   tile !== null
						&& tile.isFree()
						&& object === null
					) {


						var shake = {
							x: Math.random() > 0.5 ? (Math.random() * 30) : (Math.random() * -30),
							y: Math.random() > 0.5 ? (Math.random() * 30) : (Math.random() * -30)
						};

						terrain.addEffect(new lychee.effect.Shake({
							type:     lychee.effect.Shake.TYPE.bounceeaseout,
							duration: 1000,
							shake:    shake
						}));

						objects.addEffect(new lychee.effect.Shake({
							type:     lychee.effect.Shake.TYPE.bounceeaseout,
							duration: 1000,
							shake:    shake
						}));


						var ui = state.getLayer('ui');
						if (ui !== null) {

							var background = ui.getEntity('background');
							if (background !== null) {

								background.alpha = 0;
								background.color = '#000000';

								background.addEffect(new lychee.effect.Color({
									type:     lychee.effect.Color.TYPE.bounceeaseout,
									duration: 250,
									color:    '#ffffff'
								}));

								background.addEffect(new lychee.effect.Alpha({
									type:     lychee.effect.Alpha.TYPE.bounceeaseout,
									duration: 250,
									alpha:    0.5
								}));

								background.addEffect(new lychee.effect.Alpha({
									type:     lychee.effect.Alpha.TYPE.bounceeaseout,
									delay:    250,
									duration: 250,
									alpha:    0
								}));

							}

							ui.addEffect(new lychee.effect.Shake({
								type:     lychee.effect.Shake.TYPE.bounceeaseout,
								duration: 1000,
								shake:    { y: Math.random() * -30 }
							}));

						}


						entity   = new game.entity.Tank({
							alpha:    0.1,
							color:    'red',
							position: this.toScreenPosition({
								x: position.x,
								y: position.y,
								z: -1
							})
						});

						entity.addEffect(new lychee.effect.Lightning({
							type:     lychee.effect.Lightning.TYPE.bounceeaseout,
							duration: 1000,
							position: this.toScreenPosition({
								x: position.x,
								y: position.y,
								z: 20
							})
						}));

						entity.addEffect(new lychee.effect.Alpha({
							type:     lychee.effect.Alpha.TYPE.easeout,
							delay:    500,
							duration: 500,
							alpha:    1
						}));

						entity.addEffect(new lychee.effect.Shake({
							type:     lychee.effect.Shake.TYPE.linear,
							delay:    200,
							duration: 200,
							shake:    { y: 30 }
						}));


						tile.addEffect(new lychee.effect.Shake({
							type:     lychee.effect.Shake.TYPE.linear,
							duration: 200,
							shake:    { y: 20 }
						}));


						var tiles = this.getSurrounding(terrain, position);
						for (var t = 0, tl = tiles.length; t < tl; t++) {

							tiles[t].addEffect(new lychee.effect.Shake({
								type:     lychee.effect.Shake.TYPE.linear,
								delay:    150,
								duration: 200,
								shake:    { y: 10 }
							}));

						}


						objects.addEntity(entity);

					}

				}

			}

		}, this);

	};


	Class.prototype = {

		/*
		 * STATE API
		 */

		update: function(clock, delta) {

		},

		enter: function(state, level) {

			state = lychee.interfaceof(lychee.game.State, state) ? state : null;
			level = level instanceof game.logic.Level            ? level : null;


			if (state !== null && level !== null) {

				this.state = state;
				this.level = level;

				_enter.call(this);

				return true;

			}


			return false;

		},

		leave: function() {

// TODO: leave() should cleanup all layers in State

		},



		/*
		 * CUSTOM API
		 */

		getSurrounding: function(layer, position) {

			var filtered = [];
			var entity   = null;


			var coords = [];
			var x0     = position.x;
			var y0     = position.y;
			var x1     = position.x - 1;
			var y1     = position.y - 1;
			var x2     = position.x + 1;
			var y2     = position.y + 1;


			coords.push({ x: x1, y: y0 });
			coords.push({ x: x2, y: y0 });
			coords.push({ x: x0, y: y1 });
			coords.push({ x: x0, y: y2 });


			if (y0 % 2 === 1) {
				coords.push({ x: x2, y: y1 });
				coords.push({ x: x2, y: y2 });
			} else {
				coords.push({ x: x1, y: y1 });
				coords.push({ x: x1, y: y2 });
			}


			for (var c = 0, cl = coords.length; c < cl; c++) {

				var entity = layer.getEntity(null, this.toScreenPosition(coords[c]));
				if (entity !== null) {
					filtered.push(entity);
				}

			}


			return filtered;

		},

		toTilePosition: function(position, offset) {
			return _screen_to_tile_position.call(this, position, offset);
		},

		toScreenPosition: function(position, offset) {
			return _tile_to_screen_position.call(this, position, offset);
		}

	};


	return Class;

});

