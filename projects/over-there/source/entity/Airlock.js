
lychee.define('game.entity.Airlock').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _config  = attachments["json"].buffer;
	var _texture = attachments["png"];


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.on = false;


		settings.texture = _texture;
		settings.width   = 0;
		settings.height  = 0;
		settings.map     = _config.map;
		settings.state   = settings.state || 'default';
		settings.states  = _config.states;


		lychee.game.Sprite.call(this, settings);


		this.setType(settings.type);

		settings = null;

	};


	Class.prototype = {

		setType: function(type) {

			type = typeof type === 'string' ? type : null;


			if (type !== null) {

				var result = this.setState(type);
				if (result === true) {

					return true;

				}

			}


			return false;

		}

	};


	return Class;

});

