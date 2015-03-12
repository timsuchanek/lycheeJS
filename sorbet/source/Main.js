
lychee.define('sorbet.Main').requires([
	'lychee.Input',
	'sorbet.data.Host',
	'sorbet.net.Server',
//	'sorbet.mod.Fertilizer',
	'sorbet.mod.Package',
	'sorbet.mod.Server',
	'sorbet.serve.API',
	'sorbet.serve.File',
	'sorbet.serve.Redirect'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, sorbet, global, attachments) {

	/*
	 * HELPERS
	 */

	var _MOD   = [
//		sorbet.mod.Fertilizer,
		sorbet.mod.Package,
//		sorbet.mod.Server
	];

	var _SERVE = [
		sorbet.serve.API,
		sorbet.serve.File,
		sorbet.serve.Redirect
	];


	var _process_build = function(project) {

console.log('TODO: build chain for ' + project.identifier);

	};

	var _process_serve = function(data, ready) {

		var host = this.hosts[data.headers['Host'].split(':')[0]] || null;
		if (host !== null) {

			var parameters = {};

			var url = data.headers.url.split('?')[0];
			var tmp = data.headers.url.split('?')[1] || '';
			if (tmp.length > 0) {

				tmp.split('&').forEach(function(value) {

					var key = value.split('=')[0];
					var val = value.split('=')[1];


					if (!isNaN(parseInt(val, 10))) {
						parameters[key] = parseInt(val, 10);
					} else if (val === 'true') {
						parameters[key] = true;
					} else if (val === 'false') {
						parameters[key] = false;
					} else if (val === 'null') {
						parameters[key] = null;
					} else {
						parameters[key] = val;
					}

				});

			}


			if (Object.keys(parameters).length > 0) {
				data.headers.parameters = parameters;
			}


			for (var s = 0; s < _SERVE.length; s++) {

				if (_SERVE[s].can(host, url) === true) {
					_SERVE[s].process(host, url, data, ready);
					return true;
				}

			}

		}


		ready(null);

		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	var _defaults = {

		port:   null,
		hosts:  null,

		server: {
			host: null,
			port: 8080
		}

	};


	var _project_cache = {};

	(function(fs, projects) {

		projects['lychee'] = new sorbet.data.Project('lychee', fs.root + '/lychee');


		var identifiers = fs.dir('/projects');
		if (identifiers.length > 0) {

			identifiers.forEach(function(identifier) {

				var info1 = fs.info('/projects/' + identifier + '/index.html');
				var info2 = fs.info('/projects/' + identifier + '/lychee.pkg');
				if ((info1 !== null && info1.type === 'file') || (info2 !== null && info2.type === 'file')) {
					projects[identifier] = new sorbet.data.Project(identifier, fs.root + '/projects/' + identifier);
				}

			});

		}

	})(new sorbet.data.Filesystem(__dirname + '/../../'), _project_cache);


	var Class = function(settings) {

		this.settings = lychee.extendunlink({}, _defaults, settings);
		this.defaults = lychee.extendunlink({}, this.settings);

		this.hosts     = {};
		this.modules   = {};
		this.server    = null;


		if (settings.hosts instanceof Object) {

			for (var id in settings.hosts) {

				var project = settings.hosts[id];
				if (project === null) {

					this.setHost(id, null);

				} else {

					var cache = _project_cache[project] || null;
					if (cache !== null) {
						this.setHost(id, [ _project_cache['lychee'], cache ]);
					}

				}

			}

		}


		if (typeof settings.port === 'number') {
			this.settings.server.port = (settings.port | 0);
		}


		lychee.event.Emitter.call(this);


		/*
		 * INITIALIZATION
		 */

		this.bind('load', function() {

		}, this, true);

		this.bind('init', function() {

			// Activate debugging output
			lychee.debug = true;

			var settings = this.settings.server || null;
			if (settings !== null) {
				this.server = new sorbet.net.Server(settings, this);
				this.server.connect();
			}

		}, this, true);

		this.bind('build', _process_build, this);
		this.bind('serve', _process_serve, this);


// TODO: This is only the build chain

//		var _check_projects = function() {
//
//			for (var id in _project_cache) {
//
//				var project = _project_cache[id];
//				if (sorbet.mod.Package.can(project) === true) {
//					this.trigger('mod', [ project ]);
//				}
//
//			}
//
//		}.bind(this);
//
//		setTimeout(_check_projects, 5000);


		setTimeout(function() {

			for (var id in _project_cache) {

				var project = _project_cache[id];
				if (sorbet.mod.Server.can(project) === true) {
					sorbet.mod.Server.process(project);
				}

			}

		}.bind(this), 1000);

	};


	Class.VERSION = 'lycheeJS ' + lychee.VERSION + ' Sorbet (running on NodeJS ' + process.version + ')';


	Class.prototype = {

		/*
		 * MAIN API
		 */

		init: function() {

			this.trigger('load', []);
			this.trigger('init', []);

		},

		destroy: function() {

			for (var id in _project_cache) {

				var project = _project_cache[id];
				if (project.server !== null) {
					project.server.destroy();
				}

			}


			if (this.server !== null) {
				this.server.disconnect();
				this.server = null;
			}

		},



		/*
		 * CUSTOM API
		 */

		setHost: function(identifier, projects) {

			identifier = typeof identifier === 'string' ? identifier : null;
			projects   = projects instanceof Array      ? projects   : Object.values(_project_cache);


			if (identifier !== null) {

				this.hosts[identifier] = new sorbet.data.Host({
					projects: projects
				});

				return true;

			}


			return false;

		}

	};


	return Class;

});

