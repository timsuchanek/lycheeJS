
lychee.define('game.layer.Objects').includes([
	'lychee.game.Layer'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		lychee.game.Layer.call(this, settings);

		settings = null;

	};


	Class.prototype = {


	};


	return Class;

});

