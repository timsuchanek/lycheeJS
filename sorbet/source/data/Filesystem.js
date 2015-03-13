
lychee.define('sorbet.data.Filesystem').includes([
	'lychee.event.Emitter'
]).exports(function(lychee, sorbet, global, attachments) {

	var _fs   = require('fs');
	var _path = require('path');



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(root) {

		this.root = _path.normalize(root);


		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		dir: function(path, callback, scope) {

			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;


			var resolved = _path.normalize(this.root + path);
			if (callback !== null) {

				_fs.readdirSync(resolved, function(err, data) {

					if (err) {
						callback.call(scope, null);
					} else {
						callback.call(scope, data);
					}

				});

			} else {

				try {
					return _fs.readdirSync(resolved);
				} catch(e) {
					return null;
				}

			}

		},

		read: function(path, callback, scope) {

			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;


			var resolved = _path.normalize(this.root + path);
			if (callback !== null) {

				_fs.readFile(resolved, function(err, data) {

					if (err) {
						callback.call(scope, null);
					} else {
						callback.call(scope, data);
					}

				});

			} else {

				try {
					return _fs.readFileSync(resolved);
				} catch(e) {
					return null;
				}

			}

		},

		write: function(path, data, callback, scope) {

			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;


			var encoding = 'binary';

			if (typeof data === 'string') {
				encoding = 'utf8';
			} else {
				encoding = 'binary';
			}


			var info     = this.info(_path.dirname(path));
			var resolved = _path.normalize(this.root + path);

			if (info !== null && info.type === 'directory') {

				if (callback !== null) {

					_fs.writeFile(resolved, data, encoding, function(err) {

						if (err) {
							callback.call(scope, false);
						} else {
							callback.call(scope, true);
						}

					});

				} else {

					return _fs.writeFileSync(resolved, data, encoding);

				}

			} else {

				if (callback !== null) {
					callback.call(scope, false);
				} else {
					return false;
				}

			}

		},

		info: function(path) {

			var resolved = _path.normalize(this.root + path);
			if (resolved !== null) {

				var raw = null;

				try {

					raw = _fs.statSync(resolved);

				} catch(e) {
				}


				if (raw !== null) {

					return {
						type:   raw.isFile() ? 'file' : 'directory',
						length: raw.size,
						time:   raw.mtime
					};

				}

			}


			return null;

		}

	};


	return Class;

});

