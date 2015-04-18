
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

	var _on_changestate = function(main) {

		var input = main.input;
		if (input !== null) {

			var touch_events = input.___events.touch.splice(0);
			var swipe_events = input.___events.swipe.splice(0);

			input.___events.touch = [];
			input.___events.swipe = [];


			input.bind('touch', function(id, position, delta) {

				switch (this.mode) {

					case 'live':

						touch_events.forEach(function(event) {
							event.callback.call(event.scope, id, position, delta);
						});

					break;

					case 'edit':

// TODO: Place current layer/entity at current position

					break;

				}

			}, this);

			input.bind('swipe', function(id, type, position, delta, swipe) {

				switch (this.mode) {

					case 'live':

						swipe_events.forEach(function(event) {
							event.callback.call(event.scope, id, type, position, delta, swipe);
						});

					break;

					case 'edit':

// TODO: Move current layer/entity across current swipe

					break;

				}

			}, this);

		}

	};

	var _initialize = function(identifier, callback, scope) {

		var that        = this;
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

			var lychee = sandbox.lychee;
			var game   = sandbox.game;


			// This allows using #MAIN in JSON files
			game.Main.prototype.changeState = function(id) {
				sandbox.lychee.game.Main.prototype.changeState.call(this, id);
				_on_changestate.call(that, this);
			};

			sandbox.MAIN = new game.Main();
			sandbox.MAIN.init();


			setTimeout(function() {

				var _canvas  = document.querySelector('#' + identifier);
				var _wrapper = document.querySelector('#scene-preview-wrapper');

				if (_canvas !== null && _wrapper !== null) {
					_canvas.parentNode.removeChild(_canvas);
					_wrapper.appendChild(_canvas);
				}

			   	callback.call(scope, environment);

			}, 100);

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


		this.mode = 'edit';
		this.mode = 'live';


		lychee.game.Main.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('load', function(oncomplete) {
			oncomplete(true);
		}, this, true);

		this.bind('init', function() {

			this.setState('scene', new tool.state.Scene(this));


			_initialize.call(this, 'boilerplate', function(environment) {

				ui.changeState('scene', environment);

global._ENV = environment;

				// XXX: Wait for transition to complete until we dispatch
				setTimeout(function() {

					var sandbox = this;
					var width   = ((window.innerWidth - (16 + 3 * 64)) * 3) / 4; // don't touch this
					var height  = 768;

					sandbox.MAIN.settings.renderer.width  = width;
					sandbox.MAIN.settings.renderer.height = height;
					sandbox.MAIN.renderer.setWidth(width);
					sandbox.MAIN.renderer.setHeight(height);

					sandbox.MAIN.viewport.trigger('reshape', [
						sandbox.MAIN.viewport.orientation,
						sandbox.MAIN.viewport.rotation
					]);

				}.bind(environment.global), 500);

			}, this);

		}, this, true);

	};


	Class.prototype = {

	};


	return Class;

});
