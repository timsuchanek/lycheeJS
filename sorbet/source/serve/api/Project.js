
lychee.define('sorbet.serve.api.Project').requires([
	'lychee.data.JSON'
]).exports(function(lychee, sorbet, global, attachments) {

	var _JSON = lychee.data.JSON;



	/*
	 * HELPERS
	 */

	var _get_sorbet = function() {

		var details = {};
		var host    = null;
		var port    = null;


		var main = global.MAIN;
		if (main.server !== null) {
			port = main.server.port;
		}


		if (Object.keys(main.hosts).length === 1) {
			host = Object.keys(main.hosts)[0];
		}


		if (Object.keys(main.hosts).length > 0) {

			Object.keys(main.hosts).forEach(function(id) {

				details[id] = main.hosts[id].projects.map(function(project) {
					return project.identifier;
				});

			});

		}


		return {
			identifier: 'sorbet',
			details:    details,
			filesystem: null,
			server:     {
				host: host,
				port: port
			}
		};

	};

	var _serialize = function(project) {

		var filesystem = null;
		var server     = null;


		if (project.filesystem !== null) {

			filesystem = project.filesystem.root;

		}


		if (project.server !== null) {

			server = {
				host: project.server.host,
				port: project.server.port
			};

		}


		return {
			identifier: project.identifier,
			details:    project.details || null,
			filesystem: filesystem,
			server:     server
		};

	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		process: function(host, url, data, ready) {

			var identifier = null;
			var parameters = data.headers.parameters;
			if (parameters instanceof Object) {
				identifier = parameters.identifier || null;
			}


			var method = data.headers.method;
			if (method === 'OPTIONS') {

				ready({
					status:  200,
					headers: {
						'Access-Control-Allow-Origin':  data.headers['Host'],
						'Access-Control-Allow-Methods': 'GET',
						'Access-Control-Max-Age':       60 * 60
					},
					payload: ''
				});

			} else if (method === 'GET') {

				if (identifier === 'sorbet') {

					ready({
						status:  200,
						headers: {
							'Content-Control': 'no-transform',
							'Content-Type':    'application/json'
						},
						payload: _JSON.encode(_serialize(_get_sorbet()))
					});

				} else if (identifier !== null) {

					var project = host.getProject(identifier);
					if (project !== null) {

						ready({
							status:  200,
							headers: {
								'Content-Control': 'no-transform',
								'Content-Type':    'application/json'
							},
							payload: _JSON.encode(_serialize(project))
						});

					} else {

						ready({
							status:  404,
							headers: { 'Content-Type': 'application/json' },
							payload: _JSON.encode({
								error: 'Project not found.'
							})
						});

					}

				} else {

					var projects = host.projects.map(_serialize);
					if (projects.length > 0) {
						projects.push(_serialize(_get_sorbet()));
					}


					ready({
						status:  200,
						headers: { 'Content-Type': 'application/json' },
						payload: _JSON.encode(projects)
					});

				}

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

