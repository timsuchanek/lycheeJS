
lychee.define('sorbet.mod.Package').exports(function(lychee, sorbet, global, attachments) {

	var Module = {

		can: function(project) {

console.log('CHECK IF PACKAGE IS MODIFIED', project.identifier);

		},

		process: function(project, ready) {
		}

	};


	return Module;

});

