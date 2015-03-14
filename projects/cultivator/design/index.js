
ui = (function(global) {

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

	var _convert_value = function(value) {

console.log(value);

		if (typeof value === 'string') {

			var num = parseInt(value, 10);
			if (!isNaN(num)) {
				return num;
			} else {
				return value;
			}

		}


		return null;

	};


	return {

		getValue: function(query) {

			var elements = [].slice.call(document.querySelectorAll(query));
			if (elements.length > 1) {

				var value = [];

				elements.forEach(function(input) {

					if (input.type === 'radio') {

						if (input.checked === true) {
							value.push(_convert_value(input.value));
						}

					} else if (input.value != '') {

						value.push(_convert_value(input.value));

					}

				});


				if (value.length > 0) {

					if (value.length === 1) {
						return value[0];
					} else {
						return value;
					}

				}

			} else if (elements.length === 1) {

				return _convert_value(elements[0].value);

			}


			return null;

		},

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

})();

