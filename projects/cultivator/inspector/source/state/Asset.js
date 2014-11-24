
lychee.define('inspector.state.Asset').includes([
	'inspector.State'
]).exports(function(lychee, inspector, global, attachments) {

	/*
	 * HELPERS
	 */

	var _font    = new Font();
	var _config  = new Config();
	var _texture = new Texture();

	var _render_article = function(asset) {

		var content = '';

		content += '<h2>new ' + asset.type + '(\'' + asset.url.split('/').pop() + '\')<br><small>(loaded from ' + asset.url + ')</small></h2>';


		switch(asset.type) {

			case 'Object':
				content += '<div class="center">This Asset is injected at runtime and might not be used on other platforms.</div>';
				content += '<br>';
				content += '<br>';
				content += '<pre>' + asset.buffer + '</pre>';
			break;
			case 'Font':
				content += '<div class="center">This Asset is injected at runtime and might not be used on other platforms.</div>';
				content += '<br>';
				content += '<br>';
				_font.deserialize.call(_font, { buffer: asset.buffer });
				content += '<div class="center"><img src="' + _font.__buffer.texture + '"></div>';
				content += '<br>';
				content += '<pre class="json">' + JSON.stringify(_font.__buffer, null, '\t') + '</pre>';
			break;

			case 'Config':
				_config.deserialize.call(_config, { buffer: asset.buffer });
				content += '<pre class="json">' + JSON.stringify(_config.buffer, null, '\t') + '</pre>';
			break;

			case 'Texture':
				// _texture.deserialize.call(_texture, { buffer: asset.buffer });
				content += '<div class="center"><img src="' + asset.buffer + '"></div>';
			break;

			case 'Sound':
			case 'Music':
				content += '<div class="center">MP3 File<br><audio src="' + asset.buffer.mp3 + '" controls/></div>';
				content += '<br>';
				content += '<div class="center">OGG File<br><audio src="' + asset.buffer.ogg + '" controls/></div>';
			break;

		}


		return content;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		inspector.State.call(this, 'Asset', main);

	};


	Class.prototype = {

		deserialize: function(data) {

			var assets = data.assets;
			if (assets.length > 0) {

				assets.sort(function(a, b) {
					var aid = a.url.split('/').pop();
					var bid = b.url.split('/').pop();
					if (aid < bid) return -1;
					if (aid > bid) return  1;
					return 0;
				});


				var menu = assets.map(function(asset) {
					return asset.url;
				});

				var labels = assets.map(function(asset) {
					return asset.url.split('/').pop();
				});



				var articles = {};

				assets.forEach(function(asset) {
					articles[asset.url] = _render_article(asset);
				});


				this.setMenu(menu, labels);
				this.setArticles(articles);
				this.view(menu[0]);

			}

		}

	};


	return Class;

});

