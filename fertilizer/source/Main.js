
lychee.define('fertilizer.Main').requires([
	'lychee.Input',
	'lychee.data.JSON'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, sorbet, global, attachments) {

	var _lychee = lychee;
	var _path   = require('path');
	var _root   = _path.resolve(__dirname + '/../../');
	var _JSON   = lychee.data.JSON;



	/*
	 * HELPERS
	 */



	/*
	 * FEATURE DETECTION
	 */

	var _defaults = {

		project:    null,
		identifier: null,
		settings:   null

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(settings) {

		this.settings = lychee.extendunlink({}, _defaults, settings);
		this.defaults = lychee.extendunlink({}, this.settings);


		lychee.event.Emitter.call(this);


		/*
		 * INITIALIZATION
		 */

		this.bind('load', function() {

			var project = this.settings.project || null;
			var data    = this.settings.settings || null;

			if (project !== null && data !== null) {

				var platform = data.tags.platform[0] || null;
				var variant  = data.variant || null;
				var settings = _JSON.decode(_JSON.encode(lychee.extend({}, data, {
					debug:   true,
					sandbox: true,
					type:    'export'
				})));


				if (platform !== null && variant.match(/application|library/)) {

					settings.packages = settings.packages.map(function(pkg, index) {

						var id   = pkg[0];
						var path = _path.resolve('/projects/' + project, pkg[1]);

						return [ id, path ];

					});


					var that        = this;
					var environment = new lychee.Environment(settings);


					_lychee.setEnvironment(environment);

					_lychee.init(function(sandbox) {

						if (sandbox !== null) {

							environment.id      = project;
							environment.type    = 'build';
							environment.debug   = that.defaults.settings.debug;
							environment.sandbox = that.defaults.settings.sandbox;


							_lychee.setEnvironment(null);

							that.trigger('init', [ project, variant, environment ]);

						} else {

							that.destroy();

						}

					});


					return true;

				}

			}


			this.destroy();

			return false;

		}, this, true);

		this.bind('init', function(project, variant, environment) {

console.log(environment);

		}, this, true);

	};


	Class.VERSION = 'lycheeJS ' + lychee.VERSION + ' Fertilizer';


	Class.prototype = {

		/*
		 * MAIN API
		 */

		init: function() {

			this.trigger('load', []);

		},

		destroy: function() {

			this.trigger('destroy', []);

		}

	};


	return Class;

});

