
lychee.define('tool.state.Profiles').includes([
	'lychee.game.State'
]).tags({
	platform: 'html'
}).exports(function(lychee, tool, global, attachments) {

	/*
	 * HELPERS
	 */

	var _ui_update = function() {

		var config = new Config('http://localhost:4848/api/Profile?timestamp=' + Date.now());
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

				var code     = '';
				var port     = 80;
				var profiles = buffer;



				if (profiles.length > 0) {

					code += '<article class="wide">';
					code += '<h3><b>1</b>Select Profile</h3>';
					code += '<p class="center">Select a Profile you want to modify.</p>';
					code += '<div>';
					code += '<ul class="select">';
					code += profiles.map(function(profile) {
						return '<li><input name="profiles-profile" type="radio" value="' + profile.identifier + '"><span>' + profile.identifier + '</span></li>';
					}).join('');
					code += '</ul>';
					code += '</div>';
					code += '</article>';

					code += '<article class="wide">';
					code += '<h3><b>2</b>Modify Profile</h3>';
					code += '</article>';

					code += '<article>';
					code += '<h3><b>3</b>Save or Reboot</h3>';
					code += '<p class="center">Now you can save the Profile or Reboot Sorbet with its modifications.</p>';
					code += '</article>';

/*
				code += '<table>';
					profiles.forEach(function(profile, index) {

						if (index !== 0) {
							code += '<tr class="div"></tr>';
						}


						code += '<tr>';
						code += '<th><h3>' + profile.identifier + '</h3></th>';


// :' + '<input type="number" value="' + profile.port + '"></th>';
// code += '<th><input type="text" value="' + profile.identifier + '">:<input type="number" value="' + profile.port + '"></th>';


						code += '</tr>';
						code += '<tr>';
						code += '<th>Host</th>';
						code += '<th>Project</th>';
						code += '</tr>';


						for (var host in profile.hosts) {

							var project = profile.hosts[host];


							code += '<tr>';
							code += '<td><input type="text" value="' + host + '"></td>';
							code += '<td><input type="text" value="' + (project !== null ? project : '*') + '"></td>';
							code += '</tr>';

						}

console.log(profile);

					});



					projects.forEach(function(project) {

						var project_actions = [];
						var project_status  = '';

						if (project.server === null) {

							if (project.sorbet === true) {
								project_actions.push('<a class="button ico-start ico-only" href="lycheejs://start=' + project.identifier + '"></a>');
								project_status = '<label class="ico-offline">Offline</label>';
							} else {
								project_actions.push('<button class="ico-start ico-only" disabled></button>');
								project_status = '<label class="ico-offline" disabled>Offline</label>';
							}

						} else {
							project_actions.push('<a class="button ico-stop ico-only" href="lycheejs://stop=' + project.identifier + '"></a>');
							project_status = '<label class="ico-online">Online</label>';
						}


						if (project.filesystem !== null) {
							project_actions.push('<a class="button ico-folder ico-only" href="lycheejs://file=' + project.filesystem + '"></a>');
						}


						if (project_hosts.length > 0) {

							project_hosts.forEach(function(host) {

								if (sorbet !== null && sorbet.details[host] === null) {
									project_actions.push('<a class="button ico-browser ico-only" href="lycheejs://web=' + host + ':' + port + '/projects/' + project.identifier + '"></a>');
								} else {
									project_actions.push('<a class="button ico-browser ico-only" href="lycheejs://web=' + host + ':' + port + '"></a>');
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

*/

				}


//				ui.render(code);

			}

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

