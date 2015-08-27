
lychee.define('game.entity.Circle').requires([
	'lychee.effect.Color',
	'lychee.effect.Position',
	'lychee.effect.Height',
	'lychee.effect.Width'
]).includes([
	'lychee.ui.Entity'
]).exports(function(lychee, game, global, attachments) {

	var _sound = attachments["snd"];
	var _font = attachments["fnt"];
	var _texture = null;
	var img = new Image();
	img.src = "/projects/render-test/asset/entity/cat.png";
	img.onload = function() {
		_texture = img;
	};


	var _cat_map = attachments["json"].buffer.map.cat[0];


	/*
	 * HELPERS
	 */

	var _random_color = function() {

		var strr = (Math.random() * 255 | 0).toString(16);
		var strg = (Math.random() * 255 | 0).toString(16);
		var strb = (Math.random() * 255 | 0).toString(16);

		return '#' + strr + strg + strb;
	};

	var _random_pos = function() {
		return Math.random() * 5;
	}



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data, main) {

		var settings = lychee.extend({}, data);


		this.main = main || null;


		this.color = '#888888';
		this.font  = null;
		this.label = null;
		this.padding = 3;
		this.rows = 10;
		this.cols = 10;
		this.colors = [];
		this.coefficients = [];
		this.positions = [];
		this.speed = 0.3;
		settings.width  = 600;
		settings.height = 600;

		for (var i = 0; i < this.cols; i++) {
			for (var j = 0; j < this.rows; j++) {
				if (!this.colors[i]) this.colors[i] = [];
				if (!this.coefficients[i]) this.coefficients[i] = [];
				if (!this.positions[i]) this.positions[i] = [];

				this.positions[i][j] = {x: 0, y: 0};
				this.colors[i][j] = _random_color();
				this.coefficients[i][j] = {
					x: _random_pos(),
					y: _random_pos()
				};
			}
		}

		this.setColor(settings.color);
		this.setFont(settings.font || _font);
		this.setLabel(settings.label || "This is a circle");


		delete settings.color;


		if (typeof settings.radius !== 'number') {
			settings.radius = 48;
		}

		settings.shape = lychee.ui.Entity.SHAPE.rectangle;


		lychee.ui.Entity.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		var first_touch = false;

		this.bind('touch', function() {

			var effects = this.effects;
			if (effects.length === 0) {

				var x = this.position.x;
				var y = this.position.y;
				var z = this.position.z;
				var height = this.height;
				var width = this.width;

				if (first_touch) {
					y += 200;
					x += 300;
					height -= 80;
					width += 100;
				} else {
					y -= 200;
					x -= 300;
					height += 80;
					width -= 100;
				}

				this.addEffect(new lychee.effect.Position({
					type:     lychee.effect.Position.TYPE.bounceeaseout,
					duration: 500,
					position: {x: x, y: y, z: z}
				}));

				this.addEffect(new lychee.effect.Width({
					type:     lychee.effect.Width.TYPE.bounceeaseout,
					duration: 500,
					width: width
				}));

				this.addEffect(new lychee.effect.Height({
					type:     lychee.effect.Height.TYPE.bounceeaseout,
					duration: 500,
					height: height
				}));

				first_touch = !first_touch;

			}

		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor']  = 'game.entity.Circle';
			data['arguments'][1] = '#MAIN';


			return data;

		},

		render: function(renderer, offsetX, offsetY) {
			// debugger
			var alpha    = this.alpha;
			var color    = this.color;
			var position = this.position;
			var positions = this.positions;
			var font     = this.font;
			var label    = this.label;
			var radius   = this.radius;
			var colors   = this.colors;

			var width    = this.width;
			var height   = this.height;
			var padding  = this.padding;
			var rows     = this.rows;
			var cols     = this.cols;

			if (alpha !== 1) {
				renderer.setAlpha(alpha);
			}

			/**
			 * DANGER DANGER!!! cols & rows just = 1 for testing
			 */

			 // cols = rows = 1;

			var hwidth = width / (2 * cols);
			var hheight = height / (2 * rows);


			// renderer.drawBox(
			// 	position.x + offsetX - hwidth  ,
			// 	position.y + offsetY - hheight ,
			// 	position.x + offsetX + hwidth  ,
			// 	position.y + offsetY + hheight ,
			// 	1, // scaleX
			// 	1, // scaleY
			// 	0, // rotation
			// 	colors[0][0],
			// 	true,
			// 	2);

			if (_texture !== null) {
				renderer.drawSprite(position.x,
					position.y + 150,
					position.x + width,
					position.y + height + 150,
					_texture, 0.5, 0.5, 40);
			}



			// for (var i = 0; i < cols; i++) {
			// 	for (var j = 0; j < rows; j++) {
			// 		renderer.drawSprite(
			// 			position.x + 0 - hwidth  + (padding + hwidth)  * i + this.positions[i][j].x,
			// 			position.y + 0 - hheight + (padding + hheight) * j + this.positions[i][j].y,
			// 			position.x + 0 + hwidth  + (padding + hwidth)  * i + this.positions[i][j].x,
			// 			position.y + 0 + hheight + (padding + hheight) * j + this.positions[i][j].y,
			// 			_texture,
			// 			1,
			// 			this.positions[i][j].h * 1.2,
			// 			this.positions[i][j].x);
			// 	}
			// }





			// for (var i = 0; i < cols; i++) {
			// 	for (var j = 0; j < rows; j++) {
			// 		renderer.drawBox(
			// 			position.x + 0 - hwidth  + (padding + hwidth)  * i + this.positions[i][j].x,
			// 			position.y + 0 - hheight + (padding + hheight) * j + this.positions[i][j].y,
			// 			position.x + 0 + hwidth  + (padding + hwidth)  * i + this.positions[i][j].x,
			// 			position.y + 0 + hheight + (padding + hheight) * j + this.positions[i][j].y,
			// 			3,
			// 			this.positions[i][j].h * 1.2,
			// 			this.positions[i][j].x,
			// 			colors[i][j],
			// 			true,
			// 			2);
			// 	}
			// }




			// renderer.drawEllipse(
			// 	offsetX + position.x,
			// 	offsetY + position.y,
			// 	120,
			// 	80,
			// 	color,
			// 	true
			// );

			// renderer.drawRoundedRect(
			// 	offsetX + position.x + 100,
			// 	offsetY + position.y + 100,
			// 	100,
			// 	50,
			// 	10,
			// 	"#31c0ff",
			// 	false,
			// 	3
			// );


			// var points = [[0,0],[60,30],[120,0],[120,120],[60,150],[0,120]];

			// points = points.map(function(point) {
			// 	return [offsetX + position.x + point[0], offsetY + position.y + point[1] - 200];
			// });

			// renderer.drawPoly(
			// 	points,
			// 	"#d0494b",
			// 	"#ff0000",
			// 	true,
			// 	true
			// );

			// renderer.drawText(
			// 	position.x + offsetX,
			// 	y1,
			// 	label,
			// 	font,
			// 	true
			// );


			if (alpha !== 1) {
				renderer.setAlpha(1);
			}

		},

		update: function(clock, delta) {

			var sec  = (clock * this.speed) / 1000;
			var radius = 100;

			this.setPositions(sec, radius);

			lychee.ui.Entity.prototype.update.call(this, clock, delta);

		},

		setPositions: function(sec, radius) {
			for (var i = 0; i < this.cols; i++) {
				for (var j = 0; j < this.rows; j++) {
					var sin = Math.sin(sec * this.coefficients[i][j].x);
					var cos = Math.cos(sec * this.coefficients[i][j].y);
					this.positions[i][j] = {
						x: sin * radius,
						y: cos * radius,
						w: sin,
						h: cos
					};
				}
			}
		},

		setFont: function(font) {

			font = font instanceof Font ? font : null;


			if (font !== null) {

				this.font = font;

				return true;

			}


			return false;

		},

		setLabel: function(label) {

			label = typeof label === 'string' ? label : null;


			if (label !== null) {

				this.label = label;

				return true;

			}


			return false;

		},

		/*
		 * CUSTOM API
		 */

		setColor: function(color) {

			color = typeof color === 'string' ? color : null;


			if (color !== null) {

				this.color = color;

				return true;

			}


			return false;

		}

	};


	return Class;

});

