
lychee.define('tool.state.Remotes').includes([
	'lychee.game.State',
	'lychee.event.Emitter'
]).tags({
	platform: 'html'
}).exports(function(lychee, tool, global, attachments) {

	/*
	 * HELPERS
	 */

	var _profiles = {};

	var _ui_update = function() {

		var config = new Config('http://localhost:8080/api/Server?timestamp=' + Date.now());
		var that   = this;

		config.onload = function(result) {

			if (this.buffer instanceof Array) {

				_ui_render.call(that, this.buffer.filter(function(server) {
					return server.remotes.length > 0;
				}));

			}

		};

		config.load();

	};

	var _ui_render = function(servers) {

		if (servers instanceof Array) {

			var code = '';


			servers.forEach(function(server) {

				code += '<article class="wide">';
				code += '<h3>' + server.identifier + '</h3>';

				code += '<table>';
				code += '<tr>';
				code += '<th>Remote</th>';
				code += '<th>Status</th>';
				code += '<th>Actions</th>';
				code += '</tr>';

				server.remotes.forEach(function(remote) {

					var remote_actions = [];
					var remote_status  = '';
					var remote_status  = remote.status === 'online' ? 'online' : 'offline';

					if (remote.status === 'online') {
						remote_status = '<label class="ico-online">Online</label>';
						remote_actions.push('<a class="button ico-debug ico-only" href="lycheejs://debug=' + server.identifier + '/' + remote.id + '">');
					} else {
						remote_actions.push('-');
						remote_status = '<label class="ico-offline" disabled>Offline</label';
					}

					code += '<tr>';
					code += '<td>' + remote.id + '</td>';
					code += '<td>' + remote_status + '</td>';
					code += '<td>' + remote_actions.join('') + '</td>';
					code += '</tr>';

				});

				code += '</table>';
				code += '</article>';

			});


			ui.render(code, '#remotes-servers');

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.game.State.call(this, main);
		lychee.event.Emitter.call(this);

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

		},

		enter: function() {
			_ui_update.call(this);
		},

		leave: function() {

		}

	};


	return Class;

});

