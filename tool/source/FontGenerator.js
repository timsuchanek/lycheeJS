
lychee.define('tool.FontGenerator').tags({
	platform: 'html'
}).requires([
	'lychee.Font',
	'ui.Main'
]).includes([
	'lychee.Events'
]).exports(function(lychee, global) {

	var Class = function(canvas) {

		this.__canvas = canvas instanceof HTMLCanvasElement ? canvas : document.createElement('canvas');
		this.__ctx = this.__canvas.getContext('2d');

		lychee.Events.call(this, 'fonttool');

	};

	Class.SPRITEMAP = {
		none: 'none',
		x:    'x',
		xy:   'xy'
	};


	Class.prototype = {

		defaults: {
			font: 'Ubuntu',
			size: 32,
			color: '#933',
			style: 'normal',
			spacing: 1,
			outline: 1,
			outlineColor: '#000',
			firstChar: 32,
			lastChar: 127,
			spritemap: Class.SPRITEMAP.x
		},

		__updateFont: function() {

			this.__ctx.font = this.settings.style + ' ' + this.settings.size + 'px ' + '"' + this.settings.font + '"';
			this.__ctx.textBaseline = 'top';

		},

		__clear: function() {
			this.__ctx.clearRect(0, 0, this.__canvas.width, this.__canvas.height);
		},

		__render: function(charset, widthMap, offsetY) {

			offsetY = typeof offsetY === 'number' ? offsetY : 0;

			this.__ctx.fillStyle = this.settings.color;

			for (var c = 0, margin = this.settings.spacing; c < charset.length; c++) {
				this.__ctx.fillText(charset[c], margin, offsetY);
				margin += widthMap[c] + this.settings.spacing * 2;
			}

		},

		__renderOutline: function(charset, widthMap, offsetY) {

			offsetY = typeof offsetY === 'number' ? offsetY : 0;

			this.__ctx.fillStyle = this.settings.outlineColor;

			var outline = this.settings.outline;

			for (var c = 0, margin = this.settings.spacing; c < charset.length; c++) {

				for (var x = -1 * outline; x <= outline; x++) {
					for (var y = -1 * outline; y <= outline; y++) {
						this.__ctx.fillText(charset[c], margin + x, offsetY + y);
					}
				}

				margin += widthMap[c] + this.settings.spacing * 2;

			}

		},

		__getBaseline: function(charset, widthMap) {

			var width = this.__canvas.width,
				height = this.__canvas.height;

			var baselines = [],
				data = this.__ctx.getImageData(0, 0, width, height);


			for (var c = 0, margin = this.settings.spacing; c < charset.length; c++) {

				var baseline = height;

				for (var x = margin; x < margin + widthMap[c]; x++) {

					for (var y = 0; y < height / 2; y++) {

						if (
							data.data[y * width * 4 + x * 4 + 3]
							&& baseline > y
						) {
							baseline = y;
							break;
						}

					}

				}

				baselines.push(baseline);

				margin += widthMap[c] + this.settings.spacing * 2;

			}


			var rating = {};
			for (var b = 0; b < baselines.length; b++) {

				if (rating[baselines[b]] === undefined) {
					rating[baselines[b]] = 0;
				} else {
					rating[baselines[b]]++;
				}

			}


			var currentAmount = 0;
			var currentBaseline = 0;
			for (var r in rating) {

				var baseline = parseInt(r, 10);

				if (rating[r] > currentAmount) {
					currentAmount = rating[r];
					currentBaseline = baseline;
				} else if (rating[r] === currentAmount && baseline < currentBaseline) {
					currentBaseline = baseline;
				}

			}


			return currentBaseline;


			/*
			for (var c = 0; c < charset.length; c++) {
				console.log(charset[c], baselines[c]);
			}
			*/

		},

		__getMargin: function() {

			var width = this.__canvas.width,
				height = this.__canvas.height;


			var data = this.__ctx.getImageData(0, 0, width, height);

			var margin = {
				top: 0,
				bottom: 0
			};

			var x, y, found = false;
			for (y = 0; y < height; y++) {

				found = false;

				for (x = 0; x < width; x++) {
					if (data.data[y * width * 4 + x * 4 + 3]) {
						found = true;
						break;
					}
				}

				if (found === true) {
					margin.top = y;
					break;
				}

			}


			for (y = height - 1; y >= 0; y--) {

				found = false;

				for (x = 0; x < width; x++) {
					if (data.data[y * width * 4 + x * 4 + 3]) {
						found = true;
						break;
					}
				}

				if (found === true) {
					margin.bottom = y + 1;
					break;
				}

			}


			return margin;

		},

		export: function(settings) {

			this.settings = lychee.extend({}, this.defaults, settings);

			var charset = [];
			for (var c = this.settings.firstChar; c < this.settings.lastChar; c++) {
				charset.push(String.fromCharCode(c));
			}


			this.__updateFont();


			// 1. Measure the approximate the canvas dimensions
			var width = this.settings.spacing,
				widthMap = [];

			for (var i = 0; i < charset.length; i++) {

				var m = this.__ctx.measureText(charset[i]);
				var charWidth = Math.max(1, Math.ceil(m.width)) + this.settings.outline * 2;

				widthMap.push(charWidth);
				width += charWidth + this.settings.spacing * 2;

			}


			// 2. Render it the first time to find out character heights
			this.__canvas.width = width;
			this.__canvas.height = this.settings.size * 3;
			this.__updateFont();

			this.__clear();

			if (this.settings.outline > 0) {
				this.__renderOutline(charset, widthMap, this.settings.size);
			}

			this.__render(charset, widthMap, this.settings.size);


			// 3. Rerender everything if we know that the font size differed from the actual height
			var margin = this.__getMargin();
			if (margin.top > 0 || margin.bottom > 0) {

				var height = this.__canvas.height;
				this.__canvas.height = height - margin.top - (height - margin.bottom);
				this.__updateFont();

				this.__clear();

				if (this.settings.outline > 0) {
					this.__renderOutline(charset, widthMap, this.settings.size - margin.top);
				}

				this.__render(charset, widthMap, this.settings.size - margin.top);

			}


			// 4. Detect the Baseline
			var baseline = this.__getBaseline(charset, widthMap);


			// 5. Generate Image and Settings for Spriting
			var sprite = new Image();
			sprite.src = this.__canvas.toDataURL('image/png');


			var settings = {
				baseline: baseline,
				charset: charset.join(''),
				kerning: 0,
				spacing: this.settings.spacing
			};


			// 6. Sprite the Font now
			var that = this;
			sprite.onload = function() {
				that.__sprite(this, that.__canvas.width, that.__canvas.height, settings, widthMap);
			};

		},


		__sprite: function(sprite, width, height, settings, widthMap) {

			switch (this.settings.spritemap) {

				case Class.SPRITEMAP.none:

					var images = [];
					var outline = this.settings.outline;

					for (var w = 0, margin = this.settings.spacing, l = widthMap.length; w < l; w++) {

						var frameWidth = widthMap[w];

						this.__canvas.width = frameWidth + this.settings.spacing * 2;
						this.__canvas.height = height;

						this.__ctx.drawImage(
							sprite,
							margin - this.settings.spacing,
							0,
							frameWidth + this.settings.spacing * 2,
							height,
							0,
							0,
							frameWidth + this.settings.spacing * 2,
							height
						);


						var image = new Image();
						image.src = this.__canvas.toDataURL('image/png');

						images.push(image);

						margin += frameWidth + this.settings.spacing * 2;

					}


					this.trigger('ready', [{
						sprite: sprite,
						images: images,
						settings: JSON.stringify(settings)
					}]);

				break;


				case Class.SPRITEMAP.x:

					settings.map = widthMap;


					var offset = this.settings.spacing;
					for (var w = 0, l = widthMap.length; w < l; w++) {

						var frame = {
							width: widthMap[w],
							height: height,
							x: offset,
							y: 0
						};


						offset += frame.width + this.settings.spacing * 2;


						if (lychee.debug === true) {
							this.__ctx.lineWidth = 1;
							this.__ctx.strokeStyle = 'blue';
							this.__ctx.strokeRect(frame.x, frame.y, frame.width, frame.height);
						}

					}


					if (lychee.debug === true) {
						this.__createShadowCopy(this.__canvas);
					}


					this.trigger('ready', [{
						sprite: sprite,
						settings: JSON.stringify(settings)
					}]);

				break;

				case Class.SPRITEMAP.xy:

					// 1. Determination of best matching sprite width
					var spriteWidth = Math.round(Math.sqrt(width * height));
					var spriteHeight = height;


					// 2. Determination of sprite height && generation of spritemap
					var spriteMap = [];
					var srcOffsetX = this.settings.spacing;
					var offsetX = 0;
					var offsetY = 0;
					for (var w = 0, l = widthMap.length; w < l; w++) {

						var frame = {
							width: widthMap[w] + this.settings.spacing * 2,
							height: height,
							sx: srcOffsetX - this.settings.spacing,
							sy: 0,
							dx: offsetX,
							dy: offsetY
						};


						if (lychee.debug === true) {
							this.__ctx.lineWidth = 1;
							this.__ctx.strokeStyle = 'blue';
							this.__ctx.strokeRect(srcOffsetX, 0, widthMap[w], height);
							this.__ctx.strokeStyle = 'red';
							this.__ctx.strokeRect(frame.sx, frame.sy, frame.width, frame.height);
						}


						spriteMap.push(frame);


						offsetX += frame.width;
						srcOffsetX += frame.width;


						var nextFrameWidth = 0;
						if (widthMap[w + 1] !== undefined) {
							nextFrameWidth = widthMap[w + 1] + this.settings.spacing * 2;
						}


						if (offsetX + nextFrameWidth > spriteWidth) {
							offsetX = 0;
							offsetY += height;
							spriteHeight += height;
						}

					}


					if (lychee.debug === true) {
						this.__createShadowCopy(this.__canvas);
					}


					// 3. Re-draw the sprite image
					this.__canvas.width = spriteWidth;
					this.__canvas.height = spriteHeight;


					for (var s = 0, l = spriteMap.length; s < l; s++) {

						var frame = spriteMap[s];

						this.__ctx.drawImage(
							sprite,
							frame.sx,
							frame.sy,
							frame.width,
							frame.height,
							frame.dx,
							frame.dy,
							frame.width,
							frame.height
						);

					}


					// 4. Regenerate sprite image (data)
					sprite = new Image();
					sprite.src = this.__canvas.toDataURL('image/png');


					// 5. Regenerate sprite map
					widthMap = [];

					for (var s = 0, l = spriteMap.length; s < l; s++) {

						var frame = spriteMap[s];

						widthMap.push({
							width: frame.width - this.settings.spacing * 2,
							height: frame.height,
							x: frame.dx + this.settings.spacing,
							y: frame.dy
						});

					}


					if (lychee.debug === true) {

						var that = this;

						for (var w = 0, l = widthMap.length; w < l; w++) {

							var map = widthMap[w];

							this.__ctx.lineWidth = 1;
							this.__ctx.strokeStyle = 'blue';
							this.__ctx.strokeRect(map.x, map.y, map.width, map.height);
							this.__ctx.strokeStyle = 'red';
							this.__ctx.strokeRect(map.x - this.settings.spacing, map.y, map.width + this.settings.spacing * 2, map.height);

						}

					}

					if (lychee.debug === true) {
						this.__createShadowCopy(this.__canvas);
					}


					settings.map = widthMap;


					this.trigger('ready', [{
						sprite: sprite,
						settings: JSON.stringify(
							settings,
							null,
							'\t'
						)
					}]);

					break;


				default:

					this.trigger('error', [ 'Invalid Spritemap Settings' ]);

					break;

			}

		},

		__createShadowCopy: function(canvas) {

			var image = new Image();
			image.src = canvas.toDataURL('image/png');

			ui.Main.get('log').add(image);

		}

	};


	return Class;

});

