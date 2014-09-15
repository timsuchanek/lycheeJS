
lychee.define('sorbet.data.Storage').includes([
	'lychee.Storage'
]).exports(function(lychee, sorbet, global, attachments) {

	var _fs        = require('fs');
	var _instances = [];



	/*
	 * HELPERS
	 */

	var _read_cache = function(file) {

		var blob = null;
		try {
			blob = JSON.parse(_fs.readFileSync(file, 'utf8'));
		} catch(e) {
			blob = null;
		}


		if (blob === null) {
			blob = {};
		}

		if (blob[this.id] === undefined) {
			blob[this.id] = [];
		}


		return blob;

	};

	var _write_cache = function(path, cache) {

		var result = false;
		try {
			result = _fs.writeFileSync(path, JSON.stringify(cache), 'utf8');
		} catch(e) {
			result = false;
		}

		return result;

	};

	var _write_storage = function() {

		var path  = '/tmp/sorbet.store';
		var cache = _read_cache.call(this, path);

		if (cache[this.id] instanceof Array) {

			for (var c = 0, cl = cache[this.id].length; c < cl; c++) {

				var pid      = cache[this.id][c].pid;
				var pidindex = this.__removals.indexOf(pid);
				if (pidindex !== -1) {

					this.__removals.splice(pidindex, 1);
					cache[this.id].splice(c, 1);
					cl--;
					c--;

				}

			}


			for (var o = 0, ol = this.__objects.length; o < ol; o++) {

				var object = this.__objects[o];
				var found  = false;

				for (var c = 0, cl = cache[this.id].length; c < cl; c++) {

					if (cache[this.id][c].pid === object.pid) {
						found = true;
						break;
					}

				}

				if (found === false) {
					cache[this.id].push(JSON.parse(JSON.stringify(object)));
				}

			}

		}


		_write_cache.call(this, path, cache);

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__removals = [];


		settings.type = lychee.Storage.TYPE.temporary;
		settings.model = {
			pid:  process.pid,
			port: 8080
		};


		lychee.Storage.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('sync', _write_storage, this);

	};


	Class.TYPE = lychee.Storage.TYPE;


	Class.prototype = {

		remove: function(object) {

			var result = lychee.Storage.prototype.remove.call(this, null, object);
			if (result === true) {

				this.__removals.push(object.pid);

				return true;

			}


			return false;

		}

	};


	return Class;

});

