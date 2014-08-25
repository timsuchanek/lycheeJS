
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
		var size   = Math.round(Math.sqrt(files.length));
		if (size % 2 !== 0) {
			size++;
		}

		var alignx = framealign.split('-')[1] || 'center';
		var aligny = framealign.split('-')[0] || 'center';


		for (var f = 0, fl = files.length; f < fl; f++) {

			var state   = files[f].name.split('_')[0].toLowerCase();
			var width   = files[f].texture.buffer.width;
			var height  = files[f].texture.buffer.height;
			var offsetx = ( f % size)      * framesize;
			var offsety = ((f / size) | 0) * framesize;

			var dx = 0;
			var dy = 0;

			if (alignx === 'center') {
				dx = (framesize / 2) - (width / 2);
			} else if (alignx === 'right') {
				dx = (framesize - width);
			}

			if (aligny === 'center') {
				dy = (framesize / 2) - (height / 2);
			} else if (aligny === 'bottom') {
				dy = (framesize - height);
			}


			frames.push({
				state:   state,
				texture: files[f].texture || null,
				map: {
					x: offsetx,
					y: offsety,
					w: framesize,
					h: framesize
				},
				render: {
					x: offsetx + dx,
					y: offsety + dy,
					w: width,
					h: height
				}
			});

		}


		return frames;

	};

	var _get_map = function(statemap, states, frames) {

		var map = {};

		var f, fl;

		if (statemap === 'image') {

			for (f = 0, fl = frames.length; f < fl; f++) {

				var state = frames[f].state;

				if (map[state] === undefined) {
					map[state] = [];
					map[state].push(frames[f].map);
				} else {
					map[state].push(frames[f].map);
				}

			}

		} else if (statemap === 'none') {

			map['default'] = [];

			for (f = 0, fl = frames.length; f < fl; f++) {
				map['default'].push(frames[f].map);
			}

		}

		return map;

	};

	var _get_states = function(statemap, stateani, files) {

		var states = {};

		var f, fl;

		if (statemap === 'image') {

			for (f = 0, fl = files.length; f < fl; f++) {

				var state = files[f].name.split('_')[0].toLowerCase();

				if (states[state] === undefined) {

					states[state] = {
						animation: false
					};

				} else if (states[state].animation === false) {

					if (stateani === 'image') {

						states[state].animation = true;
						states[state].duration  = 1000;
						states[state].loop      = true;

					}

				}

			}

		} else if (statemap === 'none') {

			states['default'] = {
				animation: false
			};

			if (files.length > 0) {

				if (stateani === 'image') {

					states['default'].animation = true;
					states['default'].duration  = 1000;
					states['default'].loop      = true;

				}

			}

		}


		return states;

	};

	var _render_frames = function(frames) {

		for (var f = 0, fl = frames.length; f < fl; f++) {

			var frame   = frames[f];
			var texture = frame.texture;
			if (texture !== null) {

				var map = frame.render;

				this.drawImage(
					texture.buffer,
					0,
					0,
					map.w,
					map.h,
					map.x,
					map.y,
					map.w,
					map.h
				);

			}

		}

	};

	var _parse = function(settings) {

		/*
		 * 1. Get Frames and States from files
		 */

		var framesize = settings.framesize;
		var size      = Math.round(Math.sqrt(settings.files.length));
		if (size % 2 !== 0) {
			size++;
		}


		var width  = size * framesize;
		var height = size * framesize;
		var frames = _get_frames(settings.statemap, settings.framesize,      settings.framealign, settings.files);
		var states = _get_states(settings.statemap, settings.stateanimation, settings.files);
		var map    = _get_map(settings.statemap, states, frames);


		/*
		 * 2. Render Frames
		 */

		var buffer = new _buffer(width, height);

		if (frames.length > 0) {

			_render_frames.call(
				buffer.ctx,
				frames
			);

		}


		/*
		 * Export Settings
		 */

		this.texture = buffer.toString();
		this.width   = width;
		this.height  = height;
		this.map     = map;
		this.states  = states;

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
		this.map    = {};
		this.states = {};


		_parse.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		toJSON: function() {

			return {
				texture: this.texture,
				width:   this.width,
				height:  this.height,
				map:     this.map,
				states:  this.states
			};

		}

	};


	return Class;

});

