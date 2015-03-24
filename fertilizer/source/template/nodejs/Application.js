
lychee.define('fertilizer.template.nodejs.Application').includes([
	'fertilizer.Template'
]).exports(function(lychee, fertilizer, global, attachments) {

	var _template = attachments['tpl'].buffer;



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(settings) {

		fertilizer.Template.call(this, settings);


		/*
		 * INITIALIZATION
		 */

		this.bind('configure', function(oncomplete) {

			oncomplete(true);

		}, this);

		this.bind('build', function(oncomplete) {

			var env  = this.environment.serialize();
			var info = this.getInfo();
			var fs   = this.filesystem;

			var data = {
				id:    env.arguments[0].id || '',
				blob:  JSON.stringify(env),
				info:  info,
				build: env.arguments[0].build || 'game.Main'
			};


			var index = _template.toString();
			if (index !== null) {

				index = index.replacetemplate('{{id}}',    data.id);
				index = index.replacetemplate('{{blob}}',  data.blob);
				index = index.replacetemplate('{{info}}',  data.info);
				index = index.replacetemplate('{{build}}', data.build);

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

