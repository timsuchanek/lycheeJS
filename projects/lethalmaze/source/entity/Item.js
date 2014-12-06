
lychee.define('game.entity.Item').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"].buffer;


	var Class = function(data, main) {

		var settings = lychee.extend({}, data);


		settings.collision = lychee.game.Entity.COLLISION.A;
		settings.texture   = _texture;
		settings.map       = _config.map;
		settings.width     = _config.width  - 4;
		settings.height    = _config.height - 4;
		settings.shape     = lychee.game.Entity.SHAPE.rectangle;
		settings.states    = _config.states;
		settings.state     = 'default';


		delete settings.type;


		lychee.game.Sprite.call(this, settings);

	};


	Class.prototype = {

	};


	return Class;

});

