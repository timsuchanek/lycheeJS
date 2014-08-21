
lychee.define('game.state.Game').requires([
	'lychee.effect.Shake',
	'lychee.game.Background',
	'lychee.ui.Button',
	'lychee.ui.Layer',
	'game.entity.Button',
	'game.entity.Circle'
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


/*
		this.emitter = new _lychee_game_Emitter({
			type:     lychee.game.Emitter.TYPE.confetti,
			amount:   10,
			duration: 500,
			entity:   new game.entity.Circle({
				radius: 16
				color:  '#ffffff'
			}),
			effects:  [
				new lychee.effect.Blur({
					type:     lychee.effect.Blur.TYPE.easeout,
					delay:    500,
					duration: 500
				}),
				new lychee.effect.Color({
					type:     lychee.effect.Color.TYPE.bounceeaseout,
					duration: 500,
					color:    '#000000'
				})
			]
		});
*/

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

				if (layer.effects.length === 0) {

					layer.addEffect(new lychee.effect.Shake({
						type:     lychee.effect.Shake.TYPE.bounceeaseout,
						duration: 500,
						shake: {
							x: Math.random() > 0.5 ? -24 : 24,
							y: Math.random() > 0.5 ? -24 : 24
						}
					}));

				}

				if (background.effects.length === 0) {

					background.addEffect(new lychee.effect.Color({
						type:     lychee.effect.Color.TYPE.bounceeaseout,
						duration: 500,
						color:    color
					}));

				}


/*
				var emitter = this.emitter;
				if (emitter.entities.length === 0) {
					emitter.emit();
				}
*/

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
