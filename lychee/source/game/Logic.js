
lychee.define('lychee.game.Logic').requires([
	'lychee.game.Entity',
	'lychee.game.Layer',
	'lychee.game.Physic'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _sphere = lychee.game.Entity.SHAPE.sphere;
	var _cuboid = lychee.game.Entity.SHAPE.cuboid;

	var _project_layer = function(layer) {

		var projection = this.projection;
		var entities   = layer.entities;

		for (var e = 0, el = entities.length; e < el; e++) {

			var entity = entities[e];
			var shape  = entity.shape;
			var is3d   = shape === _sphere || shape === _cuboid;

			var x      = entity.position.x;
			var y      = entity.position.y;
			var z      = entity.position.z;

			var width  = entity.width  || (entity.radius * 2);
			var height = entity.height || (entity.radius * 2);
			var depth  = entity.depth  || (entity.radius * 2);

			if (projection === Class.PROJECTION.tile) {

				x *= width;
				y *= height;
				z *= depth;

			} else if (projection === Class.PROJECTION.isometry) {

// TODO: isometric projection

			} else if (projection === Class.PROJECTION.hexagon) {

// TODO: hexagon projection

			}


			if (is3d === true) {

				entity.setPosition({
					x: x,
					y: y,
					z: z
				});

			} else {

				entity.setPosition({
					x: x,
					y: y
				});

			}

		}

	};

	var _unproject_layer = function(layer) {

		var projection = this.projection;
		var entities   = layer.entities;

		for (var e = 0, el = entities.length; e < el; e++) {

			var entity = entities[e];
			var shape  = entity.shape;
			var is3d   = shape === _sphere || shape === _cuboid;

			var x      = entity.position.x;
			var y      = entity.position.y;
			var z      = entity.position.z;

			var width  = entity.width  || (entity.radius * 2);
			var height = entity.height || (entity.radius * 2);
			var depth  = entity.depth  || (entity.radius * 2);

			if (projection === Class.PROJECTION.tile) {

				x /= width;
				y /= height;
				z /= depth;

			} else if (projection === Class.PROJECTION.isometry) {

// TODO: isometric projection

			} else if (projection === Class.PROJECTION.hexagon) {

// TODO: hexagon projection

			}


			if (is3d === true) {

				entity.setPosition({
					x: x,
					y: y,
					z: z
				});

			} else {

				entity.setPosition({
					x: x,
					y: y
				});

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.physic     = null;
		this.projection = Class.PROJECTION.pixel;

		this.__layers   = [];


		this.setPhysic(settings.physic);
		this.setProjection(settings.projection);


		settings = null;

	};


	Class.PROJECTION = {
		pixel:    0,
		tile:     1,
		isometry: 2,
		hexagon:  3
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			// TODO: Deserialize layer query paths

		},

		serialize: function() {

			var settings = {};
			var blob     = {};


			if (this.physic !== null)                       settings.physic     = this.physic;
			if (this.projection !== Class.PROJECTION.pixel) settings.projection = this.projection;

			if (this.__layers.length > 0) {
				// TODO: Serialize layers and their query paths
			}


			return {
				'constructor': 'lychee.game.Logic',
				'arguments':   [ settings ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		update: function(clock, delta) {

			var physic = this.physic;
			if (physic !== null) {
				physic.update(clock, delta);
			}

		},

		enter: function(data) {

			var layers = this.__layers;
			for (var l = 0, ll = layers.length; l < ll; l++) {
				_project_layer(layers[l]);
			}

		},

		leave: function(data) {

			var layers = this.__layers;
			for (var l = 0, ll = layers.length; l < ll; l++) {
				_unproject_layer(layers[l]);
			}

		},



		/*
		 * CUSTOM API
		 */

		addLayer: function(layer) {

			layer = lychee.interfaceof(lychee.game.Layer, layer) ? layer : null;


			if (layer !== null) {

				var index = this.__layers.indexOf(layer);
				if (index === -1) {

					this.__layers.push(layer);

					return true;

				}

			}


			return false;

		},

		removeLayer: function(layer) {

			layer = lychee.interfaceof(lychee.game.Layer, layer) ? layer : null;


			if (layer !== null) {

				var index = this.__layers.indexOf(layer);
				if (index !== -1) {

					this.__layers.splice(index, 1);

					return true;

				}

			}


			return false;

		},

		setLayers: function(layers) {

			var all = true;

			if (layers instanceof Array) {

				for (var l = 0, ll = layers.length; l < ll; l++) {

					var result = this.addLayer(layers[l]);
					if (result === false) {
						all = false;
					}

				}

			}


			return all;

		},

		removeLayers: function() {

			var layers = this.__layers;

			for (var l = 0, ll = layers.length; l < ll; l++) {

				this.removeLayer(layers[l]);

				ll--;
				l--;

			}

			return true;

		},

		setPhysic: function(physic) {

			physic = lychee.interfaceof(lychee.game.Physic, physic) ? physic : null;


			if (physic !== null) {

				this.physic = physic;

				return true;

			}


			return false;

		},

		setProjection: function(projection) {

			projection = lychee.enumof(Class.PROJECTION, projection) ? projection : null;


			if (projection !== null) {

				this.projection = projection;

				return true;

			}


			return false;

		},

		toLayerPosition: function(position) {
		},

		toProjectionPosition: function(position) {
		}

	};


	return Class;

});

