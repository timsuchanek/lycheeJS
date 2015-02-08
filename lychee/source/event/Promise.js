
lychee.define('lychee.event.Promise').includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _process_stack = function() {

		var entry = this.___stack.shift() || null;
		if (entry !== null) {

			var that = this;

			entry.callback.call(entry.scope, function(result) {

				if (result === true) {
					_process_stack.call(that);
				} else {
					that.trigger('error');
				}

			});

		} else {

			this.trigger('ready');

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function() {

		this.___initialized = false;
		this.___stack       = [];

		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		then: function(callback, scope) {

			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;


			if (callback !== null) {

				this.___stack.push({
					callback: callback,
					scope:    scope
				});

			}


			return this;

		},

		init: function() {

			if (this.___initialized === false) {

				this.___initialized = true;
				_process_stack.call(this);

			}

		}

	};


	return Class;

});

