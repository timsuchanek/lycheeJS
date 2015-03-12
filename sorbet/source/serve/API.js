
lychee.define('sorbet.serve.API').requires([
	'lychee.data.JSON'
]).exports(function(lychee, sorbet, global, attachments) {

	var _JSON = lychee.data.JSON;


	var Module = {

		can: function(host, url) {

			if (url.substr(0, 5) === '/api/') {
				return true;
			}


			return false;

		},

		process: function(host, url, data, ready) {

			var api = url.split('/').pop().split('?')[0];
			if (api === 'Server') {

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

					if (identifier !== null) {

						var project = host.getProject(identifier);
						if (project !== null) {

							var server_host = data.headers['Host'].split(':')[0];
							var server_port = null;

							if (project.server !== null) {
								server_host = project.server.host || server_host;
								server_port = project.server.port || null;
							}


							ready({
								status: 200,
								headers: {
									'Content-Control': 'no-transform',
									'Content-Type':    'application/json'
								},
								payload: _JSON.encode({
									host: server_host,
									port: server_port
								})
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


// TODO: All projects (overview)

ready(null);

					}


				}

			} else {

				ready({
					status:  404,
					headers: { 'Content-Type': 'application/json' },
					payload: _JSON.encode({
						error: 'API not found.'
					})
				});

			}

		}

	};


	return Module;

});

