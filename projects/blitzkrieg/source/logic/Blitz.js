
lychee.define('game.logic.Blitz').requires([
	'game.entity.Object',
	'game.entity.Tank',
	'game.entity.Terrain',
	'lychee.effect.Lightning',
	'lychee.effect.Position'
]).exports(function(lychee, game, global, attachments) {

	/*
	 * HELPERS
	 */

	var _move_to_position = function(entity, position) {

		var x = position.x;
		var y = position.y;


		entity.addEffect(new lychee.effect.Position({
			type:     lychee.effect.Position.TYPE.linear,
			delay:    100,
			duration: 500,
			position: {
				x: entity.position.x,
				y: entity.position.y + 200
			}
		}));

		entity.addEffect(new lychee.effect.Position({
			type:     lychee.effect.Position.TYPE.linear,
			delay:    250,
			duration: 500,
			position: {
				x: x,
				y: y
			}
		}));

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(settings) {

		this.duration = 750;
		this.logic    = null;
		this.center   = null;
		this.terrain  = [];

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

		canAction: function(action) {

			if (action === 'blitz') {
				return true;
			}


			return false;

		},

		setAction: function(action) {

			if (action === 'blitz') {

				var logic = this.logic;
				if (logic !== null) {

					var objects   = [];
					var positions = [];
					var center    = this.center;

					if (center !== null) {

						objects = logic.getSurrounding(logic.toTilePosition(center.position, 'terrain'), 'objects');

						logic.strikeLightning(center);

						_move_to_position(center, {
							y: center.position.y
						});

					}


					for (var p = 0, pl = this.terrain.length; p < pl; p++) {

						var entity = this.terrain[p];
						if (entity !== null) {

							positions.push(logic.toTilePosition({
								x: entity.position.x,
								y: entity.position.y
							}, 'terrain'));

						}

					}


					for (var t = 0, tl = this.terrain.length; t < tl; t++) {

						var terrain  = this.terrain[t];
						var position = positions[(t + 1) % positions.length];

						if (terrain !== null) {
							_move_to_position(terrain, logic.toScreenPosition(position, 'terrain'));
						}

					}

					for (var o = 0, ol = objects.length; o < ol; o++) {

						var object   = objects[o];
						var terrain  = this.terrain[o];

						if (
							   terrain !== null
							&& object !== null
						) {
							_move_to_position(object, logic.toScreenPosition(positions[(o + 1) % positions.length], 'objects'));
						}

					}

				}


				return true;

			}


			return false;

		},

		setCenter: function(entity) {

			entity = entity instanceof game.entity.Terrain ? entity : null;


			if (entity !== null) {

				this.center = entity;

				return true;

			}


			return false;

		},

		setTerrain: function(terrain) {

			terrain = terrain instanceof Array ? terrain : null;


			if (terrain !== null) {

				this.terrain = terrain;

				return true;

			}


			return false;

		},

		setLogic: function(logic) {
			this.logic = logic;
			return true;
		}

	};


	return Class;

});

