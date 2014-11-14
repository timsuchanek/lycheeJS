
lychee.define('inspector.State').requires([
	'inspector.View'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, inspector, global, attachments) {

	var Class = function(id, main) {

		this.view    = null;
		this.__views = {};

		this.__element = document.querySelector('#inspector-state-' + id);


		lychee.game.State.call(this, main);

	};


	Class.prototype = {

		enter: function() {

			lychee.game.State.prototype.leave.call(this);


			var element = this.__element;
			if (element !== null) {
				element.className = 'inspector-State active';
			}

		},

		leave: function() {

			lychee.game.State.prototype.leave.call(this);


			var element = this.__element;
			if (element !== null) {
				element.className = 'inspector-State';
			}

		},



		/*
		 * CUSTOM API
		 */

		setView: function(id, view) {

			id = typeof id === 'string' ? id : null;


			if (lychee.interfaceof(inspector.View, view)) {

				if (id !== null) {

					this.__views[id] = view;

					return true;

				}

			}


			return false;

		},

		getView: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.__views[id] !== undefined) {
				return this.__views[id];
			}


			return null;

		},

		removeView: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.__views[id] !== undefined) {

				delete this.__views[id];

				if (this.view === this.__views[id]) {
					this.changeView(null);
				}

				return true;

			}


			return false;

		},

		changeView: function(id) {

			id = typeof id === 'string' ? id : null;


			var oldview = this.view;
			var newview = this.__views[id] || null;

			if (newview !== null) {

				if (oldview !== null) {
					oldview.leave();
				}

				if (newview !== null) {
					newview.enter();
				}

				this.view = newview;

			} else {

				if (oldview !== null) {
					oldview.leave();
				}

				this.view = null;

			}


			return true;

		}

	};


	return Class;

});

