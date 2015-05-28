
lychee.define('sorbet.serve.api.Profile').requires([
	'lychee.data.JSON',
	'sorbet.data.Filesystem'
]).exports(function(lychee, sorbet, global, attachments) {

	var _JSON = lychee.data.JSON;



	/*
	 * FEATURE DETECTION
	 */

	var _filesystem = new sorbet.data.Filesystem('/sorbet/profile');
	var _profiles   = (function(fs) {

		var profiles    = {};
		var identifiers = fs.dir('/').map(function(value) {
			return value.substr(0, value.length - 5);
		});

		if (identifiers.length > 0) {

			identifiers.forEach(function(identifier) {

				var profile = fs.read('/' + identifier + '.json');
				if (profile !== null) {
					profiles[identifier] = _JSON.decode(profile.toString());
					profiles[identifier].identifier = identifier;
				}

			});

		}

		return profiles;

	})(_filesystem);



	/*
	 * HELPERS
	 */

	var _update_profile = function(identifier, data) {

		if (identifier === '') return false;


		var filtered = {
			port:  null,
			hosts: {}
		};


		if (typeof data.port === 'number') {
			filtered.port = (data.port | 0);
		}

		if (data.hosts instanceof Object) {

			for (var host in data.hosts) {

				var project = data.hosts[host];
				if (typeof project === 'string' || project === null) {
					filtered.hosts[host] = project;
				}

			}

		}


		if (typeof filtered.port === 'number' && Object.keys(filtered.hosts).length > 0) {

			_profiles[identifier] = filtered;
			_filesystem.write('/' + identifier + '.json', _JSON.encode(filtered));
			_profiles[identifier].identifier = identifier;

			return true;

		}


		return false;

	};

	var _to_header = function(status, data) {

		return {
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Origin':  data.headers.origin || '*',
			'Access-Control-Allow-Methods': 'GET, PUT, POST',
			'Access-Control-Max-Age':       60 * 60,
			'Content-Control':              'no-transform',
			'Content-Type':                 'application/json'
		}

	};


	var _serialize = function(profile) {

		return {
			identifier: profile.identifier || '',
			port:       profile.port       || 8080,
			hosts:      profile.hosts      || {}
		};

	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		process: function(host, url, data, ready) {

			var method     = data.headers.method;
			var parameters = data.headers.parameters;
			var identifier = null;
			var action     = null;


			if (parameters instanceof Object) {
				action     = parameters.action     || null;
				identifier = parameters.identifier || null;
			}



			/*
			 * 1: OPTIONS
			 */

			if (method === 'OPTIONS') {

				ready({
					status:  200,
					headers: {
						'Access-Control-Allow-Headers': 'Content-Type',
						'Access-Control-Allow-Origin':  data.headers.origin,
						'Access-Control-Allow-Methods': 'GET, PUT, POST',
						'Access-Control-Max-Age':       60 * 60
					},
					payload: ''
				});



			/*
			 * 2: GET
			 */

			} else if (method === 'GET') {

				if (identifier !== null) {

					var profile = _profiles[identifier] || null;
					if (profile !== null) {

						ready({
							status:  200,
							headers: _to_header(200, data),
							payload: _JSON.encode(_serialize(profile))
						});

					} else {

						ready({
							status:  404,
							headers: { 'Content-Type': 'application/json' },
							payload: _JSON.encode({
								error: 'Profile not found.'
							})
						});

					}

				} else {

					ready({
						status:  200,
						headers: _to_header(200, data),
						payload: _JSON.encode(Object.values(_profiles).map(_serialize))
					});

				}



			/*
			 * 3: PUT
			 */

			} else if (method === 'PUT') {

				if (identifier !== null) {

					var result = _update_profile(identifier, parameters);
					if (result === true) {

						ready({
							status: 200,
							headers: _to_header(200, data),
							payload: ''
						});

					} else {

						ready({
							status:  400,
							headers: { 'Content-Type': 'application/json' },
							payload: _JSON.encode({
								error: 'Bad Request: Invalid Payload.'
							})
						});

					}

				} else {

					ready({
						status:  400,
						headers: { 'Content-Type': 'application/json' },
						payload: _JSON.encode({
							error: 'Bad Request: Invalid Identifier.'
						})
					});

				}



			/*
			 * X: OTHER
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

