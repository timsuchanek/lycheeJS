
lychee.define('lychee.net.remote.Debugger').requires([
	// 'lychee.Storage'
]).includes([
	'lychee.net.Service'
]).exports(function(lychee, global, attachments) {

	// var _storage = new lychee.Storage({
	// 	id:    'server',
	// 	type:  lychee.Storage.TYPE.persistent
	// });


	var Class = function(remote) {

		lychee.net.Service.call(this, 'debugger', remote, lychee.net.Service.TYPE.remote);

	};


	Class.prototype = {

	};


	return Class;

});

