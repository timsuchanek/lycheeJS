
lychee.define('tool.state.Status').includes([
	'lychee.game.State'
]).tags({
	platform: 'html'
}).exports(function(lychee, tool, global, attachments) {

	/*
	 * HELPERS
	 */

	var _ui_update = function() {

		var config = new Config('/api/Project?timestamp=' + Date.now());
		var that   = this;

		config.onload = function(result) {
			_ui_render.call(that, this.buffer);
		};

		config.load();

	};

	var _ui_render = function(buffer) {

		if (buffer instanceof Array) {

			var main = this.main || null;
			if (main !== null) {

				var code        = '';
				var port        = 80;
				var reverse_map = {};
				var projects    = buffer.filter(function(project) {
					return project.identifier !== 'sorbet';
				});
				var sorbet      = buffer.filter(function(project) {
					return project.identifier === 'sorbet';
				})[0] || null;


				if (projects.length > 0) {
					projects.forEach(function(project) {
						reverse_map[project.identifier] = [];
					});
				}


				code += '<table>';

				if (sorbet !== null) {

					code += '<tr>';
					code += '<th>Host</th>';
					code += '<th>Status</th>';
					code += '<th>Projects</th>';
					code += '<th>Actions</th>';
					code += '</tr>';


					if (sorbet.server !== null) {
						port = sorbet.server.port;
					}


					Object.keys(sorbet.details).forEach(function(identifier) {

						var host_projects = [ '*' ];

						if (sorbet.details[identifier] instanceof Array) {

							sorbet.details[identifier].forEach(function(id) {

								var map = reverse_map[id];
								if (map === undefined) {
									map = reverse_map[id] = [];
								}

								map.push(identifier);

							});

							host_projects = sorbet.details[identifier];

						}


						code += '<tr>';
						code += '<td>' + identifier + '</td>';
						code += '<td><label class="ico-online">Online</label></td>';
						code += '<td>' + host_projects.join(', ') + '</td>';
						code += '<td><button class="ico-browser ico-only" onclick="window.open(\'http://' + identifier + ':' + port + '\')"></button></td>';
						code += '</tr>';

					});


					Object.keys(sorbet.details).forEach(function(identifier) {

						if (sorbet.details[identifier] === null) {

							for (var id in reverse_map) {
								reverse_map[id].push(identifier);
							}

						}

					});

				}


				code += '<tr class="div"></tr>';


				if (projects.length > 0) {

					code += '<tr>';
					code += '<th>Project</th>';
					code += '<th>Status</th>';
					code += '<th>Hosts</th>';
					code += '<th>Actions</th>';
					code += '</tr>';


					projects.forEach(function(project) {

						var project_hosts   = reverse_map[project.identifier];
						var project_actions = [];
						var project_status  = '';

						if (project.server === null) {

							if (project.sorbet === true) {
								project_actions.push('<button class="ico-start ico-only" onclick="helper.start(\'' + project.identifier + '\')"></button>');
								project_status = '<label class="ico-offline">Offline</label>';
							} else {
								project_actions.push('<button class="ico-start ico-only" disabled></button>');
								project_status = '<label class="ico-offline" disabled>Offline</label>';
							}

						} else {
							project_actions.push('<button class="ico-stop ico-only" onclick="helper.stop(\'' + project.identifier + '\')"></button>');
							project_status = '<label class="ico-online">Online</label>';
						}


						if (project.filesystem !== null) {
							project_actions.push('<button class="ico-folder ico-only" onclick="helper.file(\'' + project.filesystem + '\')"></button>');
						}


						if (project_hosts.length > 0) {

							project_hosts.forEach(function(host) {

								if (sorbet !== null && sorbet.details[host] === null) {
									project_actions.push('<button class="ico-browser ico-only" onclick="helper.web(\'' + host + ':' + port + '/projects/' + project.identifier + '\')"></button>');
								} else {
									project_actions.push('<button class="ico-browser ico-only" onclick="helper.web(\'' + host + ':' + port + '\')"></button>');
								}

							});

						}


						code += '<tr>';
						code += '<td>' + project.identifier + '</td>';
						code += '<td>' + project_status + '</td>';
						code += '<td>' + project_hosts.join(', ') + '</td>';
						code += '<td>' + project_actions.join('') + '</td>';
						code += '</tr>';

					});

				}

				code += '</table>';


				ui.render(code);

			}

		} else {

console.log('render reload icon');

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.game.State.call(this, main);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize:   function() {},
		deserialize: function() {},



		/*
		 * CUSTOM API
		 */

		update: function(clock, delta) {
			_ui_update.call(this);
		},

		enter: function() {
			_ui_update.call(this);
		},

		leave: function() {
			_ui_render.call(this, null);
		}

	};


	return Class;

});

