
lychee.define('sorbet.module.Package').requires([
	'sorbet.data.Queue'
]).exports(function(lychee, sorbet, global, attachments) {



	/*
	 * HELPERS
	 */

	var _refresh = function(vhost) {

		if (lychee.debug === true) {
			console.log('sorbet.module.Server: Refreshing VHost "' + vhost.id + '"');
		}


		for (var id in vhost.projects) {

			var project = vhost.projects[id];
			if (project.sorbet === true && project.server === null) {
				this.queue.add(project);
			}

		}

	};

	var _get_namespace = function(identifier) {

		var pointer = this;

		var ns = identifier.split('.');

		for (var n = 0, l = ns.length; n < l; n++) {

			var name = ns[n];

			if (pointer[name] === undefined) {

				var letter = name.charAt(0);
				if (letter === letter.toUpperCase()) {
					pointer[name] = [];
				} else {
					pointer[name] = {};
				}

			}

			pointer = pointer[name];

		}


		return pointer;

	};

	var _build_project = function(project) {

		var fs    = project.vhost.fs;
		var files = fs.getFiles(project.root[0] + '/source');

		var source = {};

console.log('FILES', project.id, files);

		if (files !== null) {

			files.forEach(function(raw) {

				var path = raw.split('/');
				var file = path.pop();
				var tmp  = file.split('.');

				path.push(tmp.shift());


				var ext = tmp[tmp.length - 1];
				if (ext.match(/fnt|js|json|png|mp3|ogg/)) {

					var definition = _get_namespace.call(source, path.join('.'));
					var attachment = tmp.join('.');
					if (definition instanceof Array) {

						if (definition.indexOf(attachment) === -1) {
							definition.push(attachment);
						}

					}

				}

			});


console.log('building project nao!', JSON.stringify(source, null, '\t'));

process.exit();

		}



	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		this.id    = 'Package';
		this.main  = main || null;

		this.queue = new sorbet.data.Queue();
		this.queue.bind('update', _build_project, this);


		var vhosts = this.main.vhosts.values();
		for (var v = 0, vl = vhosts.length; v < vl; v++) {
			vhosts[v].bind('#refresh', _refresh, this);
		}

	};


	Class.prototype = {

		destroy: function() {

			var vhosts = this.main.vhosts.values();
			for (var v = 0, vl = vhosts.length; v < vl; v++) {
				vhosts[v].unbind('refresh', _refresh, this);
			}

		},

		process: function(host, response, data) {
			return false;
		}

	};


	return Class;

});

