
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

	var _sounds = {
		lightning: attachments['lightning.snd']
	};



	/*
	 * HELPERS
	 */

	var _depth_sort = function() {

		var state = this.state;
		if (state !== null) {

			var terrain = state.queryLayer('game', 'terrain');
			if (terrain !== null) {

				terrain.entities.sort(function(a, b) {
					if (a.position.y < b.position.y) return -1;
					if (a.position.y > b.position.y) return 1;
					return 0;
				});

			}

		}

	};

	var _parse_layer = function(layer, layerid) {

		var tile       = this.TILE;
		var game_layer = this.state.queryLayer('game', layerid);

		if (game_layer !== null) {

			game_layer.width  = layer[0].length * tile.width  + (tile.width / 2);
			game_layer.height = layer.length    * tile.offset + (tile.height - tile.offset);


			for (var y = 0; y < layer.length; y++) {

				for (var x = 0; x < layer[y].length; x++) {

					var entity = layer[y][x];
					if (entity !== null) {

						var position = this.toScreenPosition(entity.position, layerid);
						if (position !== null) {

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


		for (var y = 0; y < level.blitzes.length; y++) {

			for (var x = 0; x < level.blitzes[y].length; x++) {

				var blitz = level.blitzes[y][x];
				if (blitz !== null) {

					var center  = this.get({ x: x, y: y }, 'terrain');
					var terrain = this.getSurrounding({ x: x, y: y }, 'terrain');
					var objects = this.getSurrounding({ x: x, y: y }, 'objects');
					if (center !== null) {

						blitz.setCenter(center);
						blitz.setTerrain(terrain);
						blitz.setObjects(terrain);
						blitz.setLogic(this);
						this.__blitzes.push(blitz);

					}

				}

			}

		}


		var cursor = this.state.queryLayer('ui', 'game > cursor');
		if (cursor !== null) {
			this.__cursor = cursor;
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		this.main    = main      || null;
		this.jukebox = main.jukebox || null;
		this.loop    = main.loop || null;
		this.TILE    = null;
		this.state   = null;

		this.__blitzes = [];
		this.__cursor  = null;
		this.__focus   = {
			entity:   null,
			position: { x: null, y: null }
		};


		lychee.event.Emitter.call(this);



		/*
		 * INITIALIZATION
		 */

		this.bind('select', function(entity, tileposition) {

			var cursor = this.__cursor;
			if (cursor !== null) {

				var screenposition = this.toScreenPosition({
					x: tileposition.x,
					y: tileposition.y
				}, 'sky');


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

			var delay = 0;

			var blitzes = this.__blitzes;
			for (var b = 0, bl = blitzes.length; b < bl; b++) {

				var blitz = blitzes[b];
				if (blitz.canAction('blitz') === true) {
					delay = Math.max(delay, blitz.duration);
					blitz.setAction('blitz');
				}

			}


			this.loop.setTimeout(delay, _depth_sort, this);

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

				var terrain = this.get(position, 'terrain');
				var object  = this.get(position, 'objects');
				if (terrain !== null && object === null) {

					if (terrain.isFree()) {

						entity = new game.entity.Tank({
							alpha:    0.1,
							color:    'red',
							position: this.toScreenPosition(position, 'objects')
						});

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


						this.strikeLightning(entity);
						this.strikeEarthquake(this.get(position, 'terrain'));


						this.state.queryLayer('game', 'objects').addEntity(entity);

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

		get: function(position, layerid) {

			var layer = this.state.queryLayer('game', layerid);
			if (layer !== null) {

				var entity = layer.getEntity(null, this.toScreenPosition(position, layerid));
				if (entity !== null) {
					return entity;
				}

			}


			return null;

		},

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


				if (y0 % 2 === 1) {

					coords.push({ x: x2, y: y1 });
					coords.push({ x: x2, y: y0 });
					coords.push({ x: x2, y: y2 });
					coords.push({ x: x0, y: y2 });
					coords.push({ x: x1, y: y0 });
					coords.push({ x: x0, y: y1 });

				} else {

					coords.push({ x: x0, y: y1 });
					coords.push({ x: x2, y: y0 });
					coords.push({ x: x0, y: y2 });
					coords.push({ x: x1, y: y2 });
					coords.push({ x: x1, y: y0 });
					coords.push({ x: x1, y: y1 });

				}


				for (var c = 0, cl = coords.length; c < cl; c++) {

					var entity = layer.getEntity(null, this.toScreenPosition(coords[c], layerid));
					if (entity !== null) {
						filtered.push(entity);
					} else {
						filtered.push(null);
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

					if (layerid === 'terrain') {
						z  = 0;
					} else if (layerid === 'objects') {
						bb = 64;
						z  = 1;
					} else if (layerid === 'sky') {
						bb = 64;
						z  = 2;
					} else {
						z  = position.z;
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
					screenposition.x += tile.width / 2;

					screenposition.y += -1/2 * layer.height;
					screenposition.y += (tile.offset / 2) + (tile.height - tile.offset) / 2;


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

					if (layerid === 'terrain') {
						z  = 0;
					} else if (layerid === 'objects') {
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


					tileposition.x -= -1/2 * layer.width;
					tileposition.y -= -1/2 * layer.height;

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

		},

		strikeEarthquake: function(entity) {

			if (entity === null) return false;


			var position = this.toTilePosition(entity.position, 'terrain');

			entity.addEffect(new lychee.effect.Shake({
				type:     lychee.effect.Shake.TYPE.linear,
				duration: 500,
				shake:    { y: 20 }
			}));


			var sterrain = this.getSurrounding(position, 'terrain');
			for (var st = 0, stl = sterrain.length; st < stl; st++) {

				if (sterrain[st] !== null) {

					sterrain[st].addEffect(new lychee.effect.Shake({
						type:     lychee.effect.Shake.TYPE.linear,
						delay:    300,
						duration: 500,
						shake:    { y: 10 }
					}));

				}

			}

			var sobjects = this.getSurrounding(position, 'objects');
			for (var so = 0, sol = sobjects.length; so < sol; so++) {

				if (sobjects[so] !== null) {

					sobjects[so].addEffect(new lychee.effect.Shake({
						type:     lychee.effect.Shake.TYPE.linear,
						delay:    300,
						duration: 500,
						shake:    { y: 10 }
					}));

				}

			}


			return true;

		},

		strikeLightning: function(entity) {

			if (entity === null) return false;


			this.jukebox.play(_sounds.lightning);


			var ui = this.state.getLayer('ui');
			if (ui !== null && ui.effects.length === 0) {

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


			var position = this.toTilePosition(entity.position, 'objects');

			entity.addEffect(new lychee.effect.Lightning({
				type:     lychee.effect.Lightning.TYPE.bounceeaseout,
				duration: 1000,
				position: this.toScreenPosition({
					x: position.x,
					y: position.y,
					z: 30
				}, 'custom')
			}));


			return true;

		}

	};


	return Class;

});

