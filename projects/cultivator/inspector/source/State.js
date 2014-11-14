
lychee.define('inspector.State').includes([
	'lychee.game.State'
]).exports(function(lychee, inspector, global, attachments) {

	var Class = function(id, data) {

		this.element = document.querySelector('#inspector-state-' + id);


		lychee.game.State.call(this, data);

	};


	Class.prototype = {

		enter: function() {

			lychee.game.State.prototype.leave.call(this);


			var element = this.element;
			if (element !== null) {
				element.className = 'inspector-State active';
			}

		},

		leave: function() {

			lychee.game.State.prototype.leave.call(this);


			var element = this.element;
			if (element !== null) {
				element.className = 'inspector-State';
			}

		},



		/*
		 * CUSTOM API
		 */

		setView: function(identifier) {

			console.log('SETTING VIEW', identifier);

		}

	};


	return Class;

});

