
lychee.define('game.net.Server').requires([
	'lychee.data.BitON',
	'game.net.remote.Highscore'
]).includes([
	'lychee.net.Server'
]).exports(function(lychee, game, global, attachments) {

	var _BitON     = lychee.data.BitON;
	var _highscore = game.net.remote.Highscore;


	var Class = function() {

		lychee.net.Server.call(this, {
			encoder: _BitON.encode,
			decoder: _BitON.decode
		});


		this.bind('connect', function(remote) {

			console.log('(Color) game.net.Server: Remote connected (' + remote.id + ')');

			remote.register('highscore', _highscore);
			remote.accept();

		}, this);

		this.bind('disconnect', function(remote) {

			console.log('(Color) game.net.Server: Remote disconnected (' + remote.id + ')');

		}, this);

	};


	Class.prototype = {

		listen: function(port, host) {

			console.log('(Color) game.net.Server: Listening on ' + host + ':' + port);

			lychee.net.Server.prototype.listen.call(this, port, host);

		}

	};


	return Class;

});

