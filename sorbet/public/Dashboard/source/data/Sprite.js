
lychee.define('dashboard.data.Sprite').exports(function(lychee, dashboard, global, attachments) {

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



	var _get_frames = function(statemap, framesize, framealign, files) {

		var frames = [];
//		var size   = Math.round(files.length * framesize / 2);
		var size   = Math.round(Math.sqrt(files.length));
		if (size % 2 !== 0) {
			size++;
		}

		var f, fl, frame;
		var offsetx, offsety;


		if (statemap === 'image') {

			for (f = 0, fl = files.length; f < fl; f++) {

				name   = files[f].name.split('_')[0].toLowerCase();
				width  = files[f].texture.buffer.width;
				height = files[f].texture.buffer.height;

				offsetx = ( f % size)      * framesize;
				offsety = ((f / size) | 0) * framesize;

				frame = {
					texture: files[f].texture,
					map: {
						x: offsetx,
						y: offsety,
						w: framesize,
						h: framesize
					},
					render: {
						x: offsetx + (framesize / 2) - (width  / 2),
						y: offsety + (framesize / 2) - (height / 2),
						w: width,
						h: height
					}
				};

			}

		} else {
		}


		return frames;

	};

	var _get_states = function(statemap, stateani, files) {

		var states = {};

		var f, fl, name;

		if (statemap === 'image') {

			for (f = 0, fl = files.length; f < fl; f++) {

				name = files[f].name.split('_')[0].toLowerCase();

				if (states[name] === undefined) {

					states[name] = {
						animation: false
					};

				} else if (states[name].animation === false) {

					if (stateani === 'image') {

						states[name].animation = true;
						states[name].duration  = 1000;
						states[name].loop      = true;

					}

				}

			}

		} else if (statemap === 'none') {

			states['default'] = {
				animation: false
			};

			for (f = 0, fl = files.length; f < fl; f++) {

				if (f > 0 && states['default'].animation === false) {
					states['default'].animation = true;
					states['default'].duration  = 1000;
					states['default'].loop      = true;
				}

			}

		}


		return states;

	};


	var _parse = function(settings) {

		/*
		 * 1. Get Frames and States from files
		 */

		var width  = settings.framesize;
		var height = settings.framesize;
		var frames = _get_frames(settings.statemap, settings.framesize,      settings.framealign, settings.files);
		var states = _get_states(settings.statemap, settings.stateanimation, settings.files);

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({
			framesize:      64,
			framealign:     'center-center',
			boundingbox:    'image',
			statemap:       'image',
			stateanimation: 'image'
		}, data);


		this.width  = 0;
		this.height = 0;
		this.states = {};
		this.map    = {};


		_parse.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		toJSON: function() {

			return {
				width:  this.width,
				height: this.height,
				states: this.states,
				map:    this.map
			};

		}

	};


	return Class;

});

