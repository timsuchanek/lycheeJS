
lychee.define('inspector.state.Snapshot').includes([
	'inspector.State'
]).exports(function(lychee, inspector, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		inspector.State.call(this, 'Snapshot', settings);

	};


	Class.prototype = {
	};


	return Class;

});

