
lychee.define('game.state.Game').requires([
	'lychee.game.Layer',
	'game.data.Level',
	'game.Controller'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, game, global, attachments) {

	var _blob   = attachments["json"].buffer;
	var _LEVELS = attachments["levels.json"].buffer;



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.game.State.call(this, main);


		this.controller = new game.Controller({
			type: game.Controller.TYPE.client
		});


		this.deserialize(_blob);



		/*
		 * INITIALIZATION
		 */

		var viewport = this.viewport;
		if (viewport !== null) {

			viewport.bind('reshape', function(orientation, rotation) {

				var renderer = this.renderer;
				if (renderer !== null) {

					var entity = null;
					var width  = renderer.width;
					var height = renderer.height;


					entity = this.getLayer('game');
					entity.offset.x = -1/2 * width;
					entity.offset.y = -1/2 * height;

				}

			}, this);

		}

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.game.State.prototype.serialize.call(this);
			data['constructor'] = 'game.state.Game';


			return data;

		},

		deserialize: function(blob) {

			lychee.game.State.prototype.deserialize.call(this, blob);


			var entity = null;



			/*
			 * HELP LAYER
			 */

		},



		/*
		 * CUSTOM API
		 */

		update: function(clock, delta) {

			lychee.game.State.prototype.update.call(this, clock, delta);

		},

		enter: function(data) {

			data = data instanceof Object ? data : { level: 'intro' };


			var level = game.data.Level.decode(_LEVELS[data.level] || null) || null;
			if (level !== null) {


				level.objects.sort(function(a, b) {

					var atank = a instanceof game.entity.Tank;
					var btank = b instanceof game.entity.Tank;

					if (!atank && btank) return -1;
					if (atank && !btank) return  1;
					return 0;

				});


				this.queryLayer('game', 'terrain').setEntities(level.terrain);
				this.queryLayer('game', 'objects').setEntities(level.objects);


				var client = this.client;
				if (client !== null) {

					client.bind('connect', function() {

console.log('WAITING FOR 10 seconds NAO');

					}, this);

				}






				this.__tanks = level.objects.filter(function(obj) {
					return obj instanceof game.entity.Tank;
				});

			}

			lychee.game.State.prototype.enter.call(this);

		},

		leave: function() {

			this.queryLayer('game', 'terrain').setEntities([]);
			this.queryLayer('game', 'objects').setEntities([]);

			lychee.game.State.prototype.leave.call(this);

		}

	};


	return Class;

});

