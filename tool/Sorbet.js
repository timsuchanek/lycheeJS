#!/usr/bin/env nodejs

var _cli = require(__dirname + '/cli.js');



/*
 * USAGE
 */

var _print_help = function() {

	console.log('                                                                                            ');
	console.log('============================================================================================');
	console.log('                   _                                                                        ');
	console.log('              {+~/`o;==-    ,_(+--,                 lycheeJS v0.8 Sorbet                    ');
	console.log('         .----+-/`-/          (+--; ,--+)_,                                                 ');
	console.log('          `+-..-| /               | ;--+)     @   (Web-, WS- & CI-Server, CDN)              ');
	console.log('               /|/|           .-. |.| .-.    <|>                                            ');
	console.log('               `--`              ~| |~        |                                             ');
	console.log('    ^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^     ');
	console.log('                                                                                            ');
	console.log('                                                                                            ');
	console.log('Usage: sorbet [Command] [Parameter, ...]                                                    ');
	console.log('                                                                                            ');
	console.log('                                                                                            ');
	console.log('Commands:                                                                                   ');
	console.log('                                                                                            ');
	console.log('   start                                      Starts a sorbet server                        ');
	console.log('   stop                                       Stops a sorbet server                         ');
	console.log('   restart                                    Stops and starts a sorbet server              ');
	console.log('                                                                                            ');
	console.log('Parameters:                                                                                 ');
	console.log('                                                                                            ');
	console.log('   --identifier="mycoolserver"                The identifier of the server.                 ');
	console.log('                                                                                            ');
	console.log('   --profile="./path/to/profile.json"         The static configuration file.                ');
	console.log('                                                                                            ');
	console.log('   --port="8080"                              The dynamic configuration port number.        ');
	console.log('   --sandbox="./path/to/project"              The dynamic configuration root directory.     ');
	console.log('   --virtualhost="cosmo.lycheejs.org"         The dynamic virtualhost identifier.           ');
	console.log('                                                                                            ');
	console.log('Important:                                                                                  ');
	console.log('                                                                                            ');
	console.log('- Profiles are static configuration. They setup ports, root folders and virtualhosts.       ');
	console.log('- If no Profile is set, it will default to using the dynamic configuration settings.        ');
	console.log('- If no Identifier is set, it will default to the process id (PID).                         ');
	console.log('- If no Sandbox Directory is set, it will default to the current working directory.         ');
	console.log('- If no VirtualHost is set, it will default to "localhost".                                 ');
	console.log('                                                                                            ');
	console.log('Examples:                                                                                   ');
	console.log('                                                                                            ');
	console.log('cd ~/lycheeJS; sorbet start --profile="./sorbet/profile/localhost.json"                     ');
	console.log('                                                                                            ');
	console.log('cd ~/myproject; sorbet start --port="8081"                                                  ');
	console.log('cd ~; sorbet start --port="8082" --sandbox="./myproject" --virtualhost="foo.lycheejs.org"   ');
	console.log('                                                                                            ');
	console.log('cd ~; sorbet start --identifier="betastuff" --port="8083" --sandbox="./myproject"           ');
	console.log('cd ~; sorbet restart --identifier="betastuff"                                               ');
	console.log('                                                                                            ');

};



var _command    = null;
var _identifier = null;
var _profile    = null;

(function() {

	var settings = {
		command:     null,
		identifier:  null,
		profile:     null,
		port:        null,
		sandbox:     process.cwd(),
		virtualhost: null
	};


	for (var a = 0, al = process.argv.length; a < al; a++) {

		var arg = process.argv[a].replace(/"/g, '');
		if (arg.substr(0, 2) === '--' && arg.indexOf('=') !== -1) {

			var key = arg.substr(2).split('=')[0];
			var val = arg.substr(2).split('=')[1];

			if (!isNaN(parseInt(val, 10))) {
				val = parseInt(val, 10);
			}


			if (typeof settings[key] !== undefined) {
				settings[key] = val;
			}

		} else if (arg.match(/start|stop|restart/)) {

			settings['command'] = arg;

		}

	}


	if (settings.profile !== null) {

		if (_cli.isFile(settings.profile)) {

			var data = _cli.read(settings.profile);
			if (data !== null) {
				settings.profile = data;
			} else {
				settings.profile = null;
			}

		} else {
			settings.profile = null;
		}

	}



	var id   = typeof settings.identifier === 'string' ? settings.identifier : null;
	var cmd  = typeof settings.command === 'string'    ? settings.command    : null;
	var port = typeof settings.port === 'number'       ? settings.port       : 8080;
	var host = typeof settings.host === 'string'       ? settings.host       : 'localhost';
	var root = _cli.isDirectory(settings.sandbox)      ? settings.sandbox    : process.cwd();

	if (settings.profile === null) {

		console.warn('No Profile set, using dynamic configuration settings.');

		_command    = cmd;
		_identifier = id;
		_profile    = {
			port:   port,
			vhosts: [{
				hosts:  [ host ],
				config: { root: root }
			}]
		};

	} else {

		console.warn('Profile set, using static configuration settings.');

		_command    = cmd;
		_identifier = id;
		_profile    = settings.profile;

	}


	settings = null;

})();



/*
 * IMPLEMENTATION
 */

(function(cli, command, identifier, profile) {

	var lychee = cli.lychee;
	var global = cli.global;



	/*
	 * HELPERS
	 */

	var _start_server = function(identifier, profile) {

// TODO: Use process.spawn() and try to set this to a different folder

		lychee.setEnvironment(new lychee.Environment({
			id:      'sorbet',
			debug:   true,
			sandbox: false,
			build:   'sorbet.Main',
			timeout: 3000,
			packages: [
				new lychee.Package('lychee', '/lychee/lychee.pkg'),
				new lychee.Package('sorbet', '/sorbet/lychee.pkg')
			],
			tags:     {
				platform: [ 'nodejs' ]
			}
		}));

		lychee.init(function(sandbox) {

			var lychee = sandbox.lychee;
			var sorbet = sandbox.sorbet;

			var main = new sorbet.Main(profile);

			main.listen(profile.port);

			process.on('exit', function() {
				main.destroy();
			});

		});

	};

	var _stop_server = function(identifier) {

// TODO: stop server via identifier

	};



	/*
	 * INITIALIZATION
	 */

	if (command === 'start' && profile !== null) {

		_start_server(identifier, profile);

	} else if (command === 'stop' && identifier !== null) {

		_stop_server(identifier);

	} else if (command === 'restart' && identifier !== null && profile !== null) {

		_stop_server(identifier);
		_start_server(identifier, profile);

	} else {

		if (command === null) {
			console.error('sorbet: Invalid Command');
		}

		if (profile === null) {
			console.error('sorbet: Invalid Profile');
		}


		_print_help();
		process.exit(1);

	}

})(_cli, _command, _identifier, _profile);

