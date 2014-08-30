
lychee.define('game.Logic').requires([
	'game.logic.Level'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, game, global, attachments) {

	/*
	 * HELPERS
	 */

	var _enter = function() {

		var state = this.state;
		var level = this.level;
		var layer = null;


		if (state !== null && level !== null) {

			layer = state.queryLayer('game', 'terrain');

			if (layer !== null) {

				layer.width  = level.width;
				layer.height = level.height;

				for (var t = 0, tl = level.terrain.length; t < tl; t++) {
					layer.addEntity(level.terrain[t]);
				}

			}


			layer = state.queryLayer('game', 'objects');

			if (layer !== null) {

				layer.width  = level.width;
				layer.height = level.height;

				for (var o = 0, ol = level.objects.length; o < ol; o++) {
					layer.addEntity(level.objects[o]);
				}

			}


			for (var b = 0, bl = level.blitzes.length; b < bl; b++) {
				this.__blitzes.push(level.blitzes[b]);
			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.state = null;
		this.level = null;

		this.__blitzes = [];


		lychee.event.Emitter.call(this);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('select', function(entity, position) {

// TODO: game.entity.Tank, game.entity.Tower

console.log('SELECT', entity, position);

		}, this);

	};


	Class.prototype = {

		/*
		 * STATE API
		 */

		update: function(clock, delta) {
		},

		enter: function(state, level) {

			state = lychee.interfaceof(lychee.game.State, state) ? state : null;
			level = level instanceof game.logic.Level            ? level : null;


			if (state !== null && level !== null) {

				this.state = state;
				this.level = level;

				_enter.call(this);

				return true;

			}


			return false;

		},

		leave: function() {

// TODO: leave() should cleanup all layers in State

		}

	};


	return Class;

});

