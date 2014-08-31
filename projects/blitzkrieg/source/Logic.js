
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

	var _parse_layer = function(layer, layerid) {

		var tile       = this.TILE;
		var game_layer = this.state.queryLayer('game', layerid);

		if (game_layer !== null) {

			game_layer.width  = layer[0].length * tile.width  + (tile.width / 2);
			game_layer.height = layer.length    * tile.offset + (tile.height - tile.offset);


			var offsetx = (tile.width / 4);
			var offsety = (tile.height - tile.offset);

			for (var y = 0; y < layer.length; y++) {

				for (var x = 0; x < layer[y].length; x++) {

					var entity = layer[y][x];
					if (entity !== null) {

						var position = this.toScreenPosition(entity.position, layerid);
						if (position !== null) {

							position.x += offsetx;
							position.y += offsety;

							entity.setPosition(position);
							game_layer.addEntity(entity);

						}

					}

				}

			}

		}

	};

	var _enter = function(level) {

		_parse_layer.call(this, level.terrain, 'terrain');
		_parse_layer.call(this, level.objects, 'objects');


		var cursor = this.state.queryLayer('ui', 'game > cursor');
		if (cursor !== null) {
			this.__cursor = cursor;
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.TILE  = null;
		this.state = null;

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

console.log('SELECT', tileposition);

			var cursor = this.__cursor;
			if (cursor !== null) {

				var screenposition = this.toScreenPosition({
					x: tileposition.x,
					y: tileposition.y
				}, 'objects');


console.log('SELECT', tileposition, screenposition);


				if (entity !== null) {
					cursor.setState('active');
				} else {
					cursor.setState('default');
				}

				cursor.setVisible(true);

				cursor.addEffect(new lychee.effect.Position({
					type:     lychee.effect.Position.TYPE.easeout,
					position: screenposition
				}));

				cursor.addEffect(new lychee.effect.Lightning({
					type:     lychee.effect.Lightning.TYPE.bounceeaseout,
					duration: 500,
					position: screenposition
				}));

			}


			this.__focus.entity     = entity;
			this.__focus.position.x = tileposition.x;
			this.__focus.position.y = tileposition.y;

		}, this);

		this.bind('deselect', function() {

			this.__focus.entity     = null;
			this.__focus.position.x = null;
			this.__focus.position.y = null;

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

					var tile   = terrain.getEntity(null, this.toScreenPosition(position, 'terrain'));
					var object = objects.getEntity(null, this.toScreenPosition(position, 'objects'));

					if (
						   tile !== null
						&& tile.isFree()
						&& object === null
					) {

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
								shake:    { y: -20 + Math.random() * -30 }
							}));

						}


						entity   = new game.entity.Tank({
							alpha:    0.1,
							color:    'red',
							position: this.toScreenPosition(position, 'objects')
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
							duration: 500,
							shake:    { y: 30 }
						}));


						tile.addEffect(new lychee.effect.Shake({
							type:     lychee.effect.Shake.TYPE.linear,
							duration: 500,
							shake:    { y: 20 }
						}));


						var sterrain = this.getSurrounding(position, 'terrain');
						for (var st = 0, stl = sterrain.length; st < stl; st++) {

							sterrain[st].addEffect(new lychee.effect.Shake({
								type:     lychee.effect.Shake.TYPE.linear,
								delay:    300,
								duration: 500,
								shake:    { y: 10 }
							}));

						}

						var sobjects = this.getSurrounding(position, 'objects');
						for (var so = 0, sol = sobjects.length; so < sol; so++) {

							sobjects[so].addEffect(new lychee.effect.Shake({
								type:     lychee.effect.Shake.TYPE.linear,
								delay:    300,
								duration: 500,
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
				this.TILE  = state.main.TILE;

				_enter.call(this, level);

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

		getSurrounding: function(position, layerid) {

			var filtered = [];
			var entity   = null;

			var layer = this.state.queryLayer('game', layerid);
			if (layer !== null) {

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

					var entity = layer.getEntity(null, this.toScreenPosition(coords[c], layerid));
					if (entity !== null) {
						filtered.push(entity);
					}

				}

			}


			return filtered;

		},

		toScreenPosition: function(position, layerid) {

			layerid = typeof layerid === 'string' ? layerid : 'terrain';


			var tile = this.TILE;
			if (tile !== null) {

				var layer = this.state.queryLayer('game', 'terrain');
				if (layer !== null) {

					var bb = 0;
					var z  = 0;

					if (layerid === 'objects') {
						bb = 64;
						z  = 1;
					} else if (layerid === 'sky') {
						bb = 64;
						z  = 2;
					}


					var screenposition = {
						x: position.x,
						y: position.y
					};

					if (screenposition.y % 2 === 1) {
						screenposition.x += 0.5;
					}

					screenposition.x *= tile.width;
					screenposition.y *= tile.offset;

					screenposition.x += -1/2 * layer.width;
//					screenposition.x += tile.width / 4;

					screenposition.y += -1/2 * layer.height;
					screenposition.y += (tile.height - tile.offset) / 4;


					if (z !== 0) {
						screenposition.y -= z * (tile.height - tile.offset);
					}

					if (bb !== 0) {
						screenposition.y += ((tile.height - tile.offset) - (bb - tile.offset));
					}


					return screenposition;

				}

			}


			return null;

		},

		toTilePosition: function(position, layerid) {

			layerid = typeof layerid === 'string' ? layerid : 'terrain';


			var tile  = this.TILE;
			if (tile !== null) {

				var layer = this.state.queryLayer('game', 'terrain');
				if (layer !== null) {

					var bb = 0;
					var z  = 0;

					if (layerid === 'objects') {
						bb = 64;
						z  = 1;
					} else if (layerid === 'sky') {
						bb = 64;
						z  = 2;
					}


					var tileposition = {
						x: position.x,
						y: position.y,
						z: z
					};


					if (z !== 0) {
						tileposition.y += z * (tile.height - tile.offset);
					}

					if (bb !== 0) {
						tileposition.y -= ((tile.height - tile.offset) - (bb - tile.offset));
					}


//					tileposition.x -= tile.width / 4;
					tileposition.x -= -1/2 * layer.width;

					tileposition.y -= -1/2 * layer.height;
					tileposition.y -=  1/8 * (tile.height - tile.offset);

					tileposition.x /= tile.width;
					tileposition.y /= tile.offset;


					tileposition.y |= 0;

					if (tileposition.y % 2 === 1) {
						tileposition.x -= 0.5;
					}

					tileposition.x |= 0;


					return tileposition;

				}

			}


			return null;

		}

	};


	return Class;

});

