
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

	var _music  = {
		battle:    attachments['battle.msc'],
		commando:  attachments['commando.msc']
	};

	var _sounds = {

		select_tank:     attachments['select-tank.snd'],
		select_position: attachments['select-position.snd'],
		lightning:       attachments['lightning.snd'],

		voice_idle:      attachments['voice-idle.snd'],
		voice_move:      attachments['voice-move.snd'],
		voice_attack:    attachments['voice-attack.snd']

	};



	/*
	 * HELPERS
	 */

	var _refresh_map = function() {

		var state = this.state;
		if (state !== null) {

			var terrain = state.queryLayer('game', 'terrain');
			if (terrain !== null) {

				terrain.entities.sort(function(a, b) {
					if (a.position.y < b.position.y) return -1;
					if (a.position.y > b.position.y) return  1;
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
							this.set({ x: x, y: y }, entity, layerid);
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

					var center  = this.get({ x: x, y: y },            'terrain');
					var terrain = this.getSurrounding({ x: x, y: y }, 'terrain');
					var objects = this.getSurrounding({ x: x, y: y }, 'objects');
					if (center !== null) {

						blitz.setCenter(center);
						blitz.setLogic(this);
						this.__blitzes.push(blitz);

					}

				}

			}

		}


		var ui_cursor = this.state.queryLayer('ui', 'game > cursor');
		if (ui_cursor !== null) {
			this.__ui.cursor = ui_cursor;
		}

		var ui_overlay = this.state.queryLayer('ui', 'overlay');
		if (ui_overlay !== null) {
			this.__ui.overlay = ui_overlay;
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		this.main    = main         || null;
		this.jukebox = main.jukebox || null;
		this.loop    = main.loop    || null;
		this.TILE    = null;
		this.state   = null;

		this.__actions = [];
		this.__blitzes = [];
		this.__ui      = {
			cursor:  null,
			overlay: null
		};
		this.__focus   = {
			object:   null,
			position: { x: null, y: null }
		};
		this.__map     = {};
		this.__mode    = {
			object: null,
			action: null
		};


		lychee.event.Emitter.call(this);



		/*
		 * INITIALIZATION
		 */

		this.bind('select', function(object, terrain, tileposition) {

			var cursor = this.__ui.cursor;
			if (cursor !== null) {

				var screenposition = this.toScreenPosition({
					x: tileposition.x,
					y: tileposition.y
				}, 'sky');


				if (screenposition.x !== cursor.position.x || screenposition.y !== cursor.position.y) {
					this.jukebox.play(_sounds.select_position);
				}


				if (object !== null) {

					if (object instanceof game.entity.Tank) {

						this.jukebox.play(_sounds.select_tank);

						if (object.action === 'idle') {
							this.jukebox.play(_sounds.voice_idle);
						}

					}

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


			var overlay = this.__ui.overlay;
			if (overlay !== null) {

				var actionobject = this.__mode.object;
				if (actionobject === null) {
					actionobject = object;
				}


				if (actionobject === null) {

					overlay.hideAction('attack');
					overlay.hideAction('move');

					if (terrain !== null && terrain.isFree()) {
						overlay.showAction('drop');
					} else {
						overlay.hideAction('drop');
					}

				} else {

					if (actionobject.canAction('attack')) {
						overlay.showAction('attack');
					} else {
						overlay.hideAction('attack');
					}

					if (actionobject.canAction('move')) {
						overlay.showAction('move');
					} else {
						overlay.hideAction('move');
					}

				}

			}


			this.__focus.object     = object;
			this.__focus.position.x = tileposition.x;
			this.__focus.position.y = tileposition.y;

		}, this);

		this.bind('deselect', function() {

			this.__focus.object     = null;
			this.__focus.position.x = null;
			this.__focus.position.y = null;
			this.__mode.action      = null;
			this.__mode.object      = null;


			var cursor = this.__ui.cursor;
			if (cursor !== null) {
				cursor.setVisible(false);
			}

			var overlay = this.__ui.overlay;
			if (overlay !== null) {
				overlay.hideAction('attack');
				overlay.hideAction('move');
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


			this.loop.setTimeout(delay, _refresh_map, this);

		}, this);

		this.bind('attack', function() {

this.jukebox.play(_sounds.voice_attack);
console.log('ATTACK');

		}, this);

		this.bind('move', function() {

			var focus = this.__focus;
			var mode  = this.__mode;

			if (mode.action !== 'move') {

				if (
					   focus.object !== null
					&& focus.object.canAction('move')
				) {
					mode.object = focus.object;
					mode.action = 'move';
				}

// TODO: deactivate attack button
console.log('MOVE MODE ACTIVATED', focus.object, mode);

			} else if (mode.action === 'move') {

console.log('MOVE ENTITY NAO TO ', focus.position);

				if (focus.position !== null) {

					this.jukebox.play(_sounds.voice_move);

					this.__actions.push({
						type:   'move',
						entity: mode.entity,
						target: focus.position
					});

				}

			}

		}, this);

		this.bind('drop', function() {

			var state    = this.state;
			var object   = this.__focus.object;
			var position = this.__focus.position;
			if (
				   state !== null
				&& object === null
				&& position.x !== null
				&& position.y !== null
			) {

				var terrain = this.get(position, 'terrain');
				var object  = this.get(position, 'objects');
				if (terrain !== null && object === null) {

					if (terrain.isFree()) {

						object = new game.entity.Tank({
							alpha:    0.1,
							color:    'red',
							position: this.toScreenPosition(position, 'objects')
						});

						object.addEffect(new lychee.effect.Alpha({
							type:     lychee.effect.Alpha.TYPE.easeout,
							delay:    500,
							duration: 500,
							alpha:    1
						}));

						object.addEffect(new lychee.effect.Shake({
							type:     lychee.effect.Shake.TYPE.linear,
							delay:    200,
							duration: 500,
							shake:    { y: 30 }
						}));


						this.strikeLightning(object);
						this.strikeEarthquake(this.get(position, 'terrain'));


						this.set(position, object, 'objects');
						this.state.queryLayer('game', 'objects').addEntity(object);

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

				this.jukebox.play(_music.commando);

				_enter.call(this, level);

			}

		},

		leave: function() {

			this.jukebox.stop(null);

// TODO: leave() should cleanup all layers in State

		},



		/*
		 * CUSTOM API
		 */

		set: function(position, entity, layerid) {

			var layer = this.state.queryLayer('game', layerid);
			if (layer !== null) {

				var map = this.__map[layerid] || null;
				if (map === null) {
					map = this.__map[layerid] = {};
				}


				var x = position.x || null;
				var y = position.y || null;
				if (x !== null && y !== null) {

					if (map[x] === undefined) {
						map[x] = {};
					}

					map[x][y] = entity;


					return true;

				}

			}


			return false;

		},

		get: function(position, layerid) {

			var map = this.__map[layerid] || null;
			if (map !== null) {

				var x = position.x || null;
				var y = position.y || null;

				if (x !== null && y !== null) {

					if (map[x] !== undefined) {

						if (map[x][y] !== undefined) {
							return map[x][y];
						}

					}

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
					filtered.push(this.get(coords[c], layerid));
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


					screenposition.x |= 0;
					screenposition.y |= 0;


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
				delay:    500,
				duration: 500,
				shake:    { y: 20 }
			}));


			var sterrain = this.getSurrounding(position, 'terrain');
			for (var st = 0, stl = sterrain.length; st < stl; st++) {

				if (sterrain[st] !== null) {

					sterrain[st].addEffect(new lychee.effect.Shake({
						type:     lychee.effect.Shake.TYPE.linear,
						delay:    750,
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
						delay:    750,
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

