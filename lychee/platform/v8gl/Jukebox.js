
lychee.define('Jukebox').tags({
	platform: 'v8gl'
}).requires([
	'lychee.Track'
]).exports(function(lychee, global) {

	var Class = function(maxPoolSize) {

		this.__maxPoolSize = typeof maxPoolSize === 'number' ? maxPoolSize : 8;

		this.__tracks = {};
		this.__pool = {};
		this.__poolSize = 0;

	};


	Class.prototype = {

		add: function(track) {
		},

		play: function(id, loop) {
		},

		toggle: function(id, loop) {
	   	},

		stop: function(id) {
		},

		mute: function(id) {
		},

		unmute: function(id) {
		},

		isMuted: function(id) {
		},

		isPlaying: function(id) {
		},

		getVolume: function(id) {
		},

		setVolume: function(id, volume) {
		}

	};


	return Class;

});

