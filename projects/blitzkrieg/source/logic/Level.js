
lychee.define('game.logic.Level').requires([
	'game.entity.Object',
	'game.entity.Terrain'
]).exports(function(lychee, game, global, attachments) {

	/*
	 * HELPERS
	 */

	var _parse = function(data, tile) {

		var tilewidth  = tile.width;
		var tileheight = tile.height;
		var tileoffset = tile.offset;

		var offsetx = -1/2 * data.width  * tilewidth  + tilewidth / 4;
		var offsety = -1/2 * data.height * tileoffset + (tileheight - tileoffset) * 3/4;

		this.width  = data.width  * tilewidth  + (tilewidth / 2);
		this.height = data.height * tileoffset + (tileheight - tileoffset);


		var x, y, posx, posy, type;


		if (data.terrain instanceof Array) {

			for (y = 0; y < data.terrain.length; y++) {

				this.map.terrain[y] = [];

				for (x = 0; x < data.terrain[0].length; x++) {

					type = data.terrain[y][x];
					posx = Math.round(offsetx + x * tilewidth);
					posy = Math.round(offsety + y * tileoffset);

					if (y % 2 === 1) {
						posx += Math.round(tilewidth / 2);
					}


					if (type > 0) {

						var terrain = new game.entity.Terrain({
							type:     type,
							position: {
								x: posx,
								y: posy
							}
						});

						this.map.terrain[y].push(terrain);
						this.terrain.push(terrain);

					}

				}

			}

		}


		if (data.objects instanceof Array) {

			for (y = 0; y < data.objects.length; y++) {

				for (x = 0; x < data.objects[0].length; x++) {

					type = data.objects[y][x];
					posx = Math.round(offsetx + x * tilewidth);
					posy = Math.round(offsety + y * tileoffset);

					if (y % 2 === 1) {
						posx += Math.round(tilewidth / 2);
					}


					if (type > 0) {

						var object = new game.entity.Object({
							type:     type,
							position: {
								x: posx,
								y: posy
							}
						});


						var isfree = this.map.terrain[y][x].isFree();
						if (isfree === 0) {
							this.map.objects[y][x] = 2;
						}

						this.objects.push(object);

					}

				}

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data, tile) {

		this.width   = 0;
		this.height  = 0;

		this.terrain = [];
		this.objects = [];
		this.blitzes = [];

		this.map     = {
			terrain: [],
			objects: [],
			blitzes: []
		};


		_parse.call(this, lychee.extend({
		}, data), lychee.extend({
			width:  65,
			height: 90,
			offset: 90 - 36
		}, tile));


		settings = null;

	};


	Class.prototype = {

	};


	return Class;

});

