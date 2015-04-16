
lychee.define('game.ui.HUD').requires([
	'game.ui.Bubble'
]).includes([
	'lychee.ui.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _font    = attachments["fnt"];
	var _texture = attachments["png"];
	var _config  = {
		width:  1024,
		height: 1024,
		states: { 'default': 0 },
		map:    { 'default': [{ x: 0, y: 0, w: 1024, h: 1024 }] }
	};


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		settings.texture = _texture;
		settings.width   = _config.width;
		settings.height  = _config.height;
		settings.shape   = lychee.ui.Sprite.SHAPE.rectangle;
		settings.state   = 'default';
		settings.states  = _config.states;
		settings.map     = _config.map;


		lychee.ui.Sprite.call(this, settings);

		settings = null;

	};


	Class.prototype = {

	};


	return Class;

});

