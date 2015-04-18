
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

	var _trace_entity = function(position) {

		var pos = {
			x: position.x - this.offset.x,
			y: position.y - this.offset.y
		};


		var entity = this.getEntity(null, pos);
		if (entity !== null) {

			if (typeof entity.getEntity === 'function') {

				var result = _trace_entity.call(entity, {
					x: pos.x - entity.position.x,
					y: pos.y - entity.position.y
				});

				if (result !== null) {
					return result;
				}

			}


			return entity;

		}


		return null;

	};

	var _on_changestate = function(main) {

		var input = main.input;
		if (input !== null) {

			var touch_events = input.___events.touch.splice(0);
			var swipe_events = input.___events.swipe.splice(0);

			input.___events.touch = [];
			input.___events.swipe = [];


			input.setTouch(true);
			input.setSwipe(true);


			input.bind('touch', function(id, position, delta) {

				switch (this.mode) {

					case 'play':

						touch_events.forEach(function(event) {
							event.callback.call(event.scope, id, position, delta);
						});

					break;

					case 'modify':

						var found = null;
						var pos   = {
							x: position.x - main.renderer.offset.x - main.renderer.width  / 2,
							y: position.y - main.renderer.offset.y - main.renderer.height / 2
						};


						Object.values(main.state.__layers).reverse().forEach(function(layer) {

							var entity = _trace_entity.call(layer, pos);
							if (found === null) {
								found = entity;
							}

						});

						this.entity = found;

						var state = this.state;
						if (state !== null) {
							state.trigger('entity', [ this.entity ]);
						}

					break;

					case 'create':

// TODO: Place current layer/entity at current position

					break;

				}

			}, this);

			input.bind('swipe', function(id, type, position, delta, swipe) {

				switch (this.mode) {

					case 'play':

						swipe_events.forEach(function(event) {
							event.callback.call(event.scope, id, type, position, delta, swipe);
						});

					break;

					case 'modify':

						var pos = {
							x: position.x - main.renderer.offset.x - main.renderer.width  / 2,
							y: position.y - main.renderer.offset.y - main.renderer.height / 2
						};


						var entity = this.entity;
						if (entity !== null) {

							entity.setPosition({
								x: pos.x,
								y: pos.y
							});

						}

					break;

					case 'create':

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


		this.entity   = null;
		this.mode     = 'play';
		this.template = null;


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

		this.bind('mode', function(mode) {

			this.mode   = mode;
			this.entity = null;

			var state = this.state;
			if (state !== null) {
				state.trigger('entity', [ this.entity ]);
			}

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});
