
lychee.define('game.entity.Bullet').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"].buffer;


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		settings.collision = lychee.game.Entity.COLLISION.A;
		settings.texture   = _texture;
		settings.map       = _config.map;
		settings.radius    = _config.radius;
		settings.shape     = lychee.game.Entity.SHAPE.circle;
		settings.states    = _config.states;
		settings.state     = 'default';


		delete settings.type;


		lychee.game.Sprite.call(this, settings);

	};


	Class.prototype = {

	};


	return Class;

});

