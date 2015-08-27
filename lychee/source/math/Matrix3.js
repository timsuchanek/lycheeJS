
lychee.define('lychee.math.Matrix3').exports(function(lychee, global) {

	var _type = typeof Float32Array !== 'undefined' ? Float32Array : Array;

	var _multiply = function(a, b) {
		var a00 = a[0*3+0];
		var a01 = a[0*3+1];
		var a02 = a[0*3+2];
		var a10 = a[1*3+0];
		var a11 = a[1*3+1];
		var a12 = a[1*3+2];
		var a20 = a[2*3+0];
		var a21 = a[2*3+1];
		var a22 = a[2*3+2];
		var b00 = b[0*3+0];
		var b01 = b[0*3+1];
		var b02 = b[0*3+2];
		var b10 = b[1*3+0];
		var b11 = b[1*3+1];
		var b12 = b[1*3+2];
		var b20 = b[2*3+0];
		var b21 = b[2*3+1];
		var b22 = b[2*3+2];

		return [
			a00 * b00 + a01 * b10 + a02 * b20,
			a00 * b01 + a01 * b11 + a02 * b21,
			a00 * b02 + a01 * b12 + a02 * b22,
			a10 * b00 + a11 * b10 + a12 * b20,
			a10 * b01 + a11 * b11 + a12 * b21,
			a10 * b02 + a11 * b12 + a12 * b22,
			a20 * b00 + a21 * b10 + a22 * b20,
			a20 * b01 + a21 * b11 + a22 * b21,
			a20 * b02 + a21 * b12 + a22 * b22
		];
	};


	var Class = function(data) {

		data = Array.isArray(data) && data.length === 9 ? data : null;

		if (data !== null) {
			this._data = new _type(data);
		} else {
			this._data = new _type([
				1, 0, 0,
				0, 1, 0,
				0, 0, 1
			]);
		}

	};

	Class.IDENTITY = new _type([
		1, 0, 0,
		0, 1, 0,
		0, 0, 1
	]);


	Class.PRECISION = 0.000001;


	Class.prototype = {

		getData: function() {
			return this._data;
		},

		set: function(data) {

			this._data = data;

		},

		toString: function() {

			var d = this._data;

			return [
				d[0] + ', ' + d[1] + ', ' + d[2],
				d[3] + ', ' + d[4] + ', ' + d[5],
				d[6] + ', ' + d[7] + ', ' + d[8],
			].join('\n');

		},

		project: function(width, height) {
			var projection = [
				2 / width, 0,           0,
				0,         -2 / height, 0,
				-1,        1,           1
			];

			this._data = _multiply(this._data, projection);
		},

		rotate: function(radian) {
			var c = Math.cos(radian);
			var s = Math.sin(radian);

			var rotation = [
				c, -s, 0,
				s, c,  0,
				0, 0,  1
			];

			this._data = _multiply(this._data, rotation);
		},

		scale: function(x, y) {
			var scale = [
				x, 0, 0,
				0, y, 0,
				0, 0, 1
			];

			this._data = _multiply(this._data, scale);
		},

		translate: function(x, y) {

			var translation = [
				1, 0, 0,
				0, 1, 0,
				x, y, 1
			];

			this._data = _multiply(this._data, translation);
		},

		multiplyVector: function(v) {
			var d = this._data;

			// product
			var p = [];

			// debugger

			p[0] = d[0] * v[0] + d[1] * v[1] + d[2] * v[2];
			p[1] = d[3] * v[0] + d[4] * v[1] + d[5] * v[2];
			p[2] = d[6] * v[0] + d[7] * v[1] + d[8] * v[2];


			return p;
		}

	};


	return Class;

});

