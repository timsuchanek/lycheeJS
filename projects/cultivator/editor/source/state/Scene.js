
lychee.define('tool.state.Scene').includes([
	'lychee.game.State',
	'lychee.event.Emitter'
]).tags({
	platform: 'html'
}).exports(function(lychee, tool, global, attachments) {

	/*
	 * HELPERS
	 */

	var _render = function(query, parent) {

		var blob = this.serialize();
		var code = '';
		var name = this.label ? this.label : (parent.__map[query.split('/').pop()] || blob.constructor);


		code += '<li class="active" title="' + blob.constructor + '">';

		code += '<label class="ico-eye active" onclick="MAIN.state.trigger(\'visibility\', [\'' + query + '\']);this.classList.toggle(\'active\');this.parentNode.classList.toggle(\'active\');"></label>';

		if (this.entities instanceof Array && this.entities.length > 0) {
			code += '<label class="ico-arrow down active" onclick="this.parentNode.classList.toggle(\'active\');this.classList.toggle(\'down\');this.classList.toggle(\'right\'); void 1337;"></label>';
		}


		code += '<span>' + name + '</span>';


		if (this.entities instanceof Array && this.entities.length > 0) {

			code += '<ul>';

			var parent = this;

			this.entities.forEach(function(entity, index) {
				code += _render.call(entity, query + '/' + index, parent);
			});

			code += '</ul>';

		}


		code += '</li>';

		return code;

	};

	var _ui_update = function() {

		var code   = '';
		var layers = this.environment.global.MAIN.state.__layers;


		code += '<ul>';

		Object.values(layers).reverse().forEach(function(layer, index) {

			var dummy = { __map: {} };
			dummy.__map[index] = Object.keys(layers).reverse()[index];

			code += _render.call(layer, '/' + index, dummy);

		});

		code += '</ul>';


		ui.render(code, '#scene-layers-wrapper');

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {


		this.environment = null;


		lychee.game.State.call(this, main);
		lychee.event.Emitter.call(this);



		/*
		 * INITIALIZATION
		 */

		this.bind('entity', function(entity) {

// TODO: Use Entity selection for properties/settings

console.log('ENTITY selected', entity);

		}, this);

		this.bind('submit', function(id, settings) {

		}, this);

		this.bind('visibility', function(query) {

			var path    = query.split('/').slice(1);
			var layers  = this.environment.global.MAIN.state.__layers;
			var pointer = Object.values(layers).reverse()[path.shift()];

			while (path.length > 0) {

				if (pointer.entities instanceof Array) {
					pointer = pointer.entities[path.shift()];
				}

			}


			var entity = pointer || null;
			if (entity !== null) {

				if (lychee.interfaceof(lychee.ui.Layer, entity) || lychee.interfaceof(lychee.game.Layer, entity)) {
					entity.setVisible(!entity.visible);
				} else if (lychee.interfaceof(lychee.ui.Entity, entity)) {
					entity.setVisible(!entity.visible);
				} else if (lychee.interfaceof(lychee.game.Entity, entity)) {
					entity.setAlpha(entity.alpha === 1 ? 0 : 1);
				}

			}

		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize:   function() {},
		deserialize: function() {},



		/*
		 * CUSTOM API
		 */

		update: function(clock, delta) {

		},

		enter: function(environment) {

			this.environment = environment;
			_ui_update.call(this);

			lychee.game.State.prototype.enter.call(this);

		},

		leave: function() {

			this.environment = null;

			lychee.game.State.prototype.leave.call(this);

		}

	};


	return Class;

});

