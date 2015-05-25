
lychee.define('sorbet.net.Remote').tags({
	platform: 'iojs'
}).requires([
	'lychee.net.protocol.HTTP'
]).includes([
	'lychee.net.Tunnel'
]).supports(function(lychee, global) {

	// TODO: Feature Detection

	return true;

}).exports(function(lychee, sorbet, global, attachments) {

	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__socket      = null;
		this.__isConnected = false;


		settings.codec = {
			encode: function(data) { return data; },
			decode: function(data) { return data; }
		};


		lychee.net.Tunnel.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('connect', function() {
			this.__isConnected = true;
		}, this);

		this.bind('disconnect', function() {
			this.__isConnected = false;
		}, this);

		this.bind('send', function(blob) {

			if (this.__socket !== null) {
				this.__socket.send(blob.status, blob.headers, blob.payload);
			}

		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.net.Tunnel.prototype.serialize.call(this);
			data['constructor'] = 'sorbet.net.Remote';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function(socket) {

			if (this.__isConnected === false) {

				var that = this;


				this.__socket = new lychee.net.protocol.HTTP(socket, lychee.net.protocol.HTTP.TYPE.remote);

				this.__socket.ondata = function(status, headers, payload) {

					that.receive({
						status:  status,
						headers: headers,
						payload: payload
					});

				};

				this.__socket.onclose = function(code) {
					that.__socket = null;
					that.trigger('disconnect', [ code ]);
				};


				if (lychee.debug === true) {
					console.log('sorbet.net.Remote: Connected to ' + this.host + ':' + this.port);
				}


				return true;

			}


			return false;

		},

		disconnect: function() {

			if (this.__isConnected === true) {

				if (lychee.debug === true) {
					console.log('sorbet.net.Remote: Disconnected from ' + this.host + ':' + this.port);
				}

				if (this.__socket !== null) {
					this.__socket.close();
				}


				return true;

			}


			return false;

		}

	};


	return Class;

});

