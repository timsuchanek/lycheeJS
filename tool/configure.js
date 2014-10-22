#!/usr/bin/env nodejs

(function() {

	(function() {

		if (typeof String.prototype.trim !== 'function') {

			String.prototype.trim = function() {
				return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
			};

		}

	})();


	var _fs   = require('fs');
	var _path = require('path');

	var _root      = _path.resolve(process.cwd(), '.');
	var _core      = '';
	var _bootstrap = {};



	/*
	 * HELPERS
	 */

	var _mkdir_p = function(path, mode) {

		path = _path.resolve(path);

		if (mode === undefined) {
			mode = 0777 & (~process.umask());
		}


		try {

			if (_fs.statSync(path).isDirectory()) {
				return true;
			} else {
				return false;
			}

		} catch(err) {

			if (err.code === 'ENOENT') {

				_mkdir_p(_path.dirname(path), mode);
				_fs.mkdirSync(path, mode);

				return true;

			}

		}

	};

	var _log = function(message, result) {

		var line;

		line  = message;
		line += ' ... ';

		if (result === true) {
			line += 'SUCCESS';
		} else {
			line += 'ERROR';
		}

		console.log(line);

	};



	/*
	 * GET CORE
	 */

	(function(files) {

		for (var f = 0, fl = files.length; f < fl; f++) {

			var file = _path.resolve(_root, files[f]);
			if (_fs.existsSync(file) === true) {
				_core += _fs.readFileSync(file, 'utf8');
			}

		}

	})([
		'./lychee/source/core/lychee.js',
		'./lychee/source/core/Debugger.js',
		'./lychee/source/core/Definition.js',
		'./lychee/source/core/Environment.js',
		'./lychee/source/core/Package.js'
	]);



	/*
	 * GET PLATFORM-SPECIFIC BOOTSTRAP
	 */

	(function(platforms, files) {

		var p, pl, platform;

		for (p = 0, pl = platforms.length; p < pl; p++) {

			platform = platforms[p];

			_bootstrap[platform] = {};


			if (platform.indexOf('-') !== -1) {

				var baseplatform = platform.split('-')[0];
				for (var basefile in _bootstrap[baseplatform]) {
					_bootstrap[platform][basefile] = _bootstrap[baseplatform][basefile];
				}

			}


			for (var f = 0, fl = files.length; f < fl; f++) {

				var file = files[f];
				var path = _path.resolve(_root, './lychee/source/platform/' + platform + '/' + file);
				if (_fs.existsSync(path) === true) {
					_bootstrap[platform][file] = _fs.readFileSync(path, 'utf8');
				}

			}

		}


		for (p = 0, pl = platforms.length; p < pl; p++) {

			platform = platforms[p];

			if (Object.keys(_bootstrap[platform]).length === 0) {
				delete _bootstrap[platform];
			}

		}

	})([
		'html',
		'html-nw',
		'html-webgl',
		'nodejs',
		'nodejs-sdl',
		'nodejs-webgl'
	], [
		'bootstrap.js',
		'Input.js',
		'Renderer.js',
		'Storage.js',
		'Viewport.js'
	]);



	/*
	 * GENERATE CODE (CORE + BOOTSTRAP)
	 */

	(function(core, bootstrap) {

		for (var platform in bootstrap) {

			var code = '' + core;

			for (var file in bootstrap[platform]) {
				code += bootstrap[platform][file];
			}


			var path    = _path.resolve(_root, './lychee/build/' + platform + '/core.js');
			var message = 'Building "' + path + '"';
			var result  = false;

			if (_fs.existsSync(path) === true) {

				result = true;

				try {
					_fs.writeFileSync(path, code, 'utf8');
				} catch(e) {
					result = false;
				} finally {
					_log(message, result);
				}

			} else {

				if (_mkdir_p(_path.resolve(_root, './lychee/build/' + platform)) === true) {

					result = true;

					try {
						_fs.writeFileSync(path, code, 'utf8');
					} catch(e) {
						result = false;
					} finally {
						_log(message, result);
					}

				}

			}

		}

	})(_core, _bootstrap);



	/*
	 * GENERATE API DOCUMENTATION
	 */

	var _format_markdown = function(text) {

		var index = text.indexOf('*');
		var open  = false;

		while (index !== -1) {

			text = text.substr(0, index) + (open === false ? '<em>' : '</em>') + text.substr(index + 1);
			open = !open;

			index = text.indexOf('*');

		}


		text = text.replace(/\[([^\]]+)\]\(([^)"]+)(?: \"([^\"]+)\")?\)/, '<a href="$2">$1</a>');


		return text;

	};

	var _parse_documentation = function(content) {

		var source = content.toString().split('\n');
		var target = [];

		var open = {
			article: false,
			ul:      false,
			li:      false,
			pre:     false,
			p:       false
		};


		for (var s = 0, sl = source.length; s < sl; s++) {

			var line = source[s];

			if (line.charAt(0) === '=') {

				line = '<article id="' + line.substr(2, line.length - 3).trim() + '">';

				if (open.article === true) {
					line = '</article>\n\n' + line;
					open.article = false;
				}

				open.article = true;

			} else if (line.substr(0, 3) === '###') {

				line = '\t<h3>' + line.substr(4) + '</h3>';

			} else if (line.substr(0, 2) === '##') {

				line = '\t<h2>' + line.substr(3) + '</h2>';

			} else if (line.substr(0, 1) === '#') {

				line = '\t<h1>' + line.substr(2) + '</h1>';

			} else if (line.substr(0, 3) === '```') {

				if (open.pre === false) {
					line = '\t<pre class="' + _format_markdown(line.substr(3)) + '">';
					open.pre = true;
				} else {
					line = '\t</pre>';
					open.pre = false;
				}

			} else if (line.charAt(0) === '-') {

				if (open.ul === false) {
					line = '\t<ul>\n\t\t<li>\n\t\t\t' + _format_markdown(line.substr(2));
					// + '</li>';
					open.ul = true;
					open.li = true;
				} else {
					line = '\t\t<li>\n\t\t\t' + _format_markdown(line.substr(2));
					// + '</li>';
					open.li = true;
				}

			} else if (line !== '' && open.li === true) {

				line = '\t\t\t' + line;

			} else if (line !== '' && open.pre === true) {

				line = line.replace(/\t/g, '  ');

			} else if (line !== '' && open.pre === false && open.ul === false) {

				if (open.p === false) {
					line = '\t<p>\n\t\t' + _format_markdown(line);
					open.p = true;
				} else {
					// Do nothing
					line = '\t\t' + _format_markdown(line);
				}

			} else if (line === '') {

				if (open.li === true) {
					line += '\t\t</li>\n';
					open.li = false;
				}

				if (open.ul === true) {
					line += '\t</ul>\n';
					open.ul = false;
				}

				if (open.p === true) {
					line += '\t</p>\n';
					open.p = false;
				}


				if (s === sl - 1) {

					if (open.article === true) {
						line += '</article>';
					}

				}

			}


			target.push(line);

		}


		return target.join('\n');

	};

	(function(folders) {

		for (var fo = 0, fol = folders.length; fo < fol; fo++) {

			var folder  = folders[fo];
			var path    = _path.resolve(_root, './lychee/' + folder);
			var message = 'Documenting "' + path + '"';
			var result  = true;

			if (_fs.existsSync(path) === true) {

				var files = _fs.readdirSync(path);
				for (var f = 0, fl = files.length; f < fl; f++) {

					var apipath = path + '/' + files[f];
					var docpath = _path.resolve(_root, './docs/' + folder.split('/').join('-') + '-' + files[f].split('.')[0] + '.html');

					var file = files[f];
					if (_fs.existsSync(apipath) === true) {

						var apicontent = _fs.readFileSync(apipath);
						var doccontent = _parse_documentation(apicontent);
						if (doccontent !== null) {

							if (_fs.existsSync(_path.dirname(docpath)) === false) {
								_mkdir_p(_path.dirname(docpath));
							}

							if (_fs.existsSync(_path.dirname(docpath)) === true) {

								try {
									_fs.writeFileSync(docpath, doccontent, 'utf8');
								} catch(e) {
									result = false;
								}

							}

						}

					}

				}

			}


			_log(message, result);

		}

	})([
		'api/core',
		'api/data',
		'api/effect',
		'api/event',
		'api/game',
		'api/math',
		'api/net',
		'api/net/client',
		'api/net/remote',
		'api/ui',
		'api/verlet'
	]);

})();

