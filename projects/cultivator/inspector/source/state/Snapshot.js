
lychee.define('inspector.state.Snapshot').includes([
	'inspector.State'
]).exports(function(lychee, inspector, global, attachments) {

	var Class = function(main) {

		inspector.State.call(this, 'Snapshot', main);


		this.deserialize();
		this.changeView('definitions');

	};


	Class.prototype = {

		deserialize: function() {

			var view = null;



			view = new inspector.View('Definitions');
			view.bind('menu', function(item) {

console.log('MENU selected', item);

			}, this);

			this.setView('definitions', view);


			view = new inspector.View('Assets');
			view.bind('menu', function(item) {

console.log('MENU selected', item);

			}, this);

			this.setView('assets', view);

		}

	};


	return Class;

});

