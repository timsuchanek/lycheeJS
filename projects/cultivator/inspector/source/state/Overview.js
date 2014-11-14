
lychee.define('inspector.state.Overview').includes([
	'inspector.State'
]).exports(function(lychee, inspector, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		inspector.State.call(this, 'Overview', settings);

	};


	Class.prototype = {
	};


	return Class;

});

