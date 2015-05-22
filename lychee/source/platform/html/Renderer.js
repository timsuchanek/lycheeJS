
lychee.define('Renderer').tags({
	platform: 'html'
}).supports(function(lychee, global) {

	/*
	 * Hint for check against undefined:
	 *
	 * typeof CanvasRenderingContext2D is:
	 * > function in Chrome, Firefox, IE10
	 * > object in Safari, Safari Mobile
	 *
	 */


	if (typeof global.document !== 'undefined' && typeof global.document.createElement === 'function') {

		if (typeof global.CanvasRenderingContext2D !== 'undefined') {

			var canvas = global.document.createElement('canvas');
			if (typeof canvas.getContext === 'function') {
				return true;
			}

		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _color_cache = {};

	var _is_color = function(color) {

		if (typeof color === 'string') {

			if (color.match(/(#[AaBbCcDdEeFf0-9]{6})/)) {
				return true;
			}

		}


		return false;

	};



	/*
	 * STRUCTS
	 */

	var _buffer = function(width, height) {

		this.width  = typeof width === 'number'  ? width  : 1;
		this.height = typeof height === 'number' ? height : 1;

		this.__buffer = global.document.createElement('canvas');
		this.__ctx    = this.__buffer.getContext('2d');

		this.__buffer.width  = this.width;
		this.__buffer.height = this.height;

	};

	_buffer.prototype = {

		clear: function() {

			this.__ctx.clearRect(0, 0, this.width, this.height);

		},

		resize: function(width, height) {

			this.__buffer.width  = this.width;
			this.__buffer.height = this.height;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var _id = 0;


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.alpha      = 1.0;
		this.background = '#000000';
		this.id         = 'lychee-Renderer-' + _id++;
		this.width      = null;
		this.height     = null;
		this.offset     = { x: 0, y: 0 };

		this.__canvas           = global.document.createElement('canvas');
		this.__canvas.className = 'lychee-Renderer';
		this.__ctx              = this.__canvas.getContext('2d');
		global.document.body.appendChild(this.__canvas);


		this.setAlpha(settings.alpha);
		this.setBackground(settings.background);
		this.setId(settings.id);
		this.setWidth(settings.width);
		this.setHeight(settings.height);


		settings = null;

	};



	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.alpha !== 1.0)                           settings.alpha      = this.alpha;
			if (this.background !== '#000000')                settings.background = this.background;
			if (this.id.substr(0, 16) !== 'lychee-Renderer-') settings.id         = this.id;
			if (this.width !== null)                          settings.width      = this.width;
			if (this.height !== null)                         settings.height     = this.height;


			return {
				'constructor': 'lychee.Renderer',
				'arguments':   [ settings ],
				'blob':        null
			};

		},



		/*
		 * SETTERS AND GETTERS
		 */

		setAlpha: function(alpha) {

			alpha = typeof alpha === 'number' ? alpha : null;


			if (alpha !== null) {

				if (alpha >= 0 && alpha <= 1) {
					this.alpha = alpha;
				}

			}

		},

		setBackground: function(color) {

			color = _is_color(color) === true ? color : null;


			if (color !== null) {
				this.background = color;
				this.__canvas.style.backgroundColor = color;
			}

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {
				this.id = id;
				this.__canvas.id = id;
			}

		},

		setWidth: function(width) {

			width = typeof width === 'number' ? width : null;


			if (width !== null) {
				this.width = width;
			} else {
				this.width = global.innerWidth;
			}


			this.__canvas.width       = this.width;
			this.__canvas.style.width = this.width + 'px';
			this.offset.x             = this.__canvas.getBoundingClientRect().left;

		},

		setHeight: function(height) {

			height = typeof height === 'number' ? height : null;


			if (height !== null) {
				this.height = height;
			} else {
				this.height = global.innerHeight;
			}


			this.__canvas.height       = this.height;
			this.__canvas.style.height = this.height + 'px';
			this.offset.y              = this.__canvas.getBoundingClientRect().top;

		},



		/*
		 * BUFFER INTEGRATION
		 */

		clear: function(buffer) {

			buffer = buffer instanceof _buffer ? buffer : null;


			if (buffer !== null) {

				buffer.clear();

			} else {

				var ctx = this.__ctx;

				ctx.fillStyle = this.background;
				ctx.fillRect(0, 0, this.width, this.height);

			}

		},

		flush: function() {

		},

		createBuffer: function(width, height) {
			return new _buffer(width, height);
		},

		setBuffer: function(buffer) {

			buffer = buffer instanceof _buffer ? buffer : null;


			if (buffer !== null) {
				this.__ctx = buffer.__ctx;
			} else {
				this.__ctx = this.__canvas.getContext('2d');
			}

		},



		/*
		 * DRAWING API
		 */

		drawArc: function(x, y, start, end, radius, color, background, lineWidth) {

			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;
			var pi2 = Math.PI * 2;


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();

			ctx.arc(
				x,
				y,
				radius,
				start * pi2,
				end * pi2
			);

			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

			ctx.closePath();

		},

		drawBox: function(x1, y1, x2, y2, color, background, lineWidth) {

			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			ctx.globalAlpha = this.alpha;

			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
			} else {
				ctx.fillStyle   = color;
				ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
			}

		},

		drawBuffer: function(x1, y1, buffer) {

			buffer = buffer instanceof _buffer ? buffer : null;


			if (buffer !== null) {

				var ctx = this.__ctx;


				ctx.globalAlpha = this.alpha;
				ctx.drawImage(buffer.__buffer, x1, y1);


				// if (lychee.debug === true) {

				// 	this.drawBox(
				// 		x1,
				// 		y1,
				// 		x1 + buffer.width,
				// 		y1 + buffer.height,
				// 		'#00ff00',
				// 		false,
				// 		1
				// 	);

				// }

			}

		},

		drawCircle: function(x, y, radius, color, background, lineWidth) {

			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();

			ctx.arc(
				x,
				y,
				radius,
				0,
				Math.PI * 2
			);


			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

			ctx.closePath();

		},

		drawEllipse: function(x, y, w, h, color, background, lineWidth) {

			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();


			var kappa = 0.5522848,
			    ox = (w / 2) * kappa, // control point offset horizontal
			    oy = (h / 2) * kappa, // control point offset vertical
			    xe = x + w,           // x-end
			    ye = y + h,           // y-end
			    xm = x + w / 2,       // x-middle
			    ym = y + h / 2;       // y-middle

			ctx.moveTo(x, ym);
			ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
			ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
			ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

			ctx.closePath();

		},


		drawLight: function(x, y, radius, color, background, lineWidth) {

			color      = _is_color(color) ? _hex_to_rgba(color) : 'rgba(255,255,255,1.0)';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

			gradient.addColorStop(0, color);
			gradient.addColorStop(1, 'rgba(0,0,0,0)');


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();

			ctx.arc(
				x,
				y,
				radius,
				0,
				Math.PI * 2
			);


			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = gradient;
				ctx.stroke();
			} else {
				ctx.fillStyle   = gradient;
				ctx.fill();
			}

			ctx.closePath();

		},


		drawLine: function(x1, y1, x2, y2, color, lineWidth) {

			color     = _is_color(color) === true ? color : '#000000';
			lineWidth = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);

			ctx.lineWidth   = lineWidth;
			ctx.strokeStyle = color;
			ctx.stroke();

			ctx.closePath();

		},

		drawTriangle: function(x1, y1, x2, y2, x3, y3, color, background, lineWidth) {

			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x3, y3);
			ctx.lineTo(x1, y1);

			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

			ctx.closePath();

		},

		// points, x1, y1, [ ... x(a), y(a) ... ], [ color, background, lineWidth ]
		drawPolygon: function(points, x1, y1) {

			var l = arguments.length;

			if (points > 3) {

				var optargs = l - (points * 2) - 1;


				var color, background, lineWidth;

				if (optargs === 3) {

					color      = arguments[l - 3];
					background = arguments[l - 2];
					lineWidth  = arguments[l - 1];

				} else if (optargs === 2) {

					color      = arguments[l - 2];
					background = arguments[l - 1];

				} else if (optargs === 1) {

					color      = arguments[l - 1];

				}


				color      = _is_color(color) === true ? color : '#000000';
				background = background === true;
				lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


				var ctx = this.__ctx;


				ctx.globalAlpha = this.alpha;
				ctx.beginPath();
				ctx.moveTo(x1, y1);

				for (var p = 1; p < points; p++) {

					ctx.lineTo(
						arguments[1 + p * 2],
						arguments[1 + p * 2 + 1]
					);

				}

				ctx.lineTo(x1, y1);

				if (background === false) {
					ctx.lineWidth   = lineWidth;
					ctx.strokeStyle = color;
					ctx.stroke();
				} else {
					ctx.fillStyle   = color;
					ctx.fill();
				}

				ctx.closePath();

			}

		},

		drawRoundedRect: function(x, y, width, height, radius, color, background, lineWidth) {


			var maxRadius = Math.min(width, height) / 2 | 0;


			background = background === true;
			color      = _is_color(color) === true ? color : '#000000';
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;
			radius     = radius > maxRadius ? maxRadius : radius;

			var ctx = this.__ctx;

			ctx.beginPath();
			ctx.moveTo(x, y + radius);
			ctx.lineTo(x, y + height - radius);
			ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
			ctx.lineTo(x + width - radius, y + height);
			ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
			ctx.lineTo(x + width, y + radius);
			ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
			ctx.lineTo(x + radius, y);
			ctx.quadraticCurveTo(x, y, x, y + radius);
			ctx.closePath();



			ctx.globalAlpha = this.alpha;

			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

		},

		drawPoly: function(points, color background, closed, lineWidth) {

			var ctx = this.__ctx;


			points     = points.length > 0 ? points : [];
			color      = _is_color(color) ? color : '#ffffff';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 0;
			closed     = closed === true;


			ctx.beginPath();

			ctx.moveTo(points[0][0], points[0][1]);

			for (var i = 1; i < points.length; i++) {
				ctx.lineTo(points[i][0], points[i][1]);
			}

			if (closed) {
				ctx.lineTo(points[0][0], points[0][1]);
			}

			if (points[0][0] === points[points.length - 1][0] && points[0][1] === points[points.length - 1][1]) {
				ctx.closePath();
			}

			ctx.globalAlpha = this.alpha;

			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

		},

		drawSprite: function(x1, y1, texture, map) {

			texture = texture instanceof Texture ? texture : null;
			map     = map instanceof Object      ? map     : null;


			if (texture !== null) {

				var ctx = this.__ctx;


				ctx.globalAlpha = this.alpha;

				if (map === null) {

					ctx.drawImage(
						texture.buffer,
						x1,
						y1
					);

				} else {

					// if (lychee.debug === true) {

					// 	this.drawBox(
					// 		x1,
					// 		y1,
					// 		x1 + map.w,
					// 		y1 + map.h,
					// 		'#ff0000',
					// 		false,
					// 		1
					// 	);

					// }

					ctx.drawImage(
						texture.buffer,
						map.x,
						map.y,
						map.w,
						map.h,
						x1,
						y1,
						map.w,
						map.h
					);

				}

			}

		},

		drawText: function(x1, y1, text, font, center) {

			font   = font instanceof Font ? font : null;
			center = center === true;


			if (font !== null) {

				if (center === true) {

					var dim = font.measure(text);

					x1 -= dim.realwidth / 2;
					y1 -= (dim.realheight - font.baseline) / 2;

				}


				y1 -= font.baseline / 2;


				var margin  = 0;
				var texture = font.texture;
				if (texture !== null && texture.buffer !== null) {

					var ctx = this.__ctx;


					ctx.globalAlpha = this.alpha;

					for (t = 0, l = text.length; t < l; t++) {

						var chr = font.measure(text[t]);

						// if (lychee.debug === true) {

						// 	this.drawBox(
						// 		x1 + margin,
						// 		y1,
						// 		x1 + margin + chr.realwidth,
						// 		y1 + chr.height,
						// 		'#00ff00',
						// 		false,
						// 		1
						// 	);

						// }

						ctx.drawImage(
							texture.buffer,
							chr.x,
							chr.y,
							chr.width,
							chr.height,
							x1 + margin - font.spacing,
							y1,
							chr.width,
							chr.height
						);

						margin += chr.realwidth + font.kerning;

					}

				}

			}

		},



		/*
		 * RENDERING API
		 */

		renderEntity: function(entity, offsetX, offsetY) {

			if (typeof entity.render === 'function') {

				entity.render(
					this,
					offsetX || 0,
					offsetY || 0
				);

			}

		}

	};


	return Class;

});

