
lychee.define('game.Sidebar').requires([
//	'game.entity.Bar'
]).exports(function(lychee, global) {

	var Class = function(game, settings) {

		this.settings = lychee.extend({}, this.defaults, settings);

		this.game = game;
		this.__renderer = this.game.renderer;

		this.__data = {
			points: 0,
			time:   0
		};

	};


	Class.prototype = {

		defaults: {
			width: 192
		},

		enter: function() {
			this.game.score.bind('update', this.update, this);
		},

		leave: function() {
			this.game.score.unbind('update', this.update);
		},

		update: function(data) {

			this.__data.points = data.points;
			this.__data.time = data.time;

		},

		render: function(clock, delta) {

			var s = this.settings;

			var points = this.__data.points.toString();
			var time = Math.floor(this.__data.time / 1000).toString();

			var font = this.game.fonts.normal;
			if (s.width < 192) {
				font = this.game.fonts.small;
			}

			this.__renderer.drawText(
				s.offset.x + 10,
				s.offset.y + 40,
				'Score:',
				font,
				null
			);

			this.__renderer.drawText(
				s.offset.x + 10,
				s.offset.y + 80,
				points,
				font,
				null
			);


			this.__renderer.drawText(
				s.offset.x + 10,
				s.offset.y + 180,
				'Time:',
				font,
				null
			);

			this.__renderer.drawText(
				s.offset.x + 10,
				s.offset.y + 220,
				time,
				font,
				null
			);

		},

		resize: function(settings) {
			this.settings = lychee.extend({}, this.defaults, settings);
		}

	};


	return Class;

});

