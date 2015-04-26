
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

	var _load_api = function(callback, scope) {

		console.log('calling docs with ', this.activeDoc);
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

			if (currentPath === main.activeDoc) {

				code += '<a onclick="window.open(\'' + this.__path + key + '\')" class="active">' + key + '</a>';

				if (pointer && pointer.hasOwnProperty('constructor') && pointer.hasOwnProperty('arguments')) {
					main.activeBlob = pointer;
				}
			} else if (pointer === null || (pointer.hasOwnProperty('constructor') || pointer.hasOwnProperty('arguments'))) {
				code += '<a onclick="window.open(\'?module=' + currentPath + '\', \'_self\')">' + key + '</a>';

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

		this.activeBlob = null;
		this.activeDoc  = "/lychee/source/core/Asset";
		this.config     = null;

		/*
		 * INITIALIZATION
		 */

		this.bind('init', function() {

			_parse_url.call(this);

			_load_api.call(this, function(result) {

				if (result) {

					// initial value for recursion
					this.config.buffer.__path = '';

					var code = _render.call(this.config.buffer, this);
					ui.render(code, '#packages-tree');


					var docs = '';

					if (this.activeBlob !== null) {
						var markdownCode = lychee.deserialize(this.activeBlob).toString();

						marked.setOptions({
							highlight: function(code) {
								return hljs.highlightAuto(code).value;
							}
						});

						docs = marked(markdownCode);
					} else {
						docs = '<h1>This class currently has no docs :(</h1>';
					}

					ui.render(docs, '#docs');
				}
			}, this);

		}, this, true);

		this.bind('submit', function(id, settings) {


		}, this);

	};


	Class.prototype = {

	};


	return Class;

});
