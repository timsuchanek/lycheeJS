
lychee.define('fertilizer.Main').requires([
	'lychee.Input',
	'lychee.data.JSON',
	'fertilizer.data.Filesystem',
//	'fertilizer.template.html-nwjs.Application',
//	'fertilizer.template.html-nwjs.Library',
	'fertilizer.template.html.Application',
	'fertilizer.template.html.Library',
	'fertilizer.template.nodejs.Application',
	'fertilizer.template.nodejs.Library'
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

		var that = this;


		this.bind('load', function() {

			var identifier = this.settings.identifier || null;
			var project    = this.settings.project    || null;
			var data       = this.settings.settings   || null;

			if (identifier !== null && project !== null && data !== null) {

				var platform = data.tags.platform[0] || null;
				var variant  = data.variant || null;
				var settings = _JSON.decode(_JSON.encode(lychee.extend({}, data, {
					debug:   false,
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


							that.trigger('init', [ project, identifier, platform, variant, environment ]);

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

		this.bind('init', function(project, identifier, platform, variant, environment) {

			if (typeof fertilizer.template[platform] === 'object') {

				var construct = fertilizer.template[platform][variant.charAt(0).toUpperCase() + variant.substr(1).toLowerCase()] || null;
				if (construct !== null) {

					var template = new construct(environment, new fertilizer.data.Filesystem('/projects/' + project + '/build/' + identifier));


					template.trigger('configure', [function(result) {

						if (result === true) {

							template.trigger('build', [function(result) {

								if (result === true) {

									if (lychee.debug === true) {
										console.log('\n\n');
										console.log('fertilizer: BUILD SUCCESS ("' + project + '/' + identifier + '")');
										console.log('\n\n');
									}

									this.destroy();

								} else {

									if (lychee.debug === true) {
										console.log('\n\n');
										console.log('fertilizer: BUILD FAILURE ("' + project + '/' + identifier + '")');
										console.log('\n\n');
									}

									this.destroy();

								}

							}.bind(that)]);

						} else {

							if (lychee.debug === true) {
								console.log('\n\n');
								console.error('fertilizer: CONFIGURATION FAILURE ("' + project + '/' + identifier + '")');
								console.log('\n\n');
							}

							this.destroy();

						}

					}.bind(that)]);


					return true;

				}

			}


			this.destroy();

			return false;

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

