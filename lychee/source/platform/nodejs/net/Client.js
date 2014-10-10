
lychee.define('lychee.net.Client').tags({
	platform: 'nodejs'
}).includes([
	'lychee.event.Emitter'
]).requires([
	'lychee.net.Service'
]).supports(function(lychee, global) {

	if (typeof process !== 'undefined') {
		return true;
	}


	return false;

}).exports(function(lychee, global) {

	/*
	 * HELPERS
	 */

	var _socket_handler = function(url) {
	};

	var _receive_handler = function(blob, isBinary) {

		var data = null;
		try {
			data = this.__decoder(blob);
		} catch(e) {
			// Unsupported data encoding
			return false;
		}


		if (data instanceof Object && typeof data._serviceId === 'string') {

			var service = this.getService(data._serviceId);
			var event   = data._serviceEvent  || null;
			var method  = data._serviceMethod || null;


			if (method !== null) {

				if (method.charAt(0) === '@') {

					if (method === '@plug') {
						_plug_service.call(this,   data._serviceId, service);
					} else if (method === '@unplug') {
						_unplug_service.call(this, data._serviceId, service);
					}

				} else if (service !== null && typeof service[method] === 'function') {

					// Remove data frame service header
					delete data._serviceId;
					delete data._serviceMethod;

					service[method](data);

				}

			} else if (event !== null) {

				if (service !== null && typeof service.trigger === 'function') {

					// Remove data frame service header
					delete data._serviceId;
					delete data._serviceEvent;

					service.trigger(event, [ data ]);

				}

			}

		} else {

			this.trigger('receive', [ data ]);

		}


		return true;

	};

	var _is_service_waiting = function(service) {

		for (var w = 0, wl = this.__services.waiting.length; w < wl; w++) {

			if (this.__services.waiting[w] === service) {
				return true;
			}

		}


		return false;

	};

	var _is_service_active = function(service) {

		for (var a = 0, al = this.__services.active.length; a < al; a++) {

			if (this.__services.active[a] === service) {
				return true;
			}

		}


		return false;

	};

	var _plug_service = function(id, service) {

		id = typeof id === 'string' ? id : null;

		if (id === null || service === null) {
			return;
		}


		var found = false;

		for (var w = 0, wl = this.__services.waiting.length; w < wl; w++) {

			if (this.__services.waiting[w] === service) {
				this.__services.waiting.splice(w, 1);
				found = true;
				wl--;
				w--;
			}

		}


		if (found === true) {

			this.__services.active.push(service);

			service.trigger('plug', []);

			if (lychee.debug === true) {
				console.log('lychee.net.Client: Remote plugged in Service (' + id + ')');
			}

		}

	};

	var _unplug_service = function(id, service) {

		id = typeof id === 'string' ? id : null;

		if (id === null || service === null) {
			return;
		}


		var found = false;

		for (var a = 0, al = this.__services.active.length; a < al; a++) {

			if (this.__services.active[a] === service) {
				this.__services.active.splice(a, 1);
				found = true;
				al--;
				a--;
			}

		}


		if (found === true) {

			service.trigger('unplug', []);

			if (lychee.debug === true) {
				console.log('lychee.net.Client: Remote unplugged Service (' + id + ')');
			}

		}

	};

	var _cleanup_services = function() {

		for (var a = 0, al = this.__services.active.length; a < al; a++) {
			this.__services.active[a].trigger('unplug', []);
		}

		if (lychee.debug === true) {
			console.log('lychee.net.Client: Remote disconnected');
		}


		this.__services.waiting = [];
		this.__services.active  = [];

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.port      = 1337;
		this.host      = 'localhost';
		this.reconnect = 0;


		this.__encoder = settings.encoder instanceof Function ? settings.encoder : JSON.stringify;
		this.__decoder = settings.decoder instanceof Function ? settings.decoder : JSON.parse;
		this.__socket  = null;
		this.__services  = {
			waiting: [], // Waiting Services need to be verified from Remote
			active:  []  // Active Services for allowed interaction
		};

		this.__isBinary  = false;
		this.__isRunning = false;


		lychee.event.Emitter.call(this);

		settings = null;

	};


	Class.STATUS = {
		1000: 'Normal Closure',
		1001: 'Going Away',
		1002: 'Protocol Error',
		1003: 'Unsupported Data',
		1005: 'No Status Received',
		1006: 'Abnormal Closure',
		1008: 'Policy Violation',
		1009: 'Message Too Big',
		1011: 'Internal Error',
		1012: 'Service Restart',
		1013: 'Try Again Later'
	};


	Class.prototype = {

		listen: function(port, host) {

			if (this.__socket !== null) return false;


			this.port = typeof port === 'number' ? port : this.port;
			this.host = typeof host === 'string' ? host : this.host;


			if (this.__isRunning === true) {
				return false;
			}


			if (lychee.debug === true) {
				console.log('lychee.net.Client: Listening on ' + this.host + ':' + this.port);
			}


			var url = 'ws://' + this.host + ':' + this.port;

			_socket_handler.call(this, url);
			// TODO: Create this.__socket instance and bind close and message events

		},

		send: function(data, service) {

			data    = data instanceof Object    ? data    : null;
			service = service instanceof Object ? service : null;


			if (data === null || this.__isRunning === false) {
				return false;
			}


			if (service !== null) {

				if (typeof service.id     === 'string') data._serviceId     = service.id;
				if (typeof service.event  === 'string') data._serviceEvent  = service.event;
				if (typeof service.method === 'string') data._serviceMethod = service.method;

			}


			var blob = this.__encoder(data);
			if (this.__isBinary === true) {

				var bl    = blob.length;
				var bytes = new Uint8Array(bl);

				for (var b = 0; b < bl; b++) {
					bytes[b] = blob.charCodeAt(b);
				}

				blob = bytes.buffer;

			}


			// TODO: Send data via this.__socket to server
			// this.__socket.send(blob);


			return true;

		},

		connect: function() {

			if (this.__isRunning === false) {
				return this.listen(this.port, this.host);
			}


			return false;

		},

		disconnect: function() {

			if (this.__isRunning === true) {

				// TODO: Close this.__socket connection
				// this.__socket.close();

				return true;

			}


			return false;

		},

		setReconnect: function(reconnect) {

			reconnect = typeof reconnect === 'number' ? (reconnect | 0) : null;


			if (reconnect !== null) {

				this.reconnect = reconnect;

				return true;

			}


			return false;

		},

		addService: function(service) {

			service = lychee.interfaceof(lychee.net.Service, service) ? service : null;


			if (service !== null) {

				if (_is_service_waiting.call(this, service) === false && _is_service_active.call(this, service) === false) {

					this.__services.waiting.push(service);

					// Please, Remote, plug Service! PING
					this.send({}, {
						id:     service.id,
						method: '@plug'
					});

					return true;

				}

			}


			return false;

		},

		getService: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				for (var w = 0, wl = this.__services.waiting.length; w < wl; w++) {

					var wservice = this.__services.waiting[w];
					if (wservice.id === id) {
						return wservice;
					}

				}

				for (var a = 0, al = this.__services.active.length; a < al; a++) {

					var aservice = this.__services.active[a];
					if (aservice.id === id) {
						return aservice;
					}

				}

			}


			return null;

		},

		removeService: function(service) {

			service = lychee.interfaceof(lychee.net.Service, service) ? service : null;


			if (service !== null) {

				if (_is_service_waiting.call(this, service) === true || _is_service_active.call(this, service) === true) {

					// Please, Remote, unplug Service! PING
					this.send({}, {
						id:     service.id,
						method: '@unplug'
					});

					return true;

				}

			}


			return false;

		}

	};


	return Class;

});

