
lychee.define('game.state.Game').requires([
	'lychee.effect.Alpha',
	'lychee.effect.Color',
	'lychee.effect.Shake',
	'lychee.game.Background',
	'lychee.game.Emitter',
	'lychee.ui.Button',
	'lychee.ui.Layer',
	'game.entity.Button',
	'game.entity.Circle',
	'game.entity.Particle'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, game, global, attachments) {

	var _blob  = attachments["json"].buffer;
	var _fonts = {
		headline: attachments["headline.fnt"],
		normal:   attachments["normal.fnt"]
	};



	/*
	 * HELPERS
	 */

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


		this.emitter    = null;
		this.intervalId = null;


		this.deserialize(_blob);
		this.reshape();

	};


	Class.prototype = {

		deserialize: function(blob) {

			lychee.game.State.prototype.deserialize.call(this, blob);


			var entity = null;


			entity = this.queryLayer('ui', 'circle');
			entity.bind('touch', function() {

				var color      = this.queryLayer('ui', 'circle').color;
				var layer      = this.getLayer('ui');
				var background = this.queryLayer('background', 'background');
				var emitter    = this.emitter;


				var action = (layer.effects.length === 0 && background.effects.length === 0);
				if (action === true) {

					layer.addEffect(new lychee.effect.Shake({
						type:     lychee.effect.Shake.TYPE.bounceeaseout,
						duration: 500,
						shake: {
							x: Math.random() > 0.5 ? -24 : 24,
							y: Math.random() > 0.5 ? -24 : 24
						}
					}));

					background.addEffect(new lychee.effect.Color({
						type:     lychee.effect.Color.TYPE.bounceeaseout,
						duration: 500,
						color:    color
					}));


					if (emitter !== null) {
						emitter.create(40);
					}

				}

			}, this);


			this.emitter = new lychee.game.Emitter({
				type:     lychee.game.Emitter.TYPE.explosion,
				duration: 500,
				lifetime: 2000,
				position: {
					x: 0,
					y: -100
				},
				entity:   lychee.serialize(new game.entity.Particle({
					radius: 16,
					color:  '#ffffff'
				}))
			});

			this.emitter.bind('create', function(entity) {

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
			this.emitter.bind('destroy', function(entity) {

				var layer = this.getLayer('background');
				if (layer !== null) {
					layer.removeEntity(entity);
				}

			}, this);

		},

		reshape: function(orientation, rotation) {

			lychee.game.State.prototype.reshape.call(this, orientation, rotation);


			var renderer = this.renderer;
			if (renderer !== null) {

				var entity = null;
				var width  = renderer.width;
				var height = renderer.height;


				entity = this.queryLayer('background', 'background');
				entity.width  = width;
				entity.height = height;

				entity = this.queryLayer('ui', 'button');
				entity.position.y = 1/2 * height - 42;

			}

		},

		update: function(clock, delta) {

			lychee.game.State.prototype.update.call(this, clock, delta);


			var emitter = this.emitter;
			if (emitter !== null) {
				emitter.update(clock, delta);
			}

		},

		enter: function() {

			lychee.game.State.prototype.enter.call(this);


			var entity = null;

			entity = this.queryLayer('ui', 'circle');
			entity.setColor('#888888');

			entity = this.queryLayer('background', 'background');
			entity.setColor('#000000');


			var service = this.client.getService('ping');
			if (service !== null) {

				entity = this.queryLayer('ui', 'statistics');

				service.bind('unplug', function() {
					this.setLabel('Ping: - ms / - ms');
				}, entity);

				service.bind('statistics', function(ping, pong) {
					this.setLabel('Ping: ' + ping + ' ms / ' + pong + ' ms');
				}, entity);

			}


			var loop = this.loop;
			if (loop !== null) {

				this.intervalId = loop.setInterval(1000, function() {

					var client = this.client;
					if (client !== null) {

						var service = this.client.getService('ping');
						if (service !== null) {
							service.ping();
						}

					}

				}, this);

			}

		},

		leave: function() {

			var loop = this.loop;
			if (loop !== null) {
				loop.removeInterval(this.intervalId);
			}


			var entity  = null;
			var service = this.client.getService('ping');
			if (service !== null) {

				entity = this.queryLayer('ui', 'statistics');

				service.unbind('unplug',     null, entity);
				service.unbind('statistics', null, entity);

			}


			lychee.game.State.prototype.leave.call(this);

		}

	};


	return Class;

});
