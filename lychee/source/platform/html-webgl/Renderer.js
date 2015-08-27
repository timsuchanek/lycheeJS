
lychee.define('Renderer').tags({
	platform: 'html-webgl'
})
.requires([
	'lychee.math.Webgl',
	'lychee.math.Primitive',
	'lychee.math.Matrix3'
])
.supports(function(lychee, global) {

	/*
	 * Hint for check against undefined
	 *
	 * typeof WebGLRenderingContext is:
	 * > function in Chrome, Firefox, IE11
	 * > object in Safari, Safari Mobile
	 *
	 */

	if (
		   typeof global.document !== 'undefined'
		&& typeof global.document.createElement === 'function'
		&& typeof global.WebGLRenderingContext !== 'undefined'
	) {

		var canvas = global.document.createElement('canvas');
		if (typeof canvas.getContext === 'function') {

			if (canvas.getContext('webgl') instanceof global.WebGLRenderingContext) {
				return true;
			}

		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	// var _programs = {};

	var _primitive_vs = [
	'attribute vec2 a_position;',

	'uniform mat3 u_matrix;',

	'void main() {',

	'  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);',

	// '  gl_Position = vec4(a_position, 0, 1);',

	'}'
	].join('\n');


	var _primitive_fs = [
	'precision mediump float;',

	'uniform vec4 u_color;',

	'void main() {',
	'  gl_FragColor = u_color;',
	'}'
	].join('\n');

	var _texture_vs = [

		'attribute vec2 a_position;',

		'uniform mat3 u_matrix;',

		'varying vec2 v_texCoord;',


		'void main() {',

		'  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);',

		'  v_texCoord = a_position;',

		'}'

	].join('\n');

	var _texture_fs = [
	'precision mediump float;',

	'uniform sampler2D u_image;',

	'varying vec2 v_texCoord;',

	'void main() {',
	'  gl_FragColor = texture2D(u_image, v_texCoord);',
	'}'
	].join('\n');



	/*
	 * HELPERS
	 */

	var _create_program_info = function(shaders) {

		var gl = this.__ctx;

		var program = gl.createProgram();
		shaders.forEach(function(shader) {
			gl.attachShader(program, shader);
		});

		gl.linkProgram(program);

		var linked = gl.getProgramParameter(program, gl.LINK_STATUS);

		if (!linked) {
			throw new Error("Couldn't link.");
			gl.deleteProgram(program);
		}

		return program;
	};

	var _is_color = function(color) {

		if (typeof color === 'string') {

			if (
				   color.match(/(#[AaBbCcDdEeFf0-9]{6})/)
				|| color.match(/(#[AaBbCcDdEeFf0-9]{8})/)
			) {

				return true;

			}

		}


		return false;
	};

	var _hex_to_rgba = function(hex) {

		if (_color_cache[hex] !== undefined) {
			return _color_cache[hex];
		}


		var rgba = [ 0, 0, 0, 1.0 ];

		if (typeof hex === 'string') {

			if (hex.length === 7) {

				rgba[0] = parseInt(hex[1] + hex[2], 16) / 256;
				rgba[1] = parseInt(hex[3] + hex[4], 16) / 256;
				rgba[2] = parseInt(hex[5] + hex[6], 16) / 256;
				rgba[3] = 1.0;

			} else if (hex.length === 9) {

 				rgba[0] = parseInt(hex[1] + hex[2], 16) / 256;
				rgba[1] = parseInt(hex[3] + hex[4], 16) / 256;
				rgba[2] = parseInt(hex[5] + hex[6], 16) / 256;
				rgba[3] = parseInt(hex[7] + hex[8], 16) / 256;

			}

		}


		_color_cache[hex] = rgba;


		return rgba;
	};


	/*
	 * STRUCTS
	 */

	var _color_cache = {};

	var _texture_cache = {};


	var _buffer = function(width, height) {

	};

	_buffer.prototype = {
	};


	var _buffer_info_cache = {
		rectangle: {
			stroke: null,
			background: null
		},
		circle: null,
		line: null,
		ellipse: null,
		texture: null
	};

	var _last_used_program_info = null;
	var _last_used_buffer_info  = null;
	var _bind_buffers           = false;

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
		this.__canvas.className = 'lychee-Renderer-canvas';
		this.__ctx              = this.__canvas.getContext('webgl');
		global.document.body.appendChild(this.__canvas);

		this.__programs = {};


		this.setAlpha(settings.alpha);
		this.setBackground(settings.background);
		this.setId(settings.id);
		this.setWidth(settings.width);
		this.setHeight(settings.height);


		settings = null;




		var gl = this.__ctx;

		this.util = new lychee.math.Webgl(gl);
		this.primitive = new lychee.math.Primitive(this.width, this.height);

		this.program_infos = {
			primitive: this.util.createProgramInfo([_primitive_vs, _primitive_fs]),
			texture: this.util.createProgramInfo([_texture_vs, _texture_fs])
		};


		// set primitive program uniforms

		this.matrix_location = {
			primitive: gl.getUniformLocation(this.program_infos.primitive.program, 'u_matrix'),
			texture: gl.getUniformLocation(this.program_infos.texture.program, 'u_matrix')
		};

		this.color_location = gl.getUniformLocation(this.program_infos.primitive.program, 'u_color');

		// set texture program uniform

		this.image_location = gl.getUniformLocation(this.program_infos.texture.program, 'u_image');


		/** Testing this shit */


		/** Compile Vertex Shader */

		// var vshader = gl.createShader(gl.VERTEX_SHADER);

		// gl.shaderSource(vshader, _vs);

		// gl.compileShader(vshader);

		// if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
		// 	throw new Error('Couldnt compile vertex shader');
		// }


		// /** Compile Fragment Shader */

		// var fshader = gl.createShader(gl.FRAGMENT_SHADER);

		// gl.shaderSource(fshader, _fs);

		// gl.compileShader(fshader);

		// if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
		// 	throw new Error('Couldnt compile Fragment Shader');
		// }


		// /** Create Program */

		// var program = gl.createProgram();

		// gl.attachShader(program, vshader);
		// gl.attachShader(program, fshader);

		// gl.linkProgram(program);

		// if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		// 	throw new Error('Oops.');
		// }

		// gl.useProgram(program);

		// var vertices = new Float32Array([
  //     -1.0, -1.0,
  //      1.0, -1.0,
  //     -1.0,  2.0,
  //     -1.0,  1.0,
  //      1.0, -1.0,
  //      1.0,  1.0]);


		// var positionLocation = gl.getAttribLocation(program, 'a_position');

		// var buffer = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		// gl.bufferData(gl.ARRAY_BUFFER,
		// 	new Float32Array([
		// 	      -1.0, -1.0,
		// 	       1.0, -1.0,
		// 	      -1.0,  1.0,
		// 	      -1.0,  1.0,
		// 	       1.0, -1.0,
		// 	       1.0,  1.0
		// 	 ]),
		// 	gl.STATIC_DRAW);
		// gl.enableVertexAttribArray(positionLocation);
		// gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

		// var matrixLocation = gl.getUniformLocation(program, 'u_matrix');

		// gl.uniformMatrix3fv(matrixLocation,
		// 	false,
		// 	[
		// 		1, 0, 0,
		// 		0, 1, 0,
		// 		0, 0, 1
		// 	]
		// );

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		// gl.drawArrays(gl.TRIANGLES, 0, 6);





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


			if (
				   alpha !== null
				&& alpha >= 0
				&& alpha <= 1
			) {
				this.alpha = alpha;
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
			this.__ctx._width         = this.width;
			this.offset.x             = this.__canvas.offsetLeft;
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
			this.__ctx._height         = this.height;
			this.offset.y              = this.__canvas.offsetTop;
		},



		/*
		 * BUFFER INTEGRATION
		 */

		clear: function(buffer) {

			// buffer = buffer instanceof _buffer ? buffer : null;


			// if (buffer !== null) {

			// 	// TODO: Use gl.clear(gl.COLOR_BUFFER_BIT) on buffer;
			// 	buffer.clear();

			// } else {

			// 	var gl    = this.__ctx;
			// 	var color = _hex_to_rgba(this.background);

			// 	gl.clearColor(color[0], color[1], color[2], color[3]);

			// }

		},

		flush: function() {

		},


		createBuffer: function(width, height) {
			//return new _buffer(width, height);
		},

		setBuffer: function(buffer) {

			// buffer = buffer instanceof _buffer ? buffer : null;


			// if (buffer !== null) {
			// 	// this.__ctx = buffer.__ctx;
			// } else {
			// 	// this.__ctx = this.__canvas.getContext('2d');
			// }

		},



		/*
		 * DRAWING API
		 */


		drawBox: function(x1, y1, x2, y2, scaleX, scaleY, rotation, color, background, lineWidth) {

			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var gl = this.__ctx;

			if (background) {
				if (!_buffer_info_cache.rectangle.background) {
					// if it's the first rectangle with background, we draw, create the buffer.
					var vertices = this.primitive.rectangle(0, 0, 1.0, 1.0);
					_buffer_info_cache.rectangle.background = this.util.createPrimitiveBufferInfo(vertices);
				}

				var object_to_draw = {
					programInfo: this.program_infos.primitive,
					bufferInfo: _buffer_info_cache.rectangle.background,
					uniforms: {
						u_color: _hex_to_rgba(color),
						u_matrix: this.primitive.matrixForRect(x1, y1, x2, y2, scaleX, scaleY, rotation)
					}
				};

				this.drawPrimitive.call(this, object_to_draw);
			} else {
				if (!_buffer_info_cache.rectangle.stroke) {
					// if it's the first rectangle WITHOUT background, we draw, create the buffer.
					var vertices = this.primitive.rectangle(0, 0, 1.0, 1.0, false, lineWidth);
					_buffer_info_cache.rectangle.stroke = this.util.createPrimitiveBufferInfo(vertices);
				}
			}

		},

		drawSprite: function(x1, y1, x2, y2, texture, scaleX, scaleY, rotation) {
			// texture = texture instanceof Texture ? texture : null;
			// map     = map instanceof Object      ? map     : null;



			if (!_buffer_info_cache.texture) {
				// if it's the first rectangle with background, we draw, create the buffer.
				var vertices = this.primitive.rectangle(0, 0, 1.0, 1.0);
				_buffer_info_cache.texture = this.util.createTextureBufferInfo(vertices);
			}

			if (texture !== null) {
				var object_to_draw = {
					programInfo: this.program_infos.texture,
					bufferInfo: _buffer_info_cache.texture,
					uniforms: {
						u_matrix: this.primitive.matrixForRect(x1, y1, x2, y2, scaleX, scaleY, rotation)
					},
					image: texture
				};

				this.drawTexture.call(this, object_to_draw);
			}
		},

		drawTexture: function(obj) {
			var programInfo = obj.programInfo;
			var bufferInfo = obj.bufferInfo;
			var uniforms = obj.uniforms;
			var image = obj.image;
			var gl = this.__ctx;


			_bind_buffers = false;

			if (programInfo !== _last_used_program_info) {
				_last_used_program_info = programInfo;
				gl.useProgram(programInfo.program);

				/**
				 * If the program changed, we have to rebind the buffers
				 */

				var positionLocation = gl.getAttribLocation(programInfo.program, 'a_position');

				var texture = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, texture);

				// Set the parameters so we can render any size image.
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

				// Upload the image into the texture.

				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);


				// Set the position buffer

				var positionBuffer = gl.createBuffer();

				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, bufferInfo.vertices, gl.STATIC_DRAW);
				gl.enableVertexAttribArray(positionLocation);

				gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)



			}

			gl.uniformMatrix3fv(this.matrix_location.texture, false, uniforms.u_matrix);

			gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);

		},

		drawCircle: function(x, y, radius, color, background, lineWidth) {

			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var gl = this.__ctx;

			if (background) {
				if (!_buffer_info_cache.circle.background) {
					// if it's the first circle with background, we draw, create the buffer.
					var vertices = this.primitive.circle(0, 0, 1.0);
					_buffer_info_cache.circle.background = this.util.createPrimitiveBufferInfo(vertices);
				}

				var object_to_draw = {
					programInfo: this.program_info,
					bufferInfo: _buffer_info_cache.circle.background,
					uniforms: {
						u_color: _hex_to_rgba(color),
						u_matrix: this.primitive.matrixForRect(x1, y1, x2, y2, scaleX, scaleY, rotation)
					}
				};

				this.drawPrimitive.call(this, object_to_draw);
			} else {
				if (!_buffer_info_cache.circle.stroke) {
					// if it's the first circle WITHOUT background, we draw, create the buffer.
					var vertices = this.primitive.circle(0, 0, 1.0, 1.0, false, lineWidth);
					_buffer_info_cache.circle.stroke = this.util.createPrimitiveBufferInfo(vertices);
				}
			}

		},

		drawPrimitive: function(obj) {
			var programInfo = obj.programInfo;
			var bufferInfo = obj.bufferInfo;
			var uniforms = obj.uniforms;
			var gl = this.__ctx;


			_bind_buffers = false;

			if (programInfo !== _last_used_program_info) {
				_last_used_program_info = programInfo;
				gl.useProgram(programInfo.program);

				/**
				 * If the program changed, we have to rebind the buffers
				 */

				var positionLocation = gl.getAttribLocation(programInfo.program, 'a_position');

				var buffer = gl.createBuffer();

				gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
				gl.bufferData(gl.ARRAY_BUFFER, bufferInfo.vertices, gl.STATIC_DRAW);
				gl.enableVertexAttribArray(positionLocation);

				gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

			}

			// if (_bind_buffers || bufferInfo !== _last_used_buffer_info) {
			// 	_last_used_buffer_info = bufferInfo;
				// this.util.setBuffers(programInfo.attribSetters, bufferInfo.buffers);
			// }

			// set the uniform
			// this.util.setUniforms(programInfo.uniformSetters, uniforms);
			// debugger
			// draw


			// debugger

			// var um = uniforms.u_matrix;
			// var vs = bufferInfo.vertices;


			// console.log(vs)
			// console.log(um);

			// var m = new lychee.math.Matrix3(um);


			// for (var i = 0; i < vs.length; i += 2) {

			// 	var v = [vs[i], vs[i + 1], 1];
			// 	console.log([vs[i], vs[i + 1]], m.multiplyVector(v));
			// }

			// console.log(obj.x1, obj.y1, obj.x2, obj.y2);

			// debugger

			gl.uniformMatrix3fv(this.matrix_location.primitive, false, uniforms.u_matrix);
			gl.uniform4fv(this.color_location, uniforms.u_color);

			gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);

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

