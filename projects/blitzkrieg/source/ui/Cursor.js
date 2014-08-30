
lychee.define('game.ui.Cursor').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"].buffer;


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.visible = true;


		this.setVisible(settings.visible);

		delete settings.visible;


		settings.texture = _texture;
		settings.width   = _config.width;
		settings.height  = _config.height;
		settings.map     = _config.map;
		settings.states  = _config.states;


		lychee.game.Sprite.call(this, settings);

	};


	Class.prototype = {

		render: function(renderer, offsetX, offsetY) {

			var visible = this.visible;
			if (visible === true) {
				lychee.game.Sprite.prototype.render.call(this, renderer, offsetX, offsetY);
			}

		},

		setVisible: function(visible) {

			if (visible === true || visible === false) {

				this.visible = visible;

				return true;

			}


			return false;

		}

	};


	return Class;

});

