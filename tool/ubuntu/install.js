#!/usr/bin/env nodejs

(function() {

	(function() {

		if (typeof String.prototype.trim !== 'function') {

			String.prototype.trim = function() {
				return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
			};

		}

		if (typeof String.prototype.replacetemplate !== 'function') {

			String.prototype.replacetemplate = function(key, value) {

				key   = typeof key === 'string'   ? key   : null;
				value = typeof value === 'string' ? value : '';


				if (key !== null) {

					var keyl = key.length;
					var keyi = this.indexOf(key);
					if (keyi !== -1) {
						return '' + this.substr(0, keyi) + value + this.substr(keyi + keyl);
					}

				}

				return this;

			};

		}

	})();



	var _fs   = require('fs');
	var _path = require('path');
	var _root = _path.resolve(process.cwd(), '.');
	var _user = process.env.USER;

	var _profiles = [];



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

	var _exec_sync = function(command) {

		var result = null;

		try {
			result = require('child_process').execSync(command);
		} catch(e) {
			result = null;
		}


		if (result !== null) {
			return result.toString();
		}


		return null;

	};



	/*
	 * 0: ENVIRONMENT CHECK
	 */

	(function() {

		var errors = 0;

		console.log('> Checking Environment');


		if (_fs.existsSync(_path.resolve(_root, './lychee/build')) === true) {
			console.log('\tprocess cwd: OKAY');
		} else {
			console.log('\tprocess cwd: FAIL (' + _root + ' is not the lycheeJS directory)');
			errors++;
		}


		if (_user === 'root') {
			console.log('\tprocess user: OKAY');
		} else {
			console.log('\tprocess user: FAIL (You are not root)');
			errors++;
		}


		if (_fs.existsSync(_path.resolve(_root, './sorbet/profile')) === true) {
			console.log('\t./sorbet/profile: OKAY');
		} else {
			console.log('\t./sorbet/profile: FAIL');
			errors++;
		}


		if (_fs.existsSync(_path.resolve('/etc/init.d')) === true) {
			console.log('\t/etc/init.d: OKAY');
		} else {
			console.log('\t/etc/init.d: FAIL (Does not exist)');
			errors++;
		}



		if (errors === 0) {
			console.log('> OKAY\n');
		} else {
			console.log('> FAIL\n');
			process.exit(1);
		}

	})();



	/*
	 * 1: PROFILE INTEGRATION
	 */

	(function(profiles) {

		var errors = 0;

		console.log('> Integrating Sorbet Profiles');


		var dir = _path.resolve('/etc/sorbet/');

		if (_fs.existsSync(dir) === false) {
			_mkdir_p(dir);
		}


		if (_fs.existsSync(dir) === true) {

			Object.keys(profiles).forEach(function(profileid) {

				var path   = _path.resolve('/etc/sorbet', './' + profileid + '.json');
				var buffer = profiles[profileid];


				var result = false;

				try {
					_fs.writeFileSync(path, buffer, 'utf8');
					result = true;
				} catch(e) {
					result = false;
				}


				if (result === true) {
					console.log('\t' + profileid + ': OKAY');
				} else {
					console.log('~\t' + profileid + ': SKIP');
				}

			});

		} else {
			errors++;
		}



		if (errors === 0) {
			console.log('> OKAY\n');
		} else {
			console.log('> FAIL\n');
		}

	})((function(files) {

		var profiles = {};

		files.forEach(function(file) {

			if (file.substr(file.length - 5, 5) === '.json') {

				var name = file.substr(0, file.length - 5);
				var buffer = null;

				try {
					buffer = _fs.readFileSync(_path.resolve(_root, './sorbet/profile/' + file));
				} catch(e) {
					buffer = null;
				}


				if (buffer !== null) {
					profiles[name] = buffer.toString();
				}

			}

		});

		return profiles;

	})(_fs.readdirSync(_path.resolve(_root, './sorbet/profile'))));



	/*
	 * 2: SERVICE INTEGRATION
	 */

	(function() {

		var errors = 0;

		console.log('> Integrating Sorbet Service');


		var sorbet_profile = 'localhost.json';
		var script_dir     = _path.resolve('/etc/init.d');
		var script_result  = false;

		if (_fs.existsSync(script_dir) === true) {

			var buffer = null;
			try {
				buffer = _fs.readFileSync(_path.resolve(__dirname, './_etc_init_d_sorbet.sh'), 'utf8');
				buffer = buffer.toString();
			} catch(e) {
				buffer = null;
			}


			if (buffer !== null) {

				buffer = buffer.replacetemplate('{{lycheejs_root}}',  _root);
				buffer = buffer.replacetemplate('{{sorbet_user}}',    'lycheejs');
				buffer = buffer.replacetemplate('{{sorbet_group}}',   'lycheejs');
				buffer = buffer.replacetemplate('{{sorbet_profile}}', sorbet_profile);


				try {

					_fs.writeFileSync(_path.resolve(script_dir, './sorbet'), buffer, 'utf8');

					if (_exec_sync('chmod 755 ' + _path.resolve(script_dir, './sorbet')) !== null) {
						script_result = true;
					} else {
						script_result = false;
					}

				} catch(e) {
					script_result = false;
				}

			}

		}

		if (script_result === true) {
			console.log('\t/etc/init.d/sorbet: OKAY');
		} else {
			console.log('\t/etc/init.d/sorbet: FAIL');
			errors++;
		}



		var user_result = false;

		if (_exec_sync('getent passwd lycheejs') === null) {

			if (_exec_sync('useradd --system lycheejs') !== null) {
				user_result = true;
			}

		} else {
			user_result = true;
		}

		if (user_result === true) {
			console.log('\tlycheejs user: OKAY');
		} else {
			console.log('\tlycheejs user: FAIL');
			errors++;
		}


		if (_exec_sync('update-rc.d sorbet defaults') !== null) {
			console.log('\tupdate-rc.d: OKAY');
		} else {
			console.log('\tupdate-rc.d: FAIL');
			errors++;
		}



		if (errors === 0) {
			console.log('> OKAY\n');
		} else {
			console.log('> FAIL\n');
		}

	})();

})();

