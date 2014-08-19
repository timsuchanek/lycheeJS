#!/usr/bin/env nodejs

var _shell = require(__dirname + '/shell.js');



/*
 * USAGE
 */

var _print_help = function() {

	console.log('                                                                                            ');
	console.log('============================================================================================');
	console.log('               ,   _                                                                        ');
	console.log('              { \\/`o;====-  ,_(\'--,                 lycheeJS v0.8 Fertilizer              ');
	console.log('         .----\'-/`-/          (.--; ,--\')_,                                               ');
	console.log('          `\'-..-| /               | ;--.)     @   (Cross-Compiler and CI-Builder)          ');
	console.log('               /\\/\\           .-. |.| .-.    <|>                                *O*       ');
	console.log('               `--`               \|\|/         |                                 \\|/      ');
	console.log('    ^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^     ');
	console.log('                                                                                            ');
	console.log('                                                                                            ');
	console.log('Usage: fertilizer [Mode] [Parameter, ...]                                                   ');
	console.log('                                                                                            ');
	console.log('                                                                                            ');
	console.log('Modes:                                                                                      ');
	console.log('                                                                                            ');
	console.log('   file                                       Builds the lychee.env to a single file        ');
	console.log('   folder                                     Builds the lychee.env to a folder             ');
	console.log('   library                                    Builds the lychee.env to a single library file');
	console.log('                                                                                            ');
	console.log('Parameters:                                                                                 ');
	console.log('                                                                                            ');
	console.log('   --environment="./path/to/lychee.env"       The lychee.Environment\'s serialize() output. ');
	console.log('   --fertilizer="./fertilizers/nodejs"        The platform-specific Fertilizer.             ');
	console.log('   --sandbox="./myproject/sandbox"            The isolated sandbox folder.                  ');
	console.log('                                                                                            ');
	console.log('Important:                                                                                  ');
	console.log('                                                                                            ');
	console.log('- File and Folder Mode produce static code that includes bootstrap.js and lychee.init().    ');
	console.log('- Library Mode produces dynamic code that is ready for inclusion or injection.              ');
	console.log('- If Environment has not the same platform-specific tags as the Fertilizer, it will fail.   ');
	console.log('                                                                                            ');
	console.log('Examples:                                                                                   ');
	console.log('                                                                                            ');
	console.log('fertilizer file --environment="./lychee/build/nodejs/main.lychee.env" --fertilizer="./fertilizers/nodejs" --sandbox="./example"');
	console.log('                                                                                            ');

};



var _mode        = null;
var _environment = null;
var _fertilizer  = null;
var _sandbox     = null;

(function() {

	var settings = {
		mode:        null,
		environment: null,
		fertilizer:  null,
		sandbox:     null
	};


	for (var a = 0, al = process.argv.length; a < al; a++) {

		var arg = process.argv[a];
		if (arg.substr(0, 2) === '--' && arg.indexOf('=') !== -1) {

			var key = arg.substr(2).split('=')[0];
			var val = arg.substr(2).split('=')[1];

			if (!isNaN(parseInt(val, 10))) {
				val = parseInt(val, 10);
			}


			if (typeof settings[key] !== undefined) {
				settings[key] = val;
			}

		} else if (arg.match(/file|folder|library/)) {

			settings['mode'] = arg;

		}

	}



	if (settings.environment !== null) {

		if (_shell.isFile(settings.environment)) {
			settings.environment = _shell.read(settings.environment);
		} else {
			settings.environment = null;
		}

		_environment = settings.environment;

	}


	if (settings.fertilizer !== null) {

		if (_shell.isDirectory(settings.fertilizer) === false) {
			settings.fertilizer = null;
		}

		_fertilizer = settings.fertilizer;

	}


	if (settings.sandbox !== null) {

		if (_shell.isDirectory(settings.sandbox) === false) {
			settings.sandbox = null;
		}

		_sandbox = settings.sandbox;

	}


	if (settings.mode !== null) {
		_mode = settings.mode;
	}


	settings = null;

})();



/*
 * IMPLEMENTATION
 */

