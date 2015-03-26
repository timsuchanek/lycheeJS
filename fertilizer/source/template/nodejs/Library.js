
lychee.define('fertilizer.template.nodejs.Library').includes([
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

				index = index.replacetemplate('{{blob}}', data.blob);
				index = index.replacetemplate('{{info}}', data.info);
				index = index.replacetemplate('{{id}}',   data.id);

				fs.write('index.js', index);

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

