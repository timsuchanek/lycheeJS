
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


		return blob;

	};

	var _sync_storage = function(objects) {

		var path = '/tmp/sorbet.store';

		var cache = _read_cache(path);
		if (cache instanceof Object) {
//				cache[this.id] = _serialize.call(this);
		}

console.log('SYNCHRONIZING SORBET STORAGE', Object.keys(cache), this.__objects);

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		settings.type = lychee.Storage.TYPE.temporary;


		lychee.Storage.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('sync', _sync_storage, this);

	};


	Class.TYPE = lychee.Storage.TYPE;


	Class.prototype = {

	};


	return Class;

});

