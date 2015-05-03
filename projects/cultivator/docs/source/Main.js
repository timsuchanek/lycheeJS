
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

			var suffix = this.active_doc.split('/source/')[1];

			code += '<a href="#" class="button ico-docs view active">Docs View</a>';
			code += '<a href="#" class="button ico-glasses view">Source View</a>';
			code += '<a class="button ico-edit edit" href="' + GITHUB_URL + suffix + '.md">Edit on Github</a>';

		}

		return code;
	}

	var _initial_api = function(callback, scope) {

		this.config = new Config('http://localhost:4848/api/Docs?module=' + this.active_doc);

		this.config.onload = function(result) {
			result.__path = '/';
			callback.call(scope, result);
		};

		this.config.load();
	};

	var _open_doc = function(_module, event) {
		if (typeof _module !== 'string' || _module === this.active_doc) return;

		this.active_doc    = _module;
		this.active_module = _module.split('/').pop();


		// disable the old tree element, enable the new
		_set_tree_active.call(this, _module);

		if (_CACHE[this.active_doc]) {

			ui.render(_generate_actions.call(this) + _CACHE[this.active_doc], '#docs');

			var state = {
				active_doc: this.active_doc,
				active_module: this.active_module
			};

			history.pushState(state, this.active_module, "index.html?module=" + this.active_doc);

		} else {
			this.config = new Config('http://localhost:4848/api/Docs?module=' + this.active_doc + '&docsonly');

			this.config.onload = function(result) {

				this.active_blob = this.config.buffer.doc;

				if (this.active_blob) {

					var markdown_code = lychee.deserialize(this.active_blob).toString();
					_render_markdown.call(this, markdown_code);

				} else {
					_CACHE[this.active_doc] = NO_DOCS;
					ui.render(_generate_actions.call(this) + NO_DOCS, '#docs');
				}

				var state = {
					active_doc: this.active_doc,
					active_module: this.active_module
				};

				history.pushState(state, this.active_module, "index.html?module=" + this.active_doc);

			}.bind(this);

			this.config.load();

		}



		window.onpopstate = function(event) {
			var state = event.state;
			var worked = false;

			if (state !== null) {
				this.active_module = state.active_module;
				this.active_doc = state.active_doc;
				worked = true;
			} else {
				var old_doc = document.location.href.split('?')[1].split('=')[1];
				if (_CACHE[old_doc]) {
					worked = true;
					this.active_doc = old_doc;
					this.active_module = old_doc.split('/').pop();
				}
			}

			if (worked) {

				_set_tree_active.call(this, this.active_doc);

				ui.render(_generate_actions.call(this) + _CACHE[this.active_doc], '#docs');

			}


		}.bind(this);

		event.preventDefault();
		event.stopPropagation();

		return false;
	};

	var _parse_url = function() {

		var url = location.href.split('?');
		if (url.length > 1) {
			var params = url[1].split('#');
			var param = params[0].split('=');
			this.position = params.length > 1 ? params[1] : null;

			if (param.length > 1 && param[0] == 'module') {
				this.active_doc = param[1];
				this.active_module = param[1].split('/').pop();
			}

		}
	};

	var _render_tree = function(main) {
		var code = '<ul>';

		Object.keys(this).forEach(function(key) {
			code += '<li>';

			var pointer = this[key];
			var current_path = LYCHEE_SRC + this.__path + '/' + key;


			if (typeof pointer === 'boolean' || (pointer.hasOwnProperty('constructor') || pointer.hasOwnProperty('arguments'))) {

				var class_code = 'class="';
				var id = 'tree' + current_path.split('/').join('-');

				if (current_path === main.active_doc) {
					class_code = ' class="active';
					main.active_tree_id = id;
				}

				if (pointer === false) {
					class_code += ' no-docs"';
				} else {
					class_code += '"'
				}


				code += '<a id="' + id + '" href="index.html?module=' + current_path + '" onclick="MAIN.trigger(\'open_doc\', [\'' + current_path + '\', event]); return false;"' + class_code + '>' + key + '</a>';


				if (pointer && pointer.hasOwnProperty('constructor') && pointer.hasOwnProperty('arguments')) {
					main.active_blob = pointer || null;
				}

				main.count(!!pointer);

			} else if (typeof pointer === 'object') {
				code += '<span>' + key + '</span>';

				pointer.__path = this.__path + '/' + key;
				code += _render_tree.call(pointer, main);
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

		_CACHE[this.active_doc] = docs_code;

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

	var _set_tree_active = function(_module) {


		[].slice.call(document.querySelectorAll('#packages-tree a.active')).forEach(function(element) {
			element.classList.remove('active');
		});

		this.active_tree_id = 'tree' + _module.split('/').join('-');
		var tree_element = document.getElementById(this.active_tree_id);
		tree_element.classList.add('active');

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

		this.active_blob           = null;
		this.active_doc            = "/lychee/source/core/Asset";
		this.active_module         = 'Asset';
		this.config               = null;
		this.classes              = 0;
		this.documented_classes    = 0;
		this.position             = null;
		this.undocumented_classes  = 0;
		this.active_tree_id    = null;

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

			_initial_api.call(this, function(result) {

				if (result) {

					// initial value for recursion
					this.config.buffer.__path = '';

					var code = _render_tree.call(this.config.buffer, this);

					ui.render(code, '#packages-tree');

					_render_score.call(this);


					if (this.active_blob !== null) {
						var markdown_code = lychee.deserialize(this.active_blob).toString();

						if (marked) {
							_render_markdown.call(this, markdown_code);
						} else {
							// if the markdown parser `marked` hasn't loaded yet
							setTimeout(_render_markdown.bind(this, markdown_code), 500);
						}

					} else {
						_CACHE[this.active_doc] = NO_DOCS;
						ui.render(_generate_actions.call(this) + NO_DOCS, '#docs');
					}

				}
			}, this);

		}, this, true);

		this.bind('open_doc', _open_doc, this);

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
