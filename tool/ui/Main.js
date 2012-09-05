
lychee.define('ui.Main').exports(function(lychee, global) {


	var Module = {

		__elements: (function() {

			var elements = document.querySelectorAll('.ui');
			var _map = {};
			for (var e = 0, l = elements.length; e < l; e++) {

				var cnames = elements[e].className.split(' ');
				for (var c = 0, cl = cnames.length; c < cl; c++) {
					if (cnames[c] === 'ui') continue;
					if (cnames[c].match(/ui-/)) {
						_map[cnames[c].replace(/ui-/,'')] = elements[e];
					}
				}

			}

			if (lychee.debug === true) {
				console.log('ui.Main elements:', _map);
			}

			_map.__main = document.body;

			return _map;

		})(),

		API: {

			main: {

				add: function(element) {
					Module.__add('__main', element);
				}

			},

			navi: {

				add: function(label, element, force) {

					label = typeof label === 'string' ? label : null;
					force = force === true ? true : false;

					if (label !== null) {

						var _label = document.createElement('label');
						_label.innerHTML = label;
						_label.className = 'ui-label';
						Module.__add('navi', _label);

					}


					if (element !== null) {
						Module.__add('navi', element);
					}


					if (label !== null || force === true) {
						Module.__add('navi', document.createElement('br'));
					}

				}

			},

			viewport: {

				clear: function() {
					Module.__elements.viewport.innerHTML = '';
				},

				add: function(element) {
					Module.__add('viewport', element);
				}

			},

			log: {

				clear: function() {
					Module.__elements.log.innerHTML = '<p style="text-align:center">Debug Output will land here.';
				},

				add: function(element) {
					Module.__add('log', element);
				},

				hide: function() {
					Module.__elements.log.className = 'ui ui-log hidden';
				},

				show: function() {
					Module.__elements.log.className = 'ui ui-log visible';
				}

			}

		},

		get: function(id) {

			id = typeof id === 'string' ? id : null;

			if (id !== null && this.API[id] !== undefined) {
				return this.API[id];
			}


			return null;

		},

		__add: function(id, element, before) {

			if (this.__elements[id] == null) return false;

			before = before || null;

			if (!element) return;

			if (element.addTo) {

				element.addTo(this.__elements[id]);
				return true;

			} else if (element instanceof HTMLElement) {

				if (before !== null) {

					this.__elements[id].insertBefore(element, before);
					return true;

				} else {

					this.__elements[id].appendChild(element);
					return true;

				}

			}

			return false;

		}

	};


	return Module;

});

