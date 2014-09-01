
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

		var x = position.x || null;
		var y = position.y || null;


		entity.addEffect(new lychee.effect.Position({
			type:     lychee.effect.Position.TYPE.linear,
			duration: 500,
			position: {
				x: x !== null ? (entity.position.x)       : null,
				y: y !== null ? (entity.position.y + 200) : null
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
		this.objects  = [];

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

					var center = this.center;
					if (center !== null) {

						logic.strikeLightning(center);

						_move_to_position(center, {
							y: center.position.y
						});

					}


					var positions = [];

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

						var terrain = this.terrain[t];
						if (terrain !== null) {
							_move_to_position(terrain, logic.toScreenPosition(positions[(t + 1) % positions.length], 'terrain'));
						}

					}

/*
					for (var o = 0, ol = this.objects.length; o < ol; o++) {

						var object  = this.objects[o];
						var terrain = this.terrain[o];
						if (
							   terrain !== null
							&& object !== null
						) {

							_move_to_position(
								object,
								logic.toScreenPosition(logic.toTilePosition(positions[(o + 1) % positions.length], 'terrain'), 'objects')
							);

						}

					}
*/

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

		setObjects: function(objects) {

			objects = objects instanceof Array ? objects : null;


			if (objects !== null) {

				this.objects = objects;

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

