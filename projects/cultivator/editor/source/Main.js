
lychee.define('tool.Main').requires([
	'lychee.data.JSON',
	'tool.state.Scene'
]).includes([
	'lychee.game.Main'
]).tags({
	platform: 'html'
}).exports(function(lychee, tool, global, attachments) {

	var _JSON = lychee.data.JSON;

	/*
	 * HACKS
	 */

	(function(global) {

		if (typeof global.addEventListener !== 'undefined') {

			global.addEventListener('click', function(event) {

				var target = event.target;
				if (target.tagName === 'A' && target.href.match(/lycheejs:\/\//g)) {

					setTimeout(function() {

						var main = global.MAIN || null;
						if (main !== null) {
							main.loop.trigger('update', []);
						}

					}, 200);

				}

			}, true);

		}

	})(global);



	/*
	 * HELPERS
	 */

	var _initialize = function(identifier, callback, scope) {

		var environment = new lychee.Environment({
			id:      identifier,
			debug:   true,
			sandbox: true,
			build:   'game.Main',
			packages: [
				new lychee.Package('game', '/projects/' + identifier + '/lychee.pkg')
			],
			tags:     {
				platform: [ 'html' ]
			}
		});


		Object.values(lychee.environment.definitions).filter(function(definition) {
			return definition.id.substr(0, 6) === 'lychee';
		}).forEach(function(definition) {
			environment.define(definition);
		});


		lychee.setEnvironment(environment);

		lychee.init(function(sandbox) {

			lychee.setEnvironment(null);


			var lychee = sandbox.lychee;
			var game   = sandbox.game;


			// This allows using #MAIN in JSON files
			sandbox.MAIN = new game.Main();
			sandbox.MAIN.init();


			var _canvas = document.querySelector('#' + identifier);
			if (_canvas !== null) {
				_canvas.parentNode.removeChild(_canvas);
			}

			var _wrapper = document.querySelector('#scene-preview-wrapper');
			if (_wrapper !== null) {
				_wrapper.appendChild(_canvas);
			}


			callback.call(scope, environment);

		});

	};

	var _load_api = function(callback, scope) {

		var config = new Config('http://localhost:4848/api/Editor?timestamp=' + Date.now());

		config.onload = function(result) {
			callback.call(scope, this.buffer);
		};

		config.load();

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({

			client:   null,
			input:    null,
			jukebox:  null,
			renderer: null,
			server:   null,

			loop: {
				update: 1/10,
				render: 0
			},

			viewport: {
				fullscreen: false
			}

		}, data);


		lychee.game.Main.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('load', function(oncomplete) {
			oncomplete(true);
		}, this, true);

		this.bind('init', function() {

			this.setState('scene', new tool.state.Scene(this));


			_initialize('boilerplate', function(environment) {

				ui.changeState('scene', environment);

console.log(environment);

			}, this);

		}, this, true);

	};


	Class.prototype = {

	};


	return Class;

});
