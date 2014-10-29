
lychee.define('game.state.Game').requires([
	'lychee.effect.Alpha',
	'lychee.effect.Color',
	'lychee.effect.Position',
	'lychee.game.Background',
	'lychee.game.Emitter',
	'lychee.ui.Label',
	'game.entity.Layer',
	'game.entity.Square',
	'game.entity.lycheeJS',
	'game.ui.Button',
	'game.ui.Layer'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, game, global, attachments) {

	var _blob = attachments["json"].buffer;
	var _font = attachments["fnt"];



	/*
	 * HELPERS
	 */

	var _COLOR_CYCLE = [ '#3f7cb6', '#5ad2f0', '#434343' ];
	var _LEVEL_DATA  = [{
		amount:  4,
		palette: [ '#743329', '#dd9c92', '#3f7cb6' ]
	}, {
		amount:  9,
		palette: [ '#743329', '#dd9c92', '#747474' ]
	}, {
		amount:  9,
		palette: [ '#dd9c92', '#743329', '#747474' ]
	}, {
		amount:  16,
		palette: [ '#a3d8cf', '#5fd8c3', '#8bd8cb' ]
	}, {
		amount:  16,
		palette: [ '#8bd8cb', '#a3d8cf', '#5fd8c3' ]
	}, {
		amount:  16,
		palette: [ '#5fd8c3', '#8bd8cb', '#a3d8cf' ]
	}, {
		amount:  16,
		palette: [ '#f06060', '#f07272', '#f06060' ]
	}, {
		amount:  36,
		palette: [ '#f06060', '#f07272', '#f06060' ]
	}, {
		amount:  36,
		palette: [ '#72b3f0', '#60abf0', '#60abf0' ]
	}, {
		amount:  36,
		palette: [ '#9160f0', '#986bf0', '#9160f0' ]
	}, {
		amount:  36,
		palette: [ '#986bf0', '#9160f0', '#986bf0' ]
	}, {
		amount:  36,
		palette: [ '#986bf0', '#9160f0', '#271b3d' ]
	}, {
		amount:  36,
		palette: [ '#986bf0', '#9160f0', '#444444' ]
	}, {
		amount:  36,
		palette: [ '#cdf058', '#bcdd51', '#444444' ]
	}, {
		amount:  36,
		palette: [ '#cdf058', '#bcdd51', '#bcdd51' ]
	}, {
		amount:  36,
		palette: [ '#97b241', '#92ab3f', '#444444' ]
	}, {
		amount:  36,
		palette: [ '#97b241', '#92ab3f', '#97b241' ]
	}, {
		amount:  36,
		palette: [ '#604723', '#574020', '#604723' ]
	}, {
		amount:  36,
		palette: [ '#604723', '#5b4321', '#000000' ]
	}, {
		amount:  36,
		palette: [ '#604723', '#5d4522', '#000000' ]
	}, {
		amount:  36,
		palette: [ '#604723', '#5d4522', '#5d4522' ]
	}, {
		amount:  36,
		palette: [ '#5d4723', '#5d4522', '#5d4522' ]
	}, {
		amount:  36,
		palette: [ '#54e6e6', '#55e8e8', '#54e6e6' ]
	}, {
		amount:  36,
		palette: [ '#55e6e6', '#55e8e8', '#54e6e6' ]
	}, {
		amount:  36,
		palette: [ '#55e7e7', '#55e8e8', '#54e6e6' ]
	}, {
		amount:  36,
		palette: [ '#e8b455', '#e6b254', '#e8b455' ]
	}, {
		amount:  36,
		palette: [ '#e8b455', '#e7b354', '#e8b455' ]
	}, {
		amount:  64,
		palette: [ '#e8b455', '#e7b355', '#604723' ]
	}, {
		amount:  64,
		palette: [ '#e8b455', '#e7b454', '#472360' ]
	}, {
		amount:  64,
		palette: [ '#e654e0', '#e554e1', '#e654e0' ]
	}];

	var _refresh = function() {

		var level = _LEVEL_DATA[this.__level] || null;
		if (level !== null) {

			var layer    = this.queryLayer('game', 'layer');
			var entities = [].slice.call(layer.entities);

			var max     = Math.sqrt(level.amount, 2)           | 0;
			var s       = (Math.random() * (level.amount - 1)) | 0;
			var x       = 0;
			var y       = 0;
			var offsetx = -1/2 * max * 48;
			var offsety = -1/2 * max * 48;


			for (var a = 0; a < level.amount; a++) {

				var posx = offsetx + x * 48 + 24;
				var posy = offsety + y * 48 + 24;

				var entity = entities[a] || null;
				if (entity === null) {
					entity = new game.entity.Square();
					entities.push(entity);
				}


				entity.addEffect(new lychee.effect.Position({
					type:     lychee.effect.Position.TYPE.easeout,
					delay:    a * 50,
					duration: 250,
					position: {
						x: posx,
						y: posy
					}
				}));

				entity.addEffect(new lychee.effect.Color({
					type:     lychee.effect.Color.TYPE.easeout,
					delay:    100,
					duration: 500,
					color:    a === s ? level.palette[0] : level.palette[1]
				}));


				x++;

				if (x % max === 0) {
					x = 0;
					y++;
				}

			}


			if (entities.length > level.amount) {
				entities = entities.splice(0, level.amount);
			}


			layer.addEffect(new lychee.effect.Color({
				type:     lychee.effect.Color.TYPE.easeout,
				delay:    100,
				duration: 500,
				color:    level.palette[2]
			}));

			layer.setEntities(entities);

		} else {

console.log('GAME OVER DUDE!');
//			this.trigger('gameover', [ this.__level ]);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.game.State.call(this, main);


		this.__index = 0;
		this.__level = 0;
		this.__time  = 60000;


		this.deserialize(_blob);
		this.reshape();


		this.getLayer('ui').bind('touch', function(id, position, delta) {

console.log('YAY TOUCH!', position);


	this.__level++;
	_refresh.call(this);

		}, this);

	};


	Class.prototype = {

		deserialize: function(blob) {

			lychee.game.State.prototype.deserialize.call(this, blob);


			var entity = null;



			/*
			 * HELP LAYER
			 */

/*
			entity = this.queryLayer('ui', 'help > back');
			entity.bind('touch', function() {
				this.main.changeState('menu');
			}, this);

			entity = this.queryLayer('ui', 'help > message');
			entity.setFont(_font);
*/
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

				entity = this.queryLayer('background', 'lycheeJS');
				entity.position.y = 1/2 * height - 32;

			}

		},

		update: function(clock, delta) {

			var background = this.queryLayer('background', 'background');
			if (background !== null) {

				if (background.effects.length === 0) {

					var index = (this.__index++) % _COLOR_CYCLE.length;
					var color = _COLOR_CYCLE[index] || null;
					if (color !== null) {

						background.addEffect(new lychee.effect.Color({
							type:     lychee.effect.Color.TYPE.linear,
							duration: 5000,
							color:    color
						}));

					}

				}

			}


			lychee.game.State.prototype.update.call(this, clock, delta);

		},

		enter: function() {

			this.__level = 0;

			_refresh.call(this);


			lychee.game.State.prototype.enter.call(this);

		},

		leave: function() {

			this.__level = 0;

			_refresh.call(this);

			lychee.game.State.prototype.leave.call(this);

		}

	};


	return Class;

});
