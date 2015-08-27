
lychee.define('lychee.math.Primitive')
.requires([
	'lychee.math.Matrix3'
])
.exports(function(lychee, global, attachments) {

	var _matrix_cache = {
		rectangle: {
			stroke: {},
			background: {}
		},
		circle: {},
		line: {},
		ellipse: {}
	};

	var _deg_to_rad = function(deg) {
		return deg * (Math.PI / 180);
	}

	var Class = function (width, height) {
		this.width = width;
		this.height = height;
	};

	Class.prototype = {
		rectangle: function(x1, y1, x2, y2) {
			return new Float32Array([
				x1, y1,
				x2, y1,
				x1, y2,
				x1, y2,
				x2, y1,
				x2, y2]);
		},

		circle: function(x, y, radius) {
			var num_segments = 40;

			
		},

		matrixForRect: function(x1, y1, x2, y2, scaleX, scaleY, rotation) {

			var matrix = new lychee.math.Matrix3();

			matrix.scale((x2 - x1), (y2 - y1));
			matrix.scale(scaleX, scaleY);
			matrix.rotate(_deg_to_rad(rotation));
			matrix.translate(x1, y1);
			matrix.project(this.width, this.height);

			return matrix.getData();

		}
	};


	return Class;

});