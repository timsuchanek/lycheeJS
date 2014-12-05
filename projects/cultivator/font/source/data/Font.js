
lychee.define('dashboard.data.Font').tags({
	platform: 'html'
}).exports(function(lychee, game, global, attachments) {

	/*
	 * FEATURE DETECTION
	 */

	var _ctx      = null;
	var _document = global.document;

	(function(canvas) {

		_ctx = canvas.getContext('2d');

	})(_document.createElement('canvas'));



	/*
	 * HELPERS
	 */

	var _buffer = function(width, height) {

		this.width  = typeof width === 'number'  ? width  : 1;
		this.height = typeof height === 'number' ? height : 1;

		this.__buffer = _document.createElement('canvas');
		this.ctx      = this.__buffer.getContext('2d');

		this.__buffer.width  = this.width;
		this.__buffer.height = this.height;

	};

	_buffer.prototype = {

		toString: function() {
			return this.__buffer.toDataURL('image/png');
		}

	};


	var _parse = function(settings) {

		/*
		 * 1. Measure approximate canvas dimensions
		 */

		var width        = measurements.width;
		var height       = measurements.height;
		var widthmap     = measurements.widthmap;


		/*
		 * 2. Render Font + Outline
		 */

		var texture = new _buffer(width, height);

		if (settings.outline > 0) {

			_render_outline.call(
				texture.ctx,
				settings,
				charset,
				widthmap,
				settings.size
			);

		}

		_render_font.call(
			texture.ctx,
			settings,
			charset,
			widthmap,
			settings.size,
			false
		);


// TODO: From here

		/*
		 * 3. Measure font dimensions
		 * 4. Render Font + Outline again
		 */

		var margin = _measure_margin.call(texture.ctx, 0, 0, width, height);
		if (margin.top > 0 || margin.bottom > 0) {

			var h   = height - margin.top - margin.bottom;
			height  = h;
			texture = new _buffer(width, height);


			if (settings.outline > 0) {

				_render_outline.call(
					texture.ctx,
					settings,
					charset,
					widthmap,
					settings.size - margin.top
				);

			}

			_render_font.call(
				texture.ctx,
				settings,
				charset,
				widthmap,
				settings.size - margin.top
			);

		}


		/*
		 * 5. Measure Baseline
		 */

		var baseline = _measure_baseline.call(
			texture.ctx,
			settings,
			charset,
			widthmap,
			0,
			0,
			width,
			height
		);



		/*
		 * Export Settings
		 */

		this.texture    = texture.toString();
		this.charset    = charset.join('');
		this.map        = widthmap;
		this.baseline   = baseline;
		this.lineheight = texture.height;
		this.kerning    = 0;
		this.spacing    = settings.spacing;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({
			family:       'Ubuntu Mono',
			style:        'normal',
			size:         32,
			spacing:      8,
			outline:      0,
			color:        '#ffffff',
			outlinecolor: '#000000',
			charset:      [ 32, 127 ]
		}, data);


		this.texture    = null;
		this.charset    = '';
		this.map        = [];
		this.baseline   = 0;
		this.lineheight = 0;
		this.kerning    = 0;
		this.spacing    = 0;


		_parse.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		toJSON: function() {

			return {
				texture:    this.texture,
				charset:    this.charset,
				map:        this.map,
				baseline:   this.baseline,
				lineheight: this.lineheight,
				kerning:    this.kerning,
				spacing:    this.spacing
			};

		}

	};


	return Class;

});

