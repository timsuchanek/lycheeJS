
lychee.define('game.Logic').includes([
	'lychee.event.Emitter'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		lychee.event.Emitter.call(this);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('select', function(entity, position) {

console.log('SELECT', entity, position);

		}, this);

	};


	Class.prototype = {
	};


	return Class;

});