(function(shell, mode, environment, fertilizer, sandbox) {

	var lychee = shell.lychee;
	var global = shell.global;

	lychee.event         = lychee.event || {};
	lychee.event.Emitter = shell.include('lychee/source/event/Emitter.js', 'lychee.event.Emitter');



	/*
	 * HELPERS
	 */



	/*
	 * INITIALIZATION
	 */

	if (
		   mode !== null
		&& environment !== null
		&& fertilizer !== null
		&& sandbox !== null
	) {

		console.log('DOING STUFF', mode);
		console.log(mode, environment, fertilizer, sandbox);

	} else {

		if (mode === null) {
			console.error('fertilizer: Invalid Mode');
		}

		if (environment === null) {
			console.error('fertilizer: Invalid Environment');
		}

		if (fertilizer === null) {
			console.error('fertilizer: Invalid Fertilizer');
		}

		if (sandbox === null) {
			console.error('fertilizer: Invalid Sandbox');
		}


		_print_help();
		process.exit(1);

	}

})(_shell, _mode, _environment, _fertilizer, _sandbox);




// TODO: Port the old stuff with Filesystem and Templates
//
//
// XXX: TEST COMMAND
// mkdir ___sandbox;
// ./tool/Fertilizer.js file --environment="./lychee/build/nodejs/main.lychee.env" --fertilizer="./fertilizers/nodejs" --sandbox="./___sandbox"









return;


