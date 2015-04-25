
lychee.define('game.entity.Terrain').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"].buffer;

	var _TYPES   = {
		0: 'default',
		1: 'arrow-top',
		2: 'arrow-right',
		3: 'arrow-bottom',
		4: 'arrow-left'
	};


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		settings.texture = _texture;
		settings.map     = _config.map;
		settings.width   = _config.width;
		settings.height  = _config.height;
		settings.shape   = lychee.game.Entity.SHAPE.rectangle;
		settings.states  = _config.states;
		settings.state   = _TYPES[settings.type] || 'default';


		delete settings.type;


		lychee.game.Sprite.call(this, settings);

		settings = null;

	};


	Class.prototype = {

	};


	return Class;

});

