
lychee.define('game.Logic').requires([
	'game.logic.Level'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, game, global, attachments) {

	/*
	 * HELPERS
	 */

	var _screen_to_tile_position = function(screenposition, offset) {

		offset = offset === true;


		var state = this.state;
		var tile  = this.TILE;
		if (state !== null && tile !== null) {

			var layer = state.queryLayer('game', 'objects');
			if (layer !== null) {

				var tileposition = {
					x: screenposition.x,
					y: screenposition.y
				};

				if (offset === true) {
					tileposition.x -= layer.offset.x;
					tileposition.y -= layer.offset.y;
				}

				tileposition.x -= -1/2 * (layer.width - tile.width / 2) + tile.width / 4;
				tileposition.y -= -1/2 * (layer.height - (tile.height - tile.offset) * 1/4);

				tileposition.x /= tile.width;
				tileposition.y /= tile.offset;

				tileposition.y |= 0;

				if (tileposition.y % 2 === 1) {
					tileposition.x -= 0.5;
				}

				tileposition.x = Math.round(tileposition.x) | 0;


				return tileposition;

			}

		}


		return null;

	};

	var _tile_to_screen_position = function(tileposition, offset) {

		offset = offset === true;


		var state = this.state;
		var tile  = this.TILE;
		if (state !== null && tile !== null) {

			var layer = state.queryLayer('game', 'objects');
			if (layer !== null) {

				var screenposition = {
					x: tileposition.x,
					y: tileposition.y
				};

				if (screenposition.y % 2 === 1) {
					screenposition.x += 0.5;
				}

				screenposition.x *= tile.width;
				screenposition.y *= tile.offset;


				screenposition.x += -1/2 * (layer.width - tile.width / 2) + tile.width / 4;
				screenposition.y += -1/2 * (layer.height - (tile.height - tile.offset) * 1/4);

				if (offset === true) {
					screenposition.x += layer.offset.x;
					screenposition.y += layer.offset.y;
				}


				return screenposition;

			}

		}


		return null;

	};

	var _enter = function() {

		var state = this.state;
		var level = this.level;
		var layer = null;


		if (state !== null && level !== null) {

			if (state.main !== null) {
				this.TILE = state.main.TILE;
			}


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


			var cursor = state.queryLayer('ui', 'game > cursor');
			if (cursor !== null) {
				this.__cursor = cursor;
			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.TILE  = null;

		this.state = null;
		this.level = null;

		this.__blitzes = [];
		this.__cursor  = null;


		lychee.event.Emitter.call(this);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('select', function(entity, tileposition) {

			var screenposition = this.toScreenPosition(tileposition, false);

// TODO: Selection of Entity

			var cursor = this.__cursor;
			if (cursor !== null) {
				cursor.setVisible(true);
				cursor.setPosition(screenposition);
			}

		}, this);

		this.bind('deselect', function() {

console.log('DESELECT');

// TODO: Deselection of Entity

			var cursor = this.__cursor;
			if (cursor !== null) {
				cursor.setVisible(false);
			}

		}, this);


		this.bind('blitz', function() {
console.log('BLITZ');
		}, this);

		this.bind('attack', function() {
console.log('ATTACK');
		}, this);

		this.bind('move', function() {
console.log('MOVE');
		}, this);

		this.bind('drop', function() {
console.log('DROP');
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

		},



		/*
		 * CUSTOM API
		 */

		toTilePosition: function(position, offset) {
			return _screen_to_tile_position.call(this, position, offset);
		},

		toScreenPosition: function(position, offset) {
			return _tile_to_screen_position.call(this, position, offset);
		}

	};


	return Class;

});

