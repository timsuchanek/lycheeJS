
lychee.define('sorbet.net.Server').tags({
	platform: 'iojs'
}).requires([
	'sorbet.net.Remote'
]).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof process !== 'undefined') {

		try {

			require('net');

			return true;

		} catch(e) {
		}

	}

	return false;

}).exports(function(lychee, sorbet, global, attachments) {

	var net = require('net');



	/*
	 * HELPERS
	 */

	var _generate_error = function(data) {

		var content = 'text/plain';
		var payload = 'File not found.';


		var ext = '';
		if (data.headers instanceof Object && typeof data.headers.url === 'string') {
			ext = data.headers.url.split('?')[0].split('.').pop();
		}


		if (ext === 'js') {
			content = 'application/javascript';
			payload = '"File not found.";';
		} else if (ext === 'json') {
			content = 'application/json';
			payload = '{ "error": "File not found." }';
		} else if (ext === 'xml') {
			content = 'text/xml';
			payload = '<error>File not found.</error>';
		}


		return {
			status:  404,
			headers: { 'Content-Type': content },
			payload: payload
		};

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.host = null;
		this.port = 8080;


		this.__socket = null;


		this.setHost(settings.host);
		this.setPort(settings.port);


		lychee.event.Emitter.call(this);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {
		},



		/*
		 * CUSTOM API
		 */

		connect: function() {

			if (this.__socket === null) {

				if (lychee.debug === true) {
					console.log('sorbet.net.Server: Connected to ' + this.host + ':' + this.port);
				}


				var that = this;


				this.__socket = new net.Server();

				this.__socket.on('connection', function(socket) {

					var host = socket.remoteAddress;
					var port = socket.remotePort;


					socket.setTimeout(0);


					var remote = new sorbet.net.Remote({
						host: host,
						port: port
					});

					remote.bind('connect', function() {
						that.trigger('connect', [ this ]);
					}, remote);

					remote.bind('disconnect', function() {
						that.trigger('disconnect', [ this ]);
					}, remote);


					remote.bind('receive', function(blob) {

						this.trigger('serve', [ blob, function(data) {

							if (data !== null) {
								remote.send(data);
							} else {
								remote.send(_generate_error(blob));
							}

						}]);

					}, that);


					remote.connect(socket);
					remote.trigger('connect', []);

				});


				this.__socket.on('error', function(err) {
					console.error('sorbet.net.Server: Error "' + err + '" on ' + that.host + ':' + that.port);
				});

				this.__socket.on('close', function() {
					that.__socket = null;
				});

				this.__socket.listen(this.port, this.host);


				return true;

			}


			return false;

		},

		disconnect: function() {

			if (this.__socket !== null) {
				this.__socket.close();
			}


			return true;

		},



		/*
		 * TUNNEL API
		 */

		setHost: function(host) {

			host = typeof host === 'string' ? host : null;


			if (host !== null) {

				this.host = host;

				return true;

			}


			return false;

		},

		setPort: function(port) {

			port = typeof port === 'number' ? (port | 0) : null;


			if (port !== null) {

				this.port = port;

				return true;

			}


			return false;

		}

	};


	return Class;

});

