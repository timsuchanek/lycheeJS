
lychee.define('lychee.net.remote.KRPC').requires([
	'lychee.data.KRPC'
]).includes([
	'lychee.net.Service'
]).exports(function(lychee, global, attachments) {

	var _KRPC = lychee.data.KRPC;



	/*
	 * HELPERS
	 */

	var _on_krpc = function(blob) {

		var data = _KRPC.decode(blob);
		if (data !== null) {

			var type    = data.type;
			var message = data.message;

			if (type !== null && message !== null) {

				var result = this.trigger(type, [ message ]);
				if (result === false) {
					this.report(Class.ERROR.unknown_method);
				}

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(id, remote, data) {

		id = typeof id === 'string' ? id : 'krpc';


		var settings = lychee.extend({}, data);


		lychee.net.Service.call(this, id, remote, lychee.net.Service.TYPE.remote);



		/*
		 * INITIALIZATION
		 */

		this.bind('krpc', _on_krpc, this);

	};


	Class.ERROR = {
		generic:        201,
		server:         202,
		protocol:       203,
		unknown_method: 204
	};

	Class.MESSAGE = {
		201: 'Generic Error',
		202: 'Server Error',
		203: 'Protocol Error',
		204: 'Unknown Method'
	};


	Class.prototype = {

		respond: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

				var id      = typeof data.id === 'number' ? data.id   : null;
				var msgdata = data.data instanceof Object ? data.data : null;


				if (msgdata !== null) {

					if (this.tunnel !== null) {

						var blob = _KRPC.encode({
							type:    'response',
							message: {
								id:   id,
								data: msgdata
							}
						});


						if (blob !== null) {

							this.tunnel.send(blob, {
								id:    this.id,
								event: 'krpc'
							});

						}

					}

				}

			}

		},

		report: function(error) {

			if (lychee.enumof(Class.ERROR, error) === true) {

				var code    = error;
				var message = Class.MESSAGE[code];


				var blob = _KRPC.encode({
					type: 'error',
					message: {
						code:    code,
						message: message
					}
				});


				if (blob !== null) {

					this.tunnel.send(blob, {
						id:    this.id,
						event: 'krpc'
					});

				}

			}

		}

	};


	return Class;


});

