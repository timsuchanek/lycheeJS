
lychee.define('sorbet.module.Package').requires([
	'sorbet.data.Queue'
]).exports(function(lychee, sorbet, global, attachments) {



	/*
	 * HELPERS
	 */

	var _refresh = function(vhost) {

		if (lychee.debug === true) {
			console.log('sorbet.module.Fertilizer: Refreshing VHost "' + vhost.id + '"');
		}


		var found = false;

		for (var id in vhost.projects) {

			var project = vhost.projects[id];
			if (Object.keys(project.builds).length > 0) {

				if (vhost.fs.isFile(project.root[0] + '/lychee.pkg') === true) {

					this.queue.add({
						id:    project.id,
						vhost: vhost,
						root:  project.root[0]
					});

				}

			}

		}

	};

	var _build_project = function(project) {
		// TODO: Implement an algorithm that crawls the project's source folder and updates lychee.pkg/source/files object
	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		this.id   = 'Package';
		this.main = main || null;

		this.queue = new sorbet.data.Queue();
		this.queue.bind('update', _build_project, this);



		/*
		 * INITIALIZATION
		 */

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

			this.queue.destroy();

		},

		process: function(host, response, data) {
			return false;
		}

	};


	return Class;

});

