
lychee.define('game.net.Client').requires([
	'lychee.data.BitON',
	'game.net.client.Ping'
]).includes([
	'lychee.net.Client'
]).exports(function(lychee, game, global, attachments) {

	var _BitON = lychee.data.BitON;
	var _ping  = game.net.client.Ping;


	var Class = function(data, main) {

		var settings = lychee.extend({
//			codec:     _BitON,
			reconnect: 10000
		}, data);


		lychee.net.Client.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('connect', function() {

			this.addService(new _ping(this));



			var that = this;

			setTimeout(function() {

				var service = that.getService('ping');
				if (service !== null) {

					service.bind('statistics', function(ping, pong) {
						console.log('PING ' + ping + 'ms, PONG ' + pong + 'ms');
					}, this);

					setInterval(function() {
						that.getService('ping').ping();
					}, 1000);

				}

			}, 1000);


			if (lychee.debug === true) {
				console.log('(p2pdemo) game.net.Client: Remote connected');
			}

		}, this);

		this.bind('disconnect', function(code) {

			if (lychee.debug === true) {
				console.log('(p2pdemo) game.net.Client: Remote disconnected (' + code + ')');
			}

		}, this);


		this.connect();



	};


	Class.prototype = {

	};


	return Class;

});

