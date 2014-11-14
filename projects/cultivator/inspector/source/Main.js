
lychee.define('inspector.Main').requires([
	'inspector.state.Overview',
	'inspector.state.Snapshot',
	'inspector.state.Timeline'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, inspector, global, attachments) {

	var Class = function(parameters) {


		this.environment = null;


		lychee.game.Main.call(this, {

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

		});


		this.bind('load', function() {
			this.settings.client     = null;
		}, this, true);

		this.bind('init', function() {

			this.setState('overview', new inspector.state.Overview(this));
			this.setState('snapshot', new inspector.state.Snapshot(this));
			this.setState('timeline', new inspector.state.Timeline(this));

		}, this, true);



		/*
		 * INITIALIZATION
		 */

		var url = parameters.url;
		if (typeof url === 'string') {


			var that        = this;
			var environment = new Config(url);

			environment.onload = function() {
				that.setEnvironment(this.buffer);
			};

			environment.load();

		}

	};


	Class.prototype = {

		setEnvironment: function(environment) {

console.log(environment);

		}

	};


	return Class;

});
