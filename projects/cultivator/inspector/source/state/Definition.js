
lychee.define('inspector.state.Definition').includes([
	'inspector.State'
]).exports(function(lychee, inspector, global, attachments) {

	/*
	 * HELPERS
	 */

	var _render_article = function(definition) {

		var content = '';

		if (definition.id !== definition.origin) {
			content += '<h2>lychee.define(\'' + definition.id + '\')<br><small>(injected from ' + definition.origin + ')</small></h2>';
		} else {
			content += '<h2>lychee.define(\'' + definition.id + '\')</h2>';
		}


		content += '<h3>.tags(/* tag: value */)</h3>';
		content += '<ul>';

		if (definition.tags !== null) {

			Object.keys(definition.tags).forEach(function(key) {
				content += '<li>' + key + ': ' + definition.tags[key] + '</li>';
			});

		} else {

			content += '<li> -- no Tags assigned -- </li>';

		}

		content += '</ul>';


		content += '<h3>.attaches(/* Assets */)</h3>';
		content += '<ul>';

		if (definition.attaches !== null && definition.attaches.length > 0) {

			definition.attaches.forEach(function(url) {
				if (typeof url !== 'string') return;
				content += '<li><a onclick="MAIN.changeState(\'asset\');MAIN.state.view(\'' + url + '\')">' + url.split('/').pop() + '</a></li>';
			});

		} else {

			content += '<li> -- no Assets attached -- </li>';

		}

		content += '</ul>';


		content += '<h3>.requires(/* Definitions */)</h3>';
		content += '<ul>';

		if (definition.requires !== null && definition.requires.length > 0) {

			definition.requires.forEach(function(item) {
				content += '<li><a onclick="MAIN.state.view(\'' + item + '\')">' + item + '</a></li>';
			});

		} else {

			content += '<li> -- no Definitions required -- </li>';

		}

		content += '</ul>';


		content += '<h3>.includes(/* Definitions */)</h3>';
		content += '<ul>';

		if (definition.includes !== null && definition.includes.length > 0) {

			definition.includes.forEach(function(item) {
				content += '<li><a onclick="MAIN.state.view(\'' + item + '\')">' + item + '</a></li>';
			});

		} else {

			content += '<li> -- no Definitions included -- </li>';

		}

		content += '</ul>';


		content += '<h3>.exports(/* Code */)</h3>';

		if (definition.exports !== null) {
			content += '<pre class="javascript">' + definition.exports.replace(/\t/g, '    ') + '</pre>';
		} else {
			content += '<pre class="javascript">/* no Code exported */</pre>';
		}


		return content;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		inspector.State.call(this, 'Definition', main);

	};


	Class.prototype = {

		deserialize: function(data) {

			var definitions = data.definitions;
			if (definitions.length > 0) {

				var menu = definitions.map(function(definition) {
					return definition.id;
				});

				menu.sort(function(a, b) {
					if (a < b) return -1;
					if (a > b) return  1;
					return 0;
				});


				var articles = {};

				definitions.forEach(function(definition) {
					articles[definition.id] = _render_article(definition);
				});


				this.setMenu(menu);
				this.setArticles(articles);
				this.view(menu[0]);

			}

		}

	};


	return Class;

});

