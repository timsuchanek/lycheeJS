#!/usr/bin/env nodejs


var root   = require('path').resolve(__dirname, '../');
var fs     = require('fs');
var lychee = require(root + '/lychee/build/nodejs/core.js')(root);
var path   = require('path');


var _settings = (function() {

	var settings = {
		command: null,
		profile: null
	};


	var args = [ process.argv[2] || '', process.argv[3] || '' ];
	if (args[0].match(/start|stop/)) {

		settings.command = args[0];
		settings.profile = args[1] || null;

	}


	if (settings.profile !== null) {

		try {

			if (fs.existsSync(root + '/sorbet/profile/' + settings.profile + '.json')) {
				settings.profile = JSON.parse(fs.readFileSync(root + '/sorbet/profile/' + settings.profile + '.json', 'utf8'));
			} else {
				settings.profile = null;
			}

		} catch(e) {
		}

	}


	return settings;

})();



(function(command, profile) {

	/*
	 * HELPERS
	 */

	var _clear_pid = function() {

		try {

			fs.unlinkSync(root + '/sorbet/.pid');
			return true;

		} catch(e) {

			return false;

		}

	};

	var _read_pid = function() {

		var pid = null;

		try {

			pid = fs.readFileSync(root + '/sorbet/.pid', 'utf8');

			if (!isNaN(parseInt(pid, 10))) {
				pid = parseInt(pid, 10);
			}

		} catch(e) {
			pid = null;
		}

		return pid;

	};

	var _write_pid = function() {

		try {

			fs.writeFileSync(root + '/sorbet/.pid', process.pid);
			return true;

		} catch(e) {

			return false;

		}

	};



	if (command === 'start') {

		if (profile === null) {

			console.error('Invalid Profile');
			process.exit(1);

			return false;

		} else {

			console.info('Starting Instance (' + process.pid + ') ... ');

			lychee.setEnvironment(new lychee.Environment({
				id:      'sorbet',
				debug:   false,
				sandbox: false,
				build:   'sorbet.Main',
				timeout: 1000,
				packages: [
					new lychee.Package('lychee', '/lychee/lychee.pkg'),
					new lychee.Package('sorbet', '/sorbet/lychee.pkg')
				],
				tags:     {
					platform: [ 'nodejs' ]
				}
			}));


			setTimeout(function() {

				var main = lychee.environment.global.MAIN;
				if (main === undefined || main.server === null) {
					_clear_pid();
					process.exit(1);
				}

			}, 1500);


			lychee.init(function(sandbox) {

				var lychee = sandbox.lychee;
				var sorbet = sandbox.sorbet;


				// This allows using #MAIN in JSON files
				sandbox.MAIN = new sorbet.Main(profile);
				sandbox.MAIN.init();
				_write_pid();


				process.on('SIGHUP',  function() { sandbox.MAIN.destroy(); _clear_pid(); this.exit(1); });
				process.on('SIGINT',  function() { sandbox.MAIN.destroy(); _clear_pid(); this.exit(1); });
				process.on('SIGQUIT', function() { sandbox.MAIN.destroy(); _clear_pid(); this.exit(1); });
				process.on('SIGABRT', function() { sandbox.MAIN.destroy(); _clear_pid(); this.exit(1); });
				process.on('SIGTERM', function() { sandbox.MAIN.destroy(); _clear_pid(); this.exit(1); });
				process.on('error',   function() { sandbox.MAIN.destroy(); _clear_pid(); this.exit(1); });
				process.on('exit',    function() {});


				new lychee.Input({
					key:         true,
					keymodifier: true
				}).bind('escape', function() {

					console.warn('sorbet.Main: [ESC] pressed, exiting Sorbet ...');

					sandbox.MAIN.destroy();
					_clear_pid();
					process.exit(0);

				}, this);

			});

		}

	} else if (command === 'stop') {

		var pid = _read_pid();
		if (pid !== null) {

			console.info('Stopping Instance (' + pid + ') ... ');

			process.kill(pid, 'SIGTERM');
			process.exit(0);

		} else {

			process.exit(1);

		}

	} else {

		console.info('lycheeJS ' + lychee.VERSION + ' Sorbet');

		var profiles      = fs.readdirSync(root + '/sorbet/profile').map(function(value) {
			return '"' + value.substr(0, value.indexOf('.json')) + '"';
		});
		var profiles_info = (profiles.join(', ') + '                                                      ').substr(0, 50);


		console.log('                                                      ');
		console.log('Usage: sorbet [Command] [Profile]                     ');
		console.log('                                                      ');
		console.log('                                                      ');
		console.log('Commands:                                             ');
		console.log('                                                      ');
		console.log('    start                    Starts a Sorbet Instance.');
		console.log('    stop                     Stops a Sorbet Instance. ');
		console.log('                                                      ');
		console.log('Available Profiles:                                   ');
		console.log('    ' + profiles_info);
		console.log('                                                      ');
		console.log('Examples:                                             ');
		console.log('                                                      ');
		console.log('    sorbet start development                          ');
		console.log('                                                      ');


		process.exit(0);

	}

})(_settings.command, _settings.profile);

