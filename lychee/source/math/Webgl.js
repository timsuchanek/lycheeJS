
lychee.define('lychee.math.Webgl').tags({
	platform: 'html-webgl'
}).exports(function(lychee, global, attachments) {

	var _default_shader_type = [
	  "VERTEX_SHADER",
	  "FRAGMENT_SHADER"
	];

	var _create_program = function(sources) {

		var shaders = sources.map(function(source, index) {
			return _load_shader.call(this, source, _default_shader_type[index % 2]);
		}, this);

		var program = this.gl.createProgram();

		shaders.forEach(function(shader) {
			this.gl.attachShader(program, shader);
		}, this);

		this.gl.linkProgram(program);

		var linked = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);

		if (!linked) {
			throw new Error("Program couldn't be linked");
		}

		return program;

	};


	var _create_attribute_setters = function(program) {
		var setters = {};

		var create_attribute_setter = function(index) {
			var that = this;
			return function (b) {

				that.gl.bindBuffer(that.gl.ARRAY_BUFFER, b);
				that.gl.enableVertexAttribArray(index);

				that.gl.vertexAttribPointer(index, 2, that.gl.FLOAT, false, 0, 0);
			}
		};


		var setters = {};

		var num_attribs = this.gl.getProgramParameter(program, this.gl.ACTIVE_ATTRIBUTES);



		for (var i = 0; i < num_attribs; i++) {
			var info = this.gl.getActiveAttrib(program, i);

			if (!info) {
				break;
			}

			var index = this.gl.getAttribLocation(program, info.name);

			setters[info.name] = create_attribute_setter.call(this, i);
		}

		return setters;
	}

	var _create_uniform_setters = function(program) {

		var textureUnit = 0;

		var create_uniform_setter = function(program, info) {

			var location = this.gl.getUniformLocation(program, info.name);
			var type = info.type;
			var that = this;

			var isArray = (info.size > 1 && info.name.substr(-3) === '[0]');

			if (type === that.gl.FLOAT && isArray) {
			  return function(v) {
			    that.gl.uniform1fv(location, v);
			  };
			}
			if (type === that.gl.FLOAT) {
			  return function(v) {
			    that.gl.uniform1f(location, v);
			  };
			}
			if (type === that.gl.FLOAT_VEC2) {
			  return function(v) {
			    that.gl.uniform2fv(location, v);
			  };
			}
			if (type === that.gl.FLOAT_VEC3) {
			  return function(v) {
			    that.gl.uniform3fv(location, v);
			  };
			}
			if (type === that.gl.FLOAT_VEC4) {
			  return function(v) {
			    that.gl.uniform4fv(location, v);
			  };
			}
			if (type === that.gl.INT && isArray) {
			  return function(v) {
			    that.gl.uniform1iv(location, v);
			  };
			}
			if (type === that.gl.INT) {
			  return function(v) {
			    that.gl.uniform1i(location, v);
			  };
			}
			if (type === that.gl.INT_VEC2) {
			  return function(v) {
			    that.gl.uniform2iv(location, v);
			  };
			}
			if (type === that.gl.INT_VEC3) {
			  return function(v) {
			    that.gl.uniform3iv(location, v);
			  };
			}
			if (type === that.gl.INT_VEC4) {
			  return function(v) {
			    that.gl.uniform4iv(location, v);
			  };
			}
			if (type === that.gl.BOOL) {
			  return function(v) {
			    that.gl.uniform1iv(location, v);
			  };
			}
			if (type === that.gl.BOOL_VEC2) {
			  return function(v) {
			  	debugger
			    that.gl.uniform2iv(location, v);
			  };
			}
			if (type === that.gl.BOOL_VEC3) {
			  return function(v) {
			    that.gl.uniform3iv(location, v);
			  };
			}
			if (type === that.gl.BOOL_VEC4) {
			  return function(v) {
			    that.gl.uniform4iv(location, v); }
			  ;
			}
			if (type === that.gl.FLOAT_MAT2) {
			  return function(v) {
			    that.gl.uniformMatrix2fv(location, false, v);
			  };
			}
			if (type === that.gl.FLOAT_MAT3) {
			  return function(v) {
			  	debugger
			    that.gl.uniformMatrix3fv(location, false, v);
			  };
			}
			if (type === that.gl.FLOAT_MAT4) {
			  return function(v) {
			    that.gl.uniformMatrix4fv(location, false, v);
			  };
			}
			if ((type === that.gl.SAMPLER_2D || type === that.gl.SAMPLER_CUBE) && isArray) {
			  var units = [];
			  for (var ii = 0; ii < info.size; ++ii) {
			    units.push(textureUnit++);
			  }
			  return function(bindPoint, units) {
			    return function(textures) {
			      that.gl.uniform1iv(location, units);
			      textures.forEach(function(texture, index) {
			        that.gl.activeTexture(that.gl.TEXTURE0 + units[index]);
			        that.gl.bindTexture(bindPoint, tetxure);
			      });
			    };
			  }(_getBindPointForSamplerType(that.gl, type), units);
			}
			if (type === that.gl.SAMPLER_2D || type === that.gl.SAMPLER_CUBE) {
			  return function(bindPoint, unit) {
			    return function(texture) {
			      that.gl.uniform1i(location, unit);
			      that.gl.activeTexture(that.gl.TEXTURE0 + unit);
			      that.gl.bindTexture(bindPoint, texture);
			    };
			  }(_getBindPointForSamplerType(that.gl, type), textureUnit++);
			}
			throw ("unknown type: 0x" + type.toString(16)); // we should never get here.
		}

		var setters = {};


		var num_uniforms = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);

		for (var i = 0; i < num_uniforms; i++) {

			var info = this.gl.getActiveUniform(program, i);

			if (!info) {
				break;
			}

			var name = info.name;

			if (name.substr(-3) === '[0]') {
				name = name.substr(0, name.length - 3);
			}

			var setter = create_uniform_setter.call(this, program, info);

			setters[name] = setter;

		}

		return setters;

	}

	var _create_webgl_buffer = function(vertices) {


		var buffer    = this.gl.createBuffer();
		var draw_type = this.gl.STATIC_DRAW;
		var type      = this.gl.ARRAY_BUFFER;

		this.gl.bindBuffer(type, buffer);
		this.gl.bufferData(type, vertices, draw_type);

		return buffer;

	};

	var _getBindPointForSamplerType = function(gl, type) {
	  if (type === gl.SAMPLER_2D)   return gl.TEXTURE_2D;        // eslint-disable-line
	  if (type === gl.SAMPLER_CUBE) return gl.TEXTURE_CUBE_MAP;  // eslint-disable-line
	};

	var _load_shader = function(source, type) {

		// debugger

		var shader = this.gl.createShader(this.gl[type]);

		this.gl.shaderSource(shader, source);

		this.gl.compileShader(shader);

		var compiled = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);

		if (!compiled) {
			throw new Error("Shader couldn't be compiled");
		}

		return shader;

	}

	var Class = function (gl) {
		this.gl = gl;
	};

	Class.prototype = {
		createPrimitiveBufferInfo: function(vertices) {

			return {
				buffers: {
					a_position: _create_webgl_buffer.call(this, vertices)
				},
				numElements: vertices.length / 2,
				vertices: vertices
			};

		},

		createTextureBufferInfo: function(vertices) {

			return {
				buffers: {
					a_position: _create_webgl_buffer.call(this, vertices)
				},
				numElements: vertices.length / 2,
				vertices: vertices
			};

		},



		createProgramInfo: function(shaders) {

			var program = _create_program.call(this, shaders);

			var uniformSetters = _create_uniform_setters.call(this, program);

			var attribSetters = _create_attribute_setters.call(this, program);


			return {
			  program: program,
			  uniformSetters: uniformSetters,
			  attribSetters: attribSetters,
			};

		},

		setBuffers: function(setters, buffers) {

			Object.keys(buffers).forEach(function(name) {

				var setter = setters[name];

				if (typeof setter === 'function') {
					setter(buffers[name]);
				}

			});

		},

		setUniforms: function(setters, uniforms) {

			Object.keys(uniforms).forEach(function(name) {

				var setter = setters[name];

				if (typeof setter === 'function') {
					setter(uniforms[name]);
				}

			});

		}
	};


	return Class;

});