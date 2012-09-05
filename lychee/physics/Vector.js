
lychee.define('lychee.physics.Vector').exports(function(lychee, global) {

	var Class = function(x, y, z) {

		this.x = typeof x === 'number' ? x : 0;
		this.y = typeof y === 'number' ? y : 0;
		this.z = typeof z === 'number' ? z : 0;

	};


	Class.prototype = {

		clear: function() {
			this.x = 0;
			this.y = 0;
			this.z = 0;
		},

		invert: function() {
			this.x = -1 * this.x;
			this.y = -1 * this.y;
			this.z = -1 * this.z;
		},

		add: function(vector, copy) {

			copy = copy === true ? true : false;

			if (vector instanceof Class) {

				if (copy === true) {

					return new Class(
						this.x + vector.x,
						this.y + vector.y,
						this.z + vector.z
					);

				} else {

 					this.x += vector.x;
					this.y += vector.y;
					this.z += vector.z;

				}

			}

		},

		subtract: function(vector, copy) {

			copy = copy === true ? true : false;

			if (vector instanceof Class) {

				if (copy === true) {

					return new Class(
						this.x - vector.x,
						this.y - vector.y,
						this.z - vector.z
					);

				} else {

					this.x -= vector.x;
					this.y -= vector.y;
					this.z -= vector.z;

				}

			}

		},

		multiply: function(vector, copy) {

			copy = copy === true ? true : false;

			if (vector instanceof Class) {

				if (copy === true) {

					return new Class(
						this.x * vector.x,
						this.y * vector.y,
						this.z * vector.z
					);

				} else {

					this.x *= vector.x;
					this.y *= vector.y;
					this.z *= vector.z;

				}

			}

		},

		vectorProduct: function(vector, copy) {

			copy = copy === true ? true : false;

			if (vector instanceof Class) {

				if (copy === true) {

					return new Class(
						this.y * vector.z - z * vector.y,
						this.z * vector.x - x * vector.z,
						this.x * vector.y - y * vector.x
					);

				} else {

					this.x = this.y * vector.z - z * vector.y,
					this.y = this.z * vector.x - x * vector.z,
					this.z = this.x * vector.y - y * vector.x

				}

			}

		},

		scalarProduct: function(vector) {

			if (vector instanceof Class) {
				return this.x * vector.x + this.y * vector.y + this.z * vector.z;
			}

			return null;

		},

		magnitude: function(vector) {

			if (vector instanceof Class) {
				return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
			}

			return null;

		},

		normalize: function() {

			var length = this.magnitude();
			if (length > 0) {

				this.multiply(new Class(
					1 / length,
					1 / length,
					1 / length
				));

			}

		},

		unit: function() {

			var vector = new Class(this.x, this.y, this.z);

			vector.normalize();

			return vector;

		},

		equals: function(vector) {

			if (vector instanceof Class) {

				return (
					this.x === vector.x
					&& this.y === vector.y
					&& this.z === vector.z
				);

			}

			return false;

		}

	};


	return Class;

});

