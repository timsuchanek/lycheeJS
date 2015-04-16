
lychee.define('game.ui.Button').includes([
	'lychee.ui.Sprite'
]).exports(function(lychee, global, game, attachments) {

	var _texture = attachments["png"];
	var _config  = {
		width:  128,
		height: 32,
		states: { 'default': 0 },
		map:    { 'default': [{ x: 0, y: 0, w: 128, h: 32 }]}
	};


	var Class = function(settings) {

		settings.texture = _texture;
		settings.map     = _config.map;
		settings.width   = _config.width;
		settings.height  = _config.height;
		settings.shape   = lychee.ui.Entity.SHAPE.rectangle;
		settings.states  = _config.states;


		lychee.ui.Sprite.call(this, settings);

		settings = null;

	};


	Class.prototype = {
	};


	return Class;

});

