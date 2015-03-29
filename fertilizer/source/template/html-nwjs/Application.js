
lychee.define('fertilizer.template.html-nwjs.Application').requires([
	'lychee.data.JSON',
	'fertilizer.data.Filesystem'
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
	 * HELPERS
	 */

	var _package_linux = function() {

		var runtime_sh = new fertilizer.data.Shell('/bin/runtime/html-nwjs/linux');
		var project_fs = this.filesystem;

		if (project_fs !== null) {

			var result = runtime_sh.exec('/package.sh ' + project_fs.root);

console.log('package.sh result:', result);

			if (result === true) {
				return true;
			}

		}


		return false;

	};

	var _package_osx = function() {

		// TODO: Package OSX

		return true;

	};

	var _package_windows = function() {

		var runtime_sh = new fertilizer.data.Shell('/bin/runtime/html-nwjs/windows');
		var project_fs = this.filesystem;

		if (project_fs !== null) {

			var result = runtime_sh.exec('/package.sh ' + project_fs.root);
			if (result === true) {
				return true;
			}

		}


		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(env, fs, sh) {

		fertilizer.Template.call(this, env, fs, sh);



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

		this.bind('package', function(oncomplete) {

			var result = true;

			if (_package_linux.call(this) === false)   result = false;
			if (_package_osx.call(this) === false)     result = false;
			if (_package_windows.call(this) === false) result = false;

			oncomplete(result);

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});

