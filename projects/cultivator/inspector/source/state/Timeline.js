
lychee.define('inspector.state.Timeline').includes([
	'inspector.State'
]).exports(function(lychee, inspector, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		inspector.State.call(this, 'Timeline', settings);

	};


	Class.prototype = {
	};


	return Class;

});

