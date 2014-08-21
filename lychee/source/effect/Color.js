
lychee.define('lychee.effect.Color').exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _is_color = function(color) {

		if (typeof color === 'string') {

			if (color.match(/(#[AaBbCcDdEeFf0-9]{6})/) || color.match(/(#[AaBbCcDdEeFf0-9]{8})/)) {
				return true;
			}

		}


		return false;

	};

	var _rgba_to_color = function(r, g, b) {

		var strr = r > 15 ? (r).toString(16) : '0' + (r).toString(16);
		var strg = g > 15 ? (g).toString(16) : '0' + (g).toString(16);
		var strb = b > 15 ? (b).toString(16) : '0' + (b).toString(16);

		return '#' + strr + strg + strb;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(settings) {

		this.type     = Class.TYPE.easeout;
		this.start    = null;
		this.duration = 250;
		this.from     = null;
		this.to       = null;


		// No data validation garbage allowed for effects

		var type     = lychee.enumof(Class.TYPE, settings.type) ? settings.type           : null;
		var duration = typeof settings.duration === 'number'    ? (settings.duration | 0) : null;
		var color    = _is_color(settings.color)                ? settings.color          : null;

		if (type !== null) {
			this.type = type;
		}

		if (duration !== null) {
			this.duration = duration;
		}

		if (color !== null) {
			this.to = color;
		}

	};


	Class.TYPE = {
		linear:        0,
		easein:        1,
		easeout:       2,
		bounceeasein:  3,
		bounceeaseout: 4
	};


	Class.prototype = {

		render: function(renderer, offsetX, offsetY) {

		},

		update: function(entity, clock, delta) {

			if (this.start === null) {

				this.start = clock;
				this.from  = entity.color || '#000000';

			}


			var fromr = parseInt(this.from.substr(1, 2), 16) || 0;
			var fromg = parseInt(this.from.substr(3, 2), 16) || 0;
			var fromb = parseInt(this.from.substr(5, 2), 16) || 0;

			var tor   = parseInt(this.to.substr(1, 2), 16) || 0;
			var tog   = parseInt(this.to.substr(3, 2), 16) || 0;
			var tob   = parseInt(this.to.substr(5, 2), 16) || 0;

			var r     = 0;
			var g     = 0;
			var b     = 0;

			var t = (clock - this.start) / this.duration;
			if (t <= 1) {

				var f  = 0;
				var dr = tor - fromr;
				var dg = tog - fromg;
				var db = tob - fromb;


				var type = this.type;
				if (type === Class.TYPE.linear) {

					r = fromr + t * dr;
					g = fromg + t * dg;
					b = fromb + t * db;

				} else if (type === Class.TYPE.easein) {

					f = 1 * Math.pow(t, 3);

					r = fromr + f * dr;
					g = fromg + f * dg;
					b = fromb + f * db;

				} else if (type === Class.TYPE.easeout) {

					f = Math.pow(t - 1, 3) + 1;

					r = fromr + f * dr;
					g = fromg + f * dg;
					b = fromb + f * db;

				} else if (type === Class.TYPE.bounceeasein) {

					var k = 1 - t;

					if ((k /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(k, 2) );
					} else if (k < ( 2 / 2.75 )) {
						f = 7.5625 * ( k -= ( 1.5   / 2.75 )) * k + 0.75;
					} else if (k < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( k -= ( 2.25  / 2.75 )) * k + 0.9375;
					} else {
						f = 7.5625 * ( k -= ( 2.625 / 2.75 )) * k + 0.984375;
					}

					r = fromr + (1 - f) * dr;
					g = fromg + (1 - f) * dg;
					b = fromb + (1 - f) * db;

				} else if (type === Class.TYPE.bounceeaseout) {

					if ((t /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(t, 2) );
					} else if (t < ( 2 / 2.75 )) {
						f = 7.5625 * ( t -= ( 1.5   / 2.75 )) * t + 0.75;
					} else if (t < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( t -= ( 2.25  / 2.75 )) * t + 0.9375;
					} else {
						f = 7.5625 * ( t -= ( 2.625 / 2.75 )) * t + 0.984375;
					}

					r = fromr + f * dr;
					g = fromg + f * dg;
					b = fromb + f * db;

				}

				entity.color = _rgba_to_color(r, g, b);


				return true;

			} else {

				entity.color = _rgba_to_color(tor, tog, tob);


				return false;

			}

		}

	};


	return Class;

});

