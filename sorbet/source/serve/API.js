
lychee.define('sorbet.serve.API').requires([
	'lychee.data.JSON',
	'sorbet.serve.api.Project',
	'sorbet.serve.api.Server'
]).exports(function(lychee, sorbet, global, attachments) {

	var _JSON = lychee.data.JSON;

	var _API  = {
		'Project': sorbet.serve.api.Project,
		'Server':  sorbet.serve.api.Server
	};


	var Module = {

		can: function(host, url) {

			if (url.substr(0, 5) === '/api/') {
				return true;
			}


			return false;

		},

		process: function(host, url, data, ready) {

			var api = url.split('/').pop().split('?')[0];
			if (_API[api] !== undefined) {

				_API[api].process(host, url, data, ready);

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

