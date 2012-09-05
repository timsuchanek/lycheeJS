
lychee.define('lychee.Parser').requires([
	'lychee.Tokenizer'
]).exports(function(lychee, global) {

	function array_to_hash(array) {

		var hash = {};
		for (var a = 0, l = array.length; a < l; a++) {
			hash[array[a]] = true;
		}

		return hash;

	};

	function is_member(name, array) {

		for (var a = 0, l = array.length; a < l; a++) {
			if (array[a] === name) return true;
		}

		return false;

	};

	function is_token(token, type, value) {
		return token.type === type && (value == null || token.value === value);
	};



	var _ASSIGNMENT = (function(arr) {

		var hashmap = {};

		for (var a = 0, l = arr.length; a < l; a++) {

			var op = arr[a];
			if (op.length > 1) {
				hashmap[op] = op.substr(0, op.length - 1);
			} else {
				hashmap[op] = true;
			}

		}

		return hashmap;

	})([
		'=',
		'+=', '-=', '*=', '/=', '%=',
		'>>=', '<<=', '>>>=',
		'|=', '^=', '&='
	]);

	var _ATOMIC_START_TOKENS = array_to_hash([
		'atom', 'name', 'num', 'regexp', 'string'
	]);

	var _OPERATOR_PRIORITIES = (function(arr) {

		var hashmap = {};

		for (var a = 0, n = 1, l = arr.length; a < l; ++a, ++n) {

			var arr2 = arr[a];
			for (var b = 0, ll = arr2.length; b < ll; ++b) {
				hashmap[arr2[b]] = n;
			}

		}

		return hashmap;

	})([
		["||"],
		["&&"],
		["|"],
		["^"],
		["&"],
		["==", "===", "!=", "!=="],
		["<", ">", "<=", ">=", "in", "instanceof"],
		[">>", "<<", ">>>"],
		["+", "-"],
		["*", "/", "%"]
	]);


	var _STATEMENTS_WITH_LABELS = array_to_hash([
		'do', 'for', 'switch', 'while'
	]);

	var _UNARY_PREFIX = array_to_hash([
		'typeof', 'void', 'delete',
		'++', '--', '+', '-', '!', '~'
	]);

	var _UNARY_POSTFIX = array_to_hash([
		'++', '--'
	]);



	var Class = function(source, settings) {

		this.settings = lychee.extend({}, this.defaults, settings);
		this.reset(source);

	};



	Class.ERROR = function(message, token) {

		this.message = message;
		this.stack = new Error().stack;

		this.line = token.line + 1;
		this.column = token.column + 1;
		this.position = token.position + 1;

	};

	Class.ERROR.prototype.toString = function() {
		return this.message + " (line: " + this.line + ", column: " + this.column + ", position: " + this.position + ")" + "\n\n" + this.stack;
	};



	Class.prototype = {

		defaults: {
			exigent: true
		},

		reset: function(source) {

			if (source instanceof lychee.Tokenizer) {
				this.__source = source;
			} else {
				this.__source = new lychee.Tokenizer(source, true);
			}


			this.__previous = null;
			this.__current = null;
			this.__peeked = null;

			this.__currentFunction = 0;
			this.__currentLoop = 0;

			this.__current = this.next();

		},

		as: function() {
			return Array.prototype.slice.call(arguments, 0);
		},

		asName: function() {

			switch (this.__current.type) {
				case 'name':
				case 'operator':
				case 'keyword':
				case 'atom':

					var value = this.__current.value;
					this.next();
					return value;

				default:
					this.__throwUnexpected();
			}

		},

		asPropertyName: function() {

			switch (this.__current.type) {
				case 'num':
				case 'string':

					var value = this.__current.value;
					this.next();
					return value;

				default:
					return this.asName();
			}

		},

		prev: function() {
			return this.__previous;
		},

		next: function() {

			this.__previous = this.__current;

			if (this.__peeked !== null) {
				this.__current = this.__peeked;
				this.__peeked = null;
			} else {
				this.__current = this.__source.next();
			}


			this.__inDirectives = this.__inDirectives === true && (
				this.__current.type === 'string' || is_token(this.__current, 'punc', ';')
			);


			return this.__current;

		},

		peek: function() {

			if (this.__peeked === null) {
				this.__peeked = this.__source.next();
			}


			return this.__peeked;

		},

		getAST: function() {

			var ast = [ 'ROOT', [] ];

			while (is_token(this.__current, 'EOF') === false) {
				ast[1].push(this.__statement());
			}

			return ast;

		},

		__throw: function(message) {

			if (lychee.debug === true) {
				debugger;
			}

			throw new Class.ERROR(
				message,
				this.__current
			);

		},

		__throwUnexpected: function(token) {

			token = token !== undefined ? token : this.__current;

			this.__throw(
				'Unexpected Token: ' + token.type + ' (' + token.value + ')',
				token
			);

		},

		expect: function(type, value) {

			if (is_token(this.__current, type, value) === true) {
				return this.next();
			}

			this.__throw('Unexpected Token ' + this.__current.type + ', expected ' + type);

		},

		__statement: function() {

			if (
				is_token(this.__current, 'operator', '/') === true
				|| is_token(this.__current, 'operator', '/=') === true
			) {
				// Force RegExp
				this.__peeked = null;
				this.__current = this.__source.next(this.__current.value.substr(1));
			}

			switch (this.__current.type) {

				case "string":

					var directive = this.__inDirectives,
						statement = this.__simpleStatement();

					if (
						directive === true
						&& statement[1][0] === 'string'
						&& is_token(this.__current, 'punc', ',') === true
					) {
						return this.as('directive', statement[1][1]);
					}


					return statement;

				case "num":
				case "regexp":
				case "operator":
				case "atom":


					return this.__simpleStatement();

				case "name":

					if (is_token(this.peek(), 'punc', ':') === true) {

						var label = this.__current.value;
						this.next();
						this.next();

						return this.__labeledStatement(label);

					}

					return this.__simpleStatement();

				case "punc":

					switch(this.__current.value) {

						case "{":
							return this.as('block', this.__block());

						case "[":
						case "(":
							return this.__simpleStatement();

						case ";":
							this.next();
							return this.as('block');

						default:
							this.__throwUnexpected();

					}

				case "keyword":

					var value = this.__current.value;
					this.next();

					switch(value) {

						case "break":
							return this.__break_continue('break');

						case "continue":
							return this.__break_continue('continue');

						case "debugger":
							this.__semicolon();
							return this.as('debugger');

						case "do":

							return (function(body, that) {

								that.expect('keyword', 'while');

								var parenthesised = that.__parenthesised();
								that.__semicolon();

								return that.as('do', parenthesised, body);

							})(this.__inLoop(this.__statement, this), this);

						case "for":
							return this.__for();

						case "function":
							return this.__function();

						case "if":
							return this.__if();

						case "return":

							if (this.__currentFunction === 0) {
								this.__throw("'return' outside of function");
							}

							return this.__return();

						case "switch":
							return this.__switch();

						case "throw":

							if (this.__current.newlinebefore) {
								this.__throw("Illegal newline after 'throw'");
							}

							var expression = this.__expression();
							this.__semicolon();

							return this.as('throw', expression);

						case "try":
							return this.__try();

						case "var":
							var _var = this.__var();
							this.__semicolon();
							return _var;

						case "const":
							return this.__const();

						case "while":
							return this.as('while', this.__parenthesised(), this.__inLoop(this.__statement, this));

						case "with":
							return this.as('with', this.__parenthesised(), this.__statement());

						default:
							this.__throwUnexpected();

					}


			}

		},



		/*
		 * STUFF
		 */
		__canInsertSemicolon: function() {

			if (this.settings.exigent === false) {

				if (
					this.__current.newlinebefore === true
					|| is_token(this.__current, 'EOF')
					|| is_token(this.__current, 'punc', '}')
				) {
					return true;
				}

			}

			return false;

		},

		__isAssignable: function(expression) {

			if (this.settings.exigent === false) {
				return true;
			}

			switch(expression[0] + '') {

				case 'dot':
				case 'sub':
				case 'new':
				case 'call':
					return true;

				case 'name':
					return expression[1] !== 'this';

			}

		},

		__parenthesised: function() {

			this.expect('punc', '(');

			var expression = this.__expression();

			this.expect('punc', ')');

			return expression;

		},

		__labeledStatement: function(label) {

			this.__labels.push(label);

			var start = this.__current,
				statement = this.__statement();

			if (
				this.settings.exigent === true
				&& Object.prototype.hasOwnProperty(_STATEMENTS_WITH_LABELS, statement[0]) === false
			) {
				this.__throwUnexpected(start);
			}

			this.__labels.pop();

			return this.as('label', label, statement);

		},

		__simpleStatement: function() {

			var expression = this.__expression();
			this.__semicolon();

			return this.as('stat', expression);

		},

		__inLoop: function(callback, scope) {

			try {
				++this.__currentLoop;
				return callback.call(scope);
			} finally {
				--this.__currentLoop;
			}

		},






		__array: function() {

			return this.as(
				'array',
				this.__expression_list(']', !this.settings.exigent, true)
			);

		},

		__block: function() {

			this.expect('punc', '{');

			var arr = [];
			while (is_token(this.__current, 'punc', '}') === false) {

				if (is_token(this.__current, 'EOF')) {
					this.__throwUnexpected();
				}

				arr.push(this.__statement());

			}

			this.next();

			return arr;

		},

		__break_continue: function(type) {

			type = typeof type === 'string' ? type : null;

			var name = null;
			if (this.__canInsertSemicolon() === false) {
				name = is_token(this.__current, 'name') ? this.__current.value : null;
			}


			if (name !== null) {

				this.next();

				if (is_member(name, this.__labels) === false) {
					this.__throw('Label ' + name + 'without matching loop or statement');
				}

			} else if (this.__currentLoop === 0) {
				this.__throw(type + ' not inside a loop or switch statement');
			}

			this.__semicolon();

			return this.as(type, name);

		},

		__const: function() {

			var block = this.__var_definitions();

			this.__semicolon();

			return this.as('const', block);

		},

		__expression: function(commas, noIn) {

			commas = commas === false ? false : true;

			var expression = this.__maybe_assignment(noIn);
			if (
				commas === true
				&& is_token(this.__current, 'punc', ',') === true
			) {

				this.next();

				return this.as(
					'seq',
					expression,
					this.__expression(true, noIn)
				);

			}

			return expression;

		},

		__expression_atom: function(allowCalls) {

			if (is_token(this.__current, 'operator', 'new') === true) {

				this.next();
				return this.__new();

			} else if (is_token(this.__current, 'punc') === true) {

				switch (this.__current.value) {

					case '(':
						this.next();

						var expression = this.__expression();

						this.expect('punc', ')');
						return this.__subscripts(expression, allowCalls);

					case '[':
						this.next();
						return this.__subscripts(this.__array(), allowCalls);

					case '{':
						this.next();
						return this.__subscripts(this.__object(), allowCalls);

					default:
						this.__throwUnexpected();

				}

			} else if (is_token(this.__current, 'keyword', 'function') === true) {

				this.next();

				return this.__subscripts(
					this.__function(false),
					allowCalls
				);

			} else if (Object.prototype.hasOwnProperty.call(_ATOMIC_START_TOKENS, this.__current.type) === true) {

				var atom = null;
				if (this.__current.type === 'regexp') {
					atom = this.as('regexp', this.__current.value[0], this.__current.value[1]);
				} else {
					atom = this.as(this.__current.type, this.__current.value);
				}

				this.next();

				return this.__subscripts(atom, allowCalls);

			} else {
				this.__throwUnexpected();
			}

		},

		__expression_list: function(closingValue, allowTrailingComma, allowEmpty) {

			var list = [];

			var first = true;
			while (is_token(this.__current, 'punc', closingValue) === false) {

				if (first === true) {
					first = false;
				} else {
					this.expect('punc', ',');
				}

				if (
					allowTrailingComma === true
					&& is_token(this.__current, 'punc', closingValue) === true
				) {
					break;
				}

				if (
					is_token(this.__current, 'punc', ',') === true
					&& allowEmpty === true
				) {
					list.push([ 'atom', 'undefined' ]);
				} else {
					list.push(this.__expression(false));
				}

			}

			this.next();

			return list;

		},

		__expression_operator: function(left, priority, noIn) {

			var operator = is_token(this.__current, 'operator') === true ? this.__current.value : null;
			if (operator !== null && operator === 'in' && noIn === true) {
				operator = null;
			}

			var opPriority = operator !== null ? _OPERATOR_PRIORITIES[operator] : null;
			if (opPriority !== null && opPriority > priority) {

				this.next();

				var right = this.__expression_operator(
					this.__maybe_unary(true),
					opPriority,
					noIn
				);

				return this.__expression_operator(
					this.as('binary', operator, left, right),
					priority,
					noIn
				);

			}

			return left;

		},

		__expression_operators: function(noIn) {

			var left = this.__maybe_unary(true);

			return this.__expression_operator(
				left,
				0,
				noIn
			);

		},

		__for: function() {

			this.expect('punc', '(');

			var init = null;
			if (is_token(this.__current, 'punc', ';') === false) {

				// for (var x...)
				if (is_token(this.__current, 'keyword', 'var') === true) {
					this.next();
					init = this.__var(true);
				} else {
					init = this.__expression(true, true);
				}

				if (is_token(this.__current, 'operator', 'in') === true) {

					if (init[0] === 'var' && init[1].length > 1) {
						this.__throw('Only one variable declaration allowed in for...in loop');
					}

					return this.__for_in(init);

				}

				return this.__for_loop(init);

			}

		},

		__for_in: function(init) {

			var lhs = init[0] === 'var' ? this.as('name', init[1][0]) : init;

			this.next();

			var obj = this.__expression();

			this.expect('punc', ')');

			return this.as('for-in', init, lhs, obj, this.__inLoop(this.__statement, this));

		},

		__for_loop: function(init) {

			this.expect('punc', ';');

			var test = is_token(this.__current, 'punc', ';') ? null : this.__expression();

			this.expect('punc', ';');

			var step = is_token(this.__current, 'punc', ')') ? null : this.__expression();

			this.expect('punc', ')');

			return this.as('for', init, test, step, this.__inLoop(this.__statement, this));

		},

		__function: function(inStatement) {

			inStatement = inStatement === true ? true : false;

			var name = null;
			if (is_token(this.__current, 'name') === true) {
				name = this.__current.value;
				this.next();
			}

			if (inStatement === true && name === null) {
				this.__throwUnexpected();
			}

			this.expect('punc', '(');


			/*
			 * Arguments
			 */
			var first = true;
			var args = [];
			while (is_token(this.__current, 'punc', ')') === false) {

				if (first === true) {
					first = false;
				} else {
					this.expect('punc', ',');
				}

				args.push(this.__current.value);
				this.next();

			}


			this.next();


			/*
			 * Function Body
			 */
			++this.__currentFunction;

			var loop = this.__currentLoop;
			this.__inDirectives = true;
			this.__currentLoop = 0;

			var body = this.__block();

			--this.__currentFunction;
			this.__currentLoop = loop;


			return this.as(
				inStatement ? 'defun' : 'function',
				name,
				args,
				body
			);

		},

		__if: function() {

			var condition = this.__parenthesised();
			var body = this.__statement();
			var elsebody = null;


			if (is_token(this.__current, 'keyword', 'else') === true) {
				this.next();
				elsebody = this.__statement();
			}


			return this.as('if', condition, body, elsebody);

		},

		__maybe_assignment: function(noIn) {

			var left = this.__maybe_conditional(noIn);
			var value = this.__current.value;


			if (
				is_token(this.__current, 'operator') === true
				&& Object.prototype.hasOwnProperty.call(_ASSIGNMENT, value) === true
			) {

				if (this.__isAssignable(left) === true) {

					this.next();

					return this.as(
						'assign',
						_ASSIGNMENT[value],
						left,
						this.__maybe_assignment(noIn)
					);

				} else {
					this.__throw('Invalid assignment');
				}

			}

			return left;

		},

		__maybe_conditional: function(noIn) {

			var expression = this.__expression_operators(noIn);

			if (is_token(this.__current, 'operator', '?') === true) {

				this.next();

				var ifYes = this.__expression(false);

				this.expect('punc', ':');

				var ifNo = this.__expression(false, noIn);

				return this.as('conditional', expression, ifYes, ifNo);

			}

			return expression;

		},

		__maybe_unary: function(allowCalls) {

			if (
				is_token(this.__current, 'operator') === true
				&& Object.prototype.hasOwnProperty.call(_UNARY_PREFIX, this.__current.value) === true
			) {

				var value = this.__current.value;

				this.next();

				return this.__make_unary(
					'unary-prefix',
					value,
					this.__maybe_unary(allowCalls)
				);

			} else {

				var value = this.__expression_atom(allowCalls);

				while (
					is_token(this.__current, 'operator') === true
					&& Object.prototype.hasOwnProperty.call(_UNARY_POSTFIX, this.__current.value) === true
					&& this.__current.newlinebefore !== true
				) {

					value = this.__make_unary(
						'unary-postfix',
						this.__current.value,
						value
					);

					this.next();

				}

				return value;

			}

		},

		__make_unary: function(type, operator, expression) {

			if (
				(operator === '++' || operator === '--')
				&& this.__isAssignable(expression) === false
			) {
				this.__throw('Invalid use of "' + operator +'" operator');
			}

			return this.as(type, operator, expression);

		},

		__new: function() {

			var expression = this.__expression_atom(false);

			var args = null;
			if (is_token(this.__current, 'punc', '(') === true) {

				this.next();
				args = this.__expression_list(')');

			} else {
				args = [];
			}

			return this.__subscripts(
				this.as('new', expression, args),
				true
			);

		},

		__object: function() {

			var list = [];

			var first = true;

			while(is_token(this.__current, 'punc', '}') === false) {

				if (first === true) {
					first = false;
				} else {
					this.expect('punc', ',');
				}

				if (
					this.settings.exigent === false
					&& is_token(this.__current, 'punc', '}') === true
				) {
					// Allows trailing comma
					break;
				}


				var type = this.__current.type;
				var name = this.asPropertyName();

				if (
					type === 'name'
					&& (name === 'get' || name === 'set')
					&& !is_token(this.__current, 'punc', ':')
				) {
					list.push([ this.asName(), this.__function(false), name ]);
				} else {
					this.expect('punc', ':');
					list.push([ name, this.__expression(false) ]);
				}

			}

			this.next();

			return this.as('object', list);

		},

		__return: function() {

			var body = null;

			if (is_token(this.__current, 'punc', ';') === true) {

				this.next();
				body = null;

			} else if (this.__canInsertSemicolon() === true) {

				body = null;

			} else {

				body = this.__expression();
				this.__semicolon();

			}


			return this.as('return', body);

		},

		__semicolon: function() {

			if (is_token(this.__current, 'punc', ';') === true) {
				this.next();
			} else if (this.__canInsertSemicolon() === false) {
				this.__throwUnexpected();
			}

		},

		__subscripts: function(expression, allowCalls) {

			if (is_token(this.__current, 'punc', '.') === true) {

				this.next();

				return this.__subscripts(
					this.as('dot', expression, this.asName()),
					allowCalls
				);

			} else if (is_token(this.__current, 'punc', '[') === true) {

				this.next();

				var subexpression = this.__expression();

				this.expect('punc', ']');

				return this.__subscripts(
					this.as('sub', expression, subexpression),
					allowCalls
				);

			} else if (
				is_token(this.__current, 'punc', '(') === true
				&& allowCalls === true
			) {

				this.next();

				return this.__subscripts(
					this.as(
						'call',
						expression,
						this.__expression_list(')')
					),
					true
				);

			}

			return expression;

		},

		__switch: function() {

			return this.as('switch', this.__parenthesised(), this.__switch_block());

		},

		__switch_block: function() {

			return this.__inLoop(function() {

				this.expect('punc', '{');

				var block = [];
				var current = null;

				while(is_token(this.__current, 'punc', '}') === false) {

					if (is_token(this.__current, 'EOF') === true) {
						this.__throwUnexpected();
					}

					if (is_token(this.__current, 'keyword', 'case') === true) {

						this.next();
						current = [];
						block.push([ this.__expression(), current ]);
						this.expect('punc', ':');

					} else if (is_token(this.__current, 'keyword', 'default') === true) {

						this.next();
						this.expect('punc', ':');
						current = [];
						block.push([ null, current ]);

					} else {

						if (current === null) {
							this.__throwUnexpected();
						}

						current.push(this.__statement());

					}


				}

				this.next();

				return block;

			}, this);

		},

		__try: function() {

			var body = this.__block();
			var catchblock = null;
			var finallyblock = null;


			if (is_token(this.__current, 'keyword', 'catch') === true) {

				this.next();
				this.expect('punc', '(');

				if (is_token(this.__current, 'name') === false) {
					this.__throw('Name expected for try/catch block');
				}

				var name = this.__current.value;

				this.next();
				this.expect('punc', ')');

				catchblock = [ name, this.__block() ];

			}

			if (is_token(this.__current, 'keyword', 'finally') === true) {

				this.next();
				finallyblock = this.__block();

			}

			if (catchblock === null && finallyblock === null) {
				this.__throw('Missing catch/finally block after try');
			}


			return this.as('try', body, catchblock, finallyblock);

		},

		__var: function(noIn) {
			return this.as('var', this.__var_definitions(noIn));
		},

		__var_definitions: function(noIn) {

			var body = [];

			while(true) {

				if (is_token(this.__current, 'name') === false) {
					this.__throwUnexpected();
				}

				var name = this.__current.value;

				this.next();

				if (is_token(this.__current, 'operator', '=')) {
					this.next();
					body.push( [name, this.__expression(false, noIn) ]);
				} else {
					body.push([ name, null ]);
				}


				if (is_token(this.__current, 'punc', ',') === true) {
					this.next();
				} else {
					break;
				}

			}

			return body;

		}

	};


	return Class;

});

