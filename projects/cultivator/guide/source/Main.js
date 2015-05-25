
lychee.define('tool.Main').requires([
	'lychee.data.JSON'
]).includes([
	'lychee.game.Main'
]).tags({
	platform: 'html'
}).exports(function(lychee, tool, global, attachments) {

	var _DOCS_CACHE = {};
	var _JSON = lychee.data.JSON;
	var LYCHEE_SRC = '/lychee/source';
	var _SRC_CACHE = {};

	var NO_DOCS = '<h1>This class currently has no docs :(</h1>'
	            + 'If you want some, you can kick our ass at github.';

	/*
	 * HELPERS
	 */

	var _custom_parser = function(docs) {
		docs = docs.split(/=\{(.*)\}/);
		var docs_code = docs[0];

		var enum_seen         = false;
		var event_seen        = false;
		var method_seen       = false;
		var property_seen     = false;


		for (var i = 1; i < docs.length; i += 2) {

			var constructor_code  = '';

			if (docs[i] === 'constructor') {

				var strong = '<strong class="highlight">' + this.active_module + '</strong>';
				docs[i+1] = docs[i+1].replace(new RegExp(this.active_module, 'g'), strong);
				constructor_code = ' id="' + docs[i] + '"';

			} else if (docs[i].substring(0, 5) === 'enums') {
				if (!enum_seen) {
					enum_seen = true;
					docs_code += '<h2>Enums</h2>'
				}

				var name = docs[i].split('-')[1];

				docs_code += '<h4 id="' + docs[i] + '"><a href="#' + docs[i] + '">' + name + '</a></h4>';

				var strong = '<strong class="highlight">' + name + '</strong>';
				docs[i+1] = docs[i+1].replace(new RegExp(name, 'g'), strong);

			} else if (docs[i].substring(0, 6) === 'events') {
				if (!event_seen) {
					event_seen = true;
					docs_code += '<h2>Events</h2>'
				}

				var name = docs[i].split('-')[1];

				docs_code += '<h4 id="' + docs[i] + '"><a href="#' + docs[i] + '">' + name + '</a></h4>';

				var strong = '<strong class="highlight">' + name + '</strong>';
				docs[i+1] = docs[i+1].replace(new RegExp(name, 'g'), strong);

			} else if (docs[i].substring(0, 10) === 'properties') {
				if (!property_seen) {
					property_seen = true;
					docs_code += '<h2>Properties</h2>'
				}

				var name = docs[i].split('-')[1];

				docs_code += '<h4 id="' + docs[i] + '"><a href="#' + docs[i] + '">' + name + '</a></h4>';

				var strong = '<strong class="highlight">' + name + '</strong>';
				docs[i+1] = docs[i+1].replace(new RegExp(name, 'g'), strong);

			} else if (docs[i].substring(0, 7) === 'methods') {
				if (!method_seen) {
					method_seen = true;
					docs_code += '<h2>Methods</h2>'
				}

				var name = docs[i].split('-')[1];

				docs_code += '<h4 id="' + docs[i] + '"><a href="#' + docs[i] + '">' + name + '</a></h4>';

				var strong = '<strong class="highlight">' + name + '</strong>';
				docs[i+1] = docs[i+1].replace(new RegExp(name, 'g'), strong);
			}

			docs_code += '<article' + constructor_code + '>'
			         +  docs[i + 1]
			         +  '</article>';
		}

		return docs_code;
	}

	var _debounce = function(fn, delay) {
	  var timer = null;

	  return function () {
	    var context = this
	    var args    = arguments;

	    clearTimeout(timer);

	    timer = setTimeout(function () {
	      fn.apply(context, args);
	    }, delay);
	  };
	};

	var _generate_actions = function() {

		var code = '';
		var GITHUB_URL = '';
		var docs_active = !this.src_active ? ' active':'';
		var src_active = this.src_active ? ' active':'';

			code += '<a href="#" id="docs-button" class="button ico-api view' + docs_active + '" onclick="MAIN.trigger(\'toggle_source\', [false, event]); return false;">Docs View</a>';
			code += '<a href="#" id="source-button" class="button ico-glasses view' + src_active + '" onclick="MAIN.trigger(\'toggle_source\', [true, event]); return false;">Source View</a>';

			if (this.active_doc.buffer !== NO_DOCS) {

				GITHUB_URL = 'https://github.com/LazerUnicorns/lycheeJS/edit/development-0.9/lychee/api' + this.active_path + '.md';

				code += '<a class="button ico-edit edit" href="' + GITHUB_URL + '">Edit on Github</a>';

			}

		return code;
	}

	var _load_api = function(callback, scope) {
		this.pkg = new Config('/lychee/lychee.pkg');

		this.pkg.onload = function(result) {

			/**
			 * sort files alphabetically
			 */
			var sorted_files = {};
			Object.keys(scope.pkg.buffer.source.files).sort().forEach(function(key) {
				sorted_files[key] = scope.pkg.buffer.source.files[key];
			});
			scope.pkg.buffer.source.files = sorted_files;


			callback.call(scope, result);

		};

		this.pkg.load();
	};

	var _load_doc = function(cb) {


		if (_DOCS_CACHE[this.active_module]) {

			this.active_doc.buffer = _DOCS_CACHE[this.active_module];
			cb.call(this);

		} else {

			this.active_doc = new lychee.Asset('/lychee/api' + this.active_path + '.md', null);

			var that = this;

			this.active_doc.onload = function(result) {
				cb.call(that);
			};

			this.active_doc.load();

		}

	};

	var _load_src = function(cb) {

		// debugger

		if (_SRC_CACHE[this.active_module]) {

			this.active_src.buffer = _SRC_CACHE[this.active_module];
			cb.call(this);

		} else {


			this.active_src = new lychee.Asset('/lychee/source' + this.active_path + '.js', null, true);

			this.active_src.onload = function(result) {

				// ```js for the markdown parser
				this.active_src.buffer = '#' + this.active_module + '\n```js\n' + this.active_src.buffer + '\n```';

				cb.call(this);

			}.bind(this);

			this.active_src.load();

		}

	};

	var _parse_url = function() {

		var url = location.href.split('?');
		if (url.length > 1) {
			var params = url[1].split('#');
			var param = params[0].split('=');
			this.position = params.length > 1 ? params[1] : null;

			if (param.length > 1 && param[0] == 'module') {
				this.active_module = param[1];
				this.active_path = _module_to_path(param[1]);
			}

		}
	};

	var _render_tree = function(main) {


		// TODO: traverse simultaniaasulsy

		var code = '<ul>';

		Object.keys(this.source).forEach(function(key) {
			code += '<li>';

			var src_pointer = this.source[key];

			var api_pointer = null;
			if (this.__path.substring(0, 9) === '.platform' && Array.isArray(src_pointer)) {
				api_pointer = (main.pkg.buffer.api.files.core.hasOwnProperty(key)) ? main.pkg.buffer.api.files.core[key] : null;
			} else {
				api_pointer = (this.api && this.api.hasOwnProperty(key)) ? this.api[key] : null;
			}




			if (Array.isArray(src_pointer)) {


				/**
				 * calculate current path
				 * translate path, if we have a core or platform class
				 */

				var current_class = '';

				// special condition for core & platform classes
				if (this.__path.substring(0, 5) === '.core' || this.__path.substring(0, 9) === '.platform') {

					current_class = key;

				} else {

					current_class = 'lychee' + this.__path + '.' + key;

				}

				var current_path = this.__path.split('.').join('/') + '/' + key;




				var class_code = 'class="';
				var id = 'tree' + current_path.split('/').join('-');

				if (current_path === main.active_module) {
					class_code = ' class="active';
					main.active_tree_id = id;
				}

				if (api_pointer === null) {
					class_code += ' no-docs"';
				} else {
					class_code += '"'
				}



				code += '<a id="' + id + '" href="index.html?module=' + current_class + '" onclick="MAIN.trigger(\'open_doc\', [\'' + current_class + '\', event]); return false;"' + class_code + '>' + key + '</a>';


				if (src_pointer && src_pointer.hasOwnProperty('constructor') && src_pointer.hasOwnProperty('arguments')) {
					main.active_blob = src_pointer || null;
				}

				main.count(!!api_pointer);

			} else if (typeof src_pointer === 'object') {
				code += '<span>' + key + '</span>';

				var scope = {
					source: src_pointer,
					api: api_pointer,
					__path: this.__path + '.' + key
				};

				code += _render_tree.call(scope, main);
			}

			code += '</li>';
		}, this);

		code += '</ul>';

		return code;
	};

	var _render_doc = function() {

		if (this.active_doc.buffer !== 'File not found.') {

			_DOCS_CACHE[this.active_module] = this.active_doc.buffer;

			_render_markdown.call(this, this.active_doc.buffer);

		} else {

			this.active_doc.buffer = NO_DOCS;
			_DOCS_CACHE[this.active_module] = NO_DOCS;

			ui.render(_generate_actions.call(this) + NO_DOCS, '#docs');
		}

		var state = {
			active_module: this.active_module,
			active_path: this.active_path
		};

		history.pushState(state, this.active_module, "index.html?module=" + this.active_module);


		// disable the old tree element, enable the new
		_set_tree_active.call(this);

	}

	var _render_markdown = function(markdown_code) {
		marked.setOptions({
			highlight: function(code) {
				return hljs.highlightAuto(code).value;
			}
		});

		var docs = marked(markdown_code);

		/**
		 * Parse custom ={tags}
		 */
		var docs_code = _custom_parser.call(this, docs);

		ui.render(_generate_actions.call(this) + docs_code, '#docs');

		_DOCS_CACHE[this.active_module] = docs_code;

		setTimeout(function() {
			if (typeof this.position === 'string') {
				_scroll_to_id(this.position);
			}
		}.bind(this), 10);
	};

	var _scroll_to_id = function(id) {
		var element = document.getElementById(id);

		if (element) {
			element.scrollIntoView({
				block: 'start',
				behavior: 'smooth'
			});
		}
	};

	var _render_src = function() {

			_SRC_CACHE[this.active_module] = this.active_src.buffer;

			_render_markdown.call(this, this.active_src.buffer);

	}

	var _set_actions_active = function() {
		if (this.src_active) {
			document.getElementById('docs-button').classList.remove('active');
			document.getElementById('source-button').classList.add('active');
		} else {
			document.getElementById('docs-button').classList.add('active');
			document.getElementById('source-button').classList.remove('active');
		}
	}

	var _set_tree_active = function() {


		[].slice.call(document.querySelectorAll('#packages-tree a.active')).forEach(function(element) {
			element.classList.remove('active');
		});


		this.active_tree_id = 'tree' + this.active_path.split('/').join('-');

		var tree_element = document.getElementById(this.active_tree_id) || null;
		if (tree_element !== null) {
			tree_element.classList.add('active');
		}
	};

	var _module_to_path = function(input) {
		var output = input.split('.');
		if (output.length === 1) {
			var name = output[0];
			if (name.length > 0) {
				// if there is no lychee... package path, we have a core Class
				return '/core/' + name;
			} else {
				return null;
			}
		} else {
			if (output[0] === 'lychee') {
				output.shift();
				return '/' + output.join('/');
			} else {
				return null;
			}
		}
		return output;
	};


	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({

			client:    null,
			input:     null,
			jukebox:   null,
			renderer:  null,
			server:    null,

			viewport: {
				fullscreen: false
			}

		}, data);


		lychee.game.Main.call(this, settings);


		/*
		 * INITIALIZATION
		 */

		this.bind('init', function() {

			var mainArea = document.querySelector('#docs');
			var body = document.querySelector('body');

			mainArea.onscroll = _debounce(function(e) {
				if (mainArea.scrollTop > 0) {
					if (!body.classList.contains('scrolling')) {
						body.classList.add('scrolling');
					}
				} else {
					if (body.classList.contains('scrolling')) {
						body.classList.remove('scrolling');
					}
				}
				return e;
			}, 100);

			_parse_url.call(this);


			_load_api.call(this, function(result) {

				var dummy = {
					source: this.pkg.buffer.source.files,
					api: this.pkg.buffer.api.files,
					__path: ''
				};

				_render_content.call(this);

			}, this);

		}, this, true);

		this.bind('open_doc', function(name, event) {

			this.active_module         = name;
			this.active_path           = _module_to_path(this.active_module);

			_render_content.call(this);

			event.preventDefault();
			event.stopPropagation();
			return false;
		}, this);

		this.bind('toggle_source', function(new_state, event) {

			new_state = typeof new_state === 'boolean' ? new_state : false;


			if (new_state !== this.src_active) {
				// do sth
				if (new_state === false) {
					// render docs
					_render_doc.call(this);
				} else {
					// render source
					_render_src.call(this);
				}

			}

			this.src_active = new_state;

			_set_actions_active.call(this);

			event.preventDefault();
			event.stopPropagation();
			return false;
		}, this);



		window.onpopstate = function(event) {
			var state = event.state;
			var worked = false;

			if (state !== null) {
				this.active_module = state.active_module;
				this.active_path = state.active_path;
				worked = true;
			} else {
				var old_doc = document.location.href.split('?')[1].split('=')[1];
				if (_DOCS_CACHE[old_doc]) {
					worked = true;
					this.active_module = old_doc;
					this.active_path = _module_to_path(old_doc);
				}
			}

			if (worked) {

				_set_tree_active.call(this);

				ui.render(_generate_actions.call(this) + _DOCS_CACHE[this.active_module], '#docs');

			}


		}.bind(this);





	};


	Class.prototype = {
		count: function(val) {
			this.classes++;
			if (val) {
				this.documented_classes++;
			} else {
				this.undocumented_classes++;
			}
		}
	};


	return Class;

});
