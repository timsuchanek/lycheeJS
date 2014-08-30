
lychee.define('game.entity.Object').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"].buffer;

	var _TYPES   = {
		 1: 'dirt-house',
		 2: 'grass-house',
		 3: 'lava-house',
		 4: 'rock-house',
		 5: 'sand-house',
		 6: 'snow-house',
		 7: 'stone-house',
		 8: 'water-house'
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

		can: function(action) {
			return false;
		}

	};


	return Class;

});