(function(lychee, arguments) {

	/*
	 * This is a hack for now.
	 * These files are required, but are not part of lycheeJS core
	 */

	var _fs   = require('fs');
	var _path = require('path');



	/*
	 * HELPERS
	 */

	var _EVENTS = [
		'configure',
		'make',
		'package',
		'install',
		'clean'
	];

	var _next_event = function() {

		var that    = this;
		var current = this.__current;
		var next    = null;

		if (current === null) {
			next = 'configure';
		} else {
			next = _EVENTS[_EVENTS.indexOf(current) + 1] || null;
		}


		if (next !== null) {

			this.__current = next;

			var result = this.trigger(next, [ function() {
				_next_event.call(that);
			}]);

			if (result === false) {
				_next_event.call(that);
			}

		}

	};


	var _Filesystem = function(data) {

		var settings = lychee.extend({}, data);


		this.sandbox           = '/tmp/lycheejs';
		this.__templatesandbox = '/tmp/lycheejs';


		this.setSandbox(settings.sandbox);

		settings = null;

	};


	_Filesystem.prototype = {

		copy: function(path1, path2) {

			path1 = typeof path1 === 'string' ? path1 : null;
			path2 = typeof path2 === 'string' ? path2 : null;


			if (path1 !== null && path2 !== null) {

				var result = false;
				try {

					if (_fs.existsSync(this.sandbox + '/' + path1)) {

						var buffer = _fs.readFileSync(this.sandbox + '/' + path1);
						_fs.writeFileSync(this.sandbox + '/' + path2, buffer);

						result = true;

					}

				} catch(e) {

				}

				if (result === true) {
					return true;
				}

			}


			return false;

		},

		copytemplate: function(path1, path2) {

			path1 = typeof path1 === 'string' ? path1 : null;
			path2 = typeof path2 === 'string' ? path2 : null;


			if (path1 !== null && path2 !== null) {

				var result = false;
				try {

					if (_fs.existsSync(this.__templatesandbox + '/' + path1)) {

						var buffer = _fs.readFileSync(this.__templatesandbox + '/' + path1);
						_fs.writeFileSync(this.sandbox + '/' + path2, buffer);

						result = true;

					}

				} catch(e) {

				}

				if (result === true) {
					return true;
				}

			}


			return false;

		},

		read: function(path, encoding) {

			path     =  typeof path === 'string' ? path     : null;
			encoding = encoding === 'binary'     ? 'binary' : 'utf8';


			if (path !== null) {

				var data = null;
				try {
					data = _fs.readFileSync(this.sandbox + '/' + path, encoding);
				} catch(e) {

				}

				return data;

			}


			return null;

		},

		write: function(path, data, encoding) {

			path     =  typeof path === 'string'                            ? path   : null;
			data     = (typeof data === 'string' || data instanceof Buffer) ? data   : null;
			encoding =  typeof data === 'string'                            ? 'utf8' : (encoding || 'binary');


			if (path !== null && data !== null) {

				if (path.charAt(0) === '.') {
					return false;
				}


				if (encoding === 'utf8') {

					var result = false;
					try {
						_fs.writeFileSync(this.sandbox + '/' + path, data, 'utf8');
						result = true;
					} catch(e) {

					}

					if (result === true) {
						return true;
					}

				} else if (encoding === 'binary') {

					var result = false;
					try {
						_fs.writeFileSync(this.sandbox + '/' + path, data.toString('binary'), 'binary');
						result = true;
					} catch(e) {

					}

					if (result === true) {
						return true;
					}

				}

			}


			return false;

		},

		remove: function(path) {

			path = typeof path === 'string' ? path : null;


			if (path !== null) {

				if (path.charAt(0) === '.') {
					return false;
				}


				var result = false;
				try {
					_fs.unlinkSync(this.sandbox + '/' + path);
					result = true;
				} catch(e) {

				}

				if (result === true) {
					return true;
				}

			}


			return false;

		},

		setSandbox: function(sandbox) {

			sandbox = typeof sandbox === 'string' ? sandbox : null;


			if (sandbox !== null) {

				this.sandbox = sandbox;

				return true;

			}


			return false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Template = function(data) {

		var settings = lychee.extend({}, data);


		this.environment = null;
		this.filesystem  = new _Filesystem();
		this.mode        = 'file';
		this.sandbox     = null;

		this.__current   = null;


		// TODO: How to do this with cleaner API?
		this.filesystem.__templatesandbox = settings.template.substr(0, settings.template.length - 9);

		this.setEnvironment(settings.environment);
		this.setMode(settings.mode);
		this.setSandbox(settings.sandbox);


		manual['lychee.event.Emitter'].call(this);

		settings = null;

	};


	Template.prototype = lychee.extend({}, manual['lychee.event.Emitter'].prototype, {

		/*
		 * CUSTOM API
		 */

		build: function() {

			var current = this.__current;
			if (current === null) {
				_next_event.call(this);
			}

		},

		setEnvironment: function(environment) {

			if (environment instanceof Object) {

				this.environment = environment;

				return true;

			}


			return false;

		},

		setMode: function(mode) {

			if (mode === 'library' || mode === 'file' || mode === 'folder') {

				this.mode = mode;

				return true;

			}


			return false;

		},

		setSandbox: function(sandbox) {

			if (_is_directory(sandbox)) {

				this.filesystem.setSandbox(sandbox);
				this.sandbox = sandbox;

				return true;

			}


			return false;

		}

	});



	/*
	 * INITIALIZATION
	 */

	var settings = {
		environment: null,
		mode:        'file',
		template:    null,
		sandbox:     null,
		silent:      false
	};


	for (var a = 0, al = arguments.length; a < al; a++) {

		var argument = arguments[a].substr(2, arguments[a].length - 2).split('=');
		if (argument[0].match(/environment|sandbox|template/)) {
			settings[argument[0]] = _path.resolve(root, argument[1].replace(/"/g, ''));
		} else if (argument[0] === 'mode' && argument[1].match(/library|file|folder/g)) {
			settings[argument[0]] = argument[1].replace(/"/g, '');
		} else if (argument[0] === 'silent') {
			settings.silent = true;
		}

	}


	if (_is_file(settings.environment) && _is_file(settings.template) && _is_directory(settings.sandbox)) {

		var environment = null;
		try {
			environment = JSON.parse(_fs.readFileSync(settings.environment));
		} catch(e) {
			console.error('tool.Fertilizer: Invalid Environment File');
			environment = null;
		}


		var template = new Template({
			environment: environment,
			mode:        settings.mode,
			sandbox:     settings.sandbox,
			template:    settings.template
		});


		// Sets up bindings externally
		var supported = require(settings.template)(template);
		if (supported === true) {

			template.bind('clean', function() {

				var mode = this.mode;
				if (mode === 'library' || mode === 'file') {

					// TODO: Cache all filesystem write() actions and detect if it was an index.<ext>

					try {

						if (_fs.existsSync(settings.sandbox + '/index.html') === true) {

							var buffer = _fs.readFileSync(settings.sandbox + '/index.html');
							_fs.writeFileSync(settings.sandbox + '.html', buffer);

						} else if (_fs.existsSync(settings.sandbox + '/index.js') === true) {

							var buffer = _fs.readFileSync(settings.sandbox + '/index.js');
							_fs.writeFileSync(settings.sandbox + '.js', buffer);

						}

					} catch(e) {

					}

				}

				process.exit(0);

			}, template);

			template.build();

		} else {

			process.exit(1);

		}

	} else {

		if (settings.silent === false) {
			_print_help();
		}


		process.exit(1);

	}

})(require(root + '/lychee/build/nodejs/core.js')(root), [].slice.call(process.argv, 2));

