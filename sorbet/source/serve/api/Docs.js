
lychee.define('sorbet.serve.api.Docs').requires([
	'lychee.data.JSON',
	'sorbet.data.Filesystem'
]).exports(function(lychee, sorbet, global, attachments) {

	var _JSON = lychee.data.JSON;
	var _filesystem = new sorbet.data.Filesystem('/');
	var SRC_PREFIX = '/lychee/source/';
	var API_PREFIX = '/lychee/api/';

	/*
	 * HELPERS
	 */

	var _to_header = function(status, data) {

		var origin = data.headers['Origin'] || '*';


		return {
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Origin':  origin,
			'Access-Control-Allow-Methods': 'GET, PUT, POST',
			'Access-Control-Max-Age':       60 * 60,
			'Content-Control':              'no-transform',
			'Content-Type':                 'application/json'
		}

	};


	var _get_docs_tree = function(name) {
		var tree = {};

		name = name[0] === '/' ? name : '/' + name;


		var _walk = function() {

			var pointer = tree;
			var parents_copy = this.parents.slice();

			this.pointer = '';


			if (this.parents.length === 0) {

				tree[this.file] = {};

			} else {

				do {
					var dir = parents_copy.shift();
					pointer = pointer[dir];
					this.pointer += dir + '/';
				} while (parents_copy.length > 0);

			}


			this.pointer += this.file;


			var files = _filesystem.dir(SRC_PREFIX + this.pointer);


			if (files === null) {

				// For cases like Class.Name.Awesome.js
				var package_name = this.file.split('.');
				package_name = package_name.slice(0, package_name.length - 1).join('.');

				var path = _translate_platform(SRC_PREFIX + this.pointer.substring(0, this.pointer.length - 3));

				path = _source_to_api(path);


				var doc = _filesystem.read(path);


				if (doc === null) {

					pointer[package_name] = false;

				} else {

					if (name === SRC_PREFIX + this.pointer.substring(0, this.pointer.length - 3)) {
						pointer[package_name] = lychee.serialize(doc);
					} else {
						pointer[package_name] = true;
					}

				}


				return;
			} else {

				pointer[this.file] = {};

				files.forEach(function(new_file) {

					var scope = {
						parents: this.parents.concat(this.file),
						file: new_file
					};

					_walk.call(scope);
				}, this);
			}

		}

		_filesystem.dir(SRC_PREFIX).forEach(function(id) {
			var walk_scope = {
				parents: [],
				file: id
			};

			_walk.call(walk_scope);
		});

		return tree;
	};

	var _get_docs_only = function(name) {
		name = name[0] === '/' ? name.slice(1, name.length) : name;
		name = _translate_platform(name);

		var doc = _filesystem.read(_source_to_api(name));
		return {
			doc: lychee.serialize(doc)
		};
	};

	var _source_to_api = function(src) {
		var api_string = API_PREFIX + src.split('/source/')[1].replace('.js', '.md');
		if (api_string.substr(api_string.length - 3) !== '.md') {
			api_string += '.md';
		}
		return api_string;
	}

	var _translate_platform = function(name) {
		/**
		 * if we have a platform specific implementation,
		 * take the implementation from lychee/api/core or lychee/api/net
		 */

		var output = name;

		if (/platform/.test(name)) {
			if (/net/.test(name)) {
				output = SRC_PREFIX + "net/" + name.split('/').pop();
			} else {
				output = SRC_PREFIX + "core/" + name.split('/').pop();
			}
		}

		return output;
	}



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		process: function(host, url, data, ready) {

			var method     = data.headers.method;
			var parameters = data.headers.parameters || null;
			var module     = parameters !== null && parameters.hasOwnProperty('module') ? parameters.module : null;
			var docsonly   = parameters !== null && parameters.hasOwnProperty('docsonly') ? parameters.docsonly : null;

			/*
			 * 1: OPTIONS
			 */

			if (method === 'OPTIONS') {

				ready({
					status:  200,
					headers: {
						'Access-Control-Allow-Headers': 'Content-Type',
						'Access-Control-Allow-Origin':  data.headers['Origin'],
						'Access-Control-Allow-Methods': 'GET, PUT, POST',
						'Access-Control-Max-Age':       60 * 60
					},
					payload: ''
				});



			/*
			 * 2: GET
			 */

			} else if (method === 'GET') {

				if (module !== null) {
					var docs = null;

					if (docsonly !== null) {
						docs = _get_docs_only(module);
					} else {
						docs = _get_docs_tree(module);
					}

					ready({
						status:  200,
						headers: _to_header(200, data),
						payload: _JSON.encode(docs)
					});

				} else {

					ready({
						status:  400,
						headers: _to_header(400, data),
						payload: _JSON.encode({
							error: 'module parameter is missing. Try eg. ?module=lychee.core.Asset'
						})
					});

				}


			/*
			 * 3: PUT
			 */

			} else {

				ready({
					status:  405,
					headers: { 'Content-Type': 'application/json' },
					payload: _JSON.encode({
						error: 'Method not allowed.'
					})
				});

			}

		}

	};


	return Module;

});