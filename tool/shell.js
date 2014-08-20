
/*
 * POLYFILLS
 */

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



/*
 * IMPLEMENTATION
 */


var _root = require('path').resolve(__dirname, '../');

(function(lychee, global) {

	var _child_process = require('child_process');
	var _self_process  = process.argv[0] || 'nodejs';
	var _fs            = require('fs');
	var _path          = require('path');



	/*
	 * IMPLEMENTATION
	 */

	var Filesystem = function(fertilizer, sandbox) {

		this.__cache      = [];
		this.__fertilizer = '/tmp/lycheejs';
		this.__sandbox    = '/tmp/lycheejs';


		if (typeof fertilizer === 'string') {

			try {

				var stat = _fs.statSync(fertilizer);
				if (stat.isDirectory()) {
					this.__fertilizer = fertilizer;
				}

			} catch(e) {
			}

		}

		if (typeof sandbox === 'string') {

			try {

				var stat = _fs.statSync(sandbox);
				if (stat.isDirectory()) {
					this.__sandbox = sandbox;
				}

			} catch(e) {
			}

		}

	};


	Filesystem.prototype = {

		copy: function(path1, path2) {

			path1 = typeof path1 === 'string' ? path1 : null;
			path2 = typeof path2 === 'string' ? path2 : null;


			if (path1 !== null && path2 !== null) {

				var result = false;
				try {

					if (_fs.existsSync(this.__sandbox + '/' + path1)) {

						var buffer = _fs.readFileSync(this.__sandbox + '/' + path1);
						_fs.writeFileSync(this.__sandbox + '/' + path2, buffer);

						result = true;

					}

				} catch(e) {

				}


				if (result === true) {

					var index = this.__cache.indexOf(path2);
					if (index === -1) {
						this.__cache.push(path2);
					}

					return true;

				}

			}


			return false;

		},

		copytemplate: function(path1, path2) {

			path1 = typeof path1 === 'string' ? path1 : null;
			path2 = typeof path2 === 'string' ? path2 : null;


			if (path1 !== null && path2 !== null) {

				var result = false;
				try {

					if (_fs.existsSync(this.__fertilizer + '/' + path1)) {

						var buffer = _fs.readFileSync(this.__fertilizer + '/' + path1);
						_fs.writeFileSync(this.__sandbox + '/' + path2, buffer);

						result = true;

					}

				} catch(e) {

				}


				if (result === true) {

					var index = this.__cache.indexOf(path2);
					if (index === -1) {
						this.__cache.push(path2);
					}

					return true;

				}

			}


			return false;

		},

		read: function(path, encoding) {

			path     =  typeof path === 'string' ? path     : null;
			encoding = encoding === 'binary'     ? 'binary' : 'utf8';


			if (path !== null) {

				var data = null;
				try {
					data = _fs.readFileSync(this.__sandbox + '/' + path, encoding);
				} catch(e) {

				}

				return data;

			}


			return null;

		},

		write: function(path, data, encoding) {

			path     =  typeof path === 'string'                            ? path   : null;
			data     = (typeof data === 'string' || data instanceof Buffer) ? data   : null;
			encoding =  typeof data === 'string'                            ? 'utf8' : (encoding || 'binary');


			if (path !== null && data !== null) {

				if (path.charAt(0) === '.') {
					return false;
				}


				if (encoding === 'utf8') {

					var result = false;
					try {
						_fs.writeFileSync(this.__sandbox + '/' + path, data, 'utf8');
						result = true;
					} catch(e) {

					}


					if (result === true) {

						this.__cache.push(path);

						return true;

					}

				} else if (encoding === 'binary') {

					var result = false;
					try {
						_fs.writeFileSync(this.__sandbox + '/' + path, data.toString('binary'), 'binary');
						result = true;
					} catch(e) {

					}


					if (result === true) {

						var index = this.__cache.indexOf(path);
						if (index === -1) {
							this.__cache.push(path);
						}

						return true;

					}

				}

			}


			return false;

		},

		extractindex: function() {

			var cache    = this.__cache;
			var filtered = [];

			for (var c = 0, cl = cache.length; c < cl; c++) {

				if (cache[c].split('/').pop().substr(0, 5) === 'index') {
					filtered.push(cache[c]);
				}

			}


			for (var f = 0, fl = filtered.length; f < fl; f++) {

				var file        = filtered[f].split('/').pop();
				var sandboxpath = this.__sandbox + '/' + file;
				var outputpath  = this.__sandbox + '.' + file.split('.').pop();

				if (filtered[f] === file) {

					var buffer = _fs.readFileSync(sandboxpath);
					if (buffer !== null) {
						_fs.writeFileSync(outputpath, buffer);
					}

				}

			}

		},

		remove: function(path) {

			path = typeof path === 'string' ? path : null;


			if (path !== null) {

				if (path.charAt(0) === '.') {
					return false;
				}


				var result = false;
				try {
					_fs.unlinkSync(this.__sandbox + '/' + path);
					result = true;
				} catch(e) {

				}

				if (result === true) {

					var index = this.__cache.indexOf(path);
					if (index !== -1) {
						this.__cache.splice(index, 1);
					}

					return true;

				}

			}


			return false;

		}

	};



	/*
	 * EXPORTS
	 */

	module.exports = {

		lychee:  lychee,
		global:  global,

		Filesystem: Filesystem,

		include: function(path, identifier) {

			var Class = null;

			try {

				require(_root + '/' + path);

				var definition = lychee.environment.definitions[identifier] || null;
				if (definition !== null) {
					Class = definition._exports.call(definition._exports, lychee, global, definition._attaches);
				}

			} catch(e) {
			}

			return Class;

		},

		resolve: function(path) {

			var result = null;

			if (typeof path === 'string') {

				try {
					result = _path.resolve(_root, path);
				} catch(e) {
					result = path;
				}

			}

			return result;

		},

		read: function(path) {

			path = typeof path === 'string' ? path : '';


			var type = path.split('.').pop() || '';
			var data = null;

			if (this.isFile(path)) {

				var raw = null;
				try {
					raw = _fs.readFileSync(path, 'utf8');
				} catch(e) {
				}


				if (raw !== null) {

					if (type.match(/json|env|pkg|store/)) {

						try {
							data = JSON.parse(raw);
						} catch(e) {
							data = null;
						}

					} else {

						data = raw;

					}

				}

			}

			return data;

		},

		isDirectory: function(path) {

			var result = false;

			if (typeof path === 'string') {

				try {

					var stat = _fs.statSync(path);
					if (stat.isDirectory()) {
						result = true;
					}

				} catch(e) {
				}

			}

			return result;

		},

		isFile: function(path) {

			var result = false;

			if (typeof path === 'string') {

				try {

					var stat = _fs.statSync(path);
					if (stat.isFile()) {
						result = true;
					}

				} catch(e) {
				}

			}

			return result;

		}

	};

})(require(_root + '/lychee/build/nodejs/core.js')(_root), typeof global !== 'undefined' ? global : this);

