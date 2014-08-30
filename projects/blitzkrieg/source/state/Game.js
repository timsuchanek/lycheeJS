
lychee.define('game.state.Game').requires([
	'lychee.effect.Offset',
	'lychee.effect.Shake',
	'lychee.game.Background',
	'lychee.game.Layer',
	'game.ui.Cursor',
	'game.ui.Layer',
	'game.entity.lycheeJS'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, game, global, attachments) {

	var _blob  = attachments["json"].buffer;
	var _fonts = {
		headline: attachments["headline.fnt"],
		normal:   attachments["normal.fnt"]
	};

	var _levels = {
		debug: attachments['debug.json'].buffer
	};



	/*
	 * HELPERS
	 */

	var _process_touch = function(id, position, delta, swipe) {

		this.loop.setTimeout(200, function() {

			if (this.__swiping === false) {

				var logic = this.logic;
				var layer = this.queryLayer('game', 'objects');
				if (logic !== null && layer !== null) {

					var tileposition   = logic.toTilePosition(position, true);
					var screenposition = logic.toScreenPosition(tileposition, false);
					var entity         = layer.getEntity(null, screenposition);

					logic.trigger('select', [ entity, tileposition ]);

				}

			}

		}, this);

	};

	var _process_swipe = function(id, state, position, delta, swipe) {

		var terrain = this.queryLayer('game', 'terrain');
		var objects = this.queryLayer('game', 'objects');
		var ui      = this.queryLayer('ui',   'game');

		if (this.__scrolling === false && state === 'move') {
			this.__swiping = true;
		}

		if (this.__scrolling === false && state === 'end') {

			var tile = this.main.TILE;
			if (Math.abs(swipe.x) < tile.width && Math.abs(swipe.y) < tile.offset) {
				this.__swiping = false;
				return;
			}


			var ox = terrain.offset.x;
			var oy = terrain.offset.y;
			var tx = ox + swipe.x;
			var ty = oy + swipe.y;
			var dx = this.renderer.width  - terrain.width;
			var dy = this.renderer.height - terrain.height;


			var bx1 = -1/2 * Math.abs(dx);
			var bx2 =  1/2 * Math.abs(dx);
			var by1 = -1/2 * Math.abs(dy);
			var by2 =  1/2 * Math.abs(dy);
			var tx2 = Math.min(Math.max(tx, bx1), bx2);
			var ty2 = Math.min(Math.max(ty, by1), by2);


			var type = lychee.effect.Offset.TYPE.easeout;
			if (
				   (tx !== tx2 && Math.abs(ty) > Math.abs(tx))
				|| (ty !== ty2 && Math.abs(tx) > Math.abs(ty))
			) {
				type = lychee.effect.Offset.TYPE.bounceeaseout;
			}


			terrain.addEffect(new lychee.effect.Offset({
				type:     type,
				duration: 500,
				offset:   {
					x: tx2,
					y: ty2
				}
			}));

			objects.addEffect(new lychee.effect.Offset({
				type:     type,
				duration: 500,
				offset:   {
					x: tx2,
					y: ty2
				}
			}));

			ui.addEffect(new lychee.effect.Offset({
				type:     type,
				duration: 500,
				offset:   {
					x: tx2,
					y: ty2
				}
			}));


			this.__scrolling = true;

			this.loop.setTimeout(500, function() {
				this.__swiping   = false;
				this.__scrolling = false;
			}, this);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.game.State.call(this, main);


		this.logic = main.logic || null;

		this.__swiping   = false;
		this.__scrolling = false;


		this.deserialize(_blob);
		this.reshape();

	};


	Class.prototype = {

		deserialize: function(blob) {

			lychee.game.State.prototype.deserialize.call(this, blob);

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

			}

		},

		render: function(clock, delta) {

			lychee.game.State.prototype.render.call(this, clock, delta);

		},

		update: function(clock, delta) {

			lychee.game.State.prototype.update.call(this, clock, delta);

		},

		enter: function(data) {

			var settings = lychee.extend({
				level: 'debug'
			}, data);


			lychee.game.State.prototype.enter.call(this);


			var entity = null;

			entity = this.queryLayer('background', 'background');
			entity.setColor('#000000');


			var logic = this.logic;
			if (logic !== null) {

				var level = lychee.deserialize(_levels[settings.level] || null);
				if (level !== null) {

					logic.enter(this, level);


					var ui = this.queryLayer('ui', 'game');
					if (ui !== null) {
						ui.width  = level.width;
						ui.height = level.height;
						ui.bind('touch', _process_touch, this);
					}

				}

			}


			this.input.bind('swipe', _process_swipe, this);

		},

		leave: function() {

			lychee.game.State.prototype.leave.call(this);


			var ui = this.queryLayer('ui', 'game');
			if (ui !== null) {
				ui.unbind('touch', _process_touch, this);
			}

			var logic = this.logic;
			if (logic !== null) {
				logic.leave();
			}

			this.input.unbind('swipe', _process_swipe, this);

		}

	};


	return Class;

});
