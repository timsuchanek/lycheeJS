
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
	 * EXPORTS
	 */

	module.exports = {

		lychee:  lychee,
		global:  global,

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

