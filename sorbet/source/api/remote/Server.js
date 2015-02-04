
lychee.define('sorbet.api.remote.Server').includes([
	'sorbet.api.Service'
]).exports(function(lychee, sorbet, global, attachments) {

	/*
	 * HELPERS
	 */

	var _serialize_project = function(project) {

		var host = null;
		var port = null;


		var server = project.server;
		if (server !== null) {
			host = server.host || null;
			port = server.port || null;
		}


		return {
			'identifier': project.id,
			'host':       host,
			'port':       port
		};

	};

	var _get_servers = function(vhost, filters) {

		return Object.values(vhost.projects).map(function(project) {

			var data = _serialize_project(project);
			if (data.host === null) data.host = filters.host;

			return data;

		}).sort(function(a, b) {
			if (a.identifier < b.identifier) return -1;
			if (a.identifier > b.identifier) return  1;
			return 0;
		});

	};

	var _get_server = function(vhost, filters) {

		var project = Object.values(vhost.projects).find(function(project) {
			return project.id === filters.identifier;
		}) || null;


		if (project !== null) {

			var data = _serialize_project(project);
			if (data.host === null) data.host = filters.host;
			if (data.port !== null) {
				return data;
			}

		}


		return null;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		this.id   = 'Server';
		this.main = main;


		sorbet.api.Service.call(this, {
			'PATCH': false,
			'POST':  false,
			'PUT':   false
		});



		/*
		 * INITIALIZATION
		 */

		this.bind('GET', function(vhost, filters, response) {

			filters.identifier = typeof filters.identifier === 'string' ? filters.identifier : null;


			var data = null;

			if (filters.identifier === null) {
				data = _get_servers.call(this, vhost, filters);
			} else {
				data = _get_server.call(this, vhost, filters);
			}

			if (data !== null) {
				response(true, data);
			} else {
				response(false, data);
			}

		}, this);

		this.bind('OPTIONS', function(vhost, filters, response) {

			var data = {
				identifier: 'Identifier of the Project, e.g. "boilerplate"'
			};

			response(true, data);

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});

