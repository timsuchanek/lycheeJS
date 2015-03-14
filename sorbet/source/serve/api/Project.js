
lychee.define('sorbet.serve.api.Project').exports(function(lychee, sorbet, global, attachments) {

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

				// TODO: Implement API

				ready({
					status:  405,
					headers: { 'Content-Type': 'application/json' },
					payload: _JSON.encode({
						error: 'Method not allowed.'
					})
				});

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

