
lychee.define('inspector.state.Overview').includes([
	'inspector.State'
]).exports(function(lychee, inspector, global, attachments) {

	var Class = function(main) {

		inspector.State.call(this, 'Overview', main);


		this.deserialize();
		this.changeView('files');

	};


	Class.prototype = {

		deserialize: function() {

			var view = null;



			view = new inspector.View('Files');
			view.bind('menu', function(item) {

console.log('MENU selected', item);

			}, this);

			this.setView('files', view);

		}

	};


	return Class;

});

