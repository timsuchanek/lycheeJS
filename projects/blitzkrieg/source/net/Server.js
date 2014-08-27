
lychee.define('game.net.Server').requires([
	'lychee.data.BitON',
	'game.net.remote.Multiplayer'
]).includes([
	'lychee.net.Server'
]).exports(function(lychee, game, global, attachments) {

	var _BitON       = lychee.data.BitON;
	var _multiplayer = game.net.remote.Multiplayer;


	var Class = function() {

		lychee.net.Server.call(this, {
			encoder: _BitON.encode,
			decoder: _BitON.decode
		});


		this.bind('connect', function(remote) {

			console.log('(Blitzkrieg) game.net.Server: Remote connected (' + remote.id + ')');

			remote.register('multiplayer', _multiplayer);
			remote.accept();

		}, this);

		this.bind('disconnect', function(remote) {

			console.log('(Blitzkrieg) game.net.Server: Remote disconnected (' + remote.id + ')');

		}, this);

	};


	Class.prototype = {

		listen: function(port, host) {

			console.log('(Blitzkrieg) game.net.Server: Listening on ' + host + ':' + port);

			lychee.net.Server.prototype.listen.call(this, port, host);

		}

	};


	return Class;

});

