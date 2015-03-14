
app = (function(global) {

	var helper        = require('./helper');
	var fs            = require('fs');
	var path          = require('path');


	var _ROOT = '/home/christoph/Software/lycheeJS';

	var _set_active = function(element) {

		var classnames = element.className.split(' ');
		if (classnames.indexOf('active') === -1) {
			classnames.push('active');
		}

		element.className = classnames.join(' ');

	};

	var _set_inactive = function(element) {

		var classnames = element.className.split(' ');
		var classindex = classnames.indexOf('active');
		if (classindex !== -1) {
			classnames.splice(classindex, 1);
		}

		element.className = classnames.join(' ');

	};



	/*
	 * STRUCTS
	 */

	var _project_cache = [];

	var _Project = function(identifier) {

		this.identifier = identifier;
		this.status     = 'offline';

	};

	_Project.prototype = {

		open: function(type) {

			if (type === 'browser') {
				helper.open('http://localhost:8080/projects/' + this.identifier);
			} else if (type === 'folder') {
				helper.open('file://' + _ROOT + '/projects/' + this.identifier);
			}

		}

	};



	/*
	 * FEATURE DETECTION
	 */

	(function() {

		var stat = fs.lstatSync(_ROOT);
		if (stat.isDirectory() === true) {

			var projects = fs.readdirSync(_ROOT + '/projects').filter(function(identifier) {
				return (fs.existsSync(_ROOT + '/projects/' + identifier + '/lychee.pkg') || fs.existsSync(_ROOT + '/projects/' + identifier + '/lychee.pkg'));
			});

			if (projects.length > 0) {

				projects.forEach(function(identifier) {
					_project_cache.push(new _Project(identifier));
				});

			}

		}

	})();


console.log(_project_cache);
window.PROJECTS = _project_cache;


	return {

		setView: function(identifier) {

			var menu  = [].slice.call(document.querySelectorAll('menu li'));
			var views = [].slice.call(document.querySelectorAll('section[id]'));

			if (menu.length === views.length) {

				menu.forEach(function(item) {

					if (item.innerText.toLowerCase() === identifier) {
						_set_active(item);
					} else {
						_set_inactive(item);
					}

				});

				views.forEach(function(view) {

					if (view.id === identifier) {
						view.className = 'active';
					} else {
						view.className = '';
					}

				});

			}

		}

	};

})(this);

