
lychee.define('lychee.game.Logic').requires([
	'lychee.game.Layer',
	'lychee.game.Physic'
]).exports(function(lychee, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.layers     = [];
		this.physic     = null;
		this.projection = Class.PROJECTION.pixel;


		this.setPhysic(settings.physic);
		this.setProjection(settings.projection);
		this.setLayers(settings.layers);


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

			var layers = [];
			for (var bl = 0, bll = blob.layers.length; bl < bll; bl++) {
				layers.push(lychee.deserialize(blob.layers[bl]));
			}


			for (var l = 0, ll = layers.length; l < ll; l++) {
				this.addLayer(layers[l]);
			}

		},

		serialize: function() {

			var settings = {};
			var blob     = {};


			if (this.__reshape !== true) settings.reshape = this.__reshape;
			if (this.visible !== true)   settings.visible = this.visible;


			if (this.layers.length > 0) {

				blob.layers = [];

				for (var l = 0, ll = this.layers.length; l < ll; l++) {
					blob.layers.push(lychee.serialize(this.layers[l]));
				}

			}


			return {
				'constructor': 'lychee.game.Logic',
				'arguments':   [ settings ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		update: function(clock, delta) {

// TODO: Logic projection and physics update()

		},



		/*
		 * CUSTOM API
		 */

		addLayer: function(layer) {

			layer = lychee.interfaceof(lychee.game.Layer, layer) ? layer : null;


			if (layer !== null) {

				var index = this.layers.indexOf(layer);
				if (index === -1) {

					this.layers.push(layer);

					return true;

				}

			}


			return false;

		},

		removeLayer: function(layer) {

			layer = lychee.interfaceof(lychee.game.Layer, layer) ? layer : null;


			if (layer !== null) {

				var index = this.layers.indexOf(layer);
				if (index !== -1) {

					this.layers.splice(index, 1);

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

			var layers = this.layers;

			for (var l = 0, ll = layers.length; l < ll; l++) {

				this.removeLayer(layers[l]);

				ll--;
				l--;

			}

			return true;

		}

	};


	return Class;

});

