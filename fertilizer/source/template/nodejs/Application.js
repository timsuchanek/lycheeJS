
lychee.define('fertilizer.template.nodejs.Application').includes([
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

				index = this.replace(index, '{{id}}',    data.id);
				index = this.replace(index, '{{blob}}',  data.blob);
				index = this.replace(index, '{{info}}',  data.info);
				index = this.replace(index, '{{build}}', data.build);

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

