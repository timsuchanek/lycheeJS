
lychee.define('tool.Main').requires([
	'tool.data.FNT'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, tool, global, attachments) {

	var _FNT = tool.data.FNT;

	var Class = function(data) {

		var settings = lychee.extend({

			client:   null,
			input:    null,
			jukebox:  null,
			renderer: null,
			server:   null,

			viewport: {
				fullscreen: false
			}

		}, data);


		lychee.game.Main.call(this, settings);



		/*
		 * INITIALIZATIOn
		 */

		this.bind('load', function() {

		}, this, true);

		this.bind('init', function() {

//			this.setState('game', new game.state.Game(this));
//			this.setState('menu', new game.state.Menu(this));
//			this.changeState('menu');

		}, this, true);


		this.bind('submit', function(id, data) {

			if (id === 'settings') {
console.log('SETTINGS UPDATE', data);
			}

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});
