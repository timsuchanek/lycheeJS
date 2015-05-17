
lychee.define('lychee.ui.Select').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global, attachments) {

	var _font = attachments["fnt"];


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.font    = _font;
		this.options = [];
		this.value   = '';

		this.__pulse = {
			active:   false,
			duration: 300,
			start:    null,
			alpha:    0.0,
			previous: null
		};


		this.setFont(settings.font);
		this.setOptions(settings.options);
		this.setValue(settings.value);

		delete settings.font;
		delete settings.options;
		delete settings.value;


		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;
		settings.width  = typeof settings.width === 'number'  ? settings.width  : 128;
		settings.height = typeof settings.height === 'number' ? settings.height :  32;


		lychee.ui.Entity.call(this, settings);


		if (this.options.length > 1) {
			this.height = this.options.length * settings.height;
		}

		if (this.value === '') {
			this.setValue(this.options[0] || null);
		}



		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function(id, position, delta) {

			if (this.options.length === 0) return;


			var index = -1;
			var lh    = this.height / this.options.length;
			var pos   = (position.y + this.height / 2);

			if (pos > 0) {
				index = (pos / lh) | 0;
			}


			if (index >= 0) {

				var value = this.options[index] || null;
				if (value !== null && value !== this.value) {

					var result = this.setValue(value);
					if (result === true) {
						this.trigger('change', [ this.value ]);
					}

				}

			}

		}, this);


		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {
			this.setState('default');
		}, this);


		settings = null;

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
			data['constructor'] = 'lyche.ui.Select';

			var settings = data['arguments'][0];
			var blob     = (data['blob'] || {});


			if (this.options.length !== 0) settings.options = [].slice.call(this.options, 0);
			if (this.value !== '')         settings.value   = this.value;


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
					pulse.alpha = (1 - t) * 1.0;
				} else {
					pulse.alpha    = 0.0;
					pulse.active   = false;
					pulse.previous = null;
				}

			}


			lychee.ui.Entity.prototype.update.call(this, clock, delta);

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var position = this.position;
			var pulse    = this.__pulse;
			var font     = this.font;
			var value    = this.value;
			var x        = position.x + offsetX;
			var y        = position.y + offsetY;
			var hwidth   = this.width  / 2;
			var hheight  = this.height / 2;



			var x1 = x - hwidth;
			var lh = this.height / this.options.length;

			for (var o = 0, ol = this.options.length; o < ol; o++) {

				var option = this.options[o];
				var y1     = y - hheight + o * lh;


				if (pulse.active === true) {

					if (option === value) {

						renderer.setAlpha(1.0 - pulse.alpha);

						renderer.drawCircle(
							x1 + 16,
							y1 + 16,
							12,
							'#32afe5',
							true
						);

						renderer.setAlpha(1.0);

					} else if (option === pulse.previous) {

						renderer.drawCircle(
							x1 + 16,
							y1 + 16,
							11,
							'#535857',
							false,
							2
						);

						renderer.setAlpha(pulse.alpha);

						renderer.drawCircle(
							x1 + 16,
							y1 + 16,
							12,
							'#32afe5',
							true
						);

						renderer.setAlpha(1.0);

					} else {

						renderer.drawCircle(
							x1 + 16,
							y1 + 16,
							11,
							'#535857',
							false,
							2
						);

					}

				} else {

					if (option === value) {

						renderer.drawCircle(
							x1 + 16,
							y1 + 16,
							12,
							'#32afe5',
							true
						);

					} else {

						renderer.drawCircle(
							x1 + 16,
							y1 + 16,
							11,
							'#535857',
							false,
							2
						);

					}

				}


				renderer.drawText(
					x1 + 36,
					y1 + (lh - font.lineheight) / 2,
					option,
					font,
					false
				);

			}

		},



		/*
		 * CUSTOM API
		 */

		setFont: function(font) {

			font = font instanceof Font ? font : null;


			if (font !== null) {

				this.font = font;

				return true;

			}


			return false;

		},

		setOptions: function(options) {

			options = options instanceof Array ? options : null;


			if (options !== null) {

				this.options = options.map(function(option) {
					return '' + option;
				});

				return true;

			}


			return false;

		},

		setValue: function(value) {

			value = typeof value === 'string' ? value : null;


			if (value !== null) {

				if (this.options.indexOf(value) !== -1) {

					var pulse = this.__pulse;

					pulse.alpha    = 1.0;
					pulse.start    = null;
					pulse.active   = true;
					pulse.previous = this.value;


					this.value = value;

					return true;

				}

			}


			return false;

		}

	};


	return Class;

});

