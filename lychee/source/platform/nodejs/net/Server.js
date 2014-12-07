
lychee.define('lychee.net.Server').tags({
	platform: 'nodejs'
}).requires([
	'lychee.data.BitON',
	'lychee.data.JSON',
	'lychee.net.Remote'
]).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof process !== 'undefined') {
		return true;
	}


	return false;

}).exports(function(lychee, global, attachments) {

	var http    = require('http');
	var crypto  = require('crypto');

	var _BitON  = lychee.data.BitON;
	var _JSON   = lychee.data.JSON;



	/*
	 * HELPERS
	 */

	var _get_websocket_headers = function(httpheaders) {

		var wsheaders = {
			host:    httpheaders.host,
			origin:  httpheaders.origin || null,
			version: +httpheaders.version || 0
		};


		for (var prop in httpheaders) {

			if (prop.substr(0, 14) === 'sec-websocket-') {
				wsheaders[prop.substr(14)] = httpheaders[prop];
			}

		}


		if (wsheaders.version) {
			return wsheaders;
		}


		return null;

	};

	var _get_websocket_handshake = function(request) {

		var headers = _get_websocket_headers(request.headers);
		if (headers !== null && headers.origin !== null) {

			var sha1 = crypto.createHash('sha1');
			sha1.update(headers.key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');


			// HEAD
			var handshake = '';
			handshake += 'HTTP/1.1 101 WebSocket Protocol Handshake\r\n';
			handshake += 'Upgrade: WebSocket\r\n';
			handshake += 'Connection: Upgrade\r\n';

			handshake += 'Sec-WebSocket-Version: ' + headers.version       + '\r\n';
			handshake += 'Sec-WebSocket-Origin: '  + headers.origin        + '\r\n';
			handshake += 'Sec-WebSocket-Accept: '  + sha1.digest('base64') + '\r\n';


			// BODY
			handshake += '\r\n';


			return handshake;

		}


		return null;

	};

	var _upgrade_to_websocket = function(request, socket, head) {

		var reqheaders = request.headers;
		if (typeof reqheaders.upgrade === 'string' && reqheaders.upgrade.toLowerCase() === 'websocket') {

			if (typeof reqheaders.connection === 'string' && reqheaders.connection.toLowerCase().indexOf('upgrade') !== -1) {

				var handshake = _get_websocket_handshake(request);
				if (handshake !== null) {

					socket.write(handshake, 'ascii');
					socket.setTimeout(0);
					socket.setNoDelay(true);
					socket.setKeepAlive(true, 0);
					socket.removeAllListeners('timeout');


					return true;

				}

			}

		}


		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.host = null;
		this.port = 1337;


		this.__codec  = lychee.interfaceof(settings.codec, _JSON) ? settings.codec : _JSON;
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

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.Server';

			var settings = {};


			if (this.host !== 'localhost') settings.host = this.host;
			if (this.port !== 1337)        settings.port = this.port;


			data['arguments'][0] = settings;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function() {

			if (this.__socket === null) {

				if (lychee.debug === true) {
					console.log('lychee.net.Server: Connected to ' + this.host + ':' + this.port);
				}


				var that = this;


				this.__socket = new http.Server();

				this.__socket.on('upgrade', function(request, socket, headers) {

					if (_upgrade_to_websocket.call(that, request, socket, headers) === true) {

						var host = socket.remoteAddress || socket.server._connectionKey.split(':')[1];
						var port = socket.remotePort    || socket.server._connectionKey.split(':')[2];


						var remote = new lychee.net.Remote({
							host:  host,
							port:  port,
							codec: that.__codec
						});

						remote.bind('connect', function() {
							that.trigger('connect', [ this ]);
						}, remote);

						remote.bind('disconnect', function() {
							that.trigger('disconnect', [ this ]);
						}, remote);

						remote.connect(socket);
						remote.trigger('connect', []);

					} else {

						socket.end();
						socket.destroy();

					}

				});

				this.__socket.on('error', function(err) {

					console.error('lychee.net.Server: Error "' + err + '" on ' + that.host + ':' + that.port);

					try {
						that.__socket.close();
					} catch(e) {
					}

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

