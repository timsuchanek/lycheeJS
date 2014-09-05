
lychee.define('game.logic.Path').exports(function(lychee, game, global, attachments) {

	/*
	 * HELPERS
	 */

	var _MAX_SPEED = 10;
	var _MIN_SPEED = 1 / _MAX_SPEED;

	var _approximate_distance = function(suggestion, node) {

		var sx = suggestion.x;
		var sy = suggestion.y;

		var px = node.position.x;
		var py = node.position.y;

		if (sy % 2 === 1) {
			sx += 0.5;
		}

		if (py % 2 === 1) {
			px += 0.5;
		}


		var dx = px - sx;
		var dy = py - sy;


		return Math.sqrt(dx * dx + dy * dy);

	};

	var _real_distance = function(suggestion, node) {

		var speed = 1;


		if (speed < _MIN_SPEED) {

			return Infinity;

		} else {

			var sx = suggestion.x;
			var sy = suggestion.y;

			var px = node.position.x;
			var py = node.position.y;

			if (sy % 2 === 1) {
				sx += 0.5;
			}

			if (py % 2 === 1) {
				px += 0.5;
			}


			var dx = px - sx;
			var dy = py - sy;


			return Math.sqrt(dx * dx + dy * dy) / speed;

		}

	};

	var _node = function(parent, position, terrain) {

		// Values horizontal and vertical distances the same way
		var value = Math.sqrt(position.x * position.x + position.y * position.y);


		this.parent   = parent;
		this.position = position;
		this.value    = value;
		this.terrain  = terrain;
		this.f        = 0;
		this.g        = 0;

	};

	var _get_suggestions = function(position) {

		var suggestions = [];
		var logic       = this.logic;

		if (logic !== null) {

			var objects  = logic.getSurrounding(position, 'objects');
			var terrains = logic.getSurrounding(position, 'terrain');

			for (var i = 0, l = terrains.length; i < l; i++) {

				var object  = objects[i];
				var terrain = terrains[i];

				if (object === null) {

					if (terrain !== null && terrain.isFree()) {
						suggestions.push(logic.toTilePosition(terrain.position, 'terrain'));
					}

				}

			}

		}


		return suggestions;

	};

	var _refresh_path = function() {

		var result = [];
		var logic  = this.logic;

		if (logic !== null) {

			var start = new _node(null, this.origin,   logic.get(this.origin,   'terrain'));
			var stop  = new _node(null, this.position, logic.get(this.position, 'terrain'));

			var dx = this.position.x - this.origin.x;
			var dy = this.position.y - this.origin.y;
			if (dx === 0 && dy === 0) {
				return result;
			}


			var limit   = 200 * 200;
//			var limit   = 2 * Math.sqrt(dx * dx + dy * dy) / _MIN_SPEED;
			var visited = {};
			var open    = [ start ];
			var closed  = [];


			var length = 0;

			while ((length = open.length)) {

				var max = limit;
				var min = -1;


				for (var o = 0; o < length; o++) {

					if (open[o].f < max) {
						max = open[o].f;
						min = o;
					}

				}


				var tmp;
				var node = open.splice(min, 1)[0];
				if (node.value === stop.value) {

					closed.push(node);
					tmp = node;


					while (tmp !== null) {

						result.push({
// TODO: Remove this from result
g:       tmp.g,
f:       tmp.f,
							x:       tmp.position.x,
							y:       tmp.position.y,
							terrain: tmp.terrain
						});

						tmp = tmp.parent;

					}


					visited = {};
					open    = [];
					closed  = [];

					result.reverse();

				} else {

					var suggestions = _get_suggestions.call(this, node.position);
					for (var s = 0, sl = suggestions.length; s < sl; s++) {

						tmp = new _node(node, suggestions[s], logic.get(suggestions[s], 'terrain'));

						if (visited[tmp.value] !== 1) {

							tmp.g = node.g + _real_distance(suggestions[s], node);
							tmp.f = tmp.g  + _approximate_distance(suggestions[s], stop);

							visited[tmp.value] = 1;
							open.push(tmp);

						}

					}

					closed.push(node);

				}

			}

		}


		return result;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);

		this.logic    = null;

		this.origin   = { x: 0, y: 0 };
		this.position = { x: 0, y: 0 };


		this.setLogic(settings.logic);
		this.setOrigin(settings.origin);
		this.setPosition(settings.position);


		settings = null;

	};


	Class.prototype = {

		setLogic: function(logic) {
			this.logic = logic;
			return true;
		},

		setOrigin: function(origin) {

			origin = origin instanceof Object ? origin : null;


			if (origin !== null) {

				this.origin.x = typeof origin.x === 'number' ? origin.x : this.origin.x;
				this.origin.y = typeof origin.y === 'number' ? origin.y : this.origin.y;

				return true;

			}


			return false;

		},

		setPosition: function(position) {

			position = position instanceof Object ? position : null;


			if (position !== null) {

				this.position.x = typeof position.x === 'number' ? position.x : this.position.x;
				this.position.y = typeof position.y === 'number' ? position.y : this.position.y;

				this.buffer = _refresh_path.call(this);


console.log('NEW PATH', this.buffer);


				return true;

			}


			return false;

		}

	};


	return Class;

});

