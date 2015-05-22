
lychee.define('lychee.ui.Slider').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global, attachments) {

	var _font = attachments["fnt"];



	/*
	 * HELPERS
	 */

	var _refresh = function() {

		var val  = this.value;
		var map  = this.__cursor.map;
		var type = this.type;


		if (val < this.min || val > this.max) {
			return;
		}


		if (type === Class.TYPE.horizontal) {

			var vx = (val - this.min) / (this.max - this.min);

			map.x = vx * (this.width - 44);
			map.y = 0;

		} else if (type === Class.TYPE.vertical) {

			var vy = (val - this.min) / (this.max - this.min);

			map.x = 0;
			map.y = vy * (this.height - 44);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.font  = _font;
		this.max   = 100;
		this.min   = 0;
		this.step  = 1;
		this.type  = Class.TYPE.horizontal;
		this.value = 0;

		this.__cursor = {
			active:   false,
			alpha:    0.0,
			duration: 600,
			start:    null,
			pingpong: false,
			map: {
				x: 0,
				y: 0
			}
		};
		this.__pulse  = {
			active:   false,
			duration: 300,
			start:    null,
			alpha:    0.0
		};


		this.setFont(settings.font);
		this.setMax(settings.max);
		this.setMin(settings.min);
		this.setStep(settings.step);
		this.setType(settings.type);

		delete settings.font;
		delete settings.max;
		delete settings.min;
		delete settings.step;
		delete settings.type;


		settings.shape = lychee.ui.Entity.SHAPE.rectangle;


		if (this.type === Class.TYPE.horizontal) {
			settings.width  = typeof settings.width === 'number'  ? settings.width  : 192;
			settings.height = typeof settings.height === 'number' ? settings.height :  32;
		} else if (this.type === Class.TYPE.vertical) {
			settings.width  = typeof settings.width === 'number'  ? settings.width  :  32;
			settings.height = typeof settings.height === 'number' ? settings.height : 192;
		}


		lychee.ui.Entity.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function(id, position, delta) {

			var val  = null;
			var type = this.type;

			if (type === Class.TYPE.horizontal) {

				var qx = Math.max(-0.5, Math.min(0.5, position.x / (this.width - 44))) + 0.5;
				var vx = (this.min + qx * (this.max - this.min)) | 0;

				val = ((vx / this.step) | 0) * this.step;

			} else if (type === Class.TYPE.vertical) {

				var qy = Math.max(-0.5, Math.min(0.5, position.y / (this.height - 44))) + 0.5;
				var vy = (this.min + qy * (this.max - this.min)) | 0;

				val = ((vy / this.step) | 0) * this.step;

			}


			var result = this.setValue(val);
			if (result === true) {
				this.trigger('change', [ val ]);
			}

		}, this);

		this.bind('swipe', function(id, state, position, delta, swipe) {

			var val  = null;
			var type = this.type;

			if (type === Class.TYPE.horizontal) {

				var qx = Math.max(-0.5, Math.min(0.5, position.x / (this.width - 44))) + 0.5;
				var vx = (this.min + qx * (this.max - this.min)) | 0;

				val = ((vx / this.step) | 0) * this.step;

			} else if (type === Class.TYPE.vertical) {

				var qy = Math.max(-0.5, Math.min(0.5, position.y / (this.height - 44))) + 0.5;
				var vy = (this.min + qy * (this.max - this.min)) | 0;

				val = ((vy / this.step) | 0) * this.step;

			}


			var result = this.setValue(val);
			if (result === true) {
				this.trigger('change', [ val ]);
			}

		}, this);

		this.bind('key', function(key, name, delta) {

			var val  = this.value;
			var type = this.type;

			if (type === Class.TYPE.horizontal) {

				if (key === 'arrow-left')  val -= this.step;
				if (key === 'arrow-right') val += this.step;

			} else if (type === Class.TYPE.vertical) {

				if (key === 'arrow-up')    val -= this.step;
				if (key === 'arrow-down')  val += this.step;

			}


			var result = this.setValue(val);
			if (result === true) {
				this.trigger('change', [ val ]);
			}

		}, this);

		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {
			this.setState('default');
		}, this);


		this.setValue(settings.value);


		settings = null;

	};


	Class.TYPE = {
		horizontal: 0,
		vertical:   1
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			var font = lychee.deserialize(blob.font);
			if (font !== null) {
				this.setFont(font);
			}

		},

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lyche.ui.Slider';

			var settings = data['arguments'][0];
			var blob     = (data['blob'] || {});


			if (this.max !== 100)                    settings.max   = this.max;
			if (this.min !== 0)                      settings.min   = this.min;
			if (this.step !== 1)                     settings.step  = this.step;
			if (this.type !== Class.TYPE.horizontal) settings.type  = this.type;
			if (this.value !== 0)                    settings.value = this.value;


			if (this.font !== null) blob.font = lychee.serialize(this.font);


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},

		update: function(clock, delta) {

			var pulse = this.__pulse;
			if (pulse.active === true) {

				if (pulse.start === null) {
					pulse.start = clock;
				}

				var t = (clock - pulse.start) / pulse.duration;
				if (t <= 1) {
					pulse.alpha = (1 - t);
				} else {
					pulse.alpha  = 0.0;
					pulse.active = false;
				}

			}


			var cursor = this.__cursor;
			if (cursor.active === true) {

				if (cursor.start === null) {
					cursor.start = clock;
				}


				var t = (clock - cursor.start) / cursor.duration;
				if (t <= 1) {
					cursor.alpha = cursor.pingpong === true ? (1 - t) : t;
				} else {
					cursor.start    = clock;
					cursor.pingpong = !cursor.pingpong;
				}

			}


			lychee.ui.Entity.prototype.update.call(this, clock, delta);

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var font     = this.font;
			var position = this.position;
			var type     = this.type;
			var x        = position.x + offsetX;
			var y        = position.y + offsetY;
			var hwidth   = (this.width  - 2) / 2;
			var hheight  = (this.height - 2) / 2;


			var cursor = this.__cursor;
			var map = cursor.map;
			var cx  = 0;
			var cy  = 0;


			if (type === Class.TYPE.horizontal) {

				cx  = x - hwidth  + map.x + 20;
				cy  = y - hheight + 15;


				renderer.drawLine(
					x - hwidth,
					y,
					cx - 12,
					y,
					this.state === 'active' ? '#32afe5' : '#545857',
					2
				);

				renderer.drawLine(
					cx + 12,
					y,
					x + hwidth,
					y,
					this.state === 'active' ? '#32afe5' : '#545857',
					2
				);

			} else if (type === Class.TYPE.vertical) {

				cx  = x - hwidth  + 15;
				cy  = y - hheight + map.y + 20;


				renderer.drawLine(
					x,
					y - hheight,
					x,
					cy - 12,
					this.state === 'active' ? '#32afe5' : '#545857',
					2
				);

				renderer.drawLine(
					x,
					cy + 12,
					x,
					y + hheight,
					this.state === 'active' ? '#32afe5' : '#545857',
					2
				);

			}


			if (cursor.active === true) {

				renderer.drawCircle(
					cx,
					cy,
					11,
					'#32afe5',
					false,
					2
				);

				renderer.setAlpha(cursor.alpha);

				renderer.drawCircle(
					cx,
					cy,
					12,
					'#32afe5',
					true
				);

				renderer.setAlpha(1.0);


				if (type === Class.TYPE.horizontal) {

					renderer.drawText(
						cx,
						cy - 6 - font.lineheight,
						'' + this.value,
						font,
						true
					);

				} else if (type === Class.TYPE.vertical) {

					renderer.drawText(
						cx + 6 + font.measure('' + this.value).realwidth,
						cy,
						'' + this.value,
						font,
						true
					);

				}

			} else {

				renderer.drawCircle(
					cx,
					cy,
					11,
					'#545857',
					false,
					2
				);

			}


			var pulse = this.__pulse;
			if (pulse.active === true) {

				renderer.setAlpha(pulse.alpha);

				renderer.drawCircle(
					cx,
					cy,
					12,
					'#32afe5',
					true
				);

				renderer.setAlpha(1.0);

			}

		},



		/*
		 * CUSTOM API
		 */

		setFont: function(font) {

			font = font instanceof Font ? font : null;


			if (font !== null) {

				this.font = font;


				var map = this.__cursor.map;

				map.w = font.measure('_').realwidth;
				map.h = font.measure('_').realheight;


				return true;

			}


			return false;

		},

		setMax: function(max) {

			max = typeof max === 'number' ? max : null;


			if (max !== null) {

				this.max = max;
				_refresh.call(this);

				return true;

			}


			return false;

		},

		setMin: function(min) {

			min = typeof min === 'number' ? min : null;


			if (min !== null) {

				this.min = min;
				_refresh.call(this);

				return true;

			}


			return false;

		},

		setStep: function(step) {

			step = typeof step === 'number' ? step : null;


			if (step !== null) {

				this.step = step;
				_refresh.call(this);

				return true;

			}


			return false;

		},

		setState: function(id) {

			var result = lychee.ui.Entity.prototype.setState.call(this, id);
			if (result === true) {

				var cursor = this.__cursor;
				var pulse  = this.__pulse;


				if (id === 'active') {

					cursor.start  = null;
					cursor.active = true;

					pulse.alpha   = 1.0;
					pulse.start   = null;
					pulse.active  = true;

				} else {

					cursor.active = false;

				}


				return true;

			}


			return false;

		},

		setType: function(type) {

			if (lychee.enumof(Class.TYPE, type)) {

				this.type = type;

				return true;

			}


			return false;

		},

		setValue: function(value) {

			value = typeof value === 'number' ? value : null;


			if (value !== null) {

				if (value >= this.min && value <= this.max) {

					this.value = value;
					_refresh.call(this);

					return true;

				}

			}


			return false;

		}

	};


	return Class;

});

