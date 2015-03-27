
lychee.define('fertilizer.template.html.Application').includes([
	'fertilizer.Template'
]).exports(function(lychee, fertilizer, global, attachments) {

	var _templates = {
		main:  attachments['main.tpl'].buffer,
		index: attachments['index.tpl'].buffer
	};



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


			var core  = this.getCore('html');
			var index = _templates['index'].toString();
			var main  = _templates['main'].toString();

			if (main !== null && index !== null) {

				index = this.replace(index, '{{blob}}',  data.blob);
				index = this.replace(index, '{{id}}',    data.id);
				index = this.replace(index, '{{info}}',  data.info);
				index = this.replace(index, '{{build}}', data.build);

				main  = this.replace(main,  '{{id}}',    data.id);

				fs.write('/core.js',    core);
				fs.write('/index.js',   index);
				fs.write('/index.html', main);

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

