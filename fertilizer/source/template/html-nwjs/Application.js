
lychee.define('fertilizer.template.html-nwjs.Application').requires([
	'lychee.data.JSON'
]).includes([
	'fertilizer.Template'
]).exports(function(lychee, fertilizer, global, attachments) {

	var _JSON      = lychee.data.JSON;
	var _templates = {
		config: attachments['config.tpl'].buffer,
		index:  attachments['index.tpl'].buffer,
		main:   attachments['main.tpl'].buffer
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

			var env = this.environment;
			var fs  = this.filesystem;

			if (env !== null && fs !== null) {

				var blob    = _JSON.encode(env.serialize());
				var core    = this.getCore('html');
				var info    = this.getInfo(true);
				var version = ('' + lychee.VERSION).replace(/\./g, '').split('').join('.');
				var config  = _templates['config'].toString();
				var index   = _templates['index'].toString();
				var main    = _templates['main'].toString();


				index  = this.replace(index, '{{blob}}',  blob);
				index  = this.replace(index, '{{id}}',    env.id);
				index  = this.replace(index, '{{info}}',  info);
				index  = this.replace(index, '{{build}}', env.build);

				config = this.replace(config, '{{id}}',      env.id);
				config = this.replace(config, '{{version}}', version);

				core   = this.getInfo(false) + '\n\n' + core;

				main   = this.replace(main, '{{id}}', env.id);


				fs.write('/package.json', config);
				fs.write('/core.js',      core);
				fs.write('/index.js',     index);
				fs.write('/index.html',   main);

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

