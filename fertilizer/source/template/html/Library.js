
lychee.define('fertilizer.template.html.Library').includes([
	'fertilizer.Template'
]).exports(function(lychee, fertilizer, global, attachments) {

	var _template = attachments['tpl'].buffer;



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(env, fs) {

		fertilizer.Template.call(this, env, fs);



		/*
		 * INITIALIZATION
		 */

		this.bind('configure', function(oncomplete) {

			oncomplete(true);

		}, this);

		this.bind('build', function(oncomplete) {

			var env  = this.environment;
			var fs   = this.filesystem;
			var data = {
				blob: JSON.stringify(env),
				info: this.info,
				id:   env.arguments[0].id || ''
			};


			var index = _template.toString();
			if (index !== null) {

				index = this.replace(index, '{{blob}}', data.blob);
				index = this.replace(index, '{{id}}',   data.id);
				index = this.replace(index, '{{info}}', data.info);

				fs.write('/index.js', index);

				oncomplete(true);

			} else {

				oncomplete(false);

			}

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});

