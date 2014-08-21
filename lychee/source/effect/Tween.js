
lychee.define('lychee.effect.Tween').exports(function(lychee, global, attachments) {

	var Class = function(settings) {

		this.type     = Class.TYPE.easeout;
		this.start    = null;
		this.duration = 250;
		this.from     = { x: null, y: null, z: null };
		this.to       = { x: null, y: null, z: null };


		// No data validation garbage allowed for effects

		var type     = lychee.enumof(Class.TYPE, settings.type) ? settings.type           : null;
		var duration = typeof settings.duration === 'number'    ? (settings.duration | 0) : null;
		var position = settings.position instanceof Object      ? settings.position       : null;

		if (type !== null) {
			this.type = type;
		}

		if (duration !== null) {
			this.duration = duration;
		}

		if (position !== null) {
			this.to.x = typeof position.x === 'number' ? (position.x | 0) : null;
			this.to.y = typeof position.y === 'number' ? (position.y | 0) : null;
			this.to.z = typeof position.z === 'number' ? (position.z | 0) : null;
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

		update: function(entity, clock, delta) {

			if (this.start === null) {

				this.start  = clock;
				this.from.x = entity.position.x;
				this.from.y = entity.position.y;
				this.from.z = entity.position.z;

			}


			var fromx = this.from.x;
			var fromy = this.from.y;
			var fromz = this.from.z;

			var tox   = this.to.x;
			var toy   = this.to.y;
			var toz   = this.to.z;

			var x     = 0;
			var y     = 0;
			var z     = 0;

			var t = (clock - this.start) / this.duration;
			if (t <= 1) {

				var f  = 0;
				var dx = tox - fromx;
				var dy = toy - fromy;
				var dz = toz - fromz;


				var type = this.type;
				if (type === Class.TYPE.linear) {

					x = fromx + t * dx;
					y = fromy + t * dy;
					z = fromz + t * dz;

				} else if (type === Class.TYPE.easein) {

					f = 1 * Math.pow(t, 3);

					x = fromx + f * dx;
					y = fromy + f * dy;
					z = fromz + f * dz;

				} else if (type === Class.TYPE.easeout) {

					f = Math.pow(t - 1, 3) + 1;

					x = fromx + f * dx;
					y = fromy + f * dy;
					z = fromz + f * dz;

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

					x = fromx + (1 - f) * dx;
					y = fromy + (1 - f) * dy;
					z = fromz + (1 - f) * dz;

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

					x = fromx + f * dx;
					y = fromy + f * dy;
					z = fromz + f * dz;

				}

				if (tox !== null) entity.position.x = x;
				if (toy !== null) entity.position.y = y;
				if (toz !== null) entity.position.z = z;


				return true;

			} else {

				if (tox !== null) entity.position.x = tox;
				if (toy !== null) entity.position.y = toy;
				if (toz !== null) entity.position.z = toz;


				return false;

			}

		}

	};


	return Class;

});

