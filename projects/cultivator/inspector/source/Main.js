
lychee.define('inspector.Main').requires([
	'inspector.state.Overview',
	'inspector.state.Snapshot',
	'inspector.state.Timeline'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, inspector, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({

			client:   null,
			server:   null,
			renderer: null,

			input: {
				delay:       0,
				key:         false,
				keymodifier: false,
				touch:       true,
				swipe:       true
			},

			jukebox: {
				music: true,
				sound: true
			},

			viewport: {
				fullscreen: false
			}

		}, data);


		lychee.game.Main.call(this, settings);


		this.bind('load', function() {
			this.settings.client     = null;
		}, this, true);

		this.bind('init', function() {

			this.setState('overview', new inspector.state.Overview(this));
			this.setState('snapshot', new inspector.state.Snapshot(this));
			this.setState('timeline', new inspector.state.Timeline(this));
			this.changeState('overview');

		}, this, true);

	};


	Class.prototype = {
	};


	return Class;

});
