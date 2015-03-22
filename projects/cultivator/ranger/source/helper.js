
(function(global) {

	var is_nwjs = false;

	try {
		require('nw.gui');
		is_nwjs = true;
	} catch(e) {
		is_nwjs = false;
	}


	var _put_api = function(identifier, action) {

		var url = 'http://localhost:4848/api/Project?identifier=' + identifier + '&action=' + action;
		var req = new XMLHttpRequest();

		req.onload  = function() {};
		req.onerror = function() {};
		req.open('PUT', url, true);

		try {
			req.send(null);
		} catch(e) {
		}


		setTimeout(function() {

			var main = global.MAIN || null;
			if (main !== null) {
				main.state.update();
			}

		}, 200);

	};


	global.helper = {

		boot: function(profile) {

			profile = typeof profile === 'string' ? profile : null;


			if (profile !== null) {

				if (is_nwjs === true) {

					location.href = 'lycheejs://boot=' + profile;

					return true;

				}

			}


			return false;

		},

		file: function(url) {

			url = typeof url === 'string' ? url : null;


			if (url !== null) {

				if (is_nwjs === true) {
					location.href = 'lycheejs://file=' + url;
				} else {
					location.href = 'lycheejs://file=' + url;
				}


				return true;

			}


			return false;

		},

		start: function(project) {

			project = typeof project === 'string' ? project : null;


			if (project !== null) {

				_put_api(project, 'start');

				return true;

			}


			return false;

		},

		stop: function(project) {

			project = typeof project === 'string' ? project : null;


			if (project !== null) {

				_put_api(project, 'stop');

				return true;

			}


			return false;

		},

		web: function(url) {

			url = typeof url === 'string' ? url : null;


			if (url !== null) {

				if (is_nwjs === true) {
					location.href = 'lycheejs://web=' + url;
				} else {
					window.open(url);
				}


				return true;

			}


			return false;

		}

	};

})(this);

