
lychee.define('ASTScope').exports(function(lychee, global) {

	var Class = function(ast, parent) {

		ast = Object.prototype.toString.call(ast) === '[object Array]' ? ast : null;
		parent = parent instanceof lychee.ASTScope ? parent : null;


		if (ast === null) {
			throw 'Can\'t initialize an AST Scope without an AST';
		}


		this.__globals = {}
		this.__locals = {};


		// This is required for tracing
		this.__ast = ast;
		this.__parent = parent;
		this.__children = {};

	};


	Class.prototype = {

		addGlobalReference: function(name, type, value) {
		},

		addLocalReference: function(name, type, value) {

			if (this.__locals[name] === undefined) {

				var local = {
					name: name,
					types: [ type ],
					values: [ value ]
				};

				this.__locals[name] = local;

console.log('adding local ref', local);

			} else if (this.__locals[name] !== undefined) {
			}

		}

	};


	return Class;

});

