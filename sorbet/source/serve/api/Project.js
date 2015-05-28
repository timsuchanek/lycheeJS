
lychee.define('sorbet.serve.api.Project').requires([
	'lychee.data.JSON',
	'sorbet.mod.Server'
]).exports(function(lychee, sorbet, global, attachments) {

	var _JSON   = {
		encode: JSON.stringify,
		decode: JSON.parse
	};
	var _Server = sorbet.mod.Server;



	/*
	 * HELPERS
	 */

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


	var _dispatch_sorbet = function(project) {

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

			Object.keys(main.hosts).forEach(function(identifier) {

				if (identifier === 'admin') return;

				var projects = main.hosts[identifier].projects;
				if (projects.length === 2) {

					details[identifier] = projects.map(function(project) {
						return project.identifier;
					});

				} else {

					details[identifier] = null;

				}

			});

		}


		project.details    = details;
		project.filesystem = null;
		project.server     = { host: host, port: port },
		project.sorbet     = false;

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
			server:     server,
			sorbet:     project.sorbet
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

				if (identifier !== null) {

					var project = host.getProject(identifier);
					if (project !== null) {

						if (project.identifier === 'sorbet') {
							_dispatch_sorbet(project);
						}


						ready({
							status:  200,
							headers: _to_header(200, data),
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

					var projects = host.projects.filter(function(project) {
						return !project.identifier.match(/cultivator/);
					}).map(_serialize);
					var sorbet   = projects.find(function(project) {
						return project.identifier === 'sorbet';
					}) || null;

					if (sorbet !== null) {
						_dispatch_sorbet(sorbet);
					}


					ready({
						status:  200,
						headers: _to_header(200, data),
						payload: _JSON.encode(projects)
					});

				}



			/*
			 * 3: PUT
			 */

			} else if (method === 'PUT') {

				if (identifier === 'sorbet') {

					ready({
						status:  501,
						headers: { 'Content-Type': 'application/json' },
						payload: _JSON.encode({
							error: 'Action not implemented.'
						})
					});

				} else if (identifier !== null) {

					var project = host.getProject(identifier);
					if (project !== null) {

						var server = project.server;
						if (server === null && action === 'start') {

							_Server.process(project);

							ready({
								status:  200,
								headers: _to_header(200, data),
								payload: ''
							});

						} else if (server !== null && action === 'stop') {

							project.server.destroy();
							project.server = null;

							ready({
								status:  200,
								headers: _to_header(200, data),
								payload: ''
							});

						} else {

							ready({
								status:  405,
								headers: { 'Content-Type': 'application/json' },
								payload: _JSON.encode({
									error: 'Action not allowed.'
								})
							});

						}

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

					ready({
						status:  501,
						headers: { 'Content-Type': 'application/json' },
						payload: _JSON.encode({
							error: 'Action not implemented.'
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

