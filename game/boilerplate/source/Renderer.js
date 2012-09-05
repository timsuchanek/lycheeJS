
lychee.define('game.Renderer').requires([
	'game.entity.Text',
	'game.entity.Sprite'
]).includes([
	'lychee.Renderer'
]).exports(function(lychee, global) {

	var Class = function(id) {

		lychee.Renderer.call(this, id);

		this.settings = lychee.extend({}, this.defaults);

	};

	Class.prototype = {

		reset: function(width, height, resetCache, settings) {

			lychee.Renderer.prototype.reset.call(this, width, height, resetCache);

			if (Object.prototype.toString.call(settings) === '[object Object]') {
				this.settings = lychee.extend({}, settings);
			}

		},

		renderSprite: function(entity) {

			var settings = this.settings.map.sprite;
			var sprite = settings.image;


			var stateId = entity.getState();
			var state = settings.states[stateId];
			var frame = entity.getFrame();
			var position = entity.getPosition();


			this.drawSprite(
				position.x,
				position.y,
				sprite,
				state.map[frame]
			);

		},

		renderText: function(entity) {

			var pos = entity.getPosition();
			this.drawText(
				pos.x,
				pos.y,
				entity.text,
				entity.font
			);

		}

	};


	return Class;

});

