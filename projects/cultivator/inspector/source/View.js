
lychee.define('inspector.View').includes([
	'lychee.event.Emitter'
]).exports(function(lychee, inspector, global, attachments) {

	var Class = function(id) {

		this.__element = document.querySelector('#inspector-view-' + id);


		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		enter: function() {

			var element = this.__element;
			if (element !== null) {
				element.className = 'inspector-View active';
			}

		},

		leave: function() {

			var element = this.__element;
			if (element !== null) {
				element.className = 'inspector-View';
			}

		},



		/*
		 * CUSTOM API
		 */

		setContent: function(content) {

			content = typeof content === 'string' ? content : null;


			if (content !== null) {

				var element = this.__element;
				if (element !== null) {

					var articleelement = element.querySelector('article');
					if (articleelement !== null) {
						articleelement.innerHTML = content;
					}


					return true;

				}

			}


			return false;

		},

		setMenu: function(menu) {

			menu = menu instanceof Array ? menu : null;


			if (menu !== null) {

				var element = this.__element;
				if (element !== null) {

					var content = '';

					menu.forEach(function(item) {
						content += '<li onclick="MAIN.state.view.trigger(\'menu\', [ \'' + item + '\' ])">' + item + '</li>';
					});

					var menuelement = element.querySelector('menu');
					if (menuelement !== null) {
						menuelement.innerHTML = content;
					}


					return true;

				}

			}


			return false;

		}

	};


	return Class;

});

