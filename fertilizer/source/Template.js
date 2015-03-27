
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

		replace: function(str, key, value) {

			str   = typeof str === 'string'   ? str   : '';
			key   = typeof key === 'string'   ? key   : null;
			value = typeof value === 'string' ? value : '';


			if (str !== '' && key !== null) {

				var indexes = [];
				var index   = str.indexOf(key);

				while (index !== -1) {
					indexes.push(index);
					index = str.indexOf(key, index + 1);
				}


				var keyo   = 0;
				var keyl   = key.length;
				var vall   = value.length;
				var buffer = '' + str;

				indexes.forEach(function(keyi) {

					buffer  = buffer.substr(0, keyi + keyo) + value + buffer.substr(keyi + keyo + keyl);
					keyo   += (vall - keyl);

				});


				return buffer;

			}


			return str;

		},

		getInfo: function() {
			return '/* INFO STUFF */';
		}

	};


	return Class;

});

