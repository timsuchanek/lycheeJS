
lychee.define('lychee.ASTWalker').exports(function(lychee, global) {

	var Class = function() {

		this.__stack = [];

		this.__callback = null;
		this.__scope = this;

	};


	Class.WALKERS = {

		'ROOT': function(ast) {
			return [ ast[0], this.map(ast[1], this.walk, this) ];
		},

		'array': function(ast) {
			return [ ast[0], this.map(ast[1], this.walk, this) ];
		},

		'assign': function(ast) {
			return [ ast[0], ast[1], this.walk(ast[2]), this.walk(ast[3]) ];
		},

		'atom': function(ast) {
			return [ ast[0], ast[1] ];
		},

		'binary': function(ast) {
			return [ ast[0], ast[1], this.walk(ast[2]), this.walk(ast[3]) ];
		},

		'break': function(ast) {
			return [ ast[0], ast[1] ];
		},

		'call': function(ast) {
			return [ ast[0], this.walk(ast[1]), this.map(ast[2], this.walk, this) ];
		},

		'conditional': function(ast) {
			return [ ast[0], this.walk(ast[1]), this.walk(ast[2]), this.walk(ast[3]) ];
		},

		'continue': function(ast) {
			return [ ast[0], ast[1] ];
		},

		'debugger': function(ast) {
			return [ ast[0] ];
		},

		'directive': function(ast) {
			return [ ast[0], ast[1] ];
		},

		'defun': function(ast) {
			return [ ast[0], ast[1], ast[2].slice(), this.map(ast[3], this.walk, this) ];
		},

		'do': function(ast) {
			return [ ast[0], this.walk(ast[1]), this.walk(ast[2]) ];
		},

		'dot': function(ast) {
			return [ ast[0], this.walk(ast[1])].concat(ast.slice(2));
		},

		'for': function(ast) {
			return [ ast[0], this.walk(ast[1]), this.walk(ast[2]), this.walk(ast[3]), this.walk(ast[4]) ];
		},

		'for-in': function(ast) {
			return [ ast[0], this.walk(ast[1]), this.walk(ast[2]), this.walk(ast[3]), this.walk(ast[4]) ];
		},

		'function': function(ast) {
			return [ ast[0], ast[1], ast[2].slice(), this.map(ast[3], this.walk, this) ];
		},

		'if': function(ast) {
			return [ ast[0], this.walk(ast[1]), this.walk(ast[2]), this.walk(ast[3]) ];
		},

		'label': function(ast) {
			return [ ast[0], ast[1], this.walk(ast[2]) ];
		},

		'name': function(ast) {
			return [ ast[0], ast[1] ];
		},

		'new': function(ast) {
			return [ ast[0], this.walk(ast[1]), this.map(ast[2], this.walk, this) ];
		},

		'num': function(ast) {
			return [ ast[0], ast[1] ];
		},

		'object': function(ast) {

			return [ ast[0], this.map(ast[1], function(property) {

				if (property.length === 2) {
					return [ property[0], this.walk(property[1]) ];
				} else {
					return [ property[0], this.walk(property[1]), property[2] ];
				}

			}, this) ]

		},

		'regexp': function(ast) {
			return [ ast[0], ast[1], ast[2] ];
		},

		'return': function(ast) {
			return [ ast[0], this.walk(ast[1]) ];
		},

		'seq': function(ast) {
			return [ ast[0] ].concat(this.map(ast.slice(1), this.walk, this));
		},

		'stat': function(ast) {
			return [ ast[0], this.walk(ast[1]) ];
		},

		'string': function(ast) {
			return [ ast[0], ast[1] ];
		},

		'sub': function(ast) {
			return [ ast[0], this.walk(ast[1]), this.walk(ast[2]) ]
		},

		'switch': function(ast) {

			return [
				ast[0],
				this.walk(ast[1]),
				this.map(ast[2], function(branch) {

					return [
						branch[0] ? this.walk(branch[0], this) : null,
						this.map(branch[1], this.walk, this)
					];

				}, this)
			];

		},

		'throw': function(ast) {
			return [ ast[0], this.walk(ast[1]) ];
		},

		'try': function(ast) {

			return [
				ast[0],
				this.map(ast[1], this.walk, this),
				ast[2] !== null ? [
					ast[2][0],
					this.map(ast[2][1], this.walk, this)
				] : null,
				ast[3] !== null ? this.map(ast[3], this.walk, this) : null
			];

		},

		'unary-prefix': function(ast) {
			return [ ast[0], ast[1], this.walk(ast[2]) ];
		},

		'unary-postfix': function(ast) {
			return [ ast[0], ast[1], this.walk(ast[2]) ];
		},

		'while': function(ast) {
			return [ ast[0], this.walk(ast[1]), this.walk(ast[2]) ]
		},

		'with': function(ast) {
			return [ ast[0], this.walk(ast[1]), this.walk(ast[2]) ]
		}

	};



	(function(blocks) {

		for (var b = 0, l = blocks.length; b < l; b++) {

			Class.WALKERS[blocks[b]] = function(ast) {

				var arr = [ ast[0] ];
				if (ast[1] !== null) {
					arr.push(this.map(ast[1], this.walk, this));
				}

				return arr;

			};

		}

	})([ 'block', 'splice' ]);

	(function(definitionblocks) {

		for (var d = 0, l = definitionblocks.length; d < l; d++) {

			Class.WALKERS[definitionblocks[d]] = function(ast) {

				return [
					ast[0],
					this.map(ast[1], function(definitions) {

						var arr = [ definitions[0] ];
						if (definitions.length > 1) {
							arr[1] = this.walk(definitions[1], this);
						}

						return arr;

					}, this)
				]

			};

		}

	})([ 'var', 'const' ]);



	Class.MAP = {

		skip: {}, // is unique

		top: function(value) {
			this.value = value;
		},

		splice: function(value) {
			this.value = value;
		},

	};



	Class.prototype = {

		map: function(data, callback, scope) {

			var ret = [];
			var top = [];

			if (data instanceof Array) {

				for (var d = 0, l = data.length; d < l; d++) {

					var value = callback.call(scope, data[d], d);
					if (value instanceof Class.MAP.top) {

						value = value.value;
						if (value instanceof Class.MAP.splice) {
							top.push.apply(top, value.value);
						} else {
							top.push(value);
						}

					} else if (value !== Class.MAP.skip) {

						if (value instanceof Class.MAP.splice) {
							ret.push.apply(ret, value.value);
						} else {
							ret.push(value);
						}

					}

				}

			} else {

				for (var d in data) {

					if (data.hasOwnProperty(d)) {

						var value = callback.call(scope, data[d], d);
						if (value instanceof Class.MAP.top) {

							value = value.value;
							if (value instanceof Class.MAP.splice) {
								top.push.apply(top, value.value);
							} else {
								top.push(value);
							}

						} else if (value !== Class.MAP.skip) {

							if (value instanceof Class.MAP.splice) {
								ret.push.apply(ret, value.value);
							} else {
								ret.push(value);
							}

						}

					}

				}

			}


			return top.concat(ret);

		},


		walk: function(ast) {

			ast = ast || null;

			if (ast === null) return null;


			this.__stack.push(ast);


			var type = ast[0];
			var result = Class.WALKERS[type].call(this, ast);

			if (this.__callback !== null) {

				var custom = this.__callback.call(this.__scope, result, this.getParent());
				if (custom !== null) {
					result = custom;
				}

			}


			this.__stack.pop();


			return result;

		},

		walkWith: function(ast, callback, scope) {

			callback = callback instanceof Function ? callback : null;
			scope = scope !== undefined ? scope : this;

			this.__callback = callback;
			this.__scope = scope;


			var result = this.walk(ast);

			this.__callback = null;
			this.__scope = this;

			return result;

		},

		dive: function(ast) {

			ast = ast || null;

			if (ast === null) return null;

			try {
				this.__stack.push(ast);
				return Class.WALKERS[ast[0]].call(this, ast);
			} finally {
				this.__stack.pop();
			}

		},

		getParent: function() {

			if (this.__stack.length > 1) {
				// Last in stack is the current node
				return this.__stack[this.__stack.length - 2] || null;
			}


			return null;

		},

		getStack: function() {
			return this.__stack;
		}

	};



	return Class;

});

