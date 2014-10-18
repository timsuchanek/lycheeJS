#!/usr/bin/env nodejs

var _cli = require(__dirname + '/cli.js');



/*
 * USAGE
 */

var _print_help = function() {

	console.log('                                                                                            ');
	console.log('============================================================================================');
	console.log('                   _                                                                        ');
	console.log('              {+~/`o;==-    ,_(+--,                     lycheeJS v0.8 Installer             ');
	console.log('         .----+-/`-/          (+--; ,--+)_,                                                 ');
	console.log('          `+-..-| /               | ;--+)     @     (installs third-party Software)         ');
	console.log('               /|/|           .-. |.| .-.    <|>                                            ');
	console.log('               `--`              ~| |~        |                                             ');
	console.log('    ^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^=^-.-^     ');
	console.log('                                                                                            ');
	console.log('                                                                                            ');
	console.log('Usage: ./tool/Installer.js [Mode]                                                           ');
	console.log('                                                                                            ');
	console.log('                                                                                            ');
	console.log('Modes:                                                                                      ');
	console.log('                                                                                            ');
	console.log('   fertilizers                         Installs third-party runtimes and build-templates    ');
	console.log('                                                                                            ');

};



var _mode = null;
var _root = require('path').resolve(__dirname, '../');

(function() {

	var settings = {
		mode: null
	};


	for (var a = 0, al = process.argv.length; a < al; a++) {

		var arg = process.argv[a].replace(/"/g, '');
		if (arg.match(/fertilizers/)) {
			settings['mode'] = arg;
		}

	}


	if (settings.mode !== null) {
		_mode = settings.mode;
	}


	settings = null;

})();



/*
 * IMPLEMENTATION
 */

(function(cli, mode) {

	var lychee = cli.lychee;
	var global = cli.global;

	lychee.event         = lychee.event || {};
	lychee.event.Emitter = cli.include('lychee/source/event/Emitter.js', 'lychee.event.Emitter');



	/*
	 * HELPERS
	 */

	var _FERTILIZERS_ZIP = 'https://codeload.github.com/LazerUnicorns/lycheeJS-fertilizers/zip/master';



	/*
	 * INITIALIZATION
	 */

	if (mode !== null) {

		var shell;

		if (mode === 'fertilizers') {

			console.log('Downloading zip archive ...');


			shell = new cli.Shell(_root + '/fertilizers');
			shell.download(_FERTILIZERS_ZIP, 'fertilizers.zip', function(result) {

				if (result === true) {

					console.info('SUCCESS');
					console.log('Extracting zip archive ...');

					shell.unzip('fertilizers.zip', function(result) {

						if (result === true) {

							console.info('SUCCESS');
							console.log('Integrating Fertilizers ...');

							shell.move('lycheeJS-fertilizers-master/*', function(result) {

								if (result === true) {
									console.info('SUCCESS');
									process.exit(0);
								} else {
									console.error('FAILURE');
									process.exit(1);
								}

							}, this);

						} else {
							console.error('FAILURE');
							process.exit(1);
						}

					}, this);

				} else {
					console.error('FAILURE');
					process.exit(1);
				}

			}, this);

		}

	} else {

		if (mode === null) {
			console.error('Installer: Invalid Mode');
		}


		_print_help();
		process.exit(1);

	}

})(_cli, _mode);

