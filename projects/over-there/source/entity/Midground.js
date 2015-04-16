
lychee.define('game.entity.Midground').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = {
		states: { 'default': 0 },
		map:    { 'default': [{ x: 0, y: 0, w: 2048, h: 2048 }] }
	};


	var Class = function(settings) {

		if (settings === undefined) {
			settings = {};
		}


		settings.repeat  = false;
		settings.states  = _config.states;
		settings.texture = _texture;
		settings.map     = _config.map;
		settings.position = { x: 0, y: 0};


		lychee.game.Sprite.call(this, settings);

		settings = null;

	};


	Class.prototype = {

	};


	return Class;

});

