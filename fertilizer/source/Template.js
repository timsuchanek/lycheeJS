
lychee.define('fertilizer.Template').requires([
	'fertilizer.data.Filesystem'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, fertilizer, global, attachments) {

	var Class = function(environment, filesystem) {

		this.environment = lychee.interfaceof(lychee.Environment,         environment) ? environment : null;
		this.filesystem  = lychee.interfaceof(fertilizer.data.Filesystem, filesystem)  ? filesystem  : null;


		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		getInfo: function() {
			return '/* INFO STUFF */';
		}

	};


	return Class;

});

