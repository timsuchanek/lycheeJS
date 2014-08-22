
lychee.define('lychee.game.Emitter').requires([
	'lychee.game.Entity'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.delay      = 1000;
		this.duration   = 1000;
		this.entity     = null;
		this.lifetime   = 1000;
		this.position   = { x: 0, y: 0, z: 0 };
		this.type       = Class.TYPE.explosion;

		this.__create    = 0;
		this.__entities  = [];
		this.__lifetimes = [];
		this.__start     = null;


		this.setDuration(settings.duration);
		this.setEntity(settings.entity);
		this.setPosition(settings.position);
		this.setType(settings.type);


		lychee.event.Emitter.call(this);

		settings = null;

	};


	Class.TYPE = {
		explosion: 0,
		stream:    1
		// TODO: Evaluate if flame: 2 makes sense?
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


// TODO: This whole serialize() method

			if (this.amount !== 1)    settings.amount = this.amount;
			if (this.entity !== null) settings.entity = this.height;

			if (this.position.x !== 0 || this.position.y !== 0 || this.position.z !== 0) {

				settings.position = {};

				if (this.position.x !== 0) settings.position.x = this.position.x;
				if (this.position.y !== 0) settings.position.y = this.position.y;
				if (this.position.z !== 0) settings.position.z = this.position.z;

			}


			if (this.velocity.x !== 0 || this.velocity.y !== 0 || this.velocity.z !== 0) {

				settings.velocity = {};

				if (this.velocity.x !== 0) settings.velocity.x = this.velocity.x;
				if (this.velocity.y !== 0) settings.velocity.y = this.velocity.y;
				if (this.velocity.z !== 0) settings.velocity.z = this.velocity.z;

			}


			return {
				'constructor': 'lychee.game.Emitter',
				'arguments':   [ settings ]
			};

		},

		// HINT: Renderer skips if no render() method exists
		// render: function(renderer, offsetX, offsetY) {},

		update: function(clock, delta) {

			var create = this.__create;
			if (create > 0) {

				if (this.__start === null) {

					this.__start = clock + this.delay;

				}


				var t = (clock - this.__start) / this.duration;
				if (t <= 1) {

					var entity = lychee.deserialize(this.entity);
					if (entity !== null) {

						var velocity = entity.velocity || null;
						if (velocity !== null) {

							var type = this.type;
							if (type === Class.TYPE.explosion) {

								var vx = (Math.random() * 1000) | 0;
								var vy = (Math.random() * 1000) | 0;
								var vz = (Math.random() * 1000) | 0;

								var index = this.__entities.length;
								if (index % 4 === 0) {
									vx *= -1;
									vy *= -1;
								} else if (index % 4 === 1) {
									vy *= -1;
								} else if (index % 4 === 2) {
									// bottom right
								} else {
									vx *= -1;
								}

								entity.velocity.x = vx;
								entity.velocity.y = vy;
								entity.velocity.z = vz;

							}

						}


						this.trigger('create', [ entity ]);
						this.__lifetimes.push(clock + this.lifetime);
						this.__entities.push(entity);

					}


					this.__create = create - 1;
					this.__start  = null;

				}

			}


			var entities  = this.__entities;
			var lifetimes = this.__lifetimes;
			for (var l = 0, ll = lifetimes.length; l < ll; l++) {

				var lifetime = lifetimes[l];
				if (clock > lifetime) {

					this.trigger('destroy', [ entities[l] ]);
					lifetimes.splice(l, 1);
					entities.splice(l, 1);

					ll--;
					l--;

				}

			}

		},



		/*
		 * CUSTOM API
		 */

		create: function(amount) {

			amount = typeof amount === 'number' ? (amount | 0) : null;


			if (amount !== null) {

				this.__create += amount;

				return true;

			}


			return false;

		},

		setDuration: function(duration) {

			duration = typeof duration === 'number' ? (duration | 0) : null;


			if (duration !== null) {

				this.duration = duration;

				return true;

			}


			return false;

		},

		setEntity: function(entity) {

			entity = lychee.deserialize(entity) !== null ? entity : null;


			if (entity !== null) {

				this.entity = entity;

				return true;

			}


			return false;

		},

		setLifetime: function(lifetime) {

			lifetime = typeof lifetime === 'number' ? (lifetime | 0) : null;


			if (lifetime !== null) {

				this.lifetime = lifetime;

				return true;

			}


			return false;

		},

		setPosition: function(position) {

			position = position instanceof Object ? position : null;


			if (position !== null) {

				this.position.x = typeof position.x === 'number' ? position.x : this.position.x;
				this.position.y = typeof position.y === 'number' ? position.y : this.position.y;
				this.position.z = typeof position.z === 'number' ? position.z : this.position.z;

				return true;

			}


			return false;

		},

		setType: function(type) {

			type = lychee.enumof(Class.TYPE, type) ? type : null;


			if (type !== null) {

				this.type = type;

				return true;

			}


			return false;

		}

	};


	return Class;

});

