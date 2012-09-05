
lychee.define('game.Renderer').requires([
	'game.entity.Jewel',
	'game.entity.Text'
]).includes([
	'lychee.Renderer'
]).exports(function(lychee, global) {

	var Class = function(id) {

		lychee.Renderer.call(this, id);

		this.settings = lychee.extend({}, this.defaults);

		this.__map = {};

	};

	Class.prototype = {

		defaults: {
			sprite: null,
			map: null,
			tile: 0
		},

		reset: function(width, height, resetCache, settings) {

			lychee.Renderer.prototype.reset.call(this, width, height, resetCache);

			if (Object.prototype.toString.call(settings) === '[object Object]') {
				this.settings = lychee.extend({}, this.settings, settings);
			}


			this.__map.w = this.settings.tile;
			this.__map.h = this.settings.tile;


		},

		renderJewel: function(entity) {

			var map = this.settings.map['jewel-' + entity.getColor()];
			var tile = this.settings.tile;
			var sprite = this.settings.sprite;
			var pos = entity.getPosition();

			this.__map.x = map.x * tile;
			this.__map.y = map.y * tile;


			this.drawSprite(
				pos.x - tile / 2,
				pos.y - tile / 2,
				sprite,
				this.__map
			);

		},

		renderText: function(entity) {

			var pos = entity.getPosition();


			this.drawText(pos.x, pos.y, entity.text, entity.font);

		}

	};


	return Class;

});

