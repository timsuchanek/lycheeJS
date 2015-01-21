
lychee.define('lychee.net.client.KRPC').requires([
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

			if (type === 'error') {
				this.trigger('error', [ message.data ]);
			} else if (type !== null && message !== null) {
				this.trigger(type, [ message ]);
			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(id, client, data) {

		id = typeof id === 'string' ? id : 'krpc';


		var settings = lychee.extend({}, data);


		lychee.net.Service.call(this, id, client, lychee.net.Service.TYPE.client);



		/*
		 * INITIALIZATION
		 */

		this.bind('krpc', _on_krpc, this);


		if (lychee.debug === true) {

			this.bind('error', function(error) {
				console.error('lychee.net.client.KRPC: ' + error.message);
			}, this);

		}


		settings = null;

	};


	Class.prototype = {

		query: function(method, data) {

			method = typeof method === 'string' ? method : null;
			data   = data instanceof Object     ? data   : null;


			if (method !== null && data !== null) {

				var id      = typeof data.id === 'number' ? data.id    : null;
				var msgdata = data.data instanceof Object ? data.data  : null;


				if (msgdata !== null) {

					if (this.tunnel !== null) {

						var blob = _KRPC.encode({
							type:    'query',
							message: {
								id:     id,
								method: method,
								data:   msgdata
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

		}

	};


	return Class;

});

