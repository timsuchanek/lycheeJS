
lychee.define('sorbet.mod.Server').requires([
	'sorbet.data.Filesystem',
	'sorbet.data.Server'
]).exports(function(lychee, sorbet, global, attachments) {

	var _MIN_PORT      = 49152;
	var _MAX_PORT      = 65534;

	var _child_process = require('child_process');
	var _port          = _MIN_PORT;



	/*
	 * IMPLEMENTATION
	 */

	var _root = new sorbet.data.Filesystem(__dirname + '/../../../').root.slice(0, -1);

	var Module = {

		can: function(project) {

			if (project.server === null) {

				var info = project.filesystem.info('/sorbet.js');
				if (info !== null && info.type === 'file') {
					return true;
				}

			}


			return false;

		},

		process: function(project) {

			if (project.server === null) {

				var info = project.filesystem.info('/sorbet.js');
				if (info !== null && info.type === 'file') {

					var server_host = null;
					var server_port = _port++;

					if (server_port >= _MIN_PORT && server_port <= _MAX_PORT) {

						var program_bin  = project.filesystem.root + '/sorbet.js';
						var program_args = [ _root, server_port, server_host ];
						var program_cwd  = project.filesystem.root;


						var server_process = _child_process.fork(program_bin, program_args, {
							cwd: program_cwd
						});


						if (lychee.debug === true) {
							console.log('sorbet.mod.Server: Launched Server for "' + project.identifier + '" (' + server_process.pid + ' / ' + server_host + ':' + server_port + ')');
						}


						server_process.on('SIGTERM', function() { this.exit(1); });
						server_process.on('error',   function() { this.exit(1); });
						server_process.on('exit',    function() {});

						server_process.destroy = function() {

							if (lychee.debug === true) {
								console.warn('sorbet.mod.Server: Destroyed Server for "' + project.identifier + '"');
							}

							this.kill('SIGTERM');

						};


						project.setServer(new sorbet.data.Server({
							process: server_process,
							host:    server_host,
							port:    server_port
						}));

					}

				}

			}

		}

	};


	return Module;

});

