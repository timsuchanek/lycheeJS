
lychee.define('lychee.game.Entity').exports(function(lychee, global) {

	/*
	 * IMPLEMENTATION
	 */

	var _default_state  = 'default';
	var _default_states = { 'default': null };

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.width  = typeof settings.width  === 'number' ? settings.width  : 0;
		this.height = typeof settings.height === 'number' ? settings.height : 0;
		this.depth  = typeof settings.depth  === 'number' ? settings.depth  : 0;
		this.radius = typeof settings.radius === 'number' ? settings.radius : 0;

		this.alpha     = 1;
		this.collision = Class.COLLISION.none;
		this.effects   = [];
		this.shape     = Class.SHAPE.rectangle;
		this.state     = _default_state;
		this.position  = { x: 0, y: 0, z: 0 };
		this.velocity  = { x: 0, y: 0, z: 0 };

		this.__states  = _default_states;


		if (settings.states instanceof Object) {

			this.__states = { 'default': null };

			for (var id in settings.states) {

				if (settings.states.hasOwnProperty(id)) {
					this.__states[id] = settings.states[id];
				}

			}

		}


		this.setAlpha(settings.alpha);
		this.setCollision(settings.collision);
		this.setShape(settings.shape);
		this.setState(settings.state);
		this.setPosition(settings.position);
		this.setVelocity(settings.velocity);


		settings = null;

	};


	Class.COLLISION = {
		none: 0,
		A:    1,
		B:    2,
		C:    3,
		D:    4
	};


	// Same ENUM values as lychee.ui.Entity
	Class.SHAPE = {
		circle:    0,
		sphere:    1,
		rectangle: 2,
		cuboid:    3,
		polygon:   4
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.width  !== 0) settings.width  = this.width;
			if (this.height !== 0) settings.height = this.height;
			if (this.depth  !== 0) settings.depth  = this.depth;
			if (this.radius !== 0) settings.radius = this.radius;

			if (this.alpha !== 1)                         settings.alpha     = this.alpha;
			if (this.collision !== Class.COLLISION.none)  settings.collision = this.collision;
			if (this.shape     !== Class.SHAPE.rectangle) settings.shape     = this.shape;
			if (this.state     !== _default_state)        settings.state     = this.state;
			if (this.__states !== _default_states)        settings.states    = this.__states;


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
				'constructor': 'lychee.game.Entity',
				'arguments':   [ settings ]
			};

		},

		// HINT: Renderer skips if no render() method exists
		// render: function(renderer, offsetX, offsetY) {},

		update: function(clock, delta) {

			var velocity = this.velocity;

			if (velocity.x !== 0 || velocity.y !== 0 || velocity.z !== 0) {

				var x = this.position.x;
				var y = this.position.y;
				var z = this.position.z;


				var vt = delta / 1000;

				if (velocity.x !== 0) {
					x += velocity.x * vt;
				}

				if (velocity.y !== 0) {
					y += velocity.y * vt;
				}

				if (velocity.z !== 0) {
					z += velocity.z * vt;
				}


				this.position.x = x;
				this.position.y = y;
				this.position.z = z;

			}


			var effects = this.effects;
			for (var e = 0, el = this.effects.length; e < el; e++) {

				var effect = this.effects[e];
				if (effect.update(this, clock, delta) === false) {
					this.removeEffect(effect);
					el--;
					e--;
				}

			}

		},



		/*
		 * CUSTOM API
		 */

		isAtPosition: function(position) {

			if (position instanceof Object) {

				if (typeof position.x === 'number' && typeof position.y === 'number') {

					var ax = position.x;
					var ay = position.y;
					var bx = this.position.x;
					var by = this.position.y;


					var shape = this.shape;
					if (shape === Class.SHAPE.circle) {

						var dist = Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
						if (dist < this.radius) {
							return true;
						}

					} else if (shape === Class.SHAPE.rectangle) {

						var hwidth  = this.width  / 2;
						var hheight = this.height / 2;
						var colX    = (ax >= bx - hwidth)  && (ax <= bx + hwidth);
						var colY    = (ay >= by - hheight) && (ay <= by + hheight);


						return colX && colY;

					}

				}

			}


			return false;

		},

		collidesWith: function(entity) {

			var none = Class.COLLISION.none;
			if (this.collision !== entity.collision || this.collision === none || entity.collision === none) {
				return false;
			}


			var shapeA = this.shape;
			var shapeB = entity.shape;
			var posA   = this.position;
			var posB   = entity.position;
			var colX   = false;
			var colY   = false;


			var radius  = 0;
			var hwidth  = 0;
			var hheight = 0;

			if (shapeA === Class.SHAPE.circle && shapeB === Class.SHAPE.circle) {

				if (Math.sqrt(Math.pow(posB.x - posA.x, 2) + Math.pow(posB.y - posA.y, 2)) <= (this.radius + entity.radius)) {
					return true;
				}

			} else if (shapeA === Class.SHAPE.circle && shapeB === Class.SHAPE.rectangle) {

				radius  = this.radius;
				hwidth  = entity.width  / 2;
				hheight = entity.height / 2;
				colX    = (posA.x + radius > posB.x - hwidth)  && (posA.x - radius < posB.x + hwidth);
				colY    = (posA.y + radius > posB.y - hheight) && (posA.y - radius < posB.y + hheight);

				return colX && colY;

			} else if (shapeA === Class.SHAPE.rectangle && shapeB === Class.SHAPE.circle) {

				radius  = entity.radius;
				hwidth  = this.width  / 2;
				hheight = this.height / 2;
				colX    = (posB.x + radius > posA.x - hwidth)  && (posB.x - radius < posA.x + hwidth);
				colY    = (posB.y + radius > posA.y - hheight) && (posB.y - radius < posA.y + hheight);

				return colX && colY;

			} else if (shapeA === Class.SHAPE.rectangle && shapeB === Class.SHAPE.rectangle) {

				hwidth  = Math.abs(posA.x - posB.x);
				hheight = Math.abs(posA.y - posB.y);
				colX    = hwidth  * 2 < (this.width  + entity.width);
				colY    = hheight * 2 < (this.height + entity.height);

				return colX && colY;

			}


			return false;

		},

		setAlpha: function(alpha) {

			alpha = (typeof alpha === 'number' && alpha >= 0 && alpha <= 1) ? alpha : null;


			if (alpha !== null) {

				this.alpha = alpha;

				return true;

			}


			return false;

		},

		setCollision: function(collision) {

			if (lychee.enumof(Class.COLLISION, collision)) {

				this.collision = collision;

				return true;

			}


			return false;

		},

		addEffect: function(effect) {

			effect = effect instanceof Object && typeof effect.update === 'function' ? effect : null;


			if (effect !== null) {

				var index = this.effects.indexOf(effect);
				if (index === -1) {

					this.effects.push(effect);

					return true;

				}

			}


			return false;

		},

		removeEffect: function(effect) {

			effect = effect instanceof Object && typeof effect.update === 'function' ? effect : null;


			if (effect !== null) {

				var index = this.effects.indexOf(effect);
				if (index !== -1) {

					this.effects.splice(index, 1);

					return true;

				}

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

		setShape: function(shape) {

			if (lychee.enumof(Class.SHAPE, shape)) {

				this.shape = shape;

				return true;

			}


			return false;

		},

		getStateMap: function() {
			return this.__states[this.state];
		},

		setState: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.__states[id] !== undefined) {

				this.state = id;

				return true;

			}


			return false;

		},

		setVelocity: function(velocity) {

			velocity = velocity instanceof Object ? velocity : null;


			if (velocity !== null) {

				this.velocity.x = typeof velocity.x === 'number' ? velocity.x : this.velocity.x;
				this.velocity.y = typeof velocity.y === 'number' ? velocity.y : this.velocity.y;
				this.velocity.z = typeof velocity.z === 'number' ? velocity.z : this.velocity.z;

				return true;

			}


			return false;

		}

	};


	return Class;

});

