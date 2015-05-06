
lychee.define('tool.Main').requires([
	'lychee.data.JSON'
]).includes([
	'lychee.game.Main'
]).tags({
	platform: 'html'
}).exports(function(lychee, tool, global, attachments) {

	var _JSON = lychee.data.JSON;
	var LYCHEE_SRC = '/lychee/source';
	var _CACHE = {};
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
		if (this.active_blob !== null) {

			var GITHUB_URL = 'https://github.com/LazerUnicorns/lycheeJS/edit/development-0.9/lychee/api/';
			// TODO
			// var suffix = this.active_module.split('/source/')[1];

			// code += '<a href="#" class="button ico-docs view active">Docs View</a>';
			// code += '<a href="#" class="button ico-glasses view">Source View</a>';
			// code += '<a class="button ico-edit edit" href="' + GITHUB_URL + suffix + '.md">Edit on Github</a>';

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

	var _load_doc = function() {

		// disable the old tree element, enable the new
		_set_tree_active.call(this);

		if (_CACHE[this.active_module]) {

			ui.render(_generate_actions.call(this) + _CACHE[this.active_module], '#docs');

			var state = {
				active_module: this.active_module,
				active_path:   _module_to_path(this.active_module)
			};

			history.pushState(state, this.active_module, "index.html?module=" + this.active_module);

		} else {

			this.active_doc = new Stuff('/lychee/api' + this.active_path + '.md');

			this.active_doc.onload = function(result) {

				if (this.active_doc.buffer) {

					_render_markdown.call(this, this.active_doc.buffer);

				} else {
					_CACHE[this.active_module] = NO_DOCS;
					ui.render(_generate_actions.call(this) + NO_DOCS, '#docs');
				}

				var state = {
					active_module: this.active_module,
					active_path: this.active_path
				};

				history.pushState(state, this.active_module, "index.html?module=" + this.active_module);

			}.bind(this);

			this.active_doc.load();

		}



		window.onpopstate = function(event) {
			var state = event.state;
			var worked = false;

			if (state !== null) {
				this.active_module = state.active_module;
				this.active_module = state.active_module;
				worked = true;
			} else {
				var old_doc = document.location.href.split('?')[1].split('=')[1];
				if (_CACHE[old_doc]) {
					worked = true;
					this.active_module = old_doc;
					this.active_module = old_doc.split('/').pop();
				}
			}

			if (worked) {

				_set_tree_active.call(this);

				ui.render(_generate_actions.call(this) + _CACHE[this.active_module], '#docs');

			}


		}.bind(this);

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

				var current_path = LYCHEE_SRC + this.__path + '/' + key;




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



				code += '<a id="' + id + '" href="index.html?module=' + current_class + '" onclick="MAIN.trigger(\'open_doc\', [\'' + current_path + '\', event]); return false;"' + class_code + '>' + key + '</a>';


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

		_CACHE[this.active_module] = docs_code;

		setTimeout(function() {
			if (typeof this.position === 'string') {
				_scroll_to_id(this.position);
			}
		}.bind(this), 10);
	};

	var _render_score = function() {
		var code = ''
						+ '<span id="num-documented">' + this.documented_classes + '</span>'
						+ '/'
						+ '<span id="num-total">' + this.classes + '</span>'
						+ ' classes documented';

		ui.render(code, "#score");
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

	var _set_tree_active = function() {
		[].slice.call(document.querySelectorAll('#packages-tree a.active')).forEach(function(element) {
			element.classList.remove('active');
		});


		this.active_tree_id = 'tree-lychee-api' + this.active_path.split('/').join('-');
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
	}

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

		this.active_doc           = null;
		this.active_module         = "Asset";
		this.active_path           = _module_to_path(this.active_module);
		this.config                = null;
		this.classes               = 0;
		this.documented_classes    = 0;
		this.position              = null;
		this.undocumented_classes  = 0;
		this.active_tree_id        = null;

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

				var tree = _render_tree.call(dummy, this);

				ui.render(tree, '#packages-tree');

				_render_score.call(this);

				_load_doc.call(this);

				// if (result) {

				// 	// initial value for recursion



				// 	if (this.active_blob !== null) {
				// 		var markdown_code = lychee.deserialize(this.active_blob).toString();

				// 		if (marked) {
				// 			_render_markdown.call(this, markdown_code);
				// 		} else {
				// 			// if the markdown parser `marked` hasn't loaded yet
				// 			setTimeout(_render_markdown.bind(this, markdown_code), 500);
				// 		}

				// 	} else {
				// 		_CACHE[this.active_module] = NO_DOCS;
				// 		ui.render(_generate_actions.call(this) + NO_DOCS, '#docs');
				// 	}

				// }
			}, this);

		}, this, true);

		this.bind('open_doc', function(name, event) {

			this.active_module         = name;
			this.active_path           = _module_to_path(this.active_module);

			_load_doc.call(this);

			event.preventDefault();
			event.stopPropagation();
			return false;
		}, this);

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
