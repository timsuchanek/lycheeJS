
lychee.define('game.net.Server').requires([
	'lychee.data.BitON'
]).includes([
	'lychee.net.Server'
]).exports(function(lychee, game, global, attachments) {

	var _BitON = lychee.data.BitON;


	var Class = function(data) {

		var settings = lychee.extend({
			codec: _BitON
		}, data);


		lychee.net.Server.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('connect', function(remote) {

			console.log('(ISS Tycoon) game.net.Server: Remote connected (' + remote.host + ':' + remote.port + ')');

		}, this);

		this.bind('disconnect', function(remote) {

			console.log('(ISS Tycoon) game.net.Server: Remote disconnected (' + remote.host + ':' + remote.port + ')');

		}, this);


		this.connect();

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.net.Server.prototype.serialize.call(this);
			data['constructor'] = 'game.net.Server';


			return data;

		}

	};


	return Class;

});

