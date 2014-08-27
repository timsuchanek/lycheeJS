
lychee.define('game.entity.Terrain').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"].buffer;

	var _TYPES   = {
		 0: 'dirt-bound',
		 1: 'dirt-free',
		 2: 'grass-bound',
		 3: 'grass-free',
		 4: 'lava-bound',
		 5: 'lava-free',
		 6: 'rock-bound',
		 7: 'rock-free',
		 8: 'sand-bound',
		 9: 'sand-free',
		10: 'snow-bound',
		11: 'snow-free',
		12: 'stone-bound',
		13: 'stone-free',
		14: 'water-bound',
		15: 'water-free'
	};


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		settings.texture = _texture;
		settings.width   = _config.width;
		settings.height  = _config.height;
		settings.map     = _config.map;
		settings.states  = _config.states;
		settings.state   = _TYPES[settings.type] || 'default';


		delete settings.type;


		lychee.game.Sprite.call(this, settings);

	};


	Class.prototype = {

	};


	return Class;

});

