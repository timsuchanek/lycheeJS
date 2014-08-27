
lychee.define('game.ui.Layer').includes([
	'lychee.ui.Layer'
]).exports(function(lychee, game, global, attachments) {

//	var _texture = attachments["png"];
//	var _config  = attachments["json"].buffer;


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		lychee.ui.Layer.call(this, settings);

	};


	Class.prototype = {

	};


	return Class;

});

