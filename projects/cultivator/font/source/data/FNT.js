
lychee.define('tool.data.FNT').requires([
	'lychee.data.JSON'
]).tags({
	platform: 'html'
}).exports(function(lychee, game, global, attachments) {

	var _JSON = lychee.data.JSON;



	/*
	 * HELPERS
	 */

	var _default_charset = [];

	(function(charset) {

		for (var c = 32; c < 127; c++) {
			charset.push(String.fromCharCode(c));
		}

	})(_default_charset);


	var _Buffer = function(data, mode) {

		data = typeof data === 'string'          ? _JSON.decode(data) : null;
		mode = lychee.enumof(_Buffer.MODE, mode) ? mode               : 0;


		var settings = lychee.extend({}, data);


		var texture = settings.texture;
		if (typeof texture === 'string') {
			settings.texture = new Texture(null);
			settings.texture.deserialize({ buffer: texture });
		}


		this.__data = {
			baseline:   0,
			charset:    _default_charset,
			kerning:    0,
			lineheight: 0,
			map:        [],
			spacing:    0,
			texture:    null
		};
		this.__mode = mode;


		this.setBaseline(settings.baseline);
		this.setCharset(settings.charset);
		this.setKerning(settings.kerning);
		this.setLineHeight(settings.lineheight);
		this.setMap(settings.map);
		this.setSpacing(settings.spacing);
		this.setTexture(settings.texture);


		settings = null;

	};


	_Buffer.MODE = {
		read:  0,
		write: 1
	};

	_Buffer.prototype = {

		toString: function() {

			var tmp = lychee.extend({}, this.__data);
			if (tmp.texture !== null) {
				tmp.texture = tmp.texture.serialize().blob.buffer || null;
			}


			return _JSON.encode(tmp);

		},

		setBaseline: function(baseline) {

			baseline = typeof baseline === 'number' ? (baseline | 0) : null;


			if (baseline !== null) {

				this.__data.baseline = baseline;

				return true;

			}


			return false;

		},

		setCharset: function(charset) {

			charset = typeof charset === 'string' ? charset : null;


			if (charset !== null) {

				this.__data.charset = charset;

				return true;

			}


			return false;

		},

		setKerning: function(kerning) {

			kerning = typeof kerning === 'number' ? (kerning | 0) : null;


			if (kerning !== null) {

				this.__data.kerning = kerning;

				return true;

			}


			return false;

		},

		setLineHeight: function(lineheight) {

			lineheight = typeof lineheight === 'number' ? (lineheight | 0) : null;


			if (lineheight !== null) {

				this.__data.lineheight = lineheight;

				return true;

			}


			return false;

		},

		setMap: function(map) {

			map = map instanceof Array ? map : null;


			if (map !== null) {

				var filtered = [];

				for (var m = 0, ml = map.length; m < ml; m++) {

					var value = map[m];
					if (typeof value === 'number') {
						filtered[m] = value;
					} else {
						filtered[m] = parseInt(value, 10) || 0;
					}

				}

				this.__data.map = filtered;


				return true;

			}


			return false;

		},

		setSpacing: function(spacing) {

			spacing = typeof spacing === 'number' ? (spacing | 0) : null;


			if (spacing !== null) {

				this.__data.spacing = spacing;

				return true;

			}


			return false;

		},

		setTexture: function(texture, settings) {

			texture = texture instanceof Texture ? texture : null;


			if (texture !== null) {

				this.__data.texture = texture;

				return true;

			}


			return false;

		}

	};



	/*
	 * ENCODER and DECODER
	 */

	var _encode_buffer = function(buffer, data) {

		// TODO: generate a texture, baseline, charset etc.
		// TODO: call buffer.setTexture(), setBaseline() etc.

	};

	var _encode = function(buffer, data) {

		if (data instanceof Object) {

			buffer.setBaseline(data.baseline);
			buffer.setCharset(data.charset);
			buffer.setKerning(data.kerning);
			buffer.setLineHeight(data.lineheight);
			buffer.setMap(data.map);
			buffer.setSpacing(data.spacing);
			buffer.setTexture(data.texture);


			if (buffer.texture === null) {
				_encode_buffer(buffer, data);
			}

		}

	};


	var _decode = function(buffer) {

		var value = {};


		value.baseline   = buffer.baseline;
		value.charset    = buffer.charset;
		value.kerning    = buffer.kerning;
		value.lineheight = buffer.lineheight;
		value.map        = buffer.map;
		value.spacing    = buffer.spacing;


		if (buffer.texture !== null) {
			value.texture = buffer.texture;
		} else {
			value = undefined;
		}


		return value;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {};


	Module.encode = function(data) {

		var buffer = new _Buffer('', _Buffer.MODE.write);

		_encode(buffer, data);

		return buffer.toString();

	};


	Module.decode = function(data) {

		var buffer = new _Buffer(data, _Buffer.MODE.read);

		var value = _decode(buffer);
		if (value === undefined) {
			return null;
		} else {
			return value;
		}

	};


	return Module;

});

