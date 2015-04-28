
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
		var docsCode = docs[0];

		var enumSeen         = false;
		var eventSeen        = false;
		var methodSeen       = false;
		var propertySeen     = false;


		for (var i = 1; i < docs.length; i += 2) {

			var constructorCode  = '';

			if (docs[i] === 'constructor') {

				var strong = '<strong class="highlight">' + this.activeModule + '</strong>';
				docs[i+1] = docs[i+1].replace(new RegExp(this.activeModule, 'g'), strong);
				constructorCode = ' id="' + docs[i] + '"';

			} else if (docs[i].substring(0, 5) === 'enums') {
				if (!enumSeen) {
					enumSeen = true;
					docsCode += '<h2>Enums</h2>'
				}

				var enumName = docs[i].split('-')[1];

				docsCode += '<h4 id="' + docs[i] + '"><a href="#' + docs[i] + '">' + enumName + '</a></h4>';

				var strong = '<strong class="highlight">' + enumName + '</strong>';
				docs[i+1] = docs[i+1].replace(new RegExp(enumName, 'g'), strong);

			} else if (docs[i].substring(0, 6) === 'events') {
				if (!eventSeen) {
					eventSeen = true;
					docsCode += '<h2>Events</h2>'
				}

				var eventName = docs[i].split('-')[1];

				docsCode += '<h4 id="' + docs[i] + '"><a href="#' + docs[i] + '">' + eventName + '</a></h4>';

				var strong = '<strong class="highlight">' + eventName + '</strong>';
				docs[i+1] = docs[i+1].replace(new RegExp(eventName, 'g'), strong);

			} else if (docs[i].substring(0, 10) === 'properties') {
				if (!propertySeen) {
					propertySeen = true;
					docsCode += '<h2>Properties</h2>'
				}

				var propertyName = docs[i].split('-')[1];

				docsCode += '<h4 id="' + docs[i] + '"><a href="#' + docs[i] + '">' + propertyName + '</a></h4>';

				var strong = '<strong class="highlight">' + propertyName + '</strong>';
				docs[i+1] = docs[i+1].replace(new RegExp(propertyName, 'g'), strong);

			} else if (docs[i].substring(0, 7) === 'methods') {
				if (!methodSeen) {
					methodSeen = true;
					docsCode += '<h2>Methods</h2>'
				}

				var methodName = docs[i].split('-')[1];

				docsCode += '<h4 id="' + docs[i] + '"><a href="#' + docs[i] + '">' + methodName + '</a></h4>';

				var strong = '<strong class="highlight">' + methodName + '</strong>';
				docs[i+1] = docs[i+1].replace(new RegExp(methodName, 'g'), strong);
			}

			docsCode += '<article' + constructorCode + '>'
			         +  docs[i + 1]
			         +  '</article>';
		}

		return docsCode;
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
		if (this.activeBlob !== null) {

			var GITHUB_URL = 'https://github.com/LazerUnicorns/lycheeJS/edit/development-0.9/lychee/api/';

			var suffix = this.activeDoc.split('/source/')[1];

			code = '<a class="edit" href="' + GITHUB_URL + suffix + '.md">Edit on Github</a>';

		}

		return code;
	}

	var _initial_api = function(callback, scope) {

		this.config = new Config('http://localhost:4848/api/Docs?module=' + this.activeDoc);

		this.config.onload = function(result) {
			result.__path = '/';
			callback.call(scope, result);
		};

		this.config.load();
	};

	var _open_doc = function(_module, event) {
		if (typeof _module !== 'string' || _module === this.activeDoc) return;

		this.activeDoc    = _module;
		this.activeModule = _module.split('/').pop();


		// disable the old tree element, enable the new
		_set_tree_active.call(this, _module);

		if (_CACHE[this.activeDoc]) {

			ui.render(_generate_actions.call(this) + _CACHE[this.activeDoc], '#docs');

			var state = {
				activeDoc: this.activeDoc,
				activeModule: this.activeModule
			};

			history.pushState(state, this.activeModule, "index.html?module=" + this.activeDoc);

		} else {
			this.config = new Config('http://localhost:4848/api/Docs?module=' + this.activeDoc + '&docsonly');

			this.config.onload = function(result) {

				this.activeBlob = this.config.buffer.doc;

				if (this.activeBlob) {

					var markdownCode = lychee.deserialize(this.activeBlob).toString();
					_render_markdown.call(this, markdownCode);

				} else {
					_CACHE[this.activeDoc] = NO_DOCS;
					ui.render(_generate_actions.call(this) + NO_DOCS, '#docs');
				}

				var state = {
					activeDoc: this.activeDoc,
					activeModule: this.activeModule
				};
				console.log('pushing state', state);
				history.pushState(state, this.activeModule, "index.html?module=" + this.activeDoc);

			}.bind(this);

			this.config.load();

		}



		window.onpopstate = function(stateEvent) {
			var state = stateEvent.state;
			var worked = false;

			if (state !== null) {
				this.activeModule = state.activeModule;
				this.activeDoc = state.activeDoc;
				worked = true;
			} else {
				var oldDoc = document.location.href.split('?')[1].split('=')[1];
				if (_CACHE[oldDoc]) {
					worked = true;
					this.activeDoc = oldDoc;
					this.activeModule = oldDoc.split('/').pop();
					console.log('paarrssse', this.activeDoc, this.activeModule);
				}
			}

			if (worked) {

				_set_tree_active.call(this, this.activeDoc);

				ui.render(_generate_actions.call(this) + _CACHE[this.activeDoc], '#docs');

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
				this.activeDoc = param[1];
				this.activeModule = param[1].split('/').pop();
			}

		}
	};

	var _render_tree = function(main) {
		var code = '<ul>';

		Object.keys(this).forEach(function(key) {
			code += '<li>';

			var pointer = this[key];
			var currentPath = LYCHEE_SRC + this.__path + '/' + key;


			if (typeof pointer === 'boolean' || (pointer.hasOwnProperty('constructor') || pointer.hasOwnProperty('arguments'))) {

				var classCode = 'class="';
				var id = 'tree' + currentPath.split('/').join('-');

				if (currentPath === main.activeDoc) {
					classCode = ' class="active';
					main.activeTreeId = id;
				}

				if (pointer === false) {
					classCode += ' no-docs"';
				} else {
					classCode += '"'
				}


				code += '<a id="' + id + '" href="index.html?module=' + currentPath + '" onclick="MAIN.trigger(\'open_doc\', [\'' + currentPath + '\', event]); return false;"' + classCode + '>' + key + '</a>';


				if (pointer && pointer.hasOwnProperty('constructor') && pointer.hasOwnProperty('arguments')) {
					main.activeBlob = pointer || null;
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


	var _render_markdown = function(markdownCode) {
		marked.setOptions({
			highlight: function(code) {
				return hljs.highlightAuto(code).value;
			}
		});

		var docs = marked(markdownCode);

		/**
		 * Parse custom ={tags}
		 */
		var docsCode = _custom_parser.call(this, docs);

		ui.render(_generate_actions.call(this) + docsCode, '#docs');

		_CACHE[this.activeDoc] = docsCode;

		setTimeout(function() {
			if (typeof this.position === 'string') {
				_scroll_to_id(this.position);
			}
		}.bind(this), 10);

	};

	var _render_score = function() {
		var code = ''
						+ '<span id="num-documented">' + this.documentedClasses + '</span>'
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

		console.log('call on me');

		[].slice.call(document.querySelectorAll('#packages-tree a.active')).forEach(function(element) {
			console.log('removin it', element);
			element.classList.remove('active');
			console.log('yeah, removed it', element);
		});

		this.activeTreeId = 'tree' + _module.split('/').join('-');
		treeElement = document.getElementById(this.activeTreeId);
		treeElement.classList.add('active');

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

		this.activeBlob           = null;
		this.activeDoc            = "/lychee/source/core/Asset";
		this.activeModule         = 'Asset';
		this.config               = null;
		this.classes              = 0;
		this.documentedClasses    = 0;
		this.position             = null;
		this.undocumentedClasses  = 0;
		this.activeTreeId    = null;

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


					if (this.activeBlob !== null) {
						var markdownCode = lychee.deserialize(this.activeBlob).toString();

						if (marked) {
							_render_markdown.call(this, markdownCode);
						} else {
							// if the markdown parser `marked` hasn't loaded yet
							setTimeout(_render_markdown.bind(this, markdownCode), 500);
						}

					} else {
						_CACHE[this.activeDoc] = NO_DOCS;
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
				this.documentedClasses++;
			} else {
				this.undocumentedClasses++;
			}
		}
	};


	return Class;

});
