
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
				sid: found.id,
				id:  found.remotes.indexOf(this.tunnel)
			}, {
				service: this.id,
				event:   'init'
			});

		}


	};

	var _on_unplug = function() {

		var that = this;


		_sessions = Object.filter(_sessions, function(value, key) {

			var index = value.remotes.indexOf(that.tunnel);
			if (index !== -1) {
				value.remotes.splice(index, 1);
			}


			if (value.remotes.length !== 0) {

				if (index !== -1) {

					value.remotes.forEach(function(remote) {

						remote.send({
							id: index
						}, {
							service: that.id,
							event:   'destroy'
						});

					});

				}

				return true;

			} else {

				return false;

			}

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

	};


	Class.prototype = {

	};


	return Class;

});

