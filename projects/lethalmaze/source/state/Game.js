
lychee.define('game.state.Game').requires([
	'lychee.effect.Alpha',
	'lychee.effect.Position',
	'lychee.effect.Shake',
	'lychee.game.Background',
	'game.effect.Explosion',
	'game.entity.Bullet',
	'game.entity.Button',
	'game.entity.Floor',
	'game.entity.Item',
	'game.entity.Tank',
	'game.entity.Wall',
	'game.layer.Floor',
	'game.layer.Objects',
	'game.layer.Effects',
	'game.ui.Dialog'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, game, global, attachments) {

	var _blob   = attachments["json"].buffer;
	var _font   = attachments["fnt"];
	var _LEVELS = attachments["levels.json"].buffer;
	var _music  = attachments["msc"];
	var _sounds = {
		death:     attachments["death.snd"],
		explosion: attachments["explosion.snd"],
		powerup:   attachments["powerup.snd"]
	};



	/*
	 * HELPERS
	 */

	var _get_move_target = function(position, direction) {

		var tile = {
			x: position.x,
			y: position.y,
			z: position.z
		};

		this.logic.unprojectPosition(tile);


		var objects_layer = this.queryLayer('game', 'objects');
		var floor_layer   = this.queryLayer('game', 'floor');

		var floor  = null;
		var object = null;


		do {

			if (direction === 'top')    tile.y -= 1;
			if (direction === 'right')  tile.x += 1;
			if (direction === 'bottom') tile.y += 1;
			if (direction === 'left')   tile.x -= 1;


			var tmp1 = {
				x: tile.x,
				y: tile.y,
				z: tile.z
			};


			this.logic.projectPosition(tmp1);


			object = objects_layer.getEntity(null, tmp1);
			floor  = floor_layer.getEntity(null, tmp1);

		} while (floor !== null && floor.state.substr(0, 5) !== 'arrow' && !(object instanceof game.entity.Wall));


		if (object !== null) {

			if (direction === 'top')    tile.y += 1;
			if (direction === 'right')  tile.x -= 1;
			if (direction === 'bottom') tile.y -= 1;
			if (direction === 'left')   tile.x += 1;


			this.logic.projectPosition(tile);


			return floor_layer.getEntity(null, tile);

		} else {

			return floor;

		}


		return null;

	};

	var _enter_game = function(level) {

		var that   = this;
		var layer  = null;
		var width  = this.renderer.width;
		var height = this.renderer.height;


		layer = this.queryLayer('game', 'floor');
		level.floor.forEach(function(line, y) {

			line.forEach(function(type, x) {

				var position = {
					x: x + 0.5,
					y: y + 0.5,
					z: 0
				};

				that.logic.projectPosition(position);

				position.x -= 1/2 * width;
				position.y -= 1/2 * height;


				layer.addEntity(new game.entity.Floor({
					type:     type,
					position: position
				}));

			});

		});


		layer = this.queryLayer('game', 'objects');
		level.objects.forEach(function(line, y) {

			line.forEach(function(type, x) {

				var position = { x: x + 0.5, y: y + 0.5, z: 0 };

				that.logic.projectPosition(position);

				position.x -= 1/2 * width;
				position.y -= 1/2 * height;


				if (type === 1) {

					layer.addEntity(new game.entity.Wall({
						position: position
					}));

				} else if (type === 2) {

					var player = new game.entity.Tank({
						position: position
					}, that.main);

					that.players.push(player);
					layer.addEntity(player);

				} else if (type === 3) {

					var button = new game.entity.Button({
						position: position
					});

					that.buttons.push(button);
					layer.addEntity(button);

				} else if (type === 4) {

					var item = new game.entity.Item({
						position: position
					});

					that.items.push(item);
					layer.addEntity(item);

				}

			});

		});


		layer.entities.sort(function(a, b) {

			var atank = a instanceof game.entity.Tank;
			var btank = b instanceof game.entity.Tank;

			if (!atank && btank) return -1;
			if (atank && !btank) return  1;
			return 0;

		});

	};

	var _leave_game = function() {

		this.players.forEach(function(player) {
			player.destroy();
		});

		this.buttons = [];
		this.items   = [];
		this.players = [];

		this.queryLayer('game', 'floor').removeEntities();
		this.queryLayer('game', 'objects').removeEntities();
		this.queryLayer('game', 'effects').removeEntities();
		this.queryLayer('ui',   'dialog').setVisible(true);

	};

	var _start_game = function() {

		this.queryLayer('ui', 'dialog').setVisible(false);

		this.main.input.bind('escape', function() {
			_stop_game.call(this);
		}, this, true);


		// TODO: Multiplayer setup

		this.setPlayer(this.players[0]);

console.log('STARTING GAME NAO');

	};

	var _stop_game = function() {

		_leave_game.call(this);
		_enter_game.call(this, _LEVELS[1]);

console.log('STOPPING GAME NAO');

	};

	var _button_action = function() {

		this.__action++;
		this.__action %= 2;


		if (this.__action === 0) {

			var objects = this.queryLayer('game', 'objects').entities;
			if (objects.length > 0) {

				objects.forEach(function(object) {

					if (object instanceof game.entity.Wall) {
						object.toggleAlpha();
					}

				});


				this.loop.setTimeout(10000, function() {
					// TODO: Spawn new random button where tile is empty
				}, this);

			}

		} else if (this.__action === 1) {

			var positions = [];

			this.players.forEach(function(player) {

				player.removeEffects();

				positions.push({
					x: player.position.x,
					y: player.position.y,
					z: player.position.z
				});

			});

			this.players.forEach(function(player) {
				player.setPosition(positions.pop());
			});

		}

	};

	var _destroy_player = function(player) {

		this.main.jukebox.play(_sounds.explosion);

		this.queryLayer('game', 'effects').addEffect(new game.effect.Explosion({
			delay:    500,
			duration: 400,
			position: {
				x: player.position.x,
				y: player.position.y
			}
		}));


		this.loop.setTimeout(500, function() {

			this.main.jukebox.play(_sounds.death);

			this.queryLayer('game', 'objects').removeEntity(player);


			if (this.player === player) {

// TODO: If player === this.player, show YouLost screen

			} else {

				var index = this.players.indexOf(player);
				if (index !== -1) {
					this.players.splice(index, 1);
				}

			}

		}, this);

	};

	var _handle_auto_action = function(player) {

		var position = {
			x: player.position.x,
			y: player.position.y,
			z: player.position.z
		};


		var floor = this.queryLayer('game', 'floor').getEntity(null, position);
		if (floor !== null) {

			if (floor.state.substr(0, 5) === 'arrow') {

				var move_direction = floor.state.split('-')[1];
				var move_target    = _get_move_target.call(this, position, move_direction);


				if (move_target !== null && move_target instanceof game.entity.Floor) {

					var move_dx       = Math.abs(move_target.position.x - player.position.x);
					var move_dy       = Math.abs(move_target.position.y - player.position.y);
					var move_duration = Math.sqrt(move_dx * move_dx + move_dy * move_dy) / 32 * 100;


					this.loop.setTimeout(200, function() {

						player.setDirection(move_direction);
						player.addEffect(new lychee.effect.Position({
							type:     lychee.effect.Position.TYPE.linear,
							duration: move_duration,
							position: {
								x: move_target.position.x,
								y: move_target.position.y
							}
						}));

						this.loop.setTimeout(move_duration + 50, function() {
							_handle_auto_action.call(this, player);
						}, this);

					}, this);

				}

			}

		}

	};

	var _handle_action = function(player, action) {

		if (player.effects.length !== 0) return;


		if (action === 'fire') {

			var direction = player.direction;
			var position  = {
				x: player.position.x,
				y: player.position.y,
				z: player.position.z
			};
			var velocity  = {
				x: 0,
				y: 0,
				z: 0
			};

			this.logic.unprojectPosition(position);

			if (direction === 'top') {
				position.y -= 1;
				velocity.y -= 5;
			}

			if (direction === 'right') {
				position.x += 1;
				velocity.x += 5;
			}

			if (direction === 'bottom') {
				position.y += 1;
				velocity.y += 5;
			}

			if (direction === 'left') {
				position.x -= 1;
				velocity.x -= 5;
			}

			this.logic.projectPosition(position);
			this.logic.projectPosition(velocity);


			var object = this.queryLayer('game', 'objects').getEntity(null, position);
			if (!(object instanceof game.entity.Wall)) {

				if (player.shoot() === true) {

					var bullet = new game.entity.Bullet({
						position: position,
						velocity: velocity
					});

					this.bullets.push(bullet);
					this.queryLayer('game', 'objects').addEntity(bullet);

				}

			}

		} else if (action.substr(0, 4) === 'move') {

			var direction = action.split('-')[1];
			var position  = {
				x: player.position.x,
				y: player.position.y,
				z: player.position.z
			};

			this.logic.unprojectPosition(position);

			if (direction === 'top')    position.y -= 1;
			if (direction === 'right')  position.x += 1;
			if (direction === 'bottom') position.y += 1;
			if (direction === 'left')   position.x -= 1;

			this.logic.projectPosition(position);


			var floor = this.queryLayer('game', 'floor').getEntity(null, position);
			if (floor !== null) {

				if (floor.state.substr(0, 5) === 'arrow') {

					var move_direction = floor.state.split('-')[1];
					var move_target    = _get_move_target.call(this, position, move_direction);


					if (move_target !== null && move_target instanceof game.entity.Floor) {

						player.setDirection(direction);
						player.addEffect(new lychee.effect.Position({
							type:     lychee.effect.Position.TYPE.linear,
							duration: 200,
							position: position
						}));


						this.loop.setTimeout(200, function() {
							_handle_auto_action.call(this, player);
						}, this);

					}

				} else {

					var object = this.queryLayer('game', 'objects').getEntity(null, position);
					if (object === null || (
							   object instanceof game.entity.Button
							|| object instanceof game.entity.Item
						) || (
							   (!object instanceof game.entity.Wall)
							&& (!object instanceof game.entity.Tank)
					)) {

						player.setDirection(direction);
						player.addEffect(new lychee.effect.Position({
							type:     lychee.effect.Position.TYPE.linear,
							duration: 200,
							position: position
						}));

					}

				}

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */


	var Class = function(main) {

		lychee.game.State.call(this, main);


		this.bullets  = [];
		this.buttons  = [];
		this.items    = [];
		this.player   = null;
		this.players  = [];

		this.__action = 0;


		this.deserialize(_blob);
		this.reshape();

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.game.State.prototype.serialize.call(this);
			data['constructor'] = 'game.state.Game';


			return data;

		},

		deserialize: function(blob) {

			lychee.game.State.prototype.deserialize.call(this, blob);



			/*
			 * INITIALIZATION
			 */

			this.queryLayer('ui', 'dialog').bind('device', function(device) {

// TODO: Tablet UI integration

			}, this);

			this.queryLayer('ui', 'dialog').bind('start', function() {
				_start_game.call(this);
			}, this);

			this.queryLayer('ui', 'dialog').bind('stop', function() {
				this.main.changeState('menu');
			}, this);

		},



		/*
		 * CUSTOM API
		 */

		reshape: function(orientation, rotation) {

			lychee.game.State.prototype.reshape.call(this, orientation, rotation);


			var renderer = this.renderer;
			if (renderer !== null) {

				var entity = null;
				var width  = renderer.width;
				var height = renderer.height;


				entity = this.queryLayer('game', 'floor');
				entity.width  = width;
				entity.height = height;
				entity.position.x = 0;
				entity.position.y = 0;

				entity = this.queryLayer('game', 'objects');
				entity.width  = width;
				entity.height = height;
				entity.position.x = 0;
				entity.position.y = 0;

				entity = this.queryLayer('game', 'effects');
				entity.width  = width;
				entity.height = height;
				entity.position.x = 0;
				entity.position.y = 0;

			}

		},

		update: function(clock, delta) {

			lychee.game.State.prototype.update.call(this, clock, delta);


			var game_layer    = this.getLayer('game');
			var effects_layer = this.queryLayer('game', 'effects');
			var objects_layer = this.queryLayer('game', 'objects');
			var entities      = objects_layer.entities;



			/*
			 * COLLISION WITH BULLETS
			 */

			for (var b = 0, bl = this.bullets.length; b < bl; b++) {

				var bullet = this.bullets[b];
				var hit    = false;

				for (var e = 0, el = entities.length; e < el; e++) {

					var entity = entities[e];
					if (entity instanceof game.entity.Wall) {

						if (bullet.collidesWith(entity) === true) {
							hit = true;
							break;
						}

					} else if (entity instanceof game.entity.Tank) {

						if (bullet.collidesWith(entity) === true) {

							if (entity.hit() === false) {
								_destroy_player.call(this, entity);
							}

							hit = true;
							break;

						}

					}

				}


				if (hit === true) {

					this.main.jukebox.play(_sounds.explosion);

					if (game_layer.effects.length === 0) {

						game_layer.addEffect(new lychee.effect.Shake({
							type:     lychee.effect.Shake.TYPE.bounceeaseout,
							duration: 500,
							shake:    {
								x: Math.random() > 0.5 ? -16 : 16,
								y: Math.random() > 0.5 ? -16 : 16
							}
						}));

					}


					effects_layer.addEffect(new game.effect.Explosion({
						duration: 250,
						position: {
							x: bullet.position.x,
							y: bullet.position.y
						}
					}));


					objects_layer.removeEntity(bullet);
					this.bullets.splice(b, 1);
					bl--;
					b--;

				}

			}



			/*
			 * COLLISION WITH BUTTONS
			 */

			for (var b = 0, bl = this.buttons.length; b < bl; b++) {

				var button = this.buttons[b];
				var action = false;

				for (var p = 0, pl = this.players.length; p < pl; p++) {

					var player = this.players[p];
					if (player.collidesWith(button) === true) {
						action = true;
						break;
					}

				}


				if (action === true) {

					this.main.jukebox.play(_sounds.powerup);

					_button_action.call(this);


					objects_layer.removeEntity(button);
					this.buttons.splice(b, 1);
					bl--;
					b--;

				}

			}



			/*
			 * COLLISION WITH ITEMS
			 */

			for (var i = 0, il = this.items.length; i < il; i++) {

				var item    = this.items[i];
				var powerup = false;

				for (var p = 0, pl = this.players.length; p < pl; p++) {

					var player = this.players[p];
					if (player.collidesWith(item) === true) {

						if (player.powerup() === true) {
							powerup = true;
						}

						break;

					}

				}


				if (powerup === true) {

					this.main.jukebox.play(_sounds.powerup);


					if (game_layer.effects.length === 0) {

						game_layer.addEffect(new lychee.effect.Alpha({
							type:     lychee.effect.Alpha.TYPE.bounceeaseout,
							alpha:    0,
							duration: 250
						}));

						game_layer.addEffect(new lychee.effect.Alpha({
							type:     lychee.effect.Alpha.TYPE.bounceeaseout,
							alpha:    0,
							delay:    250,
							duration: 250
						}));

					}


					objects_layer.removeEntity(item);
					this.items.splice(i, 1);
					il--;
					i--;

				}

			}

		},

		enter: function(data) {

			data = data instanceof Object ? data : { level: 1 };


			var level = _LEVELS[data.level] || _LEVELS[1] || null;
			if (level !== null) {

				_enter_game.call(this, level);

			} else {

				this.main.changeState('menu');

			}

			this.main.jukebox.play(_music);


			lychee.game.State.prototype.enter.call(this);

		},

		leave: function() {

			_leave_game.call(this);

			this.main.jukebox.stop(_music);


			lychee.game.State.prototype.leave.call(this);

		},

		setPlayer: function(player) {

			player = lychee.interfaceof(game.entity.Tank, player) ? player : null;


			if (player !== null) {

				this.player = player;


				var that = this;

				this.input.unbind('key');
				this.input.bind('key', function(key, name, delta) {

					switch(name) {

						case 'w':
						case 'arrow-up':
							_handle_action.call(that, this, 'move-top');
						break;

						case 'd':
						case 'arrow-right':
							_handle_action.call(that, this, 'move-right');
						break;

						case 's':
						case 'arrow-down':
							_handle_action.call(that, this, 'move-bottom');
						break;

						case 'a':
						case 'arrow-left':
							_handle_action.call(that, this, 'move-left');
						break;

						case 'space':
							_handle_action.call(that, this, 'fire');
						break;

					}

				}, player);


				return true;

			}


			return false;

		}

	};


	return Class;

});
