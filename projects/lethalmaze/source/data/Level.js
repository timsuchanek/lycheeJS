
lychee.define('game.data.Level').requires([
	'lychee.game.Logic',
	'game.entity.Item',
	'game.entity.Tank',
	'game.entity.Terrain',
	'game.entity.Wall'
]).exports(function(lychee, game, global, attachments) {

	var _logic = new lychee.game.Logic({
		projection: lychee.game.Logic.PROJECTION.tile,
		tile: {
			width:  32,
			height: 32,
			depth:   1
		}
	});


	var Module = {

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'game.data.Level',
				'blob':      null
			};

		},

		encode: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

// TODO: Encode data into JSON structure

			}


			return null;

		},

		decode: function(data) {

			data = data instanceof Array ? data : null;


			if (data !== null) {

				var cache = {
					terrain: [],
					objects: []
				};


				data.forEach(function(line, y) {

					line.forEach(function(type, x) {

						var position = {
							x: x + 0.5,
							y: y + 0.5,
							z: 0
						};

						_logic.projectPosition(position);


						cache.terrain.push(new game.entity.Terrain({
							position: position
						}));


						switch (type) {

							case 1:

								cache.objects.push(new game.entity.Wall({
									position: position
								}));

							break;

							case 2:

								cache.objects.push(new game.entity.Tank({
									position: position
								}));

							break;

							case 3:

								cache.objects.push(new game.entity.Item({
									position: position
								}));

							break;

						}

					});

				});


				return cache;

			}


			return null;

		}

	};


	return Module;

});

