
lychee.define('game.net.remote.Controller').includes([
	'lychee.net.remote.Session'
]).exports(function(lychee, game, global, attachments) {

	/*
	 * HELPERS
	 */


	var _id       = 0;
	var _sessions = {};

	var _on_plug = function() {

		var found = null;

		Object.values(_sessions).forEach(function(session) {

			if (session.active === false && session.remotes.length < 6) {
				found = session;
			}

		});


		if (found !== null) {

			found.remotes.push(this.tunnel);

		} else {

			var id = 'lethalmaze-' + _id++;


			found = _sessions[id] = {
				id:      id,
				active:  false,
				remotes: [ this.tunnel ]
			};


			setTimeout(function() {
				this.active = true;
			}.bind(found), 10000);

		}


		var tunnel = this.tunnel;
		if (tunnel !== null) {

			tunnel.send({
				sid: found.id
			}, {
				service: this.id,
				event:   'init'
			});

		}


	};

	var _on_unplug = function() {

		var tunnel = this.tunnel;


		_sessions = Object.filter(_sessions, function(value, key) {

			var index = value.remotes.indexOf(tunnel);
			if (index !== -1) {
				value.remotes.splice(index, 1);
			}

			return value.remotes.length !== 0;

		});

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(remote) {

		var settings = {};


		lychee.net.remote.Session.call(this, 'controller', remote, settings);


		this.bind('plug',   _on_plug,   this);
		this.bind('unplug', _on_unplug, this);


// TODO: Send stuff to clients

		this.bind('unplug', function() {

console.log('JOINED NEW CLIENT');

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});

