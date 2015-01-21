
lychee.define('lychee.data.KRPC').exports(function(lychee, global) {

	/*
	 * ENCODER and DECODER
	 */

	var _id = (Math.random() * 0xffff) | 0;

	var _encode = function(type, message) {

		var blob = {};


		var id     = message.id || null;
		var method = typeof message.method === 'string' ? message.method : null;


		if (type === 'query') {

			if (method !== null) {

				blob.t = id || _id++;
				blob.y = 'q';
				blob.q = method;
				blob.a = message.data;

			}

		} else if (type === 'response') {

			blob.t = id || _id++;
			blob.y = 'r';
			blob.r = message.data;

		} else if (type === 'error') {

			blob.t = _id;
			blob.y = 'e';
			blob.e = [ message.data.code, message.data.message ];

		}


		return Object.keys(blob).length > 1 ? blob : undefined;

	};


	var _decode = function(blob) {

		var type    = null;
		var message = {};


		var t = typeof blob.t === 'number' ? blob.t : null;
		var y = typeof blob.y === 'string' ? blob.y : null;
		var q = typeof blob.q === 'string' ? blob.q : null;

		if (y === 'q') {

			if (t !== null && q !== null) {

				type           = 'query';
				message.id     = t;
				message.method = q;
				message.data   = blob.a || null;

			}

		} else if (y === 'r') {

			if (t !== null) {

				type         = 'response';
				message.id   = t;
				message.data = blob.r || null;

			}

		} else if (y === 'e') {

			if (t !== null) {

				type         = 'error';
				message.id   = t;
				message.data = {
					code:    blob.e[0] || null,
					message: blob.e[1] || null
				};

			}

		}


		return Object.keys(message).length > 1 ? { type: type, message: message } : undefined;

	};



	/*
	 * IMPLEMENTATION
	 */


	var Module = {

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'lychee.data.KRPC',
				'blob':      null
			};

		},

		encode: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

				var blob = _encode(data.type, data.message);
				if (blob !== undefined) {
					return blob;
				}

			}


			return null;

		},

		decode: function(data) {

			data = typeof data === 'string' ? data : null;


			if (data !== null) {

				var object = _decode(data);
				if (object !== undefined) {
					return object;
				}

			}


			return null;

		}

	};


	return Module;

});

