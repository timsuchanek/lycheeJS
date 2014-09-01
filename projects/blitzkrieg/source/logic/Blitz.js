
lychee.define('game.logic.Blitz').requires([
	'game.entity.Terrain',
	'lychee.effect.Lightning',
	'lychee.effect.Position'
]).exports(function(lychee, game, global, attachments) {

	var _DURATIONS = {
		0:  750,
		1: 1000,
		2: 1250,
		3: 1500
	};

	var Class = function(settings) {

		this.duration = 750;
		this.logic    = null;
		this.center   = null;
		this.entities = [];


		var duration = typeof settings.type === 'number' ? _DURATIONS[(settings.type | 0)] : null;
		if (duration !== null) {
			this.duration = duration;
		}

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

				var center = this.center;
				var logic  = this.logic;

				if (center !== null && logic !== null) {

					var positions = [];

					var e, el, entity, position;

					for (e = 0, el = this.entities.length; e < el; e++) {

						entity   = this.entities[e];
						position = logic.toTilePosition({
							x: entity.position.x,
							y: entity.position.y
						}, 'terrain');

						positions.push(position);

					}


					entity = this.center;

					logic.strikeLightning(entity);

					entity.addEffect(new lychee.effect.Position({
						type:     lychee.effect.Position.TYPE.linear,
						duration: 500,
						position: {
							y: entity.position.y + 200
						}
					}));

					entity.addEffect(new lychee.effect.Position({
						type:     lychee.effect.Position.TYPE.linear,
						delay:    250,
						duration: 500,
						position: {
							y: entity.position.y
						}
					}));


					for (e = 0, el = this.entities.length; e < el; e++) {

						entity   = this.entities[e];
						position = positions[(e + 1) % el];

						entity.addEffect(new lychee.effect.Position({
							type:     lychee.effect.Position.TYPE.linear,
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
							position: logic.toScreenPosition(position, 'terrain')
						}));

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

		setEntities: function(entities) {

			entities = entities instanceof Array ? entities : null;


			if (entities !== null) {

				this.entities = [];

				for (var e = 0, el = entities.length; e < el; e++) {

					var entity = entities[e];
					if (entity instanceof game.entity.Terrain) {
						this.entities.push(entity);
					}

				}


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

