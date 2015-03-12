
lychee.define('sorbet.data.Package').includes([
	'lychee.event.Emitter'
]).exports(function(lychee, sorbet, global, attachments) {

	/*
	 * IMPLEMENTATION
	 */

	var Class = function(url) {

		// TODO: Implement package parsing, resolving etc.

		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

	};


	return Class;

});

