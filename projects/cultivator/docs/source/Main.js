
lychee.define('tool.Main').requires([
	'lychee.data.JSON'
]).includes([
	'lychee.game.Main'
]).tags({
	platform: 'html'
}).exports(function(lychee, tool, global, attachments) {

	var _JSON = lychee.data.JSON;
	var LYCHEE_SRC = '/lychee/source';


	/*
	 * HELPERS
	 */

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

	var _load_api = function(callback, scope) {

		this.config = new Config('http://localhost:4848/api/Docs?module=' + this.activeDoc);

		this.config.onload = function(result) {
			result.__path = '/';
			callback.call(scope, result);
		};

		this.config.load();

	};

	var _render = function(main) {
		var code = '<ul>';

		Object.keys(this).forEach(function(key) {
			code += '<li>';

			var pointer = this[key];
			var currentPath = LYCHEE_SRC + this.__path + '/' + key;


			if (typeof pointer === 'boolean' || (pointer.hasOwnProperty('constructor') || pointer.hasOwnProperty('arguments'))) {

				var classCode = currentPath === main.activeDoc ? ' class="active': 'class="';

				if (pointer === false) {
					classCode += ' no-docs"';
				} else {
					classCode += '"'
				}

				code += '<a onclick="window.open(\'?module=' + currentPath + '\', \'_self\')"' + classCode + '>' + key + '</a>';


				if (pointer && pointer.hasOwnProperty('constructor') && pointer.hasOwnProperty('arguments')) {
					main.activeBlob = pointer || null;
				}

				main.count(!!pointer);

			} else if (typeof pointer === 'object') {
				code += '<span>' + key + '</span>';

				pointer.__path = this.__path + '/' + key;
				code += _render.call(pointer, main);
			}

			code += '</li>';
		}, this);

		code += '</ul>';

		return code;
	};

	var _render_score = function() {
		var code = ''
						+ '<span id="num-documented">' + this.documentedClasses + '</span>'
						+ '/'
						+ '<span id="num-total">' + this.classes + '</span>'
						+ ' classes documented';

		ui.render(code, "#score");
	}

	var _parse_url = function() {
		var url = location.href.split('?');
		if (url.length > 1) {
			var param = url[1].split('=');
			if (param.length > 1 && param[0] == 'module') {
				this.activeDoc = param[1];
			}
		}
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

		this.activeBlob 					= null;
		this.activeDoc  					= "/lychee/source/core/Asset";
		this.config     					= null;
		this.classes    					= 0;
		this.documentedClasses    = 0;
		this.undocumentedClasses  = 0;

		/*
		 * INITIALIZATION
		 */

		this.bind('init', function() {

			var mainArea = document.querySelector('section.active');
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
			}, 100);

			_parse_url.call(this);

			_load_api.call(this, function(result) {

				if (result) {

					// initial value for recursion
					this.config.buffer.__path = '';

					var code = _render.call(this.config.buffer, this);

					ui.render(code, '#packages-tree');

					_render_score.call(this);


					if (this.activeBlob !== null) {
						var markdownCode = lychee.deserialize(this.activeBlob).toString();

						function _renderMarkdown() {
							marked.setOptions({
								highlight: function(code) {
									return hljs.highlightAuto(code).value;
								}
							});

							var docs = marked(markdownCode);

							/**
							 * Parse custom ={tags} into articles
							 */

							docs = docs.split(/=\{(.*)\}/);
							var docsCode = docs[0];

							var constructorSeen  = false;
							var propertySeen     = false;
							var methodSeen       = false;

							for (var i = 1; i < docs.length; i += 2) {

								if (docs[i] === 'constructor') {
									if (!constructorSeen) {
										constructorSeen = true;
										docsCode += '<h2>Constructor</h2>';
									}
								} else if (docs[i].substring(0, 10) === 'properties') {
									if (!propertySeen) {
										propertySeen = true;
										docsCode += '<h2>Properties</h2>'
									}

									var propertyName = docs[i].split('-')[1];

									docsCode += '<h4>' + propertyName + '</h4>';

									var strong = '<strong class="highlight">' + propertyName + '</strong>';
									docs[i+1] = docs[i+1].replace(new RegExp(propertyName, 'g'), strong);

								} else if (docs[i].substring(0, 7) === 'methods') {
									if (!methodSeen) {
										methodSeen = true;
										docsCode += '<h2>Methods</h2>'
									}

									var methodName = docs[i].split('-')[1];

									docsCode += '<h4>' + methodName + '</h4>';

									var strong = '<strong class="highlight">' + methodName + '</strong>';
									docs[i+1] = docs[i+1].replace(new RegExp(methodName, 'g'), strong);
								}

								docsCode += '<article class="' + docs[i] + '">'
								         +  docs[i + 1]
								         +  '</article>';
							}

							ui.render(docsCode, '#docs');

						}

						if (marked) {
							_renderMarkdown(code);
						} else {
							setTimeout(_renderMarkdown.bind(this, code), 500);
						}

					} else {
						var docs = '<h1>This class currently has no docs :(</h1>';

						ui.render(docs, '#docs');
					}

				}
			}, this);

		}, this, true);

		this.bind('submit', function(id, settings) {


		}, this);

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
