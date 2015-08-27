
lychee.define('game.state.Game').requires([
	'lychee.effect.Alpha',
	'lychee.effect.Color',
	'lychee.effect.Shake',
	'lychee.game.Background',
	'lychee.game.Emitter',
	'lychee.ui.Label',
	'game.entity.Circle',
	'game.entity.Particle',
	'game.ui.Layer'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, game, global, attachments) {

	var _blob = attachments["json"].buffer;
	var _font = attachments["fnt"];



	/*
	 * HELPERS
	 */

	var _format_statistics = function(ping, pong) {

		var tmp  = '00000000';
		var str1 = '' + ping;
		var str2 = '' + pong;

		var l = Math.max(2, str1.length, str2.length);

		if (str1.length < l) {
			str1 = tmp.substr(0, l - str1.length) + str1;
		}

		if (str2.length < l) {
			str2 = tmp.substr(0, l - str2.length) + str2;
		}


		return str1 + ' / ' + str2;

	};

	var _create_emitter = function(x, y) {

		var emitter = new lychee.game.Emitter({
			type:     lychee.game.Emitter.TYPE.explosion,
			duration: 500,
			lifetime: 2000,
			position: {
				x: x,
				y: y
			},
			entity:   lychee.serialize(new game.entity.Particle({
				radius: 16,
				color:  '#ffffff'
			}))
		});

		emitter.bind('create', function(entity) {

			entity.color = _random_color();

			entity.addEffect(new lychee.effect.Color({
				type:     lychee.effect.Color.TYPE.bounceeaseout,
				duration: 500,
				color:    '#000000'
			}));

			entity.addEffect(new lychee.effect.Alpha({
				type:     lychee.effect.Alpha.TYPE.bounceeaseout,
				duration: 500,
				alpha:    0
			}));

			var layer = this.getLayer('background');
			if (layer !== null) {
				layer.addEntity(entity);
			}

		}, this);

		emitter.bind('destroy', function(entity) {

			var layer = this.getLayer('background');
			if (layer !== null) {
				layer.removeEntity(entity);
			}

		}, this);


		this.emitters.push(emitter);

	};


	var _random_color = function() {

		var strr = (16 + Math.random() * 239 | 0).toString(16);
		var strg = (16 + Math.random() * 239 | 0).toString(16);
		var strb = (16 + Math.random() * 239 | 0).toString(16);

		return '#' + strr + strg + strb;
	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.game.State.call(this, main);


		this.emitters = [];


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


					entity = this.queryLayer('background', 'background');
					entity.width  = width;
					entity.height = height;

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


			// entity = this.queryLayer('ui', 'wrapper > circle');
			// entity.bind('touch', function() {

			// 	var color      = entity.color;
			// 	var layer      = this.getLayer('ui');
			// 	var background = this.queryLayer('background', 'background');

			// 	var action = (layer.effects.length === 0 && background.effects.length === 0);
			// 	if (action === true) {

			// 		layer.addEffect(new lychee.effect.Shake({
			// 			type:     lychee.effect.Shake.TYPE.bounceeaseout,
			// 			duration: 500,
			// 			shake: {
			// 				x: Math.random() > 0.5 ? -24 : 24,
			// 				y: Math.random() > 0.5 ? -24 : 24
			// 			}
			// 		}));

			// 		background.addEffect(new lychee.effect.Color({
			// 			type:     lychee.effect.Color.TYPE.bounceeaseout,
			// 			duration: 500,
			// 			color:    color
			// 		}));


			// 		for (var e = 0, el = this.emitters.length; e < el; e++) {
			// 			this.emitters[e].create(50);
			// 		}

			// 	}

			// }, this);


			var width  = this.renderer.width;
			var height = this.renderer.height;

			var x1 = -1/2 * width  + 64;
			var x2 =  1/2 * width  - 64;
			var y1 = -1/2 * height + 64;
			var y2 =  1/2 * height - 64;


			_create_emitter.call(this, x1, y1);
			_create_emitter.call(this, x2, y1);
			_create_emitter.call(this, x2, y2);
			_create_emitter.call(this, x1, y2);

		},



		/*
		 * CUSTOM API
		 */

		update: function(clock, delta) {

			lychee.game.State.prototype.update.call(this, clock, delta);


			for (var e = 0, el = this.emitters.length; e < el; e++) {
				this.emitters[e].update(clock, delta);
			}

		},

		enter: function() {

			lychee.game.State.prototype.enter.call(this);

		},

		leave: function() {

			lychee.game.State.prototype.leave.call(this);

		}

	};


	return Class;

});
