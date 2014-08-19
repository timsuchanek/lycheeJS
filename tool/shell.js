
var root = require('path').resolve(__dirname, '../');


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

		include: function(paths, identifiers) {

			var map = {};

			for (var p = 0, pl = paths.length; p < pl; p++) {

				var path       = paths[p];
				var identifier = identifiers[p];

				try {

					require(paths[p]);

					var definition = lychee.environment.definitions[identifier] || null;
					if (definition !== null) {
						map[identifier] = definition._exports.call(definition._exports, lychee, global, definition._attaches);
					}

				} catch(e) {
				}

			}


			return map;

		},

		resolve: function(path) {

			var result = null;

			if (typeof path === 'string') {

				try {
					result = _path.resolve(root, path);
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

})(require(root + '/lychee/build/nodejs/core.js')(root), typeof global !== 'undefined' ? global : this);

