
lychee.Asset = typeof lychee.Asset !== 'undefined' ? lychee.Asset : (function(global) {

	var lychee  = global.lychee;
	var console = global.console;



	/*
	 * HELPERS
	 */

	var _resolve_constructor = function(type) {

		var construct;


		if (type === 'json') construct = global.Config;
		if (type === 'fnt')  construct = global.Font;
		if (type === 'msc')  construct = global.Music;
		if (type === 'snd')  construct = global.Sound;
		if (type === 'png')  construct = global.Texture;


		if (construct === undefined) {
			construct = global.Stuff;
		}


		return construct || null;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Callback = function(url, type) {

		url  = typeof url === 'string'  ? url  : null;
		type = typeof type === 'string' ? type : null;


		if (url !== null) {

			if (type === null) {
				type = url.split('/').pop().split('.').pop();
			}


			var construct = _resolve_constructor(type);
			if (construct !== null) {
				return new construct(url);
			}

		}


		return null;

	};


	return Callback;

});

