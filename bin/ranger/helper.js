
(function(global) {

	var _child_process = require('child_process');
	var _path          = require('path');


	var _ROOT = _path.resolve(__dirname);


	module.exports = {

		root: _ROOT,

		open: function(url) {

			var program_bin  = _ROOT + '/helper.sh';
			var program_args = [ url ];
			var program_cwd  = _ROOT;


			// var helper_process = _child_process.fork(program_bin, program_args, {
			// 	cwd: program_cwd
			// });

//			var helper_process = _child_process.exec('"' + program_bin + ' ' + program_args.join(' ') + '"', function(err, stdout, stderr) {


var helper_process = _child_process.spawn(program_bin, program_args);

helper_process.stdout.on('data', function(out) {
	console.log(out.toString());
});

helper_process.stderr.on('data', function(out) {
	console.log(out.toString());
});


console.log(helper_process);

			return true;

			// return child_process.execSync(_ROOT + '/helper.sh ' + url);
		}

	};

})(global);
