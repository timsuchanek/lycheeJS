
lychee.define('lychee.physics.Particle').requires([
	'lychee.physics.Vector'
]).exports(function(lychee, global) {

	var _physics = lychee.physics;

	var Class = function(data) {

		var settings = lychee.extend({}, this.defaults, data);

		this.__invertedMass = null;


		this.setPosition(settings.position);
		this.setAcceleration(settings.acceleration);
		this.setVelocity(settings.velocity);
		this.setForce(settings.force);

		this.setDamping(settings.damping);
		this.setMass(settings.mass);

	};


	Class.prototype = {

		defaults: {
			damping: 0,

			position: {
				x: 0, y: 0, z: 0
			},
			acceleration: {
				x: 0, y: 0, z: 0
			},
			force: {
				x: 0, y: 0, z: 0
			},
			velocity: {
				x: 0, y: 0, z: 0
			}
		},

		update: function(clock, delta) {

			if (this.__inverseMass === null)  return;

			var dt = delta / 1000;
			if (dt > 0) {

				this.position.x += this.velocity.x * dt;
				this.position.y += this.velocity.y * dt;
				this.position.z += this.velocity.z * dt;


				this.velocity.x += (this.acceleration.x + this.force.x * this.__inverseMass) * dt;
				this.velocity.y += (this.acceleration.y + this.force.y * this.__inverseMass) * dt;
				this.velocity.z += (this.acceleration.z + this.force.z * this.__inverseMass) * dt;


				var damping = Math.pow(this.damping, dt);

				this.velocity.x *= damping;
				this.velocity.y *= damping;
				this.velocity.z *= damping;


				this.force.clear();

			}

		},

		getAcceleration: function() {
			return this.acceleration;
		},

		setAcceleration: function(acceleration) {
			return this.__setPropertyVector('acceleration', acceleration);
		},

		getDamping: function() {
			return this.damping;
		},

		setDamping: function(damping) {

			damping = typeof damping === 'number' ? damping : 1;

			this.damping = damping;

			return true;

		},

		getMass: function() {

			if (this.__invertedMass !== null) {
				return (1 / this.__invertedMass);
			}

			return Infinity;

		},

		setMass: function(mass) {

			if (mass !== 0) {
				this.__invertedMass = 1 / mass;
			}

		},

		getPosition: function() {
			return this.position;
		},

		setPosition: function(position) {
			return this.__setPropertyVector('position', position);
		},

		getVelocity: function() {
			return this.velocity;
		},

		setVelocity: function(velocity) {
			return this.__setPropertyVector('velocity', velocity);
		},

		__setPropertyVector(property, data) {

			if (Object.prototype.toString.call(data) === '[object Object]') {

				this[property] = new _Vector(
					typeof data.x === 'number' ? data.x : 0,
					typeof data.y === 'number' ? data.y : 0,
					typeof data.z === 'number' ? data.z : 0
				);

				return true;

			}

			return false;

		}

	};


	return Class;

});

