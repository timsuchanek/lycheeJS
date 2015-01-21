
lychee.define('game.net.Client').requires([
	'lychee.data.BitON',
	'game.net.client.Highscore'
]).includes([
	'lychee.net.Client'
]).exports(function(lychee, game, global, attachments) {

	var _BitON     = lychee.data.BitON;
	var _highscore = game.net.client.Highscore;


	var Class = function(data, main) {

		var settings = lychee.extend({
			codec:     _BitON,
			reconnect: 10000
		}, data);


		lychee.net.Client.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('connect', function() {

			this.addService(new _highscore(this));

			if (lychee.debug === true) {
				console.log('(Color) game.net.Client: Remote connected');
			}

		}, this);

		this.bind('disconnect', function(code, reason) {

			if (lychee.debug === true) {
				console.log('(Color) game.net.Client: Remote disconnected (' + code + ')');
			}

		}, this);


		this.connect();

	};


	Class.prototype = {

	};


	return Class;

});
