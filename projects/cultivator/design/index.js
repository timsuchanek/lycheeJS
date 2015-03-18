
ui = (function(global) {

	/*
	 * STRUCTS
	 */

	var _MIME = {
		'fnt':   { type: 'application/json',       constructor: 'Font'    },
		'js':    { type: 'application/javascript', constructor: 'Buffer'  },
		'json':  { type: 'application/json',       constructor: 'Config'  },
		'png':   { type: 'image/png',              constructor: 'Texture' },
		'pkg':   { type: 'application/json',       constructor: 'lychee.Package' },
		'store': { type: 'application/json',       constructor: 'lychee.Storage' }
	};



	/*
	 * HELPERS
	 */

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

	var _set_value = function(key, value) {

		if (key.indexOf('.') === -1) {

			this[key] = value;

		} else if (key.match(/\[([A-Za-z]+)\]/g)) {

			var path    = key.split('[')[0].split('.');
			var pointer = this;


			while (path.length > 0) {

				var name = path.shift();
				if (pointer[name] !== undefined) {
					pointer = pointer[name];
				}

			}


			name          = key.split(/\[([A-Za-z]+)\]/g)[1];
			pointer[name] = value;

		}

	};

	var _encode_file = function(name, buffer, mime) {

		var construct = mime['constructor'];
		var instance  = null;


		switch(construct) {

			case 'Config':

				instance = lychee.deserialize({
					'constructor': construct,
					'arguments':   [ buffer ],
					'blob':        {
						buffer: buffer
					}
				});

			break;

			case 'Font':

				var index = buffer.indexOf('base64,');

				if (index !== -1) {

					buffer = 'data:application/json;base64,' + buffer.substr(index + 7);

					instance = lychee.deserialize({
						'constructor': construct,
						'arguments':   [ buffer ],
						'blob':        {
							buffer: buffer
						}
					});

				}

			break;

			case 'Texture':

				instance = lychee.deserialize({
					'constructor': construct,
					'arguments':   [ buffer ],
					'blob':        {
						buffer: buffer
					}
				});

			break;

		}


		if (instance !== null) {

			return {
				name: name,
				data: instance
			};

		}


		return null;

	};

	var _encode_form = function(type, elements) {

		var data = null;


		if (type === 'application/json') {

			data = {};


			elements.forEach(function(element) {

				if (element.tagName === 'INPUT') {

					var type = element.type;
					if (type === 'text' || type === 'hidden' || type === 'color') {

						_set_value.call(data, element.name, '' + element.value);

					} else if (type === 'number' || type === 'range') {

						var tmp1 = parseInt(element.value, 10);
						if (!isNaN(tmp1)) {
							_set_value.call(data, element.name, tmp1);
						}

					} else if (type === 'radio' && element.checked === true) {

						var tmp2 = parseInt(element.value, 10);
						if (!isNaN(tmp2)) {
							_set_value.call(data, element.name, tmp2);
						} else {
							_set_value.call(data, element.name, element.value);
						}

					} else if (type === 'file' && element.files.length > 0) {

						var tmp3 = element.__files || [];
						if (tmp3.length > 0) {
							_set_value.call(data, element.name, [].slice.call(tmp3));
						}

					}

				}

			});

		}


		return data;

	};

	var _resolve_target = function(identifier) {

		var pointer = this;

		var ns = identifier.split('.');
		for (var n = 0, l = ns.length; n < l; n++) {

			var name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}


		return pointer;

	};



	/*
	 * POLYFILLS
	 */

	document.addEventListener('DOMContentLoaded', function() {

		var forms = [].slice.call(document.querySelectorAll('form[method="javascript"]'));
		if (forms.length > 0) {

			forms.forEach(function(form) {

				form.onsubmit = function() {

					try {

						var data   = _encode_form(form.getAttribute('enctype'), [].slice.call(form.querySelectorAll('input')));
						var target = _resolve_target.call(global, form.getAttribute('action'));

						if (target !== null) {

							if (target instanceof Function) {

								target(data);

							} else if (target instanceof Object && typeof target.trigger === 'function') {

								var id = form.getAttribute('id') || null;
								if (id !== null) {
									target.trigger('submit', [   id, data ]);
								} else {
									target.trigger('submit', [ null, data ]);
								}

							}

						}

					} catch(e) {
						console.log(e);
					}


					return false;

				};

			});


			forms.forEach(function(form) {

				if (typeof form.onsubmit === 'function') {

					var elements = [].slice.call(form.querySelectorAll('input'));
					if (elements.length > 0) {

						elements.forEach(function(element) {

							if (element.type === 'radio') {

								element.onclick = function() {
									form.onsubmit();
								};

							} else if (element.type === 'file') {

								element.onchange = function() {

									this.__files = [];



									[].slice.call(this.files).forEach(function(file) {

										var name = file.name.split('/').pop();
										var ext  = [].slice.call(name.split('.'), 1).join('.');
										var mime = _MIME[ext] || null;

										if (mime !== null) {

											if (mime.type === file.type) {

												var reader = new FileReader();

												reader.onload = function(event) {

													this.__files.push(_encode_file(
														file.name,
														event.target.result,
														mime
													));

												}.bind(this);

												reader.readAsDataURL(file);

											}

										}

									}.bind(this));

//									form.onsubmit();

								};

							} else {

								element.onchange = function() {

									if (this.checkValidity() === true) {
										form.onsubmit();
									}

								};

							}

						});

					}

				}

			});

		}



		var selects = [].slice.call(document.querySelectorAll('ul.select'));
		if (selects.length > 0) {

			selects.forEach(function(select) {

				var options = [].slice.call(select.querySelectorAll('input'));
				if (options.length > 0) {

					var _checked = 0;

					options.forEach(function(option, index) {
						if (option.checked === true) {
							_checked = index;
						}
					});

					options[_checked].checked = true;



					options.forEach(function(option) {

						option.addEventListener('mouseenter', function() {

							options.forEach(function(other) { other.checked = false; });
							this.checked = true;

						});

						option.addEventListener('mouseleave', function() {

							options.forEach(function(other) { other.checked = false; });
							options[_checked].checked = true;

						});

						option.addEventListener('mouseup', function() {
							_checked = options.indexOf(this);
						});

					});

				}

			});

		}

		var menuElement = document.querySelector('menu');

		var menu = [].slice.call(document.querySelectorAll('menu li'));
		if (menu.length > 0) {

			var _active = 0;

			menu.forEach(function(item, index) {

				if (item.className === 'active') {
					_active = index;
				}

			});

			_set_active(menu[_active]);


			menu.forEach(function(item) {

				item.addEventListener('mouseenter', function() {

					menu.forEach(function(other) { _set_inactive(other); });
					_set_active(this);

				});

				item.addEventListener('mouseleave', function() {

					menu.forEach(function(other) { _set_inactive(other); });
					_set_active(menu[_active]);

				});

				item.addEventListener('mouseup', function() {
					_active = menu.indexOf(this);
					menuElement.classList.contains('active') ?
					menuElement.classList.remove('active')
					: null;
				});

			});

		}

		var menuIcon = document.getElementById('menuicon');

		if (menuIcon) {
			menuIcon.addEventListener('click', function() {
				menuElement.classList.toggle('active');
			});
		}

	}, true);



	var _download = function(filename, buffer) {

		filename = typeof filename === 'string' ? filename : null;
		buffer   = buffer instanceof Buffer     ? buffer   : null;


		if (filename !== null && buffer !== null) {

			var ext  = filename.split('.').pop();
			var type = 'plain/text';
			if (ext.match(/fnt|json/)) {
				type = 'application/json';
			} else if (ext.match(/png/)) {
				type = 'image/png';
			} else if (ext.match(/js/)) {
				type = 'text/javascript';
			}

			var url     = 'data:' + type + ';base64,' + buffer.toString('base64');
			var event   = document.createEvent('MouseEvents');
			var element = document.createElement('a');


			element.download = filename;
			element.href     = url;

			event.initMouseEvent(
				'click',
				true,
				false,
				window,
				0,
				0,
				0,
				0,
				0,
				false,
				false,
				false,
				false,
				0,
				null
			);

			element.dispatchEvent(event);


			return true;

		}


		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	return {

		download: _download,

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

})(this);

