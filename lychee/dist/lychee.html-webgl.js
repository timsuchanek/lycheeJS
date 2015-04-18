
lychee = typeof lychee !== 'undefined' ? lychee : (function(global) {

	/*
	 * NAMESPACE
	 */

	if (typeof lychee === 'undefined') {
		lychee = global.lychee = {};
	}



	/*
	 * POLYFILLS
	 */

	if (typeof Array.prototype.find !== 'function') {

		Array.prototype.find = function(predicate/*, thisArg */) {

			if (this == null) {
				throw new TypeError('Array.prototype.find called on null or undefined');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}

			var list    = Object(this);
			var length  = list.length >>> 0;
			var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			var value;

			for (var i = 0; i < length; i++) {

				value = list[i];

				if (predicate.call(thisArg, value, i, list)) {
					return value;
				}

			}


			return undefined;

		}

	}

	if (typeof Object.filter !== 'function') {

		Object.filter = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.filter called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			var props   = [];
			var values  = [];
			var thisArg = arguments.length >= 3 ? arguments[2] : void 0;

			for (var prop in object) {

				var value = object[prop];

				if (Object.prototype.hasOwnProperty.call(object, prop)) {

					if (predicate.call(thisArg, value, prop, object)) {
						props.push(prop);
						values.push(value);
					}

				}

			}


			var filtered = {};

			for (var i = 0; i < props.length; i++) {
				filtered[props[i]] = values[i];
			}


			return filtered;

		};

	}

	if (typeof Object.find !== 'function') {

		Object.find = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.find called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			var thisArg = arguments.length >= 3 ? arguments[2] : void 0;

			for (var prop in object) {

				var value = object[prop];

				if (Object.prototype.hasOwnProperty.call(object, prop)) {

					if (predicate.call(thisArg, value, prop, object)) {
						return value;
					}

				}

			}


			return undefined;

		};

	}

	if (typeof Object.keys !== 'function') {

		Object.keys = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.keys called on a non-object');
			}


			var keys = [];

			for (var prop in object) {

				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					keys.push(prop);
				}

			}

			return keys;

		};

	}

	if (typeof Object.values !== 'function') {

		Object.values = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.values called on a non-object');
			}


			var values = [];

			for (var prop in object) {

				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					values.push(object[prop]);
				}

			}

			return values;

		};

	}

	if (typeof String.prototype.trim !== 'function') {

		String.prototype.trim = function() {
			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
		};

	}



	/*
	 * HELPERS
	 */

	var _environment = null;

	var _bootstrap_environment = function() {

		if (_environment === null) {

			_environment = new lychee.Environment({
				debug: true
			});

		}


		if (this.environment === null) {
			this.setEnvironment(_environment);
		}

	};

	var _resolve_constructor = function(identifier) {

		var pointer = this;

		var ns = identifier.split('.');
		for (var n = 0, l = ns.length; n < l; n++) {

			var name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}


		return pointer;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		debug:        true,
		environment:  _environment,

		ENVIRONMENTS: {},
		VERSION:      0.85,



		/*
		 * LIBRARY API
		 */

		diff: function(aobject, bobject) {

			var akeys = Object.keys(aobject);
			var bkeys = Object.keys(bobject);

			if (akeys.length !== bkeys.length) {
				return true;
			}


			for (var a = 0, al = akeys.length; a < al; a++) {

				var key = akeys[a];

				if (bobject[key] !== undefined) {

					if (aobject[key] !== null && bobject[key] !== null) {

						if (aobject[key] instanceof Object && bobject[key] instanceof Object) {

							if (lychee.diff(aobject[key], bobject[key]) === true) {

								// Allows aobject[key].builds = {} and bobject[key].builds = { stuff: {}}
								if (Object.keys(aobject[key]).length > 0) {
									return true;
								}

							}

						} else if (typeof aobject[key] !== typeof bobject[key]) {
							return true;
						}

					}

				} else {
					return true;
				}

			}


			return false;

		},

		enumof: function(template, value) {

			if (template instanceof Object && typeof value === 'number') {

				var valid = false;

				for (var val in template) {

					if (value === template[val]) {
						valid = true;
						break;
					}

				}


				return valid;

			}


			return false;

		},

		extend: function(target) {

			for (var a = 1, al = arguments.length; a < al; a++) {

				var object = arguments[a];
				if (object) {

					for (var prop in object) {

						if (object.hasOwnProperty(prop) === true) {
							target[prop] = object[prop];
						}

					}

				}

			}


			return target;

		},

		extendsafe: function(target) {

			for (var a = 1, al = arguments.length; a < al; a++) {

				var object = arguments[a];
				if (object) {

					for (var prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							var tvalue = target[prop];
							var ovalue = object[prop];
							if (tvalue instanceof Array && ovalue instanceof Array) {

								lychee.extendsafe(target[prop], object[prop]);

							} else if (tvalue instanceof Object && ovalue instanceof Object) {

								lychee.extendsafe(target[prop], object[prop]);

							} else if (typeof tvalue === typeof ovalue) {

								target[prop] = object[prop];

							}

						}

					}

				}

			}


			return target;

		},

		extendunlink: function(target) {

			for (var a = 1, al = arguments.length; a < al; a++) {

				var object = arguments[a];
				if (object) {

					for (var prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							var tvalue = target[prop];
							var ovalue = object[prop];
							if (tvalue instanceof Array && ovalue instanceof Array) {
								target[prop] = [];
								lychee.extendunlink(target[prop], object[prop]);
							} else if (tvalue instanceof Object && ovalue instanceof Object) {
								target[prop] = {};
								lychee.extendunlink(target[prop], object[prop]);
							} else {
								target[prop] = object[prop];
							}

						}

					}

				}

			}


			return target;

		},

		interfaceof: function(template, instance) {

			var valid = false;
			var method, property;

			// 1. Interface validation on Template
			if (template instanceof Function && template.prototype instanceof Object && instance instanceof Function && instance.prototype instanceof Object) {

				valid = true;

				for (method in template.prototype) {

					if (typeof template.prototype[method] !== typeof instance.prototype[method]) {
						valid = false;
						break;
					}

				}


			// 2. Interface validation on Instance
			} else if (template instanceof Function && template.prototype instanceof Object && instance instanceof Object) {

				valid = true;

				for (method in template.prototype) {

					if (typeof template.prototype[method] !== typeof instance[method]) {
						valid = false;
						break;
					}

				}


			// 3. Interface validation on Struct
			} else if (template instanceof Object && instance instanceof Object) {

				valid = true;

				for (property in template) {

					if (template.hasOwnProperty(property) && instance.hasOwnProperty(property)) {

						if (typeof template[property] !== typeof instance[property]) {
							valid = false;
							break;
						}

					}

				}

			}


			return valid;

		},



		/*
		 * ENTITY API
		 */

		deserialize: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

				var instance = null;
				var scope    = (this.environment !== null ? this.environment.global : global);


				if (typeof data.reference === 'string') {

					var resolved_module = _resolve_constructor.call(scope, data.reference);
					if (typeof resolved_module === 'object') {
						instance = resolved_module;
					}

				} else if (typeof data.constructor === 'string' && data.arguments instanceof Array) {

					var resolved_class = _resolve_constructor.call(scope, data.constructor);
					if (typeof resolved_class === 'function') {

						var bindargs = [].splice.call(data.arguments, 0).map(function(value) {

							if (typeof value === 'string' && value.charAt(0) === '#') {

								if (lychee.debug === true) {
									console.log('lychee.deserialize: Injecting "' + value + '" from global');
								}

								var resolved = _resolve_constructor.call(scope, value.substr(1));
								if (resolved !== null) {
									value = resolved;
								}

							}

							return value;

						});


						bindargs.reverse();
						bindargs.push(resolved_class);
						bindargs.reverse();


						instance = new (
							resolved_class.bind.apply(
								resolved_class,
								bindargs
							)
						)();

					}

				}


				if (instance !== null) {

					// High-Level ENTITY API
					if (typeof instance.deserialize === 'function') {

						var blob = data.blob || null;
						if (blob !== null) {
							instance.deserialize(blob);
						}

					// Low-Level ASSET API
					} else if (typeof instance.load === 'function') {
						instance.load();
					}


					return instance;

				} else {

					if (lychee.debug === true) {
						console.warn('lychee.deserialize: Require ' + (data.reference || data.constructor) + ' to deserialize it.');
					}

				}

			}


			return null;

		},

		serialize: function(definition) {

			definition = definition !== undefined ? definition : null;


			var data = null;

			if (definition !== null) {

				if (typeof definition === 'object') {

					if (typeof definition.serialize === 'function') {

						data = definition.serialize();

					} else {

						try {
							data = JSON.parse(JSON.stringify(definition));
						} catch(e) {
							data = null;
						}

					}

				} else if (typeof definition === 'function') {

					data = definition.toString();

				}

			}


			return data;

		},



		/*
		 * CUSTOM API
		 */

		define: function(identifier) {

			_bootstrap_environment.call(this);

			var definition  = new lychee.Definition(identifier);
			var environment = this.environment;

			definition.exports = function(callback) {
				lychee.Definition.prototype.exports.call(this, callback);
				environment.define(this);
			};

			return definition;

		},

		init: function(callback) {

			_bootstrap_environment.call(this);

			this.environment.init(callback);

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;
				this.debug = this.environment.debug;

				return true;

			} else {

				this.environment = _environment;
				this.debug = this.environment.debug;

			}


			return false;

		}

	};


	return Module.extend(lychee, Module);

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Asset = typeof lychee.Asset !== 'undefined' ? lychee.Asset : (function(global) {

	var lychee  = global.lychee;
	var console = global.console;



	/*
	 * HELPERS
	 */

	var _resolve_constructor = function(type) {

		var construct = null;


		if (type === 'json') construct = global.Config  || null;
		if (type === 'fnt')  construct = global.Font    || null;
		if (type === 'msc')  construct = global.Music   || null;
		if (type === 'snd')  construct = global.Sound   || null;
		if (type === 'png')  construct = global.Texture || null;


		if (construct === null) {
			construct = global.Stuff || null;
		}


		return construct;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Callback = function(url, type, ignore) {

		url    = typeof url === 'string'  ? url  : null;
		type   = typeof type === 'string' ? type : null;
		ignore = ignore === true;


		if (url !== null) {

			if (type === null) {
				type = url.split('/').pop().split('.').pop();
			}


			var construct = _resolve_constructor(type);
			if (construct !== null) {
				return new construct(url, ignore);
			}

		}


		return null;

	};


	return Callback;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Debugger = typeof lychee.Debugger !== 'undefined' ? lychee.Debugger : (function(global) {

	/*
	 * HELPERS
	 */

	var _client      = null;
	var _environment = null;

	var _bootstrap_environment = function() {

		if (_environment === null) {

			var currentenv = lychee.environment;
			lychee.setEnvironment(null);

			var defaultenv = lychee.environment;
			lychee.setEnvironment(currentenv);

			_environment = defaultenv;

		}

	};

	var _diff_environment = function(environment) {

		var cache1 = {};
		var cache2 = {};

		var global1 = _environment.global;
		var global2 = environment.global;

		for (var prop1 in global1) {

			if (global1[prop1] === global2[prop1]) continue;

			if (typeof global1[prop1] !== typeof global2[prop1]) {
				cache1[prop1] = global1[prop1];
			}

		}

		for (var prop2 in global2) {

			if (global2[prop2] === global1[prop2]) continue;

			if (typeof global2[prop2] !== typeof global1[prop2]) {
				cache2[prop2] = global2[prop2];
			}

		}


		var diff = lychee.extend({}, cache1, cache2);
		if (Object.keys(diff).length > 0) {
			return diff;
		}


		return null;

	};

	var _report = function(data) {

		if (_client === null && typeof sorbet === 'object' && typeof sorbet.net === 'object' && typeof sorbet.net.Client === 'function') {

			_client = new sorbet.net.Client();
			_client.bind('connect', function() {
				_report.call(this, data);
			}, this, true);

		} else if (_client !== null) {

			var service = _client.getService('debugger');
			if (service !== null) {
				service.report('lychee.Debugger Report', data);
			}

		}


		console.error('lychee.Debugger: Report from ' + data.file + '#L' + data.line + ' in ' + data.method + ': "' + data.message + '"');

	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'lychee.Debugger',
				'blob':      null
			};

		},

		expose: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			_bootstrap_environment();


			if (environment !== null) {

				var project = environment.id;
				if (project !== null) {

					if (lychee.diff(environment.global, _environment.global) === true) {

						var diff = _diff_environment(environment);
						if (diff !== null) {
							return diff;
						}

					}

				}

			}


			return null;

		},

		report: function(environment, error, definition) {

			_bootstrap_environment();


			environment = environment instanceof lychee.Environment ? environment : null;
			error       = error instanceof Error                    ? error       : null;
			definition  = definition instanceof lychee.Definition   ? definition  : null;


			if (environment !== null && error !== null) {

				var data = {
					project:     environment.id,
					definition:  definition !== null ? definition.id : null,
					environment: environment.serialize(),
					file:        null,
					line:        null,
					method:      null,
					type:        error.toString().split(':')[0],
					message:     error.message
				};


				if (typeof Error.captureStackTrace === 'function') {

					var orig = Error.prepareStackTrace;

					Error.prepareStackTrace = function(err, stack) { return stack; };
					Error.captureStackTrace(new Error());


					var callsite = error.stack[0];

					data.file   = callsite.getFileName();
					data.line   = callsite.getLineNumber();
					data.method = callsite.getFunctionName() || callsite.getMethodName();


					Error.prepareStackTrace = orig;

				}


				_report(data);


				return true;

			}


			return false;

		}

	};


	return Module;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Definition = typeof lychee.Definition !== 'undefined' ? lychee.Definition : (function(global) {

	var lychee = global.lychee;

	var Class = function(id) {

		id = typeof id === 'string' ? id : '';


		if (id.match(/\./)) {

			var tmp = id.split('.');

			this.id        = id;
			this.classId   = tmp.slice(1).join('.');
			this.packageId = tmp[0];

		} else {

			this.id        = 'lychee.' + id;
			this.classId   = id;
			this.packageId = 'lychee';

		}


		this._attaches = {};
		this._tags     = {};
		this._requires = [];
		this._includes = [];
		this._exports  = null;
		this._supports = null;


		return this;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.attaches instanceof Object) {

				var attachesmap = {};

				for (var aid in blob.attaches) {
					attachesmap[aid] = lychee.deserialize(blob.attaches[aid]);
				}

				this.attaches(attachesmap);

			}

			if (blob.tags instanceof Object) {
				this.tags(blob.tags);
			}

			if (blob.requires instanceof Array) {
				this.requires(blob.requires);
			}

			if (blob.includes instanceof Array) {
				this.includes(blob.includes);
			}


			var index1, index2, tmp, bindargs;

			if (typeof blob.supports === 'string') {

				// Function head
				tmp      = blob.supports.split('{')[0].trim().substr('function '.length);
				bindargs = tmp.substr(1, tmp.length - 2).split(',');

				// Function body
				index1 = blob.supports.indexOf('{') + 1;
				index2 = blob.supports.lastIndexOf('}') - 1;
				bindargs.push(blob.supports.substr(index1, index2 - index1));

				this.supports(Function.apply(Function, bindargs));

			}

			if (typeof blob.exports === 'string') {

				// Function head
				tmp      = blob.exports.split('{')[0].trim().substr('function '.length);
				bindargs = tmp.substr(1, tmp.length - 2).split(',');

				// Function body
				index1 = blob.exports.indexOf('{') + 1;
				index2 = blob.exports.lastIndexOf('}') - 1;
				bindargs.push(blob.exports.substr(index1, index2 - index1));

				this.exports(Function.apply(Function, bindargs));

			}

		},

		serialize: function() {

			var settings = {};
			var blob     = {};


			if (Object.keys(this._attaches).length > 0) {

				blob.attaches = {};

				for (var aid in this._attaches) {
					blob.attaches[aid] = lychee.serialize(this._attaches[aid]);
				}

			}

			if (Object.keys(this._tags).length > 0) {

				blob.tags = {};

				for (var tid in this._tags) {
					blob.tags[tid] = this._tags[tid];
				}

			}

			if (this._requires.length > 0)          blob.requires = this._requires.slice(0);
			if (this._includes.length > 0)          blob.includes = this._includes.slice(0);
			if (this._supports instanceof Function) blob.supports = this._supports.toString();
			if (this._exports instanceof Function)  blob.exports  = this._exports.toString();


			return {
				'constructor': 'lychee.Definition',
				'arguments':   [ this.id ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		attaches: function(map) {

			map = map instanceof Object ? map : null;


			if (map !== null) {

				for (var id in map) {

					var value = map[id];
					if (value instanceof Font || value instanceof Music || value instanceof Sound || value instanceof Texture || value !== undefined) {
						this._attaches[id] = map[id];
					}

				}

			}


			return this;

		},

		exports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {
				this._exports = callback;
			}


			return this;

		},

		includes: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (var d = 0, dl = definitions.length; d < dl; d++) {

					var definition = definitions[d];
					if (typeof definition === 'string') {

						if (definition.indexOf('.') !== -1 && this._includes.indexOf(definition) === -1) {
							this._includes.push(definition);
						}

					}

				}

			}


			return this;

		},

		requires: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (var d = 0, dl = definitions.length; d < dl; d++) {

					var definition = definitions[d];
					if (typeof definition === 'string') {

						if (definition.indexOf('.') !== -1 && this._requires.indexOf(definition) === -1) {
							this._requires.push(definition);
						}

					}

				}

			}


			return this;

		},

		supports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {
				this._supports = callback;
			}


			return this;

		},

		tags: function(map) {

			map = map instanceof Object ? map : null;


			if (map !== null) {

				for (var id in map) {

					var value = map[id];
					if (typeof value === 'string') {
						this._tags[id] = value;
					}

				}

			}


			return this;

		}

	};


	return Class;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Environment = typeof lychee.Environment !== 'undefined' ? lychee.Environment : (function(global) {

	var lychee  = global.lychee;
	var console = global.console;



	/*
	 * EVENTS
	 */

	var _export_loop = function(cache) {

		var that  = this;
		var load  = cache.load;
		var ready = cache.ready;
		var track = cache.track;

		var identifier, definition;


		for (var l = 0, ll = load.length; l < ll; l++) {

			identifier = load[l];
			definition = this.definitions[identifier] || null;


			if (definition !== null) {

				if (ready.indexOf(identifier) === -1) {
					ready.push(identifier);
				}

				load.splice(l, 1);
				track.splice(l, 1);
				ll--;
				l--;

			}

		}


		for (var r = 0, rl = ready.length; r < rl; r++) {

			identifier = ready[r];
			definition = this.definitions[identifier] || null;

			if (definition !== null) {

				var dependencies = _resolve_definition.call(this, definition);
				if (dependencies.length > 0) {

					dependencies.forEach(function(dependency) {

						if (load.indexOf(dependency) === -1 && ready.indexOf(dependency) === -1) {

							that.load(dependency);
							load.push(dependency);
							track.push(identifier);

						}

					});

				} else {

					_export_definition.call(this, definition);

					ready.splice(r, 1);
					rl--;
					r--;

				}

			}

		}


		if (load.length === 0 && ready.length === 0) {

			cache.active = false;

		} else {

			if (Date.now() > cache.timeout) {
				cache.active = false;
			}

		}

	};



	/*
	 * HELPERS
	 */

	var _validate_definition = function(definition) {

		if (!definition instanceof lychee.Definition) {
			return false;
		}


		var supported = false;

		if (definition._supports !== null) {

			// TODO: We need a Proxy for determination of all required sandboxed properties
			supported = definition._supports.call(global, lychee, global);

		} else {
			supported = true;
		}


		var tagged = true;

		if (Object.keys(definition._tags).length > 0) {

			for (var type in definition._tags) {

				var value = definition._tags[type];
				var tags  = this.tags[type] || null;
				if (tags instanceof Array) {

					if (tags.indexOf(value) === -1) {

						tagged = false;
						break;

					}

				}

			}

		}


		var type = this.type;
		if (type === 'build') {

			return tagged;

		} else if (type === 'export') {

			return tagged;

		} else if (type === 'source') {

			return supported && tagged;

		}


		return false;

	};

	var _resolve_definition = function(definition) {

		var dependencies = [];


		if (definition instanceof lychee.Definition) {

			for (var i = 0, il = definition._includes.length; i < il; i++) {

				var inc      = definition._includes[i];
				var incclass = _get_class.call(this.global, inc);
				if (incclass === null) {
					dependencies.push(inc);
				}

			}

			for (var r = 0, rl = definition._requires.length; r < rl; r++) {

				var req      = definition._requires[r];
				var reqclass = _get_class.call(this.global, req);
				if (reqclass === null) {
					dependencies.push(req);
				}

			}

		}


		return dependencies;

	};

	var _export_definition = function(definition) {

		if (_get_class.call(this.global, definition.id) !== null) {
			return false;
		}


		var namespace  = _get_namespace.call(this.global, definition.id);
		var packageId  = definition.packageId;
		var classId    = definition.classId.split('.').pop();


		if (this.debug === true) {
			var info = Object.keys(definition._attaches).length > 0 ? ('(' + Object.keys(definition._attaches).length + ' Attachment(s))') : '';
			this.global.console.log('lychee-Environment (' + this.id + '): Exporting "' + definition.id + '" ' + info);
		}



		/*
		 * 1. Export Class, Module or Callback
		 */

		var template = null;
		if (definition._exports !== null) {

			if (this.debug === true) {

				if (packageId === 'lychee') {

					try {

						// TODO: This needs to be sandboxed, so global will be this.global

						template = definition._exports.call(
							definition._exports,
							this.global.lychee,
							global,
							definition._attaches
						) || null;

					} catch(err) {
						lychee.Debugger.report(this, err, definition);
					}

				} else {

					try {

						// TODO: This needs to be sandboxed, so global will be this.global

						template = definition._exports.call(
							definition._exports,
							this.global.lychee,
							this.global[packageId],
							global,
							definition._attaches
						) || null;

					} catch(err) {
						lychee.Debugger.report(this, err, definition);
					}

				}

			} else {

				if (packageId === 'lychee') {

					// TODO: This needs to be sandboxed, so global will be this.global

					template = definition._exports.call(
						definition._exports,
						this.global.lychee,
						global,
						definition._attaches
					) || null;

				} else {

					// TODO: This needs to be sandboxed, so global will be this.global

					template = definition._exports.call(
						definition._exports,
						this.global.lychee,
						this.global[packageId],
						global,
						definition._attaches
					) || null;

				}

			}

		}



		/*
		 * 2. Extend Class, Module or Callback
		 */

		if (template !== null) {

			/*
			 * 2.1 Extend and export Class or Module
			 */

			var includes = definition._includes;
			if (includes.length > 0) {


				// Cache old prototype
				var oldprototype = null;
				if (template.prototype instanceof Object) {

					oldprototype = {};

					for (var property in template.prototype) {
						oldprototype[property] = template.prototype[property];
					}

				}



				// Define classId in namespace
				Object.defineProperty(namespace, classId, {
					value:        template,
					writable:     false,
					enumerable:   true,
					configurable: false
				});


				// Create new prototype
				namespace[classId].prototype = {};


				var extendargs = [];

				extendargs.push(namespace[classId].prototype);

				for (var i = 0, il = includes.length; i < il; i++) {

					var include = _get_template.call(this.global, includes[i]);
					if (include !== null) {

						extendargs.push(include.prototype);

					} else {

						if (this.debug === true) {
							console.error('lychee-Environment (' + this.id + '): Invalid Inclusion of "' + includes[i] + '"');
						}

					}

				}


				if (oldprototype !== null) {
					extendargs.push(oldprototype);
				}


				lychee.extend.apply(lychee, extendargs);

				Object.seal(namespace[classId].prototype);


			/*
			 * 2.2 Nothing to include, plain Definition
			 */

			} else {

				namespace[classId] = template;


				if (template instanceof Object) {
					Object.seal(namespace[classId]);
				}

			}

		} else {

			namespace[classId] = function() {};

			if (this.debug === true) {
				this.global.console.error('lychee-Environment (' + this.id + '): Invalid Definition "' + definition.id + '", it is a Dummy now.');
			}

		}


		return true;

	};

	var _get_class = function(identifier) {

		var id = identifier.split('.').pop();

		var pointer = _get_namespace.call(this, identifier);
		if (pointer[id] !== undefined) {
			return pointer;
		}


		return null;

	};

	var _get_namespace = function(identifier) {

		var pointer = this;

		var ns = identifier.split('.'); ns.pop();
		for (var n = 0, l = ns.length; n < l; n++) {

			var name = ns[n];

			if (pointer[name] === undefined) {
				pointer[name] = {};
			}

			pointer = pointer[name];

		}


		return pointer;

	};

	var _get_template = function(identifier) {

		var pointer = this;

		var ns = identifier.split('.');
		for (var n = 0, l = ns.length; n < l; n++) {

			var name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}


		return pointer;

	};



	/*
	 * STRUCTS
	 */

	var _Sandbox = function(settings) {

		var that     = this;
		var _std_err = '';
		var _std_out = '';


		this.console = {};
		this.console.log = function() {

			var str = '\n';

			for (var a = 0, al = arguments.length; a < al; a++) {

				var arg = arguments[a];
				if (arg instanceof Object) {
					str += JSON.stringify(arg, null, '\t');
				} else if (typeof arg.toString === 'function') {
					str += arg.toString();
				} else {
					str += arg;
				}

				if (a < al - 1) {
					str += '\t';
				}

			}


			if (str.substr(0, 3) === '(E)') {
				_std_err += str;
			} else {
				_std_out += str;
			}

		};

		this.console.info = function() {

			var args = [ '(I)\t' ];

			for (var a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.warn = function() {

			var args = [ '(W)\t' ];

			for (var a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.error = function() {

			var args = [ '(E)\t' ];

			for (var a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.deserialize = function(blob) {

			if (typeof blob.stdout === 'string') {
				_std_out = blob.stdout;
			}

			if (typeof blob.stderr === 'string') {
				_std_err = blob.stderr;
			}

		};

		this.console.serialize = function() {

			var blob = {};


			if (_std_out.length > 0) blob.stdout = _std_out;
			if (_std_err.length > 0) blob.stderr = _std_err;


			return {
				'reference': 'console',
				'blob':      Object.keys(blob).length > 0 ? blob : null
			};

		};


		this.Buffer  = global.Buffer;
		this.Config  = global.Config;
		this.Font    = global.Font;
		this.Music   = global.Music;
		this.Sound   = global.Sound;
		this.Texture = global.Texture;


		this.lychee              = {};
		this.lychee.ENVIRONMENTS = {};
		this.lychee.VERSION      = global.lychee.VERSION;

		[
			'debug',
			'environment',
			'diff',
			'enumof',
			'extend',
			'extendsafe',
			'extendunlink',
			'interfaceof',
			'deserialize',
			'serialize',
			'define',
			'init',
			'setEnvironment',
			'Asset',
			'Debugger',
			'Definition',
			'Environment',
			'Package'
		].forEach(function(identifier) {

			that.lychee[identifier] = global.lychee[identifier];

		});


		this.setTimeout = function(callback, timeout) {
			global.setTimeout(callback, timeout);
		};

		this.setInterval = function(callback, interval) {
			global.setInterval(callback, interval);
		};



		/*
		 * INITIALIZATION
		 */

		if (settings instanceof Object) {

			Object.keys(settings).forEach(function(key) {

				var instance = lychee.deserialize(settings[key]);
				if (instance !== null) {
					this[key] = instance;
				}

			}.bind(this));

		}

	};

	_Sandbox.prototype = {

		deserialize: function(blob) {

			if (blob.console instanceof Object) {
				this.console.deserialize(blob.console.blob);
			}

		},

		serialize: function() {

			var settings = {};
			var blob     = {};


			Object.keys(this).filter(function(key) {
				return key.charAt(0) !== '_' && key === key.toUpperCase();
			}).forEach(function(key) {
				settings[key] = lychee.serialize(this[key]);
			}.bind(this));


			var data = this.console.serialize();
			if (data.blob !== null) {
				blob.console = data;
			}


			return {
				'constructor': '_Sandbox',
				'arguments':   [ settings ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var _id = 0;

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.id          = 'lychee-Environment-' + _id++;
		this.build       = 'game.Main';
		this.debug       = true;
		this.definitions = {};
		this.global      = new _Sandbox();
		this.packages    = [];
		this.sandbox     = true;
		this.tags        = {};
		this.timeout     = 10000;
		this.type        = 'source';


		this.__cache = {
			active:   false,
			start:    0,
			end:      0,
			timeout:  0,
			load:     [],
			ready:    [],
			track:    []
		};


		// Alternative API for lychee.pkg

		if (settings.packages instanceof Array) {

			for (var p = 0, pl = settings.packages.length; p < pl; p++) {

				var pkg = settings.packages[p];
				if (pkg instanceof Array) {
					settings.packages[p] = new lychee.Package(pkg[0], pkg[1]);
				}

			}

		}


		this.setSandbox(settings.sandbox);
		this.setDebug(settings.debug);

		this.setDefinitions(settings.definitions);
		this.setId(settings.id);
		this.setPackages(settings.packages);
		this.setTags(settings.tags);
		this.setTimeout(settings.timeout);

		// Needs this.packages to be ready
		this.setType(settings.type);
		this.setBuild(settings.build);



		/*
		 * INITIALIZATION
		 */

		var type = this.type;
		if (type === 'source' || type === 'export') {

			var lypkg = this.packages.find(function(pkg) {
				return pkg.id === 'lychee';
			}) || null;

			if (lypkg === null) {

				lypkg = new lychee.Package('lychee', '/lychee/lychee.pkg');

				if (this.debug === true) {
					this.global.console.log('lychee-Environment (' + this.id + '): Injecting Package "lychee"');
				}

				lypkg.setEnvironment(this);
				this.packages.push(lypkg);

			}

		}


		settings = null;

	};



	/*
	 * BOOTSTRAP API
	 */

	Class.__FILENAME = null;



	/*
	 * IMPLEMENTATION
	 */

	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.definitions instanceof Object) {

				for (var id in blob.definitions) {
					this.definitions[id] = lychee.deserialize(blob.definitions[id]);
				}

			}

			if (blob.packages instanceof Array) {

				var packages = [];

				for (var p = 0, pl = blob.packages.length; p < pl; p++) {
					packages.push(lychee.deserialize(blob.packages[p]));
				}

				this.setPackages(packages);

				// This is a dirty hack which is allowed here
				this.setType(blob.type);
				this.setBuild(blob.build);

			} else {

				// This is a dirty hack which is allowed here
				this.setType(blob.type);
				this.setBuild(blob.build);

			}

			if (blob.global instanceof Object) {

				this.global = new _Sandbox(blob.global.arguments[0]);

				if (blob.global.blob !== null) {
					this.global.deserialize(blob.global.blob);
				}

			}

		},

		serialize: function() {

			var settings = {};
			var blob     = {};


			if (this.id !== '0')            settings.id      = this.id;
			if (this.build !== 'game.Main') settings.build   = this.build;
			if (this.debug !== true)        settings.debug   = this.debug;
			if (this.sandbox !== true)      settings.sandbox = this.sandbox;
			if (this.timeout !== 10000)     settings.timeout = this.timeout;
			if (this.type !== 'source')     settings.type    = this.type;


			if (Object.keys(this.tags).length > 0) {

				settings.tags = {};

				for (var tagid in this.tags) {
					settings.tags[tagid] = this.tags[tagid];
				}

			}

			if (Object.keys(this.definitions).length > 0) {

				blob.definitions = {};

				for (var defid in this.definitions) {
					blob.definitions[defid] = lychee.serialize(this.definitions[defid]);
				}

			}

			if (this.packages.length > 0) {

				blob.packages = [];

				for (var p = 0, pl = this.packages.length; p < pl; p++) {
					blob.packages.push(lychee.serialize(this.packages[p]));
				}

				// This is a dirty hack which is allowed here
				blob.type  = this.type;
				blob.build = this.build;

			}

			if (this.sandbox === true) {
				blob.global = this.global.serialize();
			}


			return {
				'constructor': 'lychee.Environment',
				'arguments':   [ settings ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		load: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				var packageId = identifier.split('.')[0];
				var classId   = identifier.split('.').slice(1).join('.');


				var definition = this.definitions[identifier] || null;
				if (definition !== null) {

					return true;

				} else {

					var pkg = this.packages.find(function(pkg) {
						return pkg.id === packageId;
					}) || null;

					if (pkg !== null && pkg.isReady() === true) {

						var result = pkg.load(classId, this.tags);
						if (result === true) {

							if (this.debug === true) {
								this.global.console.log('lychee-Environment (' + this.id + '): Loading "' + identifier + '" from Package "' + pkg.id + '"');
							}

						}


						return result;

					}

				}

			}


			return false;

		},

		define: function(definition) {

			var filename = Class.__FILENAME || null;
			if (filename !== null) {

				if (definition instanceof lychee.Definition) {

					var oldPackageId = definition.packageId;
					var newPackageId = null;

					for (var p = 0, pl = this.packages.length; p < pl; p++) {

						var root = this.packages[p].root;
						if (filename.substr(0, root.length) === root) {
							newPackageId = this.packages[p].id;
							break;
						}

					}


					if (newPackageId !== null && newPackageId !== oldPackageId) {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): Injecting Definition "' + definition.id + '" as "' + newPackageId + '.' + definition.classId + '"');
						}


						definition.packageId = newPackageId;
						definition.id        = definition.packageId + '.' + definition.classId;

						for (var i = 0, il = definition._includes.length; i < il; i++) {

							var inc = definition._includes[i];
							if (inc.substr(0, oldPackageId.length) === oldPackageId) {
								definition._includes[i] = newPackageId + inc.substr(oldPackageId.length);
							}

						}

						for (var r = 0, rl = definition._requires.length; r < rl; r++) {

							var req = definition._requires[r];
							if (req.substr(0, oldPackageId.length) === oldPackageId) {
								definition._requires[r] = newPackageId + req.substr(oldPackageId.length);
							}

						}

					}

				}

			}


			if (_validate_definition.call(this, definition) === true) {

				if (this.debug === true) {
					var info = Object.keys(definition._tags).length > 0 ? ('(' + JSON.stringify(definition._tags) + ')') : '';
					this.global.console.log('lychee-Environment (' + this.id + '): Mapping "' + definition.id + '" ' + info);
				}

				this.definitions[definition.id] = definition;

			} else {

				if (this.debug === true) {
					this.global.console.error('lychee-Environment (' + this.id + '): Invalid Definition "' + definition.id + '"');
				}

			}

		},

		init: function(callback) {

			callback = callback instanceof Function ? callback : function() {};


			var build = this.build;
			var cache = this.__cache;
			var that  = this;

			if (build !== null && cache.active === false) {

				var result = this.load(build, 'lychee.init');
				if (result === true) {

					if (this.debug === true) {
						this.global.console.log('lychee-Environment (' + this.id + '): BUILD START ("' + this.build + '")');
					}


					cache.start   = Date.now();
					cache.timeout = Date.now() + this.timeout;
					cache.load    = [ build ];
					cache.ready   = [];
					cache.active  = true;


					var onbuildtimeout = function() {

						if (this.debug === true) {

							this.global.console.error('lychee-Environment (' + this.id + '): BUILD TIMEOUT (' + (cache.end - cache.start) + 'ms)');
							this.global.console.error('lychee-Environment (' + this.id + '): Invalid Dependencies ' + cache.load.map(function(value, index) {
								return '"' + value + '" (required by ' + cache.track[index] + ')';
							}).join(', '));

						}


						if (this.debug === true) {

							try {
								callback.call(this.global, null);
							} catch(err) {
								lychee.Debugger.report(this, err, null);
							}

						} else {

							callback.call(this.global, null);

						}

					};

					var onbuildsuccess = function() {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): BUILD END (' + (cache.end - cache.start) + 'ms)');
						}


						if (this.sandbox === true) {
							this.global.lychee.environment = this;
						}


						if (this.debug === true) {

							try {
								callback.call(this.global, this.global);
							} catch(err) {
								lychee.Debugger.report(this, err, null);
							}

						} else {

							callback.call(this.global, this.global);

						}

					};


					var intervalId = setInterval(function() {

						var cache = that.__cache;
						if (cache.active === true) {

							_export_loop.call(that, cache);

						} else if (cache.active === false) {

							if (intervalId !== null) {
								clearInterval(intervalId);
								intervalId = null;
							}


							cache.end = Date.now();


							if (cache.end > cache.timeout) {
								onbuildtimeout.call(that);
							} else {
								onbuildsuccess.call(that);
							}

						}

					}, (1000 / 60) | 0);

				} else {

					if (this.debug === true) {
						this.global.console.log('lychee-Environment (' + this.id + '): Package not ready, retrying in 100ms ...');
					}


					setTimeout(function() {
						that.init(callback);
					}, 100);

				}

			}

		},

		setBuild: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				var type = this.type;
				if (type === 'build') {

					this.build = identifier;

					return true;

				} else {

					var pkg = this.packages.find(function(pkg) {
						return pkg.id === identifier.split('.')[0];
					});

					if (pkg !== null) {

						this.build = identifier;

						return true;

					}

				}

			}


			return false;

		},

		setDebug: function(debug) {

			if (debug === true || debug === false) {

				this.debug = debug;

				if (this.sandbox === true) {
					this.global.lychee.debug = debug;
				}

				return true;

			}


			return false;

		},

		setDefinitions: function(definitions) {

			definitions = definitions instanceof Object ? definitions : null;


			if (definitions !== null) {

				for (var identifier in definitions) {

					var definition = definitions[identifier];
					if (definition instanceof lychee.Definition) {
						this.definitions[identifier] = definition;
					}

				}


				return true;

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;


				return true;

			}


			return false;

		},

		setPackages: function(packages) {

			packages = packages instanceof Array ? packages : null;


			if (packages !== null) {

				this.packages.forEach(function(pkg) {
					pkg.setEnvironment(null);
				});

				this.packages = packages.filter(function(pkg) {

					if (pkg instanceof lychee.Package) {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): Adding Package "' + pkg.id + '"');
						}

						pkg.setEnvironment(this);

						return true;

					}


					return false;

				}.bind(this));


				return true;

			}


			return false;

		},

		setSandbox: function(sandbox) {

			if (sandbox === true || sandbox === false) {

				this.sandbox = sandbox;


				if (sandbox === true) {
					this.global = new _Sandbox();
				} else {
					this.global = global;
				}


				return true;

			}


			return false;

		},

		setTags: function(tags) {

			tags = tags instanceof Object ? tags : null;


			if (tags !== null) {

				this.tags = {};


				for (var type in tags) {

					var values = tags[type];
					if (values instanceof Array) {

						this.tags[type] = values.filter(function(value) {
							return typeof value === 'string';
						});

					}

				}


				return true;

			}


			return false;

		},

		setTimeout: function(timeout) {

			timeout = typeof timeout === 'number' ? timeout : null;


			if (timeout !== null) {

				this.timeout = timeout;

				return true;

			}


			return false;

		},

		setType: function(type) {

			if (type === 'source' || type === 'export' || type === 'build') {

				this.type = type;


				for (var p = 0, pl = this.packages.length; p < pl; p++) {
					this.packages[p].setType(this.type);
				}


				return true;

			}


			return false;

		}

	};


	return Class;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Package = typeof lychee.Package !== 'undefined' ? lychee.Package : (function(global) {

	var lychee = global.lychee;


	/*
	 * HELPERS
	 */

	var _resolve_root = function() {

		var root = this.root;
		var type = this.type;
		if (type === 'source') {
			root += '/source';
		} else if (type === 'export') {
			root += '/source';
		} else if (type === 'build') {
			root += '/build';
		}


		return root;

	};

	var _resolve_path = function(candidate) {

		var path = typeof candidate === 'string' ? candidate.split('/') : null;


		if (path !== null) {

			var type = this.type;
			if (type === 'export') {
				type = 'source';
			}


			var pointer = this.__config.buffer[type].files || null;
			if (pointer !== null) {

				for (var p = 0, pl = path.length; p < pl; p++) {

					var name = path[p];
					if (pointer[name] !== undefined) {
						pointer = pointer[name];
					} else {
						pointer = null;
						break;
					}

				}

			}


			return pointer !== null ? true : false;

		}


		return false;

	};

	var _resolve_attachments = function(candidate) {

		var attachments = {};
		var path        = candidate.split('/');
		if (path.length > 0) {

			var pointer = this.__config.buffer.source.files || null;
			if (pointer !== null) {

				for (var pa = 0, pal = path.length; pa < pal; pa++) {

					var name = path[pa];
					if (pointer[name] !== undefined) {
						pointer = pointer[name];
					} else {
						pointer = null;
						break;
					}

				}


				if (pointer !== null && pointer instanceof Array) {

					var classpath = _resolve_root.call(this) + '/' + path.join('/');

					for (var po = 0, pol = pointer.length; po < pol; po++) {

						var type = pointer[po];
						if (type !== 'js') {
							attachments[type] = classpath + '.' + type;
						}

					}

				}

			}

		}


		return attachments;

	};

	var _resolve_candidates = function(id, tags) {

		tags = tags instanceof Object ? tags : null;


		var that          = this;
		var candidatepath = id.split('.').join('/');
		var candidates    = [];

		if (tags !== null) {

			for (var tag in tags) {

				var values = tags[tag].map(function(value) {
					return _resolve_tag.call(that, tag, value) + '/' + candidatepath;
				}).filter(function(path) {
					return _resolve_path.call(that, path);
				});

				if (values.length > 0) {
					candidates.push.apply(candidates, values);
				}

			}

		}


		if (_resolve_path.call(this, candidatepath) === true) {
			candidates.push(candidatepath);
		}


		return candidates;

	};

	var _resolve_tag = function(tag, value) {

		tag   = typeof tag === 'string'   ? tag   : null;
		value = typeof value === 'string' ? value : null;


		if (tag !== null && value !== null) {

			var type = this.type;
			if (type === 'export') {
				type = 'source';
			}


			var pointer = this.__config.buffer[type].tags || null;
			if (pointer !== null) {

				if (pointer[tag] instanceof Object) {

					var path = pointer[tag][value] || null;
					if (path !== null) {
						return path;
					}

				}

			}

		}


		return '';

	};

	var _load_candidate = function(id, candidates) {

		if (candidates.length > 0) {

			var map = {
				id:           id,
				candidate:    null,
				candidates:   [].concat(candidates),
				attachments:  [],
				dependencies: [],
				loading:      1
			};


			this.__requests[id] = map;


			var candidate = map.candidates.shift();

			while (candidate !== undefined) {

				if (this.__blacklist[candidate] === 1) {
					candidate = map.candidates.shift();
				} else {
					break;
				}

			}


			// Try to load the first suggested Candidate Implementation
			if (candidate !== undefined) {

				var url            = _resolve_root.call(this) + '/' + candidate + '.js';
				var implementation = new lychee.Asset(url, null, false);
				var attachments    = _resolve_attachments.call(this, candidate);

				if (implementation !== null) {
					_load_candidate_implementation.call(this, candidate, implementation, attachments, map);
				}

			}

		}

	};

	var _load_candidate_implementation = function(candidate, implementation, attachments, map) {

		var that       = this;
		var identifier = this.id + '.' + map.id;


		implementation.onload = function(result) {

			map.loading--;


			if (result === true) {

				var environment = that.environment;
				var definition  = environment.definitions[identifier] || null;
				if (definition !== null) {

					map.candidate = this;


					var attachmentIds = Object.keys(attachments);


					// Temporary delete definition from environment and re-define it after attachments are all loaded
					if (attachmentIds.length > 0) {

						delete environment.definitions[identifier];

						map.loading += attachmentIds.length;


						attachmentIds.forEach(function(assetId) {

							var url   = attachments[assetId];
							var asset = new lychee.Asset(url);
							if (asset !== null) {

								asset.onload = function(result) {

									map.loading--;

									var tmp = {};
									if (result === true) {
										tmp[assetId] = this;
									} else {
										tmp[assetId] = null;
									}

									definition.attaches(tmp);


									if (map.loading === 0) {
										environment.definitions[identifier] = definition;
									}

								};

								asset.load();

							} else {

								map.loading--;

							}

						});

					}


					for (var i = 0, il = definition._includes.length; i < il; i++) {
						environment.load(definition._includes[i]);
					}

					for (var r = 0, rl = definition._requires.length; r < rl; r++) {
						environment.load(definition._requires[r]);
					}


					return true;

				}

			}



			// If code runs through here, candidate was invalid
			delete that.environment.definitions[identifier];
			that.__blacklist[candidate] = 1;

			// Load next candidate, if any available
			if (map.candidates.length > 0) {
				_load_candidate.call(that, map.id, map.candidates);
			}

		};

		implementation.load();

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(id, url) {

		id  = typeof id === 'string'  ? id  : 'game';
		url = typeof url === 'string' ? url : null;


		// This is public to allow loading packages
		// as external renamespaced libraries

		this.id   = id;
		this.url  = null;
		this.root = null;

		this.environment = null;
		this.type        = 'source';

		this.__blacklist = {};
		this.__config    = null;
		this.__requests  = {};


		if (url !== null) {

			var that = this;
			var tmp  = url.split('/');

			var file = tmp.pop();
			if (file === 'lychee.pkg') {

				this.root = tmp.join('/');
				this.url  = url;

				this.__config = new Config(this.url);
				this.__config.onload = function(result) {

					if (that.isReady() === false) {
						result = false;
					}


					if (result === true) {

						if (lychee.debug === true) {
							console.info('lychee.Package-' + that.id + ': Package at ' + this.url + ' ready');
						}

					} else {

						if (lychee.debug === true) {
							console.error('lychee.Package-' + that.id + ': Package at ' + this.url + ' corrupt');
						}

					}

				};
				this.__config.load();

			}

		}

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'constructor': 'lychee.Package',
				'arguments':   [ this.id, this.url ]
			};

		},



		/*
		 * CUSTOM API
		 */

		isReady: function() {

			var ready  = false;
			var config = this.__config;

			if (config !== null && config.buffer !== null) {

				if (config.buffer.source instanceof Object && config.buffer.build instanceof Object) {
					ready = true;
				}

			}


			return ready;

		},

		load: function(id, tags) {

			id   = typeof id === 'string' ? id   : null;
			tags = tags instanceof Object ? tags : null;


			if (id !== null && this.isReady() === true) {

				var request = this.__requests[id] || null;
				if (request === null) {

					var candidates = _resolve_candidates.call(this, id, tags);
					if (candidates.length > 0) {

						_load_candidate.call(this, id, candidates);

						return true;

					} else {

						if (lychee.debug === true) {
							var info = Object.keys(tags).length > 0 ? ('(' + JSON.stringify(tags) + ')') : '';
							console.error('lychee.Package-' + this.id + ': Invalid Definition "' + id + '" ' + info);
						}

						return false;

					}

				} else {

					return true;

				}

			}


			return false;

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;

				return true;

			}


			return false;

		},

		setType: function(type) {

			type = typeof type === 'string' ? type : null;


			if (type !== null) {

				if (type === 'source' || type === 'export' || type === 'build') {

					this.type = type;

					return true;

				}

			}


			return false;

		}

	};


	return Class;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee = typeof lychee !== 'undefined' ? lychee : (function(global) {

	/*
	 * NAMESPACE
	 */

	if (typeof lychee === 'undefined') {
		lychee = global.lychee = {};
	}



	/*
	 * POLYFILLS
	 */

	if (typeof Array.prototype.find !== 'function') {

		Array.prototype.find = function(predicate/*, thisArg */) {

			if (this == null) {
				throw new TypeError('Array.prototype.find called on null or undefined');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}

			var list    = Object(this);
			var length  = list.length >>> 0;
			var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			var value;

			for (var i = 0; i < length; i++) {

				value = list[i];

				if (predicate.call(thisArg, value, i, list)) {
					return value;
				}

			}


			return undefined;

		}

	}

	if (typeof Object.filter !== 'function') {

		Object.filter = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.filter called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			var props   = [];
			var values  = [];
			var thisArg = arguments.length >= 3 ? arguments[2] : void 0;

			for (var prop in object) {

				var value = object[prop];

				if (Object.prototype.hasOwnProperty.call(object, prop)) {

					if (predicate.call(thisArg, value, prop, object)) {
						props.push(prop);
						values.push(value);
					}

				}

			}


			var filtered = {};

			for (var i = 0; i < props.length; i++) {
				filtered[props[i]] = values[i];
			}


			return filtered;

		};

	}

	if (typeof Object.find !== 'function') {

		Object.find = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.find called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			var thisArg = arguments.length >= 3 ? arguments[2] : void 0;

			for (var prop in object) {

				var value = object[prop];

				if (Object.prototype.hasOwnProperty.call(object, prop)) {

					if (predicate.call(thisArg, value, prop, object)) {
						return value;
					}

				}

			}


			return undefined;

		};

	}

	if (typeof Object.keys !== 'function') {

		Object.keys = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.keys called on a non-object');
			}


			var keys = [];

			for (var prop in object) {

				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					keys.push(prop);
				}

			}

			return keys;

		};

	}

	if (typeof Object.values !== 'function') {

		Object.values = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.values called on a non-object');
			}


			var values = [];

			for (var prop in object) {

				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					values.push(object[prop]);
				}

			}

			return values;

		};

	}

	if (typeof String.prototype.trim !== 'function') {

		String.prototype.trim = function() {
			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
		};

	}



	/*
	 * HELPERS
	 */

	var _environment = null;

	var _bootstrap_environment = function() {

		if (_environment === null) {

			_environment = new lychee.Environment({
				debug: true
			});

		}


		if (this.environment === null) {
			this.setEnvironment(_environment);
		}

	};

	var _resolve_constructor = function(identifier) {

		var pointer = this;

		var ns = identifier.split('.');
		for (var n = 0, l = ns.length; n < l; n++) {

			var name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}


		return pointer;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		debug:        true,
		environment:  _environment,

		ENVIRONMENTS: {},
		VERSION:      0.85,



		/*
		 * LIBRARY API
		 */

		diff: function(aobject, bobject) {

			var akeys = Object.keys(aobject);
			var bkeys = Object.keys(bobject);

			if (akeys.length !== bkeys.length) {
				return true;
			}


			for (var a = 0, al = akeys.length; a < al; a++) {

				var key = akeys[a];

				if (bobject[key] !== undefined) {

					if (aobject[key] !== null && bobject[key] !== null) {

						if (aobject[key] instanceof Object && bobject[key] instanceof Object) {

							if (lychee.diff(aobject[key], bobject[key]) === true) {

								// Allows aobject[key].builds = {} and bobject[key].builds = { stuff: {}}
								if (Object.keys(aobject[key]).length > 0) {
									return true;
								}

							}

						} else if (typeof aobject[key] !== typeof bobject[key]) {
							return true;
						}

					}

				} else {
					return true;
				}

			}


			return false;

		},

		enumof: function(template, value) {

			if (template instanceof Object && typeof value === 'number') {

				var valid = false;

				for (var val in template) {

					if (value === template[val]) {
						valid = true;
						break;
					}

				}


				return valid;

			}


			return false;

		},

		extend: function(target) {

			for (var a = 1, al = arguments.length; a < al; a++) {

				var object = arguments[a];
				if (object) {

					for (var prop in object) {

						if (object.hasOwnProperty(prop) === true) {
							target[prop] = object[prop];
						}

					}

				}

			}


			return target;

		},

		extendsafe: function(target) {

			for (var a = 1, al = arguments.length; a < al; a++) {

				var object = arguments[a];
				if (object) {

					for (var prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							var tvalue = target[prop];
							var ovalue = object[prop];
							if (tvalue instanceof Array && ovalue instanceof Array) {

								lychee.extendsafe(target[prop], object[prop]);

							} else if (tvalue instanceof Object && ovalue instanceof Object) {

								lychee.extendsafe(target[prop], object[prop]);

							} else if (typeof tvalue === typeof ovalue) {

								target[prop] = object[prop];

							}

						}

					}

				}

			}


			return target;

		},

		extendunlink: function(target) {

			for (var a = 1, al = arguments.length; a < al; a++) {

				var object = arguments[a];
				if (object) {

					for (var prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							var tvalue = target[prop];
							var ovalue = object[prop];
							if (tvalue instanceof Array && ovalue instanceof Array) {
								target[prop] = [];
								lychee.extendunlink(target[prop], object[prop]);
							} else if (tvalue instanceof Object && ovalue instanceof Object) {
								target[prop] = {};
								lychee.extendunlink(target[prop], object[prop]);
							} else {
								target[prop] = object[prop];
							}

						}

					}

				}

			}


			return target;

		},

		interfaceof: function(template, instance) {

			var valid = false;
			var method, property;

			// 1. Interface validation on Template
			if (template instanceof Function && template.prototype instanceof Object && instance instanceof Function && instance.prototype instanceof Object) {

				valid = true;

				for (method in template.prototype) {

					if (typeof template.prototype[method] !== typeof instance.prototype[method]) {
						valid = false;
						break;
					}

				}


			// 2. Interface validation on Instance
			} else if (template instanceof Function && template.prototype instanceof Object && instance instanceof Object) {

				valid = true;

				for (method in template.prototype) {

					if (typeof template.prototype[method] !== typeof instance[method]) {
						valid = false;
						break;
					}

				}


			// 3. Interface validation on Struct
			} else if (template instanceof Object && instance instanceof Object) {

				valid = true;

				for (property in template) {

					if (template.hasOwnProperty(property) && instance.hasOwnProperty(property)) {

						if (typeof template[property] !== typeof instance[property]) {
							valid = false;
							break;
						}

					}

				}

			}


			return valid;

		},



		/*
		 * ENTITY API
		 */

		deserialize: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

				var instance = null;
				var scope    = (this.environment !== null ? this.environment.global : global);


				if (typeof data.reference === 'string') {

					var resolved_module = _resolve_constructor.call(scope, data.reference);
					if (typeof resolved_module === 'object') {
						instance = resolved_module;
					}

				} else if (typeof data.constructor === 'string' && data.arguments instanceof Array) {

					var resolved_class = _resolve_constructor.call(scope, data.constructor);
					if (typeof resolved_class === 'function') {

						var bindargs = [].splice.call(data.arguments, 0).map(function(value) {

							if (typeof value === 'string' && value.charAt(0) === '#') {

								if (lychee.debug === true) {
									console.log('lychee.deserialize: Injecting "' + value + '" from global');
								}

								var resolved = _resolve_constructor.call(scope, value.substr(1));
								if (resolved !== null) {
									value = resolved;
								}

							}

							return value;

						});


						bindargs.reverse();
						bindargs.push(resolved_class);
						bindargs.reverse();


						instance = new (
							resolved_class.bind.apply(
								resolved_class,
								bindargs
							)
						)();

					}

				}


				if (instance !== null) {

					// High-Level ENTITY API
					if (typeof instance.deserialize === 'function') {

						var blob = data.blob || null;
						if (blob !== null) {
							instance.deserialize(blob);
						}

					// Low-Level ASSET API
					} else if (typeof instance.load === 'function') {
						instance.load();
					}


					return instance;

				} else {

					if (lychee.debug === true) {
						console.warn('lychee.deserialize: Require ' + (data.reference || data.constructor) + ' to deserialize it.');
					}

				}

			}


			return null;

		},

		serialize: function(definition) {

			definition = definition !== undefined ? definition : null;


			var data = null;

			if (definition !== null) {

				if (typeof definition === 'object') {

					if (typeof definition.serialize === 'function') {

						data = definition.serialize();

					} else {

						try {
							data = JSON.parse(JSON.stringify(definition));
						} catch(e) {
							data = null;
						}

					}

				} else if (typeof definition === 'function') {

					data = definition.toString();

				}

			}


			return data;

		},



		/*
		 * CUSTOM API
		 */

		define: function(identifier) {

			_bootstrap_environment.call(this);

			var definition  = new lychee.Definition(identifier);
			var environment = this.environment;

			definition.exports = function(callback) {
				lychee.Definition.prototype.exports.call(this, callback);
				environment.define(this);
			};

			return definition;

		},

		init: function(callback) {

			_bootstrap_environment.call(this);

			this.environment.init(callback);

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;
				this.debug = this.environment.debug;

				return true;

			} else {

				this.environment = _environment;
				this.debug = this.environment.debug;

			}


			return false;

		}

	};


	return Module.extend(lychee, Module);

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


(function(lychee, global) {

	/*
	 * HELPERS
	 */

	var _load_asset = function(settings, callback, scope) {

		var proto = settings.url.split(':')[0];
		if (proto === 'file') {

			callback.call(scope, null);

		} else {

			var xhr = new XMLHttpRequest();

			xhr.open('GET', settings.url, true);


			if (settings.headers instanceof Object) {

				for (var header in settings.headers) {
					xhr.setRequestHeader(header, settings.headers[header]);
				}

			}


			xhr.onload = function() {

				try {
					callback.call(scope, xhr.responseText || xhr.responseXML);
				} catch(err) {
					lychee.Debugger.report(lychee.environment, err, null);
				} finally {
					xhr = null;
				}

			};

			xhr.onerror = xhr.ontimeout = function() {

				try {
					callback.call(scope, null);
				} catch(err) {
					lychee.Debugger.report(lychee.environment, err, null);
				} finally {
					xhr = null;
				}

			};


			xhr.send(null);

		}

	};



	/*
	 * POLYFILLS
	 */

	var _log = console.log || function() {};


	if (typeof console.info === 'undefined') {

		console.info = function() {

			var al   = arguments.length;
			var args = new Array(al);
			for (var a = 0; a < al; a++) {
				args[a] = arguments[a];
			}


			args.reverse();
			args.push('[INFO]');
			args.reverse();

			_log.apply(console, args);

		};

	}


	if (typeof console.warn === 'undefined') {

		console.warn = function() {

			var al   = arguments.length;
			var args = new Array(al);
			for (var a = 0; a < al; a++) {
				args[a] = arguments[a];
			}

			args.reverse();
			args.push('[WARN]');
			args.reverse();

			_log.apply(console, args);

		};

	}


	if (typeof console.error === 'undefined') {

		console.error = function() {

			var al   = arguments.length;
			var args = new Array(al);
			for (var a = 0; a < al; a++) {
				args[a] = arguments[a];
			}

			args.reverse();
			args.push('[ERROR]');
			args.reverse();

			_log.apply(console, args);

		};

	}



	/*
	 * FEATURE DETECTION
	 */

	var _audio_supports_ogg = false;
	var _audio_supports_mp3 = false;

	(function() {

		var _buffer_cache = {};
		var _load_buffer  = function(url) {

			var cache = _buffer_cache[url] || null;
			if (cache === null) {

				var xhr = new XMLHttpRequest();

				xhr.open('GET', url, true);
				xhr.responseType = 'arraybuffer';
				xhr.onload = function() {

					var bytes  = new Uint8Array(xhr.response);
					var buffer = new Buffer(bytes.length);

					for (var b = 0, bl = bytes.length; b < bl; b++) {
						buffer[b] = bytes[b];
					}

					cache = _buffer_cache[url] = buffer;

				};
				xhr.send(null);

			}

			return cache;

		};


		var consol = 'console' in global && typeof console !== 'undefined';
		var audio  = 'Audio' in global && typeof Audio !== 'undefined';
		var buffer = true;
		var image  = 'Image' in global && typeof Image !== 'undefined';


		if (consol) {

		} else {

			console = {};

		}


		if (audio) {

			var audiotest = new Audio();

			[ 'application/ogg', 'audio/ogg', 'audio/ogg; codecs=theora, vorbis' ].forEach(function(variant) {

				if (audiotest.canPlayType(variant)) {
					_audio_supports_ogg = true;
				}

			});

			[ 'audio/mpeg' ].forEach(function(variant) {

				if (audiotest.canPlayType(variant)) {
					_audio_supports_mp3 = true;
				}

			});

		} else {

			Audio = function() {

				this.src         = '';
				this.currentTime = 0;
				this.volume      = 0;
				this.autobuffer  = false;
				this.preload     = false;

				this.onload  = null;
				this.onerror = null;

			};


			Audio.prototype = {

				load: function() {

					if (this.onerror !== null) {
						this.onerror.call(this);
					}

				},

				play: function() {

				},

				pause: function() {

				},

				addEventListener: function() {

				}

			};

		}


		Audio.prototype.toString = function(encoding) {

			if (encoding === 'base64') {

				var url = this.src;
				if (url !== '' && url.substr(0, 5) !== 'data:') {

					var buffer = _load_buffer(url);
					if (buffer !== null) {
						return buffer.toString('base64');
					}

				}

				var index = url.indexOf('base64,') + 7;
				if (index > 7) {
					url = url.substr(index, url.length - index);
				}

				return url;

			} else {

				return Object.prototype.toString.call(this);

			}

		};


		if (image) {

		} else {

			Image = function() {

				this.src    = '';
				this.width  = 0;
				this.height = 0;

				this.onload  = null;
				this.onerror = null;

			};


			Image.prototype = {

				load: function() {

					if (this.onerror !== null) {
						this.onerror.call(this);
					}

				}

			};

		}


		Image.prototype.toString = function(encoding) {

			if (encoding === 'base64') {

				var url = this.src;
				if (url !== '' && url.substr(0, 5) !== 'data:') {

					var buffer = _load_buffer(url);
					if (buffer !== null) {
						return buffer.toString('base64');
					}

				}

				var index = url.indexOf('base64,') + 7;
				if (index > 7) {
					url = url.substr(index, url.length - index);
				}

				return url;

			} else {

				return Object.prototype.toString.call(this);

			}

		};


		if (lychee.debug === true) {

			var methods = [];

			if (consol) methods.push('console');
			if (audio)  methods.push('Audio');
			if (buffer) methods.push('Buffer');
			if (image)  methods.push('Image');

			if (methods.length === 0) {
				console.error('bootstrap.js: Supported methods are NONE');
			} else {
				console.info('bootstrap.js: Supported methods are ' + methods.join(', '));
			}

		}

	})();



	/*
	 * BUFFER IMPLEMENTATION
	 */

	var _coerce = function(num) {
		num = ~~Math.ceil(+num);
		return num < 0 ? 0 : num;
	};

	var _clean_base64 = function(str) {

		str = str.trim().replace(/[^+\/0-9A-z]/g, '');

		while (str.length % 4 !== 0) {
			str = str + '=';
		}

		return str;

	};

	var _utf8_to_bytes = function(str) {

		var bytes = [];

		for (var s = 0; s < str.length; s++) {

			var byt = str.charCodeAt(s);
			if (byt <= 0x7F) {
				bytes.push(byt);
			} else {

				var start = s;
				if (byt >= 0xD800 && byt <= 0xDFF) s++;

				var tmp = encodeURIComponent(str.slice(start, s + 1)).substr(1).split('%');
				for (var t = 0; t < tmp.length; t++) {
					bytes.push(parseInt(tmp[t], 16));
				}

			}

		}

		return bytes;

	};

	var _decode_utf8_char = function(str) {

		try {
			return decodeURIComponent(str);
		} catch(e) {
			return String.fromCharCode(0xFFFD);
		}

	};

	var _utf8_to_string = function(buffer, start, end) {

		end = Math.min(buffer.length, end);


		var str = '';
		var tmp = '';

		for (var b = start; b < end; b++) {

			if (buffer[b] <= 0x7F) {
				str += _decode_utf8_char(tmp) + String.fromCharCode(buffer[b]);
				tmp = '';
			} else {
				tmp += '%' + buffer[b].toString(16);
			}

		}

		return str + _decode_utf8_char(tmp);

	};

	var _base64_to_bytes = function(str) {

		if (str.length % 4 === 0) {

			// TODO: Might get performance increase switching to lastIndexOf('=');
			var length       = str.length;
			var placeholders = '=' === str.charAt(length - 2) ? 2 : '=' === str.charAt(length - 1) ? 1 : 0;

			var bytes = new Array(length * 3/4 - placeholders);
			var l     = placeholders > 0 ? str.length - 4 : str.length;


			var _decode = (function() {

				var _PLUS   = '+'.charCodeAt(0);
				var _SLASH  = '/'.charCodeAt(0);
				var _NUMBER = '0'.charCodeAt(0);
				var _LOWER  = 'a'.charCodeAt(0);
				var _UPPER  = 'A'.charCodeAt(0);

				return function(elt) {

					var code = elt.charCodeAt(0);

					if (code === _PLUS)        return 62;
					if (code === _SLASH)       return 63;
					if (code  <  _NUMBER)      return -1;
					if (code  <  _NUMBER + 10) return code - _NUMBER + 26 + 26;
					if (code  <  _UPPER  + 26) return code - _UPPER;
					if (code  <  _LOWER  + 26) return code - _LOWER  + 26;

				};

			})();


			var tmp;
			var b = 0;

			for (var i = 0; i < l; i += 4) {

				tmp = (_decode(str.charAt(i)) << 18) | (_decode(str.charAt(i + 1)) << 12) | (_decode(str.charAt(i + 2)) << 6) | (_decode(str.charAt(i + 3)));

				bytes[b++] = (tmp & 0xFF0000) >> 16;
				bytes[b++] = (tmp & 0xFF00)   >>  8;
				bytes[b++] =  tmp & 0xFF;

			}


			if (placeholders === 2) {

				tmp = (_decode(str.charAt(i)) << 2)  | (_decode(str.charAt(i + 1)) >> 4);

				bytes[b++] = tmp        & 0xFF;

			} else if (placeholders === 1) {

				tmp = (_decode(str.charAt(i)) << 10) | (_decode(str.charAt(i + 1)) << 4) | (_decode(str.charAt(i + 2)) >> 2);

				bytes[b++] = (tmp >> 8) & 0xFF;
				bytes[b++] =  tmp       & 0xFF;

			}


			return bytes;

		}


		return [];

	};

	var _base64_to_string = function(buffer, start, end) {

		var bytes      = buffer.slice(start, end);
		var extrabytes = bytes.length % 3;
		var l          = bytes.length - extrabytes;
		var str        = '';


		var _encode = (function() {

			var _TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

			return function(num) {
				return _TABLE.charAt(num);
			};

		})();


		var tmp;

		for (var i = 0; i < l; i += 3) {

			tmp = (bytes[i] << 16) + (bytes[i + 1] << 8) + (bytes[i + 2]);

			str += (_encode(tmp >> 18 & 0x3F) + _encode(tmp >> 12 & 0x3F) + _encode(tmp >> 6 & 0x3F) + _encode(tmp & 0x3F));

		}


		if (extrabytes === 2) {

			tmp = (bytes[bytes.length - 2] << 8) + (bytes[bytes.length - 1]);

			str += _encode( tmp >> 10);
			str += _encode((tmp >>  4) & 0x3F);
			str += _encode((tmp <<  2) & 0x3F);
			str += '=';

		} else if (extrabytes === 1) {

			tmp = bytes[bytes.length - 1];

			str += _encode( tmp >>  2);
			str += _encode((tmp <<  4) & 0x3F);
			str += '==';

		}


		return str;

	};

	var _binary_to_bytes = function(str) {

		var bytes = [];

		for (var s = 0; s < str.length; s++) {
			bytes.push(str.charCodeAt(s) & 0xFF);
		}

		return bytes;

	};

	var _binary_to_string = function(buffer, start, end) {

		end = Math.min(buffer.length, end);


		var str = '';

		for (var b = start; b < end; b++) {
			str += String.fromCharCode(buffer[b]);
		}

		return str;

	};

	var _copy_buffer = function(source, target, offset, length) {

		var i = 0;

		for (i = 0; i < length; i++) {

			if (i + offset >= target.length) break;
			if (i >= source.length)          break;

			target[i + offset] = source[i];

		}

		return i;

	};


	var Buffer = function(subject, encoding) {

		var type = typeof subject;
		if (type === 'string' && encoding === 'base64') {
			subject = _clean_base64(subject);
		}


		this.length = 0;


		if (Buffer.isBuffer(subject)) {

			this.length = subject.length;

			for (var b = 0; b < this.length; b++) {
				this[b] = subject[b];
			}

		} else if (type === 'string') {

			this.length = Buffer.byteLength(subject, encoding);

			this.write(subject, 0, encoding);

		} else if (type === 'number') {

			this.length = _coerce(subject);

			for (var n = 0; n < this.length; n++) {
				this[n] = 0;
			}

		}


		return this;

	};

	Buffer.byteLength = function(str, encoding) {

		str      = typeof str === 'string'      ? str      : '';
		encoding = typeof encoding === 'string' ? encoding : 'utf8';


		var length = 0;

		if (encoding === 'utf8') {
			length = _utf8_to_bytes(str).length;
		} else if (encoding === 'base64') {
			length = _base64_to_bytes(str).length;
		} else if (encoding === 'binary') {
			length = str.length;
		}

		return length;

	};

	Buffer.isBuffer = function(buffer) {
		return buffer instanceof Buffer;
	};

	Buffer.prototype = {

		serialize: function() {

			return {
				'constructor': 'Buffer',
				'arguments':   [ this.toString('base64'), 'base64' ]
			};

		},

		copy: function(target, target_start, start, end) {

			target_start = typeof target_start === 'number' ? (target_start | 0) : 0;
			start        = typeof start === 'number'        ? (start | 0)        : 0;
			end          = typeof end === 'number'          ? (end   | 0)        : this.length;


			if (start === end)       return;
			if (target.length === 0) return;
			if (this.length === 0)   return;


			end = Math.min(end, this.length);

			var diff        = end - start;
			var target_diff = target.length - target_start;
			if (target_diff < diff) {
				end = target_diff + start;
			}


			for (var b = 0; b < diff; b++) {
				target[b + target_start] = this[b + start];
			}

		},

		map: function(callback) {

			callback = callback instanceof Function ? callback : function(value) { return value; };


			var clone = new Buffer(this.length);

			for (var b = 0; b < this.length; b++) {
				clone[b] = callback(this[b], b);
			}

			return clone;

		},

		slice: function(start, end) {

			var length = this.length;

			start = typeof start === 'number' ? (start | 0) : 0;
			end   = typeof end === 'number'   ? (end   | 0) : length;

			start = Math.min(start, length);
			end   = Math.min(end,   length);


			var diff  = end - start;
			var clone = new Buffer(diff);

			for (var b = 0; b < diff; b++) {
				clone[b] = this[b + start];
			}

			return clone;

		},

		write: function(str, offset, length, encoding) {

			offset   = typeof offset === 'number'   ? offset   : 0;
			encoding = typeof encoding === 'string' ? encoding : 'utf8';


			var remaining = this.length - offset;
			if (typeof length === 'string') {
				encoding = length;
				length   = remaining;
			}

			if (length > remaining) {
				length = remaining;
			}


			var diff = 0;

			if (encoding === 'utf8') {
				diff = _copy_buffer(_utf8_to_bytes(str),   this, offset, length);
			} else if (encoding === 'base64') {
				diff = _copy_buffer(_base64_to_bytes(str), this, offset, length);
			} else if (encoding === 'binary') {
				diff = _copy_buffer(_binary_to_bytes(str), this, offset, length);
			}


			return diff;

		},

		toString: function(encoding, start, end) {

			encoding = typeof encoding === 'string' ? encoding : 'utf8';
			start    = typeof start === 'number'    ? start    : 0;
			end      = typeof end === 'number'      ? end      : this.length;


			if (start === end) {
				return '';
			}


			var str = '';

			if (encoding === 'utf8') {
				str = _utf8_to_string(this,   start, end);
			} else if (encoding === 'base64') {
				str = _base64_to_string(this, start, end);
			} else if (encoding === 'binary') {
				str = _binary_to_string(this, start, end);
			}

			return str;

		}

	};



	/*
	 * CONFIG IMPLEMENTATION
	 */

	var _config_cache = {};


	var _clone_config = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer = JSON.parse(JSON.stringify(origin.buffer));

			clone.__load = false;

		}

	};


	var Config = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url    = url;
		this.onload = null;
		this.buffer = null;

		this.__load = true;


		if (url !== null) {

			if (_config_cache[url] !== undefined) {
				_clone_config(_config_cache[url], this);
			} else {
				_config_cache[url] = this;
			}

		}

	};


	Config.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {
				this.buffer = JSON.parse(new Buffer(blob.buffer.substr(29), 'base64').toString('utf8'));
			}

		},

		serialize: function() {

			var blob = {};


			if (this.buffer !== null) {
				blob.buffer = 'data:application/json;base64,' + new Buffer(JSON.stringify(this.buffer), 'utf8').toString('base64');
			}


			return {
				'constructor': 'Config',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			_load_asset({
				url:     this.url,
				headers: {
					'Content-Type': 'application/json; charset=utf8'
				}
			}, function(raw) {

				var data = null;
				try {
					data = JSON.parse(raw);
				} catch(e) {
				}


				this.buffer = data;
				this.__load = false;


				if (data !== null) {

				} else {

					if (lychee.debug === true) {
						console.error('bootstrap.js: Config at "' + this.url + '" is invalid');
					}

				}


				if (this.onload instanceof Function) {
					this.onload(data !== null);
					this.onload = null;
				}

			}, this);

		}

	};



	/*
	 * FONT IMPLEMENTATION
	 */

	var _parse_font = function() {

		var data = this.__buffer;

		if (typeof data.kerning === 'number' && typeof data.spacing === 'number') {

			if (data.kerning > data.spacing) {
				data.kerning = data.spacing;
			}

		}


		if (data.texture !== undefined) {
			this.texture = new Texture(data.texture);
			this.texture.load();
		}


		this.baseline   = typeof data.baseline === 'number'    ? data.baseline   : this.baseline;
		this.charset    = typeof data.charset === 'string'     ? data.charset    : this.charset;
		this.spacing    = typeof data.spacing === 'number'     ? data.spacing    : this.spacing;
		this.kerning    = typeof data.kerning === 'number'     ? data.kerning    : this.kerning;
		this.lineheight = typeof data.lineheight === 'number'  ? data.lineheight : this.lineheight;


		if (data.map instanceof Array) {

			var offset = this.spacing;

			for (var c = 0, cl = this.charset.length; c < cl; c++) {

				var id  = this.charset[c];
				var chr = {
					width:      data.map[c] + this.spacing * 2,
					height:     this.lineheight,
					realwidth:  data.map[c],
					realheight: this.lineheight,
					x:          offset - this.spacing,
					y:          0
				};

				offset += chr.width;


				this.__charset[id] = chr;

			}

		}


		if (this.texture === null) {

			if (lychee.debug === true) {
				console.error('bootstrap.js: Font at "' + this.url + '" is invalid (No FNT file)');
			}

		}

	};


	var _font_cache = {};


	var _clone_font = function(origin, clone) {

		if (origin.__buffer !== null) {

			clone.__buffer = origin.__buffer;
			clone.__load   = false;

			_parse_font.call(clone);

		}

	};


	var Font = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url        = url;
		this.onload     = null;
		this.texture    = null;

		this.baseline   = 0;
		this.charset    = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
		this.spacing    = 0;
		this.kerning    = 0;
		this.lineheight = 0;

		this.__buffer   = null;
		this.__load     = true;

		this.__charset     = {};
		this.__charset[''] = {
			width:      0,
			height:     this.lineheight,
			realwidth:  0,
			realheight: this.lineheight,
			x:          0,
			y:          0
		};


		if (url !== null) {

			if (_font_cache[url] !== undefined) {
				_clone_font(_font_cache[url], this);
			} else {
				_font_cache[url] = this;
			}

		}

	};


	Font.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {
				this.__buffer = JSON.parse(new Buffer(blob.buffer.substr(29), 'base64').toString('utf8'));
				_parse_font.call(this);
			}

		},

		serialize: function() {

			var blob = {};


			if (this.__buffer !== null) {
				blob.buffer = 'data:application/json;base64,' + new Buffer(JSON.stringify(this.__buffer), 'utf8').toString('base64');
			}


			return {
				'constructor': 'Font',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		measure: function(text) {

			text = typeof text === 'string' ? text : null;


			if (text !== null) {

				if (text.length === 1) {

					if (this.__charset[text] !== undefined) {
						return this.__charset[text];
					}

				} else if (text.length > 1) {

					var data = this.__charset[text] || null;
					if (data === null) {

						var width = 0;

						for (var t = 0, tl = text.length; t < tl; t++) {
							var chr = this.measure(text[t]);
							width  += chr.realwidth + this.kerning;
						}


						// TODO: Embedded Font ligatures will set x and y values based on settings.map

						data = this.__charset[text] = {
							width:      width,
							height:     this.lineheight,
							realwidth:  width,
							realheight: this.lineheight,
							x:          0,
							y:          0
						};

					}


					return data;

				}

			}


			return this.__charset[''];

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			_load_asset({
				url:     this.url,
				headers: {
					'Content-Type': 'application/json; charset=utf8'
				}
			}, function(raw) {

				var data = null;
				try {
					data = JSON.parse(raw);
				} catch(e) {
				}


				if (data !== null) {

					this.__buffer = data;
					this.__load   = false;

					_parse_font.call(this);

				}


				if (this.onload instanceof Function) {
					this.onload(data !== null);
					this.onload = null;
				}

			}, this);

		}

	};



	/*
	 * MUSIC IMPLEMENTATION
	 */

	var _music_cache = {};


	var _clone_music = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer            = new Audio();
			clone.buffer.autobuffer = true;
			clone.buffer.preload    = true;
			clone.buffer.src        = origin.buffer.src;
			clone.buffer.load();

			clone.buffer.addEventListener('ended', function() {
				clone.play();
			}, true);

			clone.__buffer.ogg = origin.__buffer.ogg;
			clone.__buffer.mp3 = origin.__buffer.mp3;
			clone.__load       = false;

		}

	};


	var Music = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;
		this.volume   = 1.0;
		this.isIdle   = true;

		this.__buffer = { ogg: null, mp3: null };
		this.__load   = true;


		if (url !== null) {

			if (_music_cache[url] !== undefined) {
				_clone_music(_music_cache[url], this);
			} else {
				_music_cache[url] = this;
			}

		}

	};


	Music.prototype = {

		deserialize: function(blob) {

			if (blob.buffer instanceof Object) {

				var url  = null;
				var type = null;

				if (_audio_supports_ogg === true) {

					if (typeof blob.buffer.ogg === 'string') {
						url  = url  || blob.buffer.ogg;
						type = type || 'ogg';
					}

				} else if (_audio_supports_mp3 === true) {

					if (typeof blob.buffer.mp3 === 'string') {
						url  = url  || blob.buffer.mp3;
						type = type || 'mp3';
					}

				}


				if (url !== null && type !== null) {

					var that   = this;
					var buffer = new Audio();

					buffer.addEventListener('ended', function() {
						that.play();
					}, true);

					buffer.autobuffer = true;
					buffer.preload    = true;
					buffer.src        = url;
					buffer.load();

					this.buffer         = buffer;
					this.__buffer[type] = buffer;
					this.__load         = false;

				}

			}

		},

		serialize: function() {

			var blob = {};


			if (this.__buffer.ogg !== null || this.__buffer.mp3 !== null) {

				blob.buffer = {};

				if (this.__buffer.ogg !== null) {
					blob.buffer.ogg = 'data:application/ogg;base64,' + this.__buffer.ogg.toString('base64');
				}

				if (this.__buffer.mp3 !== null) {
					blob.buffer.mp3 = 'data:audio/mp3;base64,' + this.__buffer.mp3.toString('base64');
				}

			}


			return {
				'constructor': 'Music',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			var url  = this.url;
			var type = null;

			if (_audio_supports_ogg === true) {
				type = type || 'ogg';
			} else if (_audio_supports_mp3 === true) {
				type = type || 'mp3';
			}


			if (url !== null && type !== null) {

				var that   = this;
				var buffer = new Audio();

				buffer.onload = function() {

					that.buffer         = this;
					that.__buffer[type] = this;

					this.toString('base64');
					this.__load = false;

					if (that.onload instanceof Function) {
						that.onload(true);
						that.onload = null;
					}

				};

				buffer.onerror = function() {

					if (that.onload instanceof Function) {
						that.onload(false);
						that.onload = null;
					}

				};

				buffer.addEventListener('ended', function() {
					that.play();
				}, true);

				buffer.autobuffer = true;
				buffer.preload    = true;
				buffer.src        = url + '.' + type;
				buffer.load();


				// TODO: Evaluate if buffer.onload() is necessary
				buffer.onload();

			} else {

				if (this.onload instanceof Function) {
					this.onload(false);
					this.onload = null;
				}

			}

		},

		clone: function() {
			return new Music(this.url);
		},

		play: function() {

			if (this.buffer !== null) {

				try {
					this.buffer.currentTime = 0;
				} catch(e) {
				}

				if (this.buffer.currentTime === 0) {
					this.buffer.play();
					this.isIdle = false;
				}

			}

		},

		pause: function() {

			if (this.buffer !== null) {
				this.buffer.pause();
				this.isIdle = true;
			}

		},

		resume: function() {

			if (this.buffer !== null) {
				this.buffer.play();
				this.isIdle = false;
			}

		},

		stop: function() {

			if (this.buffer !== null) {

				this.buffer.pause();
				this.isIdle = true;

				try {
					this.buffer.currentTime = 0;
				} catch(e) {
				}

			}

		},

		setVolume: function(volume) {

			volume = typeof volume === 'number' ? volume : null;


			if (volume !== null && this.buffer !== null) {

				volume = Math.min(Math.max(0, volume), 1);

				this.buffer.volume = volume;
				this.volume        = volume;

				return true;

			}


			return false;

		}

	};



	/*
	 * SOUND IMPLEMENTATION
	 */

	var _sound_cache = {};


	var _clone_sound = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer            = new Audio();
			clone.buffer.autobuffer = true;
			clone.buffer.preload    = true;
			clone.buffer.src        = origin.buffer.src;
			clone.buffer.load();

			clone.buffer.addEventListener('ended', function() {
				clone.isIdle = true;
				clone.stop();
			}, true);

			clone.__buffer.ogg = origin.__buffer.ogg;
			clone.__buffer.mp3 = origin.__buffer.mp3;
			clone.__load       = false;

		}

	};


	var Sound = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;
		this.volume   = 1.0;
		this.isIdle   = true;

		this.__buffer = { ogg: null, mp3: null };
		this.__load   = true;


		if (url !== null) {

			if (_sound_cache[url] !== undefined) {
				_clone_sound(_sound_cache[url], this);
			} else {
				_sound_cache[url] = this;
			}

		}

	};


	Sound.prototype = {

		deserialize: function(blob) {

			if (blob.buffer instanceof Object) {

				var url  = null;
				var type = null;

				if (_audio_supports_ogg === true) {

					if (typeof blob.buffer.ogg === 'string') {
						url  = url  || blob.buffer.ogg;
						type = type || 'ogg';
					}

				} else if (_audio_supports_mp3 === true) {

					if (typeof blob.buffer.mp3 === 'string') {
						url  = url  || blob.buffer.mp3;
						type = type || 'mp3';
					}

				}


				if (url !== null && type !== null) {

					var that   = this;
					var buffer = new Audio();

					buffer.addEventListener('ended', function() {
						that.stop();
					}, true);

					buffer.autobuffer = true;
					buffer.preload    = true;
					buffer.src        = url;
					buffer.load();

					this.buffer         = buffer;
					this.__buffer[type] = buffer;
					this.__load         = false;

				}

			}

		},

		serialize: function() {

			var blob = {};


			if (this.__buffer.ogg !== null || this.__buffer.mp3 !== null) {

				blob.buffer = {};

				if (this.__buffer.ogg !== null) {
					blob.buffer.ogg = 'data:application/ogg;base64,' + this.__buffer.ogg.toString('base64');
				}

				if (this.__buffer.mp3 !== null) {
					blob.buffer.mp3 = 'data:audio/mp3;base64,' + this.__buffer.mp3.toString('base64');
				}

			}


			return {
				'constructor': 'Sound',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			var url  = this.url;
			var type = null;

			if (_audio_supports_ogg === true) {
				type = type || 'ogg';
			} else if (_audio_supports_mp3 === true) {
				type = type || 'mp3';
			}


			if (url !== null && type !== null) {

				var that   = this;
				var buffer = new Audio();

				buffer.onload = function() {

					that.buffer         = this;
					that.__buffer[type] = this;

					this.toString('base64');
					this.__load = false;

					if (that.onload instanceof Function) {
						that.onload(true);
						that.onload = null;
					}

				};

				buffer.onerror = function() {

					if (that.onload instanceof Function) {
						that.onload(false);
						that.onload = null;
					}

				};

				buffer.addEventListener('ended', function() {
					that.isIdle = true;
					that.stop();
				}, true);

				buffer.autobuffer = true;
				buffer.preload    = true;
				buffer.src        = url + '.' + type;
				buffer.load();


				// TODO: Evaluate if buffer.onload() is necessary
				buffer.onload();

			} else {

				if (this.onload instanceof Function) {
					this.onload(false);
					this.onload = null;
				}

			}

		},

		clone: function() {
			return new Sound(this.url);
		},

		play: function() {

			if (this.buffer !== null) {

				try {
					this.buffer.currentTime = 0;
				} catch(e) {
				}

				if (this.buffer.currentTime === 0) {
					this.buffer.play();
					this.isIdle = false;
				}

			}

		},

		pause: function() {

			if (this.buffer !== null) {
				this.buffer.pause();
				this.isIdle = true;
			}

		},

		resume: function() {

			if (this.buffer !== null) {
				this.buffer.play();
				this.isIdle = false;
			}

		},

		stop: function() {

			if (this.buffer !== null) {

				this.buffer.pause();
				this.isIdle = true;

				try {
					this.buffer.currentTime = 0;
				} catch(e) {
				}

			}

		},

		setVolume: function(volume) {

			volume = typeof volume === 'number' ? volume : null;


			if (volume !== null && this.buffer !== null) {

				volume = Math.min(Math.max(0, volume), 1);

				this.buffer.volume = volume;
				this.volume        = volume;

				return true;

			}


			return false;

		}

	};



	/*
	 * TEXTURE IMPLEMENTATION
	 */

	var _texture_id    = 0;
	var _texture_cache = {};


	var _clone_texture = function(origin, clone) {

		// Keep reference of Texture ID for OpenGL alike platforms
		clone.id = origin.id;


		if (origin.buffer !== null) {

			clone.buffer = origin.buffer;
			clone.width  = origin.width;
			clone.height = origin.height;

			clone.__load = false;

		}

	};


	var Texture = function(url) {

		url = typeof url === 'string' ? url : null;


		this.id     = _texture_id++;
		this.url    = url;
		this.onload = null;
		this.buffer = null;
		this.width  = 0;
		this.height = 0;

		this.__load = true;


		if (url !== null && url.substr(0, 10) !== 'data:image') {

			if (_texture_cache[url] !== undefined) {
				_clone_texture(_texture_cache[url], this);
			} else {
				_texture_cache[url] = this;
			}

		}

	};


	Texture.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {

				var that  = this;
				var image = new Image();

				image.onload = function() {
					that.buffer = this;
					that.width  = this.width;
					that.height = this.height;
				};

				image.src   = blob.buffer;
				this.__load = false;

			}

		},

		serialize: function() {

			var blob = {};


			if (this.buffer !== null) {
				blob.buffer = 'data:image/png;base64,' + this.buffer.toString('base64');
			}


			return {
				'constructor': 'Texture',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			var buffer;
			var that = this;

			var url  = this.url;
			if (url.substr(0, 5) === 'data:') {

				if (url.substr(0, 15) === 'data:image/png;') {

					buffer = new Image();

					buffer.onload = function() {

						that.buffer = this;
						that.width  = this.width;
						that.height = this.height;

						that.__load = false;
						that.buffer.toString('base64');


						var is_power_of_two = (this.width & (this.width - 1)) === 0 && (this.height & (this.height - 1)) === 0;
						if (lychee.debug === true && is_power_of_two === false) {
							console.warn('bootstrap.js: Texture at data:image/png; is NOT power-of-two');
						}


						if (that.onload instanceof Function) {
							that.onload(true);
							that.onload = null;
						}

					};

					buffer.onerror = function() {

						if (that.onload instanceof Function) {
							that.onload(false);
							that.onload = null;
						}

					};

					buffer.src = url;

				} else {

					if (lychee.debug === true) {
						console.error('bootstrap.js: Texture at "' + url.substr(0, 15) + '" is invalid (no PNG file)');
					}


					if (this.onload instanceof Function) {
						this.onload(false);
						this.onload = null;
					}

				}

			} else {

				if (url.split('.').pop() === 'png') {

					buffer = new Image();

					buffer.onload = function() {

						that.buffer = this;
						that.width  = this.width;
						that.height = this.height;

						that.__load = false;
						that.buffer.toString('base64');


						var is_power_of_two = (this.width & (this.width - 1)) === 0 && (this.height & (this.height - 1)) === 0;
						if (lychee.debug === true && is_power_of_two === false) {
							console.warn('bootstrap.js: Texture at ' + this.url + ' is NOT power-of-two');
						}


						if (that.onload instanceof Function) {
							that.onload(true);
							that.onload = null;
						}

					};

					buffer.onerror = function() {

						if (that.onload instanceof Function) {
							that.onload(false);
							that.onload = null;
						}

					};

					buffer.src = url;

				} else {

					if (lychee.debug === true) {
						console.error('bootstrap.js: Texture at "' + this.url + '" is invalid (no PNG file)');
					}


					if (this.onload instanceof Function) {
						this.onload(false);
						this.onload = null;
					}

				}

			}

		}

	};



	/*
	 * PRELOADER IMPLEMENTATION
	 */

	var _stuff_cache = {};


	var _clone_stuff = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer = origin.buffer;

			clone.__load = false;

		}

	};


	var Stuff = function(url, ignore) {

		url    = typeof url === 'string' ? url : null;
		ignore = ignore === true;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;

		this.__ignore = ignore;
		this.__load   = true;


		if (url !== null) {

			if (_stuff_cache[url] !== undefined) {
				_clone_stuff(_stuff_cache[url], this);
			} else {
				_stuff_cache[url] = this;
			}

		}

	};


	Stuff.prototype = {

		serialize: function() {

			// var buffer = null;
			// if (this.buffer !== null) {
			// 	buffer = lychee.serialize(new Buffer(this.buffer, 'utf8'));
			// }


			return {
				'constructor': 'Object',
				'arguments':   [{
					'url':    this.url,
					'buffer': this.buffer
				}]
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			var that = this;
			var type = this.url.split('/').pop().split('.').pop();
			if (type === 'js' && this.__ignore === false) {

				this.buffer            = document.createElement('script');
				this.buffer.__filename = this.url;
				this.buffer.async      = true;

				this.buffer.onload = function() {

					that.buffer = '';

					if (that.onload instanceof Function) {
						that.onload(true);
						that.onload = null;
					}

					// Don't move this, it's causing serious bugs in Blink
					document.body.removeChild(this);

				};
				this.buffer.onerror = function() {

					that.buffer = '';

					if (that.onload instanceof Function) {
						that.onload(false);
						that.onload = null;
					}

					// Don't move this, it's causing serious bugs in Blink
					document.body.removeChild(this);

				};
				this.buffer.src = this.url;

				document.body.appendChild(this.buffer);

			} else if (type === 'css' && this.__ignore === false) {

				this.buffer = document.createElement('link');
				this.buffer.rel  = 'stylesheet';
				this.buffer.href = this.url;
				this.buffer.onload = function() {

					var rules = [].slice.call(this.sheet.rules);
					if (rules.length > 0) {

						var buffer = '';

						rules.forEach(function(rule) {
							buffer += rule.cssText + '\n';
						});

						that.buffer = buffer;

					}

				};

				document.head.appendChild(this.buffer);


				// CSS files can't fail
				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

			} else {

				_load_asset({
					url: this.url
				}, function(raw) {

					this.buffer = raw;

					if (this.onload instanceof Function) {
						this.onload(raw !== null);
						this.onload = null;
					}

				}, this);

			}

		}

	};



	/*
	 * EXPORTS
	 */

	global.Buffer  = Buffer;
	global.Config  = Config;
	global.Font    = Font;
	global.Music   = Music;
	global.Sound   = Sound;
	global.Texture = Texture;

	global.Stuff   = Stuff;


	Object.defineProperty(lychee.Environment, '__FILENAME', {

		get: function() {

			if (document.currentScript) {
				return document.currentScript.__filename;
			}

			return null;

		},

		set: function() {
			return false;
		}

	});


})(this.lychee, this);




lychee.setEnvironment(new lychee.Environment({
	build:   'lychee.DIST',
	debug:   false,
	type:    'build',
	sandbox: false
}));

lychee.define('lychee.DIST').requires([
	'lychee.game.Main'
]).exports(function() {
	return function(){};
});

lychee.define('Input').tags({
	platform: 'html'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof global.addEventListener === 'function') {
		return true;
	}


	return false;

}).exports(function(lychee, global) {

	/*
	 * EVENTS
	 */

	var _instances = [];

	var _mouseactive = false;
	var _listeners = {

		keydown: function(event) {

			var handled = false;

			for (var i = 0, l = _instances.length; i < l; i++) {
				handled = _process_key.call(_instances[i], event.keyCode, event.ctrlKey, event.altKey, event.shiftKey) || handled;
			}


			if (handled === true) {
				event.preventDefault();
				event.stopPropagation();
			}

		},

		touchstart: function(event) {

			var handled = false;

			for (var i = 0, l = _instances.length; i < l; i++) {

				if (event.touches && event.touches.length) {

					for (var t = 0, tl = event.touches.length; t < tl; t++) {
						handled = _process_touch.call(_instances[i], t, event.touches[t].pageX, event.touches[t].pageY) || handled;
					}

				} else {
					handled = _process_touch.call(_instances[i], 0, event.pageX, event.pageY) || handled;
				}

			}


			// Prevent scrolling and swiping behaviour
			if (handled === true) {
				event.preventDefault();
				event.stopPropagation();
			}

		},

		touchmove: function(event) {

			for (var i = 0, l = _instances.length; i < l; i++) {

				if (event.touches && event.touches.length) {

					for (var t = 0, tl = event.touches.length; t < tl; t++) {
						_process_swipe.call(_instances[i], t, 'move', event.touches[t].pageX, event.touches[t].pageY);
					}

				} else {
					_process_swipe.call(_instances[i], 0, 'move', event.pageX, event.pageY);
				}

			}

		},

		touchend: function(event) {

			for (var i = 0, l = _instances.length; i < l; i++) {

				if (event.touches && event.touches.length) {

					for (var t = 0, tl = event.touches.length; t < tl; t++) {
						_process_swipe.call(_instances[i], t, 'end', event.touches[t].pageX, event.touches[t].pageY);
					}

				} else {
					_process_swipe.call(_instances[i], 0, 'end', event.pageX, event.pageY);
				}

			}

		},

		mousestart: function(event) {

			_mouseactive = true;


			var handled = false;

			for (var i = 0, l = _instances.length; i < l; i++) {
				handled = _process_touch.call(_instances[i], 0, event.pageX, event.pageY) || handled;
			}


			// Prevent drag of canvas as image
			if (handled === true) {
				event.preventDefault();
				event.stopPropagation();
			}

		},

		mousemove: function(event) {

			if (_mouseactive === false) return;


			var handled = false;

			for (var i = 0, l = _instances.length; i < l; i++) {
				handled = _process_swipe.call(_instances[i], 0, 'move', event.pageX, event.pageY) || handled;
			}


			// Prevent selection of canvas as content
			if (handled === true) {
				event.preventDefault();
				event.stopPropagation();
			}

		},

		mouseend: function(event) {

			if (_mouseactive === false) return;

			_mouseactive = false;

			for (var i = 0, l = _instances.length; i < l; i++) {
				_process_swipe.call(_instances[i], 0, 'end', event.pageX, event.pageY);
			}

		}

	};



	/*
	 * FEATURE DETECTION
	 */

	(function() {

		var keyboard = 'onkeydown' in global;
		var touch    = 'ontouchstart' in global;
		var mouse    = 'onmousedown' in global;


		if (typeof global.addEventListener === 'function') {

			if (keyboard) {
				global.addEventListener('keydown',    _listeners.keydown,    true);
			}

			if (touch) {

				global.addEventListener('touchstart', _listeners.touchstart, true);
				global.addEventListener('touchmove',  _listeners.touchmove,  true);
				global.addEventListener('touchend',   _listeners.touchend,   true);

			} else if (mouse) {

				global.addEventListener('mousedown',  _listeners.mousestart, true);
				global.addEventListener('mousemove',  _listeners.mousemove,  true);
				global.addEventListener('mouseup',    _listeners.mouseend,   true);
				global.addEventListener('mouseout',   _listeners.mouseend,   true);

			}

		}


		if (lychee.debug === true) {

			var methods = [];

			if (keyboard) methods.push('Keyboard');
			if (touch)    methods.push('Touch');
			if (mouse)    methods.push('Mouse');

			if (methods.length === 0) {
				console.error('lychee.Input: Supported methods are NONE');
			} else {
				console.info('lychee.Input: Supported methods are ' + methods.join(', '));
			}

		}

	})();



	/*
	 * HELPERS
	 */

	var _KEYMAP = {

		 8:  'backspace',
		 9:  'tab',
		13:  'enter',
		16:  'shift',
		17:  'ctrl',
		18:  'alt',
		19:  'pause',
//		20:  'capslock',

		27:  'escape',
		32:  'space',
		33:  'page-up',
		34:  'page-down',
		35:  'end',
		36:  'home',

		37:  'arrow-left',
		38:  'arrow-up',
		39:  'arrow-right',
		40:  'arrow-down',

		45:  'insert',
		46:  'delete',

		65:  'a',
		66:  'b',
		67:  'c',
		68:  'd',
		69:  'e',
		70:  'f',
		71:  'g',
		72:  'h',
		73:  'i',
		74:  'j',
		75:  'k',
		76:  'l',
		77:  'm',
		78:  'n',
		79:  'o',
		80:  'p',
		81:  'q',
		82:  'r',
		83:  's',
		84:  't',
		85:  'u',
		86:  'v',
		87:  'w',
		88:  'x',
		89:  'y',
		90:  'z',

		96:  '0',
		97:  '1',
		98:  '2',
		99:  '3',
		100: '4',
		101: '5',
		102: '6',
		103: '7',
		104: '8',
		105: '9',
		106: '*',
		107: '+',
		109: '-',
		110: '.',
		111: '/',

		112: 'f1',
		113: 'f2',
		114: 'f3',
		115: 'f4',
		116: 'f5',
		117: 'f6',
		118: 'f7',
		119: 'f8',
		120: 'f9',
		121: 'f10',
		122: 'f11',
		123: 'f12',

//		144: 'numlock',
		145: 'scroll'

	};

	var _SPECIALMAP = {

		48:  [ '0', ')' ],
		49:  [ '1', '!' ],
		50:  [ '2', '@' ],
		51:  [ '3', '#' ],
		52:  [ '4', '$' ],
		53:  [ '5', '%' ],
		54:  [ '6', '^' ],
		55:  [ '7', '&' ],
		56:  [ '8', '*' ],
		57:  [ '9', '(' ],

		186: [ ';', ':' ],
		187: [ '=', '+' ],
		188: [ ',', '<' ],
		189: [ '-', '_' ],
		190: [ '.', '>' ],
		191: [ '/', '?' ],
		192: [ '`', '~' ],

		219: [ '[',  '{' ],
		220: [ '\\', '|' ],
		221: [ ']',  '}' ],
		222: [ '\'', '"' ]

	};

	var _process_key = function(code, ctrl, alt, shift) {

		if (this.key === false) return false;


		// 1. Validate key event
		if (_KEYMAP[code] === undefined && _SPECIALMAP[code] === undefined) {
			return false;
		}


		ctrl  =  ctrl === true;
		alt   =   alt === true;
		shift = shift === true;


		// 2. Only fire after the enforced delay
		var delta = Date.now() - this.__clock.key;
		if (delta < this.delay) {
			return true;
		}


		// 3. Check for current key being a modifier
		if (this.keymodifier === false) {

			if (code === 16 && shift === true) {
				return true;
			}

			if (code === 17 && ctrl === true) {
				return true;
			}

			if (code === 18 && alt === true) {
				return true;
			}

		}


		var key  = null;
		var name = null;
		var tmp  = null;

		// 3a. Check for special characters (that can be shifted)
		if (_SPECIALMAP[code] !== undefined) {

			tmp  = _SPECIALMAP[code];
			key  = shift === true ? tmp[1] : tmp[0];
			name = '';

			if (ctrl  === true) name += 'ctrl-';
			if (alt   === true) name += 'alt-';
			if (shift === true) name += 'shift-';

			name += tmp[0];


		// 3b. Check for normal characters
		} else if (_KEYMAP[code] !== undefined) {

			key  = _KEYMAP[code];
			name = '';

			if (ctrl  === true && key !== 'ctrl')  name += 'ctrl-';
			if (alt   === true && key !== 'alt')   name += 'alt-';
			if (shift === true && key !== 'shift') name += 'shift-';


			if (shift === true && key !== 'ctrl' && key !== 'alt' && key !== 'shift') {

				tmp = String.fromCharCode(code);
				key = tmp !== '' ? tmp : key;

			}

			name += key.toLowerCase();

		}


		var handled = false;

		if (key !== null) {

			// bind('key') and bind('ctrl-a');
			// bind('!')   and bind('shift-1');

			handled = this.trigger('key', [ key, name, delta ]) || handled;
			handled = this.trigger(name,  [ delta ])            || handled;

		}


		this.__clock.key = Date.now();


		return handled;

	};

	var _process_touch = function(id, x, y) {

		if (this.touch === false && this.swipe === true) {

			if (this.__swipes[id] === null) {
				_process_swipe.call(this, id, 'start', x, y);
			}

			return true;

		} else if (this.touch === false) {

			return false;

		}


		// 1. Only fire after the enforced delay
		var delta = Date.now() - this.__clock.touch;
		if (delta < this.delay) {
			return true;
		}


		var handled = false;

		handled = this.trigger('touch', [ id, { x: x, y: y }, delta ]) || handled;


		this.__clock.touch = Date.now();


		// 2. Fire Swipe Start, but only for tracked touches
		if (this.__swipes[id] === null) {
			handled = _process_swipe.call(this, id, 'start', x, y) || handled;
		}


		return handled;

	};

	var _process_swipe = function(id, state, x, y) {

		if (this.swipe === false) return false;


		// 1. Only fire after the enforced delay
		var delta = Date.now() - this.__clock.swipe;
		if (delta < this.delay) {
			return true;
		}


		var position = { x: x, y: y };
		var swipe    = { x: 0, y: 0 };

		if (this.__swipes[id] !== null) {

			// FIX for touchend events
			if (state === 'end' && x === 0 && y === 0) {
				position.x = this.__swipes[id].x;
				position.y = this.__swipes[id].y;
			}

			swipe.x = x - this.__swipes[id].x;
			swipe.y = y - this.__swipes[id].y;

		}


		var handled = false;


		if (state === 'start') {

			handled = this.trigger(
				'swipe',
				[ id, 'start', position, delta, swipe ]
			) || handled;

			this.__swipes[id] = {
				x: x, y: y
			};

		} else if (state === 'move') {

			handled = this.trigger(
				'swipe',
				[ id, 'move', position, delta, swipe ]
			) || handled;

		} else if (state === 'end') {

			handled = this.trigger(
				'swipe',
				[ id, 'end', position, delta, swipe ]
			) || handled;

			this.__swipes[id] = null;

		}


		this.__clock.swipe = Date.now();


		return handled;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.delay       = 0;
		this.key         = false;
		this.keymodifier = false;
		this.touch       = false;
		this.swipe       = false;

		this.__clock   = {
			key:   Date.now(),
			touch: Date.now(),
			swipe: Date.now()
		};
		this.__swipes  = {
			0: null, 1: null,
			2: null, 3: null,
			4: null, 5: null,
			6: null, 7: null,
			8: null, 9: null
		};


		this.setDelay(settings.delay);
		this.setKey(settings.key);
		this.setKeyModifier(settings.keymodifier);
		this.setTouch(settings.touch);
		this.setSwipe(settings.swipe);


		lychee.event.Emitter.call(this);

		_instances.push(this);

		settings = null;

	};


	Class.prototype = {

		destroy: function() {

			var found = false;

			for (var i = 0, il = _instances.length; i < il; i++) {

				if (_instances[i] === this) {
					_instances.splice(i, 1);
					found = true;
					il--;
					i--;
				}

			}

			this.unbind();


			return found;

		},



		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Input';

			var settings = {};


			if (this.delay !== 0)           settings.delay       = this.delay;
			if (this.key !== false)         settings.key         = this.key;
			if (this.keymodifier !== false) settings.keymodifier = this.keymodifier;
			if (this.touch !== false)       settings.touch       = this.touch;
			if (this.swipe !== false)       settings.swipe       = this.swipe;


			data['arguments'][0] = settings;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setDelay: function(delay) {

			delay = typeof delay === 'number' ? delay : null;


			if (delay !== null) {

				this.delay = delay;

				return true;

			}


			return false;

		},

		setKey: function(key) {

			if (key === true || key === false) {

				this.key = key;

				return true;

			}


			return false;

		},

		setKeyModifier: function(keymodifier) {

			if (keymodifier === true || keymodifier === false) {

				this.keymodifier = keymodifier;

				return true;

			}


			return false;

		},

		setTouch: function(touch) {

			if (touch === true || touch === false) {

				this.touch = touch;

				return true;

			}


			return false;

		},

		setSwipe: function(swipe) {

			if (swipe === true || swipe === false) {

				this.swipe = swipe;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.net.Client').tags({
	platform: 'html'
}).requires([
	'lychee.net.protocol.HTTP',
	'lychee.net.protocol.WS'
]).includes([
	'lychee.net.Tunnel'
]).supports(function(lychee, global) {

	if (typeof WebSocket !== 'undefined') {
		return true;
	}


	return false;

}).exports(function(lychee, global, attachments) {

	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__socket      = null;
		this.__isConnected = false;


		lychee.net.Tunnel.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('connect', function() {
			this.__isConnected = true;
		}, this);

		this.bind('disconnect', function() {
			this.__isConnected = false;
		}, this);

		this.bind('send', function(blob) {

			if (this.__socket !== null) {
				this.__socket.send(blob);
			}

		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.net.Tunnel.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.Client';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function() {

			if (this.__isConnected === false) {

				var that = this;


				this.__socket = new WebSocket('ws://' + this.host + ':' + this.port, [ 'lycheejs' ]);

				this.__socket.onopen = function() {
					that.trigger('connect', []);
				};

				this.__socket.onmessage = function(event) {
					that.receive(event.data);
				};

				this.__socket.onclose = function(event) {
					that.__socket = null;
					that.trigger('disconnect', [ event.code || null ]);
				};

				this.__socket.onerror = function(event) {
					that.setReconnect(0);
					this.close();
				};


				if (lychee.debug === true) {
					console.log('lychee.net.Client: Connected to ' + this.host + ':' + this.port);
				}


				return true;

			}


			return false;

		},

		disconnect: function() {

			if (this.__isConnected === true) {

				if (lychee.debug === true) {
					console.log('lychee.net.Client: Disconnected from ' + this.host + ':' + this.port);
				}

				if (this.__socket !== null) {
					this.__socket.close();
				}


				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.net.Remote').tags({
	platform: 'html'
}).requires([
	'lychee.net.protocol.HTTP',
	'lychee.net.protocol.WS'
]).includes([
	'lychee.net.Tunnel'
]).exports(function(lychee, global, attachments) {

	var _BitON = lychee.data.BitON;
	var _JSON  = lychee.data.JSON;



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__socket      = null;
		this.__isConnected = false;


		lychee.net.Tunnel.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('connect', function() {
			this.__isConnected = true;
		}, this);

		this.bind('disconnect', function() {
			this.__isConnected = false;
		}, this);

		this.bind('send', function(blob) {

			if (this.__socket !== null) {
				// TODO: Send data via HTTP Socket
			}

		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.net.Tunnel.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.Remote';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function(socket) {

			if (this.__isConnected === false) {

				var that = this;


				// TODO: Bind to HTTP Socket (ondata, onclose)


				if (lychee.debug === true) {
//					console.log('lychee.net.Remote: Connected to ' + this.host + ':' + this.port);
				}


				return true;

			}


			return false;

		},

		disconnect: function() {

			if (this.__isConnected === true) {

				if (lychee.debug === true) {
					console.log('lychee.net.Remote: Disconnected from ' + this.host + ':' + this.port);
				}

				if (this.__socket !== null) {
					// TODO: Close HTTP Socket
				}


				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.net.Server').tags({
	platform: 'html'
}).requires([
	'lychee.data.JSON',
	'lychee.net.Remote'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global) {

	var _JSON = lychee.data.JSON;



	/*
	 * HELPERS
	 */

	// TODO: WebSocket Upgrade
	// TODO: WebSocket Handshake



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.codec = lychee.interfaceof(settings.codec, _JSON) ? settings.codec : _JSON;
		this.host  = 'localhost';
		this.port  = 1337;


		this.__socket = null;


		lychee.event.Emitter.call(this);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.Server';

			var settings = {};


			if (this.codec !== _JSON)      settings.codec = lychee.serialize(this.codec);
			if (this.host !== 'localhost') settings.host  = this.host;
			if (this.port !== 1337)        settings.port  = this.port;


			data['arguments'][0] = settings;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function() {

			if (this.__socket === null) {

				if (lychee.debug === true) {
//					console.log('lychee.net.Server: Connected to ' + this.host + ':' + this.port);
				}


				var that = this;


				// TODO: Setup HTTP Server


				return true;

			}


			return false;

		},

		disconnect: function() {

			if (this.__socket !== null) {
				this.__socket.close();
			}


			return true;

		},



		/*
		 * TUNNEL API
		 */

		setHost: function(host) {

			host = typeof host === 'string' ? host : null;


			if (host !== null) {

				this.host = host;

				return true;

			}


			return false;

		},

		setPort: function(port) {

			port = typeof port === 'number' ? (port | 0) : null;


			if (port !== null) {

				this.port = port;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('Renderer').tags({
	platform: 'html-webgl'
}).supports(function(lychee, global) {

	/*
	 * Hint for check against undefined
	 *
	 * typeof WebGLRenderingContext is:
	 * > function in Chrome, Firefox, IE11
	 * > object in Safari, Safari Mobile
	 *
	 */

	if (
		   typeof global.document !== 'undefined'
		&& typeof global.document.createElement === 'function'
		&& typeof global.WebGLRenderingContext !== 'undefined'
	) {

		var canvas = global.document.createElement('canvas');
		if (typeof canvas.getContext === 'function') {

			if (canvas.getContext('webgl') instanceof global.WebGLRenderingContext) {
				return true;
			}

		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _programs = {};

	(function(attachments) {

		for (var file in attachments) {

			var tmp = file.split('.');
			var id  = tmp[0];
			var ext = tmp[1];


			var entry = _programs[id] || null;
			if (entry === null) {
				entry = _programs[id] = {
					fs: '',
					vs: ''
				};
			}


			if (ext === 'fs') {
				entry.fs = attachments[file].buffer;
			} else if (ext === 'vs') {
				entry.vs = attachments[file].buffer;
			}

		}

	})(attachments);



	var _init_program = function(id) {

		id = typeof id === 'string' ? id : '';


		var shader = _programs[id] || null;
		if (shader !== null) {

			var gl      = this.__ctx;
			var program = gl.createProgram();


			var fs = gl.createShader(gl.FRAGMENT_SHADER);

			gl.shaderSource(fs, shader.fs);
			gl.compileShader(fs);


			var vs = gl.createShader(gl.VERTEX_SHADER);

			gl.shaderSource(vs, shader.vs);
			gl.compileShader(vs);


			gl.attachShader(program, vs);
			gl.attachShader(program, fs);
			gl.linkProgram(program);


			var status = gl.getProgramParameter(program, gl.LINK_STATUS);
			if (status === true) {

				gl.useProgram(program);

				return program;

			}

		}


		return null;

	};



	/*
	 * HELPERS
	 */

	var _color_cache = {};

	var _is_color = function(color) {

		if (typeof color === 'string') {

			if (
				   color.match(/(#[AaBbCcDdEeFf0-9]{6})/)
				|| color.match(/(#[AaBbCcDdEeFf0-9]{8})/)
			) {

				return true;

			}

		}


		return false;

	};

	var _hex_to_rgba = function(hex) {

		if (_color_cache[hex] !== undefined) {
			return _color_cache[hex];
		}


		var rgba = [ 0, 0, 0, 1.0 ];

		if (typeof hex === 'string') {

			if (hex.length === 7) {

				rgba[0] = parseInt(hex[1] + hex[2], 16) / 256;
				rgba[1] = parseInt(hex[3] + hex[4], 16) / 256;
				rgba[2] = parseInt(hex[5] + hex[6], 16) / 256;
				rgba[3] = 1.0;

			} else if (hex.length === 9) {

 				rgba[0] = parseInt(hex[1] + hex[2], 16) / 256;
				rgba[1] = parseInt(hex[3] + hex[4], 16) / 256;
				rgba[2] = parseInt(hex[5] + hex[6], 16) / 256;
				rgba[3] = parseInt(hex[7] + hex[8], 16) / 256;

			}

		}


		_color_cache[hex] = rgba;


		return rgba;

	};

	var _texture_cache = {};

	var _get_gltexture = function(texture) {

		var url = texture.url;
		if (_texture_cache[url] !== undefined) {
			return _texture_cache[url];
		}


		var gl        = this.__ctx;
		var gltexture = gl.createTexture();
		var size      = gl.getParameter(gl.MAX_TEXTURE_SIZE);


		if (
			   texture.width  <= size
			&& texture.height <= size
		) {

			gl.bindTexture(gl.TEXTURE_2D, gltexture);
// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.buffer);

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);

/*
 * TODO: Figure out why Mipmaps won't work :/
			var is_power_of_two = (texture.width & (texture.width - 1) === 0);
			if (is_power_of_two === true) {
				gl.generateMipmap(gl.TEXTURE_2D);
			}
*/

			gl.bindTexture(gl.TEXTURE_2D, null);

		}


		_texture_cache[url] = gltexture;


		return gltexture;

	};



	/*
	 * STRUCTS
	 */

	var _buffer = function(width, height) {

	};

	_buffer.prototype = {
	};



	/*
	 * IMPLEMENTATION
	 */

	var _id = 0;


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.alpha      = 1.0;
		this.background = '#000000';
		this.id         = 'lychee-Renderer-' + _id++;
		this.width      = null;
		this.height     = null;
		this.offset     = { x: 0, y: 0 };

		this.__canvas           = global.document.createElement('canvas');
		this.__canvas.className = 'lychee-Renderer-canvas';
		this.__ctx              = this.__canvas.getContext('webgl');
		global.document.body.appendChild(this.__canvas);

		this.__programs = {};


		this.setAlpha(settings.alpha);
		this.setBackground(settings.background);
		this.setId(settings.id);
		this.setWidth(settings.width);
		this.setHeight(settings.height);


		settings = null;


		for (var id in _programs) {
			this.__programs[id] = _init_program.call(this, id);
		}

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.alpha !== 1.0)                           settings.alpha      = this.alpha;
			if (this.background !== '#000000')                settings.background = this.background;
			if (this.id.substr(0, 16) !== 'lychee-Renderer-') settings.id         = this.id;
			if (this.width !== null)                          settings.width      = this.width;
			if (this.height !== null)                         settings.height     = this.height;


			return {
				'constructor': 'lychee.Renderer',
				'arguments':   [ settings ],
				'blob':        null
			};

		},



		/*
		 * SETTERS AND GETTERS
		 */

		setAlpha: function(alpha) {

			alpha = typeof alpha === 'number' ? alpha : null;


			if (
				   alpha !== null
				&& alpha >= 0
				&& alpha <= 1
			) {
				this.alpha = alpha;
			}

		},

		setBackground: function(color) {

			color = _is_color(color) === true ? color : null;


			if (color !== null) {
				this.background = color;
				this.__canvas.style.backgroundColor = color;
			}

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {
				this.id = id;
				this.__canvas.id = id;
			}

		},

		setWidth: function(width) {

			width = typeof width === 'number' ? width : null;


			if (width !== null) {
				this.width = width;
			} else {
				this.width = global.innerWidth;
			}


			this.__canvas.width       = this.width;
			this.__canvas.style.width = this.width + 'px';
			this.__ctx._width         = this.width;
			this.offset.x             = this.__canvas.offsetLeft;

		},

		setHeight: function(height) {

			height = typeof height === 'number' ? height : null;


			if (height !== null) {
				this.height = height;
			} else {
				this.height = global.innerHeight;
			}


			this.__canvas.height       = this.height;
			this.__canvas.style.height = this.height + 'px';
			this.__ctx._height         = this.height;
			this.offset.y              = this.__canvas.offsetTop;

		},



		/*
		 * BUFFER INTEGRATION
		 */

		clear: function(buffer) {

			buffer = buffer instanceof _buffer ? buffer : null;


			if (buffer !== null) {

				// TODO: Use gl.clear(gl.COLOR_BUFFER_BIT) on buffer;
				buffer.clear();

			} else {

				var gl    = this.__ctx;
				var color = _hex_to_rgba(this.background);

				gl.clearColor(color[0], color[1], color[2], color[3]);

			}

		},

		flush: function() {

		},

// TODO: createBuffer() implementation for gl.createFramebuffer();
		createBuffer: function(width, height) {
			return new _buffer(width, height);
		},

// TODO: setBuffer();

		setBuffer: function(buffer) {

			buffer = buffer instanceof _buffer ? buffer : null;


			if (buffer !== null) {
				// this.__ctx = buffer.__ctx;
			} else {
				// this.__ctx = this.__canvas.getContext('2d');
			}

		},



		/*
		 * DRAWING API
		 */

		drawArc: function(x, y, start, end, radius, color, background, lineWidth) {

// TODO: drawArc() implementation;
return;


			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;
			var pi2 = Math.PI * 2;


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();

			ctx.arc(
				x,
				y,
				radius,
				start * pi2,
				end * pi2
			);

			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

			ctx.closePath();

		},

		drawBox: function(x1, y1, x2, y2, color, background, lineWidth) {

// TODO: drawBox() implementation;
return;

			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			ctx.globalAlpha = this.alpha;

			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
			} else {
				ctx.fillStyle   = color;
				ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
			}

		},

		drawBuffer: function(x1, y1, buffer) {

// TODO: drawBuffer() implementation;
return;


			buffer = buffer instanceof _buffer ? buffer : null;


			if (buffer !== null) {

				var ctx = this.__ctx;


				ctx.globalAlpha = this.alpha;
				ctx.drawImage(buffer.__buffer, x1, y1);


				if (lychee.debug === true) {

					this.drawBox(
						x1,
						y1,
						x1 + buffer.width,
						y1 + buffer.height,
						'#00ff00',
						false,
						1
					);

				}

			}

		},

		drawCircle: function(x, y, radius, color, background, lineWidth) {

// TODO: drawCircle() implementation;
return;

			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();

			ctx.arc(
				x,
				y,
				radius,
				0,
				Math.PI * 2
			);


			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

			ctx.closePath();

		},

		drawLight: function(x, y, radius, color, background, lineWidth) {

// TODO: drawLight() implementation;
return;


			color      = _is_color(color) ? _hex_to_rgba(color) : 'rgba(255,255,255,1.0)';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

			gradient.addColorStop(0, color);
			gradient.addColorStop(1, 'rgba(0,0,0,0)');


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();

			ctx.arc(
				x,
				y,
				radius,
				0,
				Math.PI * 2
			);


			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = gradient;
				ctx.stroke();
			} else {
				ctx.fillStyle   = gradient;
				ctx.fill();
			}

			ctx.closePath();

		},

		drawLine: function(x1, y1, x2, y2, color, lineWidth) {

// TODO: drawLine() implementation;
return;


			color     = _is_color(color) === true ? color : '#000000';
			lineWidth = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);

			ctx.lineWidth   = lineWidth;
			ctx.strokeStyle = color;
			ctx.stroke();

			ctx.closePath();

		},

		drawTriangle: function(x1, y1, x2, y2, x3, y3, color, background, lineWidth) {

// TODO: drawTriangle() implementation;
return;


			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x3, y3);
			ctx.lineTo(x1, y1);

			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

			ctx.closePath();

		},

		// points, x1, y1, [ ... x(a), y(a) ... ], [ color, background, lineWidth ]
		drawPolygon: function(points, x1, y1) {

// TODO: drawPolygon() implementation;
return;


			var l = arguments.length;

			if (points > 3) {

				var optargs = l - (points * 2) - 1;


				var color, background, lineWidth;

				if (optargs === 3) {

					color      = arguments[l - 3];
					background = arguments[l - 2];
					lineWidth  = arguments[l - 1];

				} else if (optargs === 2) {

					color      = arguments[l - 2];
					background = arguments[l - 1];

				} else if (optargs === 1) {

					color      = arguments[l - 1];

				}


				color      = _is_color(color) === true ? color : '#000000';
				background = background === true;
				lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


				var ctx = this.__ctx;


				ctx.globalAlpha = this.alpha;
				ctx.beginPath();
				ctx.moveTo(x1, y1);

				for (var p = 1; p < points; p++) {

					ctx.lineTo(
						arguments[1 + p * 2],
						arguments[1 + p * 2 + 1]
					);

				}

				ctx.lineTo(x1, y1);

				if (background === false) {
					ctx.lineWidth   = lineWidth;
					ctx.strokeStyle = color;
					ctx.stroke();
				} else {
					ctx.fillStyle   = color;
					ctx.fill();
				}

				ctx.closePath();

			}

		},

		drawSprite: function(x1, y1, texture, map) {

			texture = texture instanceof Texture ? texture : null;
			map     = map instanceof Object      ? map     : null;

console.log(x1, y1);

if (y1 < 0) {
	return;
}


			var program = this.__programs['Sprite'];
			if (
				   program !== null
				&& texture !== null
			) {

				var gl  = this.__ctx;
				var tex = _get_gltexture.call(this, texture);

				var  x2 = 0,  y2 = 0;
				var tx1 = 0, ty1 = 0;
				var tx2 = 0, ty2 = 0;


				// TODO: alpha implementation in shader
				// ctx.globalAlpha = this.alpha;

				if (map === null) {

					x2  = x1 + texture.width;
					y2  = y1 + texture.height;

					tx1 = 0;
					ty1 = 0;
					tx2 = 1.0;
					ty2 = 1.0;

				} else {

					x2  = x1 + map.w;
					y2  = y1 + map.h;

					tx1 = map.x / texture.width;
					ty1 = map.y / texture.height;
					tx2 = tx1 + (map.w / texture.width);
					ty2 = ty1 + (map.h / texture.height);

					if (lychee.debug === true) {

						this.drawBox(
							x1,
							y1,
							x2,
							y2,
							'#ff0000',
							false,
							1
						);

					}

				}


				gl.useProgram(program);
				gl.bindTexture(gl.TEXTURE_2D, tex);



				console.log(tx1, ty1, ' > ', tx2, ty2);
				console.log(x1, y1, ' >> ', x2, y2);


				var texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
				var texCoordBuffer   = gl.createBuffer();

				gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
					tx1, ty1,
					tx2, ty1,
					tx1, ty2,
					tx1, ty2,
					tx2, ty1,
					tx2, ty2
				]), gl.STATIC_DRAW);

				gl.enableVertexAttribArray(texCoordLocation);
				gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);


				var resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

				gl.uniform2f(resolutionLocation, gl._width, gl._height);


				var positionLocation = gl.getAttribLocation(program, 'a_position');
				var positionBuffer   = gl.createBuffer();

				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

				gl.enableVertexAttribArray(positionLocation);
				gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);


				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
					x1, y1,
					x2, y1,
					x1, y2,
					x1, y2,
					x2, y1,
					x2, y2
				]), gl.STATIC_DRAW);


				gl.drawArrays(gl.TRIANGLES, 0, 6);












/*


 // setup GLSL program
  gl.useProgram(program);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);




}

function randomInt(range) {
  return Math.floor(Math.random() * range);
}

*/






































































/*

				var textureBuffer = gl.createBuffer();

				gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
					tx1 / texture.width, ty1 / texture.height,
					tx2 / texture.width, ty1 / texture.height,
					tx1 / texture.width, ty2 / texture.height,
					tx1 / texture.width, ty2 / texture.height,
					tx2 / texture.width, ty1 / texture.height,
					tx2 / texture.width, ty2 / texture.height
				]), gl.STATIC_DRAW);
				gl.vertexAttribPointer(program._aTexture, 2, gl.FLOAT, false, 0, 0);

				gl.bindTexture(gl.TEXTURE_2D, tex);


				gl.uniform2f(program._uViewport, gl._width, gl._height);
				gl.uniform1i(program._uSampler, 0);


				var positionBuffer = gl.createBuffer();

				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
				gl.enableVertexAttribArray(program._aPosition);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
					x1 / gl._width, y1 / gl._height,
					x2 / gl._width, y1 / gl._height,
					x1 / gl._width, y2 / gl._height,
					x1 / gl._width, y2 / gl._height,
					x2 / gl._width, y1 / gl._height,
					x2 / gl._width, y2 / gl._height
				]), gl.STATIC_DRAW);
				gl.vertexAttribPointer(program._aPosition, 2, gl.FLOAT, false, 0, 0);


				gl.drawArrays(gl.TRIANGLES, 0, 6);

				gl.deleteBuffer(positionBuffer);
				gl.deleteBuffer(textureBuffer);

*/

			}

		},

		drawText: function(x1, y1, text, font, center) {

// TODO: drawText() implementation;
return;


			font   = font instanceof Font ? font : null;
			center = center === true;


			if (font !== null) {

				if (center === true) {

					var dim = font.measure(text);

					x1 -= dim.realwidth / 2;
					y1 -= (dim.realheight - font.baseline) / 2;

				}


				y1 -= font.baseline / 2;


				var margin  = 0;
				var texture = font.texture;
				if (texture !== null) {

					var ctx = this.__ctx;


					ctx.globalAlpha = this.alpha;

					for (t = 0, l = text.length; t < l; t++) {

						var chr = font.measure(text[t]);

						if (lychee.debug === true) {

							this.drawBox(
								x1 + margin,
								y1,
								x1 + margin + chr.realwidth,
								y1 + chr.height,
								'#00ff00',
								false,
								1
							);

						}

						ctx.drawImage(
							texture.buffer,
							chr.x,
							chr.y,
							chr.width,
							chr.height,
							x1 + margin - font.spacing,
							y1,
							chr.width,
							chr.height
						);

						margin += chr.realwidth + font.kerning;

					}

				}

			}

		},



		/*
		 * RENDERING API
		 */

		renderEntity: function(entity, offsetX, offsetY) {

			if (typeof entity.render === 'function') {

				entity.render(
					this,
					offsetX || 0,
					offsetY || 0
				);

			}

		}

	};


	return Class;

});


lychee.define('Storage').tags({
	platform: 'html'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof Storage !== 'undefined') {

		try {

			if (typeof global.localStorage === 'object' && typeof global.sessionStorage === 'object') {
				return true;
			}

		} catch(e) {
			return true;
		}

	}


	return false;

}).exports(function(lychee, global) {

	/*
	 * EVENTS
	 */

	var _persistent = null;
	var _temporary  = null;



	/*
	 * FEATURE DETECTION
	 */

	(function() {

		var local   = false;
		var session = false;


		try {

			local = 'localStorage' in global;

			if (local === true) {
				_persistent = global.localStorage;
			}

			session = 'sessionStorage' in global;

			if (session === true) {
				_temporary = global.sessionStorage;
			}

		} catch(e) {

			local   = false;
			session = true;

			_persistent = null;
			_temporary  = {

				data: {},

				getItem: function(id) {
					return this.data[id] || null;
				},

				setItem: function(id, data) {
					this.data[id] = data;
				}

			};

		}


		if (lychee.debug === true) {

			var methods = [];

			if (local)   methods.push('Persistent');
			if (session) methods.push('Temporary');

			if (methods.length === 0) {
				console.error('lychee.Storage: Supported methods are NONE');
			} else {
				console.info('lychee.Storage: Supported methods are ' + methods.join(', '));
			}

		}

	})();



	/*
	 * HELPERS
	 */

	var _read_storage = function() {

		var id   = this.id;
		var blob = null;


		var type = this.type;
		if (type === Class.TYPE.persistent) {
			blob = JSON.parse(_persistent.getItem(id));
		} else if (type === Class.TYPE.temporary) {
			blob = JSON.parse(_temporary.getItem(id));
		}


		if (blob !== null) {

			if (this.model === null) {

				if (blob['@model'] instanceof Object) {
					this.model = blob['@model'];
				}

			}


			var document = this.__document;
			if (document.index === 0) {

				if (blob['@document'] instanceof Object) {
					this.__document = blob['@document'];
				}

			}


			var objects = this.__objects;
			if (objects.length === 0 || objects.length !== blob['@objects'].length) {

				if (blob['@objects'] instanceof Array) {

					objects = blob['@objects'];
					this.__objects = [];

					for (var o = 0, ol = objects.length; o < ol; o++) {
						this.__objects.push(objects[o]);
					}


					this.trigger('sync', [ this.__objects ]);


					return true;

				}

			}

		}


		return false;

	};

	var _write_storage = function() {

		var operations = this.__operations;
		if (operations.length !== 0) {

			while (operations.length > 0) {

				var operation = operations.shift();
				if (operation.type === 'insert') {

					this.__document.index++;
					this.__objects.push(operation.object);
					this.trigger('insert', [ operation.index, operation.object ]);

				} else if (operation.type === 'update') {

					if (this.__objects[operation.index] !== operation.object) {
						this.__objects[operation.index] = operation.object;
						this.trigger('update', [ operation.index, operation.object ]);
					}

				} else if (operation.type === 'remove') {

					this.__document.index--;
					this.__objects.splice(operation.index, 1);
					this.trigger('remove', [ operation.index, operation.object ]);

				}

			}


			this.__document.time = Date.now();


			var id   = this.id;
			var blob = {
				'@document': this.__document,
				'@model':    this.model,
				'@objects':  this.__objects
			};


			var type = this.type;
			if (type === Class.TYPE.persistent) {

				if (_persistent !== null) {
					_persistent.setItem(id, JSON.stringify(blob, null, '\t'));
				}

			} else if (type === Class.TYPE.temporary) {

				if (_temporary !== null) {
					_temporary.setItem(id, JSON.stringify(blob, null, '\t'));
				}

			}


			this.trigger('sync', [ this.__objects ]);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var _id = 0;

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.id    = 'lychee-Storage-' + _id++;
		this.model = {};
		this.type  = Class.TYPE.persistent;

		this.__document   = { index: 0, time: Date.now() };
		this.__objects    = [];
		this.__operations = [];


		this.setId(settings.id);
		this.setModel(settings.model);
		this.setType(settings.type);


		lychee.event.Emitter.call(this);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		_read_storage.call(this);

	};


	Class.TYPE = {
		persistent: 0,
		temporary:  1
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		sync: function(force) {

			force = force === true;


			var result = _read_storage.call(this);
			if (result === true) {

				return true;

			} else {

				if (force === true) {

					this.trigger('sync', [ this.__objects ]);

					return true;

				}

			}


			return false;

		},

		deserialize: function(blob) {

			if (blob.document instanceof Object) {
				this.__document.index = blob.document.index;
				this.__document.time  = blob.document.time;
			}

			if (blob.objects instanceof Array) {

				this.__objects = [];

				for (var o = 0, ol = blob.objects.length; o < ol; o++) {

					var object = blob.objects[o];
					if (lychee.interfaceof(this.model, object)) {
						this.__objects.push(object);
					}

				}

			}

		},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Storage';

			var settings = {};
			var blob     = (data['blob'] || {});


			if (this.id.substr(0, 15) !== 'lychee-Storage-') settings.id    = this.id;
			if (Object.keys(this.model).length !== 0)        settings.model = this.model;
			if (this.type !== Class.TYPE.persistent)         settings.type  = this.type;


			if (this.__document.index > 0) {

				blob.document = {};
				blob.document.index = this.__document.index;
				blob.document.time  = this.__document.time;

			}

			if (this.__objects.length > 0) {

				blob.objects = {};

				for (var o = 0, ol = this.__objects.length; o < ol; o++) {

					var object = this.__objects[o];
					if (object instanceof Object) {
						blob.objects.push(JSON.parse(JSON.stringify(object)));
					}

				}

			}


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		create: function() {
			return lychee.extendunlink({}, this.model);
		},

		filter: function(callback, scope) {

			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;


			if (callback !== null) {

				return this.__objects.filter(function(object, o) {
					return callback.call(scope, object, o) === true;
				});

			}


			return this.__objects.slice();

		},

		insert: function(object) {

			// This uses the diff method, because properties can be null
			object = lychee.diff(this.model, object) === false ? object : null;


			if (object !== null) {

				var index = this.__objects.indexOf(object);
				if (index === -1) {

					this.__operations.push({
						type:   'insert',
						index:  this.__objects.length,
						object: object
					});


					_write_storage.call(this);

					return true;

				}

			}


			return false;

		},

		update: function(object) {

			// This uses the diff method, because properties can be null
			object = lychee.diff(this.model, object) === false ? object : null;


			if (object !== null) {

				var index = this.__objects.indexOf(object);
				if (index !== -1) {

					this.__operations.push({
						type:   'update',
						index:  index,
						object: object
					});


					_write_storage.call(this);

					return true;

				}

			}


			return false;

		},

		get: function(index) {

			index  = typeof index === 'number' ? (index | 0) : null;


			if (index !== null) {

				var object = this.__objects[index] || null;
				if (object !== null) {
					return object;
				}

			}


			return null;

		},

		remove: function(index, object) {

			index = typeof index === 'number' ? (index | 0) : this.__objects.indexOf(object);


			if (index >= 0 && index < this.__objects.length) {

				this.__operations.push({
					type:   'remove',
					index:  index,
					object: this.__objects[index]
				});


				_write_storage.call(this);

				return true;

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;

				return true;

			}


			return false;

		},

		setModel: function(model) {

			model = model instanceof Object ? model : null;


			if (model !== null) {

				this.model = JSON.parse(JSON.stringify(model));

				return true;

			}


			return false;

		},

		setType: function(type) {

			if (lychee.enumof(Class.TYPE, type)) {

				this.type = type;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('Viewport').tags({
	platform: 'html'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof global.addEventListener === 'function') {

		if (typeof global.innerWidth === 'number' && typeof global.innerHeight === 'number') {

			if (typeof global.document !== 'undefined' && typeof global.document.getElementsByClassName === 'function') {
				return true;
			}

		}

	}


	return false;

}).exports(function(lychee, global) {

	/*
	 * EVENTS
	 */

	var _clock = {
		orientationchange: null,
		resize:            0
	};

	var _focusactive   = true;
	var _reshapeactive = false;
	var _reshapewidth  = global.innerWidth;
	var _reshapeheight = global.innerHeight;

	var _reshape_viewport = function() {

		if (_reshapeactive === true || (_reshapewidth === global.innerWidth && _reshapeheight === global.innerHeight)) {
			 return false;
		}


		_reshapeactive = true;



		/*
		 * ISSUE in Mobile WebKit:
		 *
		 * An issue occurs if width of viewport is higher than
		 * the width of the viewport of future rotation state.
		 *
		 * This bugfix prevents the viewport to scale higher
		 * than 1.0, even if the meta tag is correctly setup.
		 */

		var elements = global.document.getElementsByClassName('lychee-Renderer-canvas');
		for (var e = 0, el = elements.length; e < el; e++) {

			var element = elements[e];

			element.style.width  = '1px';
			element.style.height = '1px';

		}



		/*
		 * ISSUE in Mobile Firefox and Mobile WebKit
		 *
		 * The reflow is too slow for an update, so we have
		 * to lock the heuristic to only be executed once,
		 * waiting for a second to let the reflow finish.
		 */

		setTimeout(function() {

			for (var i = 0, l = _instances.length; i < l; i++) {
				_process_reshape.call(_instances[i], global.innerWidth, global.innerHeight);
			}

			_reshapewidth  = global.innerWidth;
			_reshapeheight = global.innerHeight;
			_reshapeactive = false;

		}, 1000);

	};


	var _instances = [];
	var _listeners = {

		orientationchange: function() {

			for (var i = 0, l = _instances.length; i < l; i++) {
				_process_orientation.call(_instances[i], global.orientation);
			}

			_clock.orientationchange = Date.now();
			_reshape_viewport();

		},

		resize: function() {

			if (_clock.orientationchange === null || (_clock.orientationchange !== null && _clock.orientationchange > _clock.resize)) {

				_clock.resize = Date.now();
				_reshape_viewport();

			}

		},

		focus: function() {

			if (_focusactive === false) {

				for (var i = 0, l = _instances.length; i < l; i++) {
					_process_show.call(_instances[i]);
				}

				_focusactive = true;

			}

		},

		blur: function() {

			if (_focusactive === true) {

				for (var i = 0, l = _instances.length; i < l; i++) {
					_process_hide.call(_instances[i]);
				}

				_focusactive = false;

			}

		}

	};



	/*
	 * FEATURE DETECTION
	 */

	var _enterFullscreen = null;
	var _leaveFullscreen = null;

	(function() {

		var resize      = 'onresize' in global;
		var orientation = 'onorientationchange' in global;
		var focus       = 'onfocus' in global;
		var blur        = 'onblur' in global;


		if (typeof global.addEventListener === 'function') {

			if (resize)      global.addEventListener('resize',            _listeners.resize,            true);
			if (orientation) global.addEventListener('orientationchange', _listeners.orientationchange, true);
			if (focus)       global.addEventListener('focus',             _listeners.focus,             true);
			if (blur)        global.addEventListener('blur',              _listeners.blur,              true);

		}


		if (global.document && global.document.documentElement) {

			var element = global.document.documentElement;

			if (typeof element.requestFullscreen === 'function' && typeof element.exitFullscreen === 'function') {

				_enterFullscreen = function() {
					element.requestFullscreen();
				};

				_leaveFullscreen = function() {
					element.exitFullscreen();
				};

			}


			if (_enterFullscreen === null || _leaveFullscreen === null) {

				var prefixes = [ 'moz', 'ms', 'webkit' ];
				var prefix   = null;

				for (var p = 0, pl = prefixes.length; p < pl; p++) {

					if (typeof element[prefixes[p] + 'RequestFullScreen'] === 'function' && typeof document[prefixes[p] + 'CancelFullScreen'] === 'function') {
						prefix = prefixes[p];
						break;
					}

				}


				if (prefix !== null) {

					_enterFullscreen = function() {
						element[prefix + 'RequestFullScreen']();
					};

					_leaveFullscreen = function() {
						global.document[prefix + 'CancelFullScreen']();
					};

				}

			}

		}


		if (lychee.debug === true) {

			var methods = [];

			if (resize)      methods.push('Resize');
			if (orientation) methods.push('Orientation');
			if (focus)       methods.push('Focus');
			if (blur)        methods.push('Blur');

			if (_enterFullscreen !== null && _leaveFullscreen !== null) {
				methods.push('Fullscreen');
			}

			if (methods.length === 0) {
				console.error('lychee.Viewport: Supported methods are NONE');
			} else {
				console.info('lychee.Viewport: Supported methods are ' + methods.join(', '));
			}

		}

	})();



	/*
	 * HELPERS
	 */

	var _process_show = function() {

		return this.trigger('show', []);

	};

	var _process_hide = function() {

		return this.trigger('hide', []);

	};

	var _process_orientation = function(orientation) {

		orientation = typeof orientation === 'number' ? orientation : null;

		if (orientation !== null) {
			this.__orientation = orientation;
		}

	};

	var _process_reshape = function(width, height) {

		if (width === this.width && height === this.height) {
			return false;
		}


		this.width  = width;
		this.height = height;



		var orientation = null;
		var rotation    = null;



		/*
		 *    TOP
		 *  _______
		 * |       |
		 * |       |
		 * |       |
		 * |       |
		 * |       |
		 * [X][X][X]
		 *
		 *  BOTTOM
		 */

		if (this.__orientation === 0) {

			if (width > height) {

				orientation = 'landscape';
				rotation    = 'landscape';

			} else {

				orientation = 'portrait';
				rotation    = 'portrait';

			}



		/*
		 *  BOTTOM
		 *
		 * [X][X][X]
		 * |       |
		 * |       |
		 * |       |
		 * |       |
		 * |_______|
		 *
		 *    TOP
		 */

		} else if (this.__orientation === 180) {

			if (width > height) {

				orientation = 'landscape';
				rotation    = 'landscape';

			} else {

				orientation = 'portrait';
				rotation    = 'portrait';

			}



		/*
		 *    ____________    B
		 * T |            [x] O
		 * O |            [x] T
		 * P |____________[x] T
		 *                    O
		 *                    M
		 */

		} else if (this.__orientation === 90) {

			if (width > height) {

				orientation = 'portrait';
				rotation    = 'landscape';

			} else {

 				orientation = 'landscape';
				rotation    = 'portrait';

			}



		/*
		 * B    ____________
		 * O [x]            | T
		 * T [x]            | O
		 * T [x]____________| P
		 * O
		 * M
		 */

		} else if (this.__orientation === -90) {

			if (width > height) {

				orientation = 'portrait';
				rotation    = 'landscape';

			} else {

 				orientation = 'landscape';
				rotation    = 'portrait';

			}

		}


		return this.trigger('reshape', [ orientation, rotation ]);

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.fullscreen = false;
		this.width      = global.innerWidth;
		this.height     = global.innerHeight;

		this.__orientation = typeof global.orientation === 'number' ? global.orientation : 0;


		lychee.event.Emitter.call(this);

		_instances.push(this);


		this.setFullscreen(settings.fullscreen);

		settings = null;

	};


	Class.prototype = {

		destroy: function() {

			var found = false;

			for (var i = 0, il = _instances.length; i < il; i++) {

				if (_instances[i] === this) {
					_instances.splice(i, 1);
					found = true;
					il--;
					i--;
				}

			}

			this.unbind();


			return found;

		},



		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Viewport';

			var settings = {};


			if (this.fullscreen !== false) settings.fullscreen = this.fullscreen;


			data['arguments'][0] = settings;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setFullscreen: function(fullscreen) {

			if (fullscreen === true && this.fullscreen === false) {

				if (_enterFullscreen !== null) {

					_enterFullscreen();
					this.fullscreen = true;

					return true;

				}

			} else if (fullscreen === false && this.fullscreen === true) {

				if (_leaveFullscreen !== null) {

					_leaveFullscreen();
					this.fullscreen = false;

					return true;

				}

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.data.BENCODE').exports(function(lychee, global) {

	/*
	 * HELPERS
	 */

	var _Stream = function(buffer, mode) {

		this.__buffer = typeof buffer === 'string' ? buffer : '';
		this.__mode   = typeof mode === 'number'   ? mode   : 0;

		this.__index  = 0;

	};


	_Stream.MODE = {
		read:  0,
		write: 1
	};


	_Stream.prototype = {

		toString: function() {
			return this.__buffer;
		},

		pointer: function() {
			return this.__index;
		},

		length: function() {
			return this.__buffer.length;
		},

		seek: function(array) {

			var bytes = Infinity;

			for (var a = 0, al = array.length; a < al; a++) {

				var token = array[a];
				var size  = this.__buffer.indexOf(token, this.__index + 1) - this.__index;
				if (size > -1 && size < bytes) {
					bytes = size;
				}

			}


			if (bytes === Infinity) {
				return 0;
			}


			return bytes;

		},

		seekRAW: function(bytes) {
			return this.__buffer.substr(this.__index, bytes);
		},

		readRAW: function(bytes) {

			var buffer = '';

			buffer       += this.__buffer.substr(this.__index, bytes);
			this.__index += bytes;

			return buffer;

		},

		writeRAW: function(buffer) {

			this.__buffer += buffer;
			this.__index  += buffer.length;

		}

	};



	/*
	 * ENCODER and DECODER
	 */

	var _encode = function(stream, data) {

		// bne, bfe, bte : null, false, true
		if (typeof data === 'boolean' || data === null) {

			if (data === null) {
				stream.writeRAW('bne');
			} else if (data === false) {
				stream.writeRAW('bfe');
			} else if (data === true) {
				stream.writeRAW('bte');
			}


		// i123e : Integer or Float (converted as Integer)
		} else if (typeof data === 'number') {

			var hi = (data / 0x80000000) << 0;
			var lo = (data % 0x80000000) << 0;

			stream.writeRAW('i');
			stream.writeRAW('' + (hi * 0x80000000 + lo).toString());
			stream.writeRAW('e');


		// <length>:<contents> : String
		} else if (typeof data === 'string') {

			stream.writeRAW(data.length + ':' + data);


		// l<contents>e : Array
		} else if (data instanceof Array) {

			stream.writeRAW('l');

			for (var d = 0, dl = data.length; d < dl; d++) {
				_encode(stream, data[d]);
			}

			stream.writeRAW('e');


		// d<contents>e : Object
		} else if (data instanceof Object && typeof data.serialize !== 'function') {

			stream.writeRAW('d');

			var keys = Object.keys(data).sort(function(a, b) {
				if (a < b) return -1;
				if (b > a) return  1;
				return 0;
			});

			for (var k = 0, kl = keys.length; k < kl; k++) {

				var key = keys[k];

				_encode(stream, key);
				_encode(stream, data[key]);

			}

			stream.writeRAW('e');


		// s<contents>e : Custom High-Level Implementation
		} else if (data instanceof Object && typeof data.serialize === 'function') {

			stream.writeRAW('s');

			var blob = lychee.serialize(data);

			_encode(stream, blob);

			stream.writeRAW('e');

		}

	};


	var _is_decodable_value = function(str) {

		var head = str.charAt(0);
		if (head.match(/([bilds]+)/g)) {
			return true;
		} else if (!isNaN(parseInt(head, 10))) {
			return true;
		}

		return false;

	};

	var _decode = function(stream) {

		var value  = undefined;
		var size   = 0;
		var tmp    = 0;
		var errors = 0;
		var check  = null;


		if (stream.pointer() < stream.length()) {

			var seek = stream.seekRAW(1);


			// bne, bfe, bte : null, false, true
			if (seek === 'b') {

				if (stream.seekRAW(3) === 'bne') {
					stream.readRAW(3);
					value = null;
				} else if (stream.seekRAW(3) === 'bfe') {
					stream.readRAW(3);
					value = false;
				} else if (stream.seekRAW(3) === 'bte') {
					stream.readRAW(3);
					value = true;
				}


			// i123e : Integer or Float (converted as Integer)
			} else if (seek === 'i') {

				stream.readRAW(1);

				size = stream.seek('e');

				if (size > 0) {

					tmp   = stream.readRAW(size);
					value = parseInt(tmp, 10);
					check = stream.readRAW(1);

				}


			// <length>:<contents> : String
			} else if (!isNaN(parseInt(seek, 10))) {

				size = stream.seek(':');

				if (size > 0) {

					size  = parseInt(stream.readRAW(size), 10);
					check = stream.readRAW(1);

					if (!isNaN(size) && check === ':') {
						value = stream.readRAW(size);
					}

				}


			// l<contents>e : Array
			} else if (seek === 'l') {

				value = [];


				stream.readRAW(1);

				while (errors === 0) {

					value.push(_decode(stream));

					check = stream.seekRAW(1);

					if (check === 'e') {
						break;
					} else if (_is_decodable_value(check) === false) {
						errors++;
					}

				}

				stream.readRAW(1);


			// d<contents>e : Object
			} else if (seek === 'd') {

				value = {};


				stream.readRAW(1);

				while (errors === 0) {

					var object_key   = _decode(stream);
					var object_value = _decode(stream);

					check = stream.seekRAW(1);

					value[object_key] = object_value;

					if (check === 'e') {
						break;
					} else if (isNaN(parseInt(check, 10))) {
						errors++;
					}

				}

				stream.readRAW(1);


			// s<contents>e : Custom High-Level Implementation
			} else if (seek === 's') {

				stream.readRAW(1);

				var blob = _decode(stream);

				value = lychee.deserialize(blob);
				check = stream.readRAW(1);

				if (check !== 'e') {
					value = undefined;
				}

			}

		}


		return value;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'lychee.data.BENCODE',
				'blob':      null
			};

		},

		encode: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

				var stream = new _Stream('', _Stream.MODE.write);

				_encode(stream, data);

				return stream.toString();

			}


			return null;

		},

		decode: function(data) {

			data = typeof data === 'string' ? data : null;


			if (data !== null) {

				var stream = new _Stream(data, _Stream.MODE.read);
				var object = _decode(stream);
				if (object !== undefined) {
					return object;
				}

			}


			return null;

		}

	};


	return Module;

});


lychee.define('lychee.data.BitON').exports(function(lychee, global) {

	/*
	 * HELPERS
	 */

	var CHAR_TABLE = new Array(256);
	for (var c = 0; c < 256; c++) {
		CHAR_TABLE[c] = String.fromCharCode(c);
	}


	var MASK_TABLE = new Array(9);
	var POW_TABLE  = new Array(9);
	var RPOW_TABLE = new Array(9);
	for (var m = 0; m < 9; m++) {
		POW_TABLE[m]  = Math.pow(2, m) - 1;
		MASK_TABLE[m] = ~(POW_TABLE[m] ^ 0xff);
		RPOW_TABLE[m] = Math.pow(10, m);
	}


	var _resolve_constructor = function(identifier, scope) {

		var pointer = scope;

		var ns = identifier.split('.');
		for (var n = 0, l = ns.length; n < l; n++) {

			var name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}


		return pointer;

	};



	var _Stream = function(buffer, mode) {

		this.__buffer    = typeof buffer === 'string' ? buffer : '';
		this.__mode      = typeof mode === 'number'   ? mode   : 0;

		this.__pointer   = 0;
		this.__value     = 0;
		this.__remaining = 8;
		this.__index     = 0;

		if (this.__mode === _Stream.MODE.read) {
			this.__value = this.__buffer.charCodeAt(this.__index);
		}

	};


	_Stream.MODE = {
		read:  0,
		write: 1
	};


	_Stream.prototype = {

		toString: function() {

			if (this.__mode === _Stream.MODE.write) {

				if (this.__value > 0) {
					this.__buffer += CHAR_TABLE[this.__value];
					this.__value   = 0;
				}


				// 0: Boolean or Null or EOS
				this.write(0, 3);
				// 00: EOS
				this.write(0, 2);

			}

			return this.__buffer;

		},

		pointer: function() {
			return this.__pointer;
		},

		length: function() {
			return this.__buffer.length * 8;
		},

		read: function(bits) {

			var overflow = bits - this.__remaining;
			var captured = this.__remaining < bits ? this.__remaining : bits;
			var shift    = this.__remaining - captured;


			var buffer = (this.__value & MASK_TABLE[this.__remaining]) >> shift;


			this.__pointer   += captured;
			this.__remaining -= captured;


			if (this.__remaining === 0) {

				this.__value      = this.__buffer.charCodeAt(++this.__index);
				this.__remaining  = 8;

				if (overflow > 0) {
					buffer = buffer << overflow | ((this.__value & MASK_TABLE[this.__remaining]) >> (8 - overflow));
					this.__remaining -= overflow;
				}

			}


			return buffer;

		},

		readRAW: function(bytes) {

			if (this.__remaining !== 8) {

				this.__index++;
				this.__value     = 0;
				this.__remaining = 8;

			}


			var buffer = '';

			if (this.__remaining === 8) {

				buffer        += this.__buffer.substr(this.__index, bytes);
				this.__index  += bytes;
				this.__value   = this.__buffer.charCodeAt(this.__index);

			}


			return buffer;

		},

		write: function(buffer, bits) {

			var overflow = bits - this.__remaining;
			var captured = this.__remaining < bits ? this.__remaining : bits;
			var shift    = this.__remaining - captured;


			if (overflow > 0) {
				this.__value += buffer >> overflow << shift;
			} else {
				this.__value += buffer << shift;
			}


			this.__pointer   += captured;
			this.__remaining -= captured;


			if (this.__remaining === 0) {

				this.__buffer    += CHAR_TABLE[this.__value];
				this.__remaining  = 8;
				this.__value      = 0;

				if (overflow > 0) {
					this.__value     += (buffer & POW_TABLE[overflow]) << (8 - overflow);
					this.__remaining -= overflow;
				}

			}

		},

		writeRAW: function(buffer) {

			if (this.__remaining !== 8) {

				this.__buffer   += CHAR_TABLE[this.__value];
				this.__value     = 0;
				this.__remaining = 8;

			}

			if (this.__remaining === 8) {

				this.__buffer  += buffer;
				this.__pointer += buffer.length * 8;

			}

		}

	};



	/*
	 * ENCODER and DECODER
	 */

	var _encode = function(stream, data) {

		// 0: Boolean or Null or EOS
		if (typeof data === 'boolean' || data === null) {

			stream.write(0, 3);

			if (data === null) {
				stream.write(1, 2);
			} else if (data === false) {
				stream.write(2, 2);
			} else if (data === true) {
				stream.write(3, 2);
			}


		// 1: Integer, 2: Float
		} else if (typeof data === 'number') {

			var type = 1;
			if (data < 268435456 && data !== (data | 0)) {
				type = 2;
			}


			stream.write(type, 3);


			// Negative value
			var sign = 0;
			if (data < 0) {
				data = -data;
				sign = 1;
			}


			// Float only: Calculate the integer value and remember the shift
			var shift = 0;

			if (type === 2) {

				var step = 10;
				var m    = data;
				var tmp  = 0;


				// Calculate the exponent and shift
				do {

					m     = data * step;
					step *= 10;
					tmp   = m | 0;
					shift++;

				} while (m - tmp > 1 / step && shift < 8);


				step = tmp / 10;

				// Recorrect shift if we are > 0.5
				// and shift is too high
				if (step === (step | 0)) {
					tmp = step;
					shift--;
				}

				data = tmp;

			}



			if (data < 2) {

				stream.write(0, 4);
				stream.write(data, 1);

			} else if (data < 16) {

				stream.write(1, 4);
				stream.write(data, 4);

			} else if (data < 256) {

				stream.write(2, 4);
				stream.write(data, 8);

			} else if (data < 4096) {

				stream.write(3, 4);
				stream.write(data >>  8 & 0xff, 4);
				stream.write(data       & 0xff, 8);

			} else if (data < 65536) {

				stream.write(4, 4);
				stream.write(data >>  8 & 0xff, 8);
				stream.write(data       & 0xff, 8);

			} else if (data < 1048576) {

				stream.write(5, 4);
				stream.write(data >> 16 & 0xff, 4);
				stream.write(data >>  8 & 0xff, 8);
				stream.write(data       & 0xff, 8);

			} else if (data < 16777216) {

				stream.write(6, 4);
				stream.write(data >> 16 & 0xff, 8);
				stream.write(data >>  8 & 0xff, 8);
				stream.write(data       & 0xff, 8);

			} else if (data < 268435456) {

				stream.write(7, 4);
				stream.write(data >> 24 & 0xff, 8);
				stream.write(data >> 16 & 0xff, 8);
				stream.write(data >>  8 & 0xff, 8);
				stream.write(data       & 0xff, 8);

			} else {

				stream.write(8, 4);

				_encode(stream, data.toString());

			}



			stream.write(sign, 1);


			// Float only: Remember the shift for precision
			if (type === 2) {
				stream.write(shift, 4);
			}


		// 3: String
		} else if (typeof data === 'string') {

			stream.write(3, 3);


			var l = data.length;

			// Write Size Field
			if (l > 65535) {

				stream.write(31, 5);

				stream.write(l >> 24 & 0xff, 8);
				stream.write(l >> 16 & 0xff, 8);
				stream.write(l >>  8 & 0xff, 8);
				stream.write(l       & 0xff, 8);

			} else if (l > 255) {

				stream.write(30, 5);

				stream.write(l >>  8 & 0xff, 8);
				stream.write(l       & 0xff, 8);

			} else if (l > 28) {

				stream.write(29, 5);

				stream.write(l, 8);

			} else {

				stream.write(l, 5);

			}


			stream.writeRAW(data);


		// 4: Start of Array
		} else if (data instanceof Array) {

			stream.write(4, 3);

			for (var d = 0, dl = data.length; d < dl; d++) {
				stream.write(0, 3);
				_encode(stream, data[d]);
			}

			// Write EOO marker
			stream.write(7, 3);


		// 5: Start of Object
		} else if (data instanceof Object && typeof data.serialize !== 'function') {

			stream.write(5, 3);

			for (var prop in data) {

				if (data.hasOwnProperty(prop)) {
					stream.write(0, 3);
					_encode(stream, prop);
					_encode(stream, data[prop]);
				}

			}

			// Write EOO marker
			stream.write(7, 3);


		// 6: Custom High-Level Implementation
		} else if (data instanceof Object && typeof data.serialize === 'function') {

			stream.write(6, 3);

			var blob = lychee.serialize(data);

			_encode(stream, blob);

			// Write EOO marker
			stream.write(7, 3);

		}

	};


	var _decode = function(stream) {

		var value  = undefined;
		var tmp    = 0;
		var errors = 0;
		var check  = 0;

		if (stream.pointer() < stream.length()) {

			var type = stream.read(3);


			// 0: Boolean or Null (or EOS)
			if (type === 0) {

				tmp = stream.read(2);

				if (tmp === 1) {
					value = null;
				} else if (tmp === 2) {
					value = false;
				} else if (tmp === 3) {
					value = true;
				}


			// 1: Integer, 2: Float
			} else if (type === 1 || type === 2) {

				tmp = stream.read(4);


				if (tmp === 0) {

					value = stream.read(1);

				} else if (tmp === 1) {

					value = stream.read(4);

				} else if (tmp === 2) {

					value = stream.read(8);

				} else if (tmp === 3) {

					value = (stream.read(4) <<  8) + stream.read(8);

				} else if (tmp === 4) {

					value = (stream.read(8) <<  8) + stream.read(8);

				} else if (tmp === 5) {

					value = (stream.read(4) << 16) + (stream.read(8) <<  8) + stream.read(8);

				} else if (tmp === 6) {

					value = (stream.read(8) << 16) + (stream.read(8) <<  8) + stream.read(8);

				} else if (tmp === 7) {

					value = (stream.read(8) << 24) + (stream.read(8) << 16) + (stream.read(8) <<  8) + stream.read(8);

				} else if (tmp === 8) {

					var str = _decode(stream);

					value = parseInt(str, 10);

				}


				// Negative value
				var sign = stream.read(1);
				if (sign === 1) {
					value = -1 * value;
				}


				// Float only: Shift it back by the precision
				if (type === 2) {
					var shift = stream.read(4);
					value /= RPOW_TABLE[shift];
				}


			// 3: String
			} else if (type === 3) {

				var size = stream.read(5);

				if (size === 31) {

					size = (stream.read(8) << 24) + (stream.read(8) << 16) + (stream.read(8) <<  8) + stream.read(8);

				} else if (size === 30) {

					size = (stream.read(8) <<  8) + stream.read(8);

				} else if (size === 29) {

					size = stream.read(8);

				}


				value = stream.readRAW(size);


			// 4: Array
			} else if (type === 4) {

				value = [];


				while (errors === 0) {

					check = stream.read(3);

					if (check === 0) {
						value.push(_decode(stream));
					} else if (check === 7) {
						break;
					} else {
						errors++;
					}

				}


			// 5: Object
			} else if (type === 5) {

				value = {};


				while (errors === 0) {

					check = stream.read(3);

					if (check === 0) {
						value[_decode(stream)] = _decode(stream);
					} else if (check === 7) {
						break;
					} else {
						errors++;
					}

				}

			// 6: Custom High-Level Implementation
			} else if (type === 6) {

				var blob = _decode(stream);

				value = lychee.deserialize(blob);
				check = stream.read(3);

				if (check !== 7) {
					value = undefined;
				}

			}

		}


		return value;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'lychee.data.BitON',
				'blob':      null
			};

		},

		encode: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

				var stream = new _Stream('', _Stream.MODE.write);

				_encode(stream, data);

				return stream.toString();

			}


			return null;

		},

		decode: function(data) {

			data = typeof data === 'string' ? data : null;


			if (data !== null) {

				var stream = new _Stream(data, _Stream.MODE.read);
				var object = _decode(stream);
				if (object !== undefined) {
					return object;
				}

			}


			return null;

		}

	};


	return Module;

});


lychee.define('lychee.data.JSON').exports(function(lychee, global) {

	/*
	 * HELPERS
	 */

	var _sanitize_string = function(str) {

		var san = str;

		san = san.replace(/\\/g, '\\\\');
		san = san.replace(/\n/g, '\\n');
		san = san.replace(/\t/g, '\\t');
		san = san.replace(/"/g,  '\\"');

		return san;

	};

	var _Stream = function(buffer, mode) {

		this.__buffer = typeof buffer === 'string' ? buffer : '';
		this.__mode   = typeof mode === 'number'   ? mode   : 0;

		this.__index  = 0;

	};


	_Stream.MODE = {
		read:  0,
		write: 1
	};


	_Stream.prototype = {

		toString: function() {
			return this.__buffer;
		},

		pointer: function() {
			return this.__index;
		},

		length: function() {
			return this.__buffer.length;
		},

		seek: function(array) {

			var bytes = Infinity;

			for (var a = 0, al = array.length; a < al; a++) {

				var token = array[a];
				var size  = this.__buffer.indexOf(token, this.__index + 1) - this.__index;
				if (size > -1 && size < bytes) {
					bytes = size;
				}

			}


			if (bytes === Infinity) {
				return 0;
			}


			return bytes;

		},

		seekRAW: function(bytes) {
			return this.__buffer.substr(this.__index, bytes);
		},

		readRAW: function(bytes) {

			var buffer = '';

			buffer       += this.__buffer.substr(this.__index, bytes);
			this.__index += bytes;

			return buffer;

		},

		writeRAW: function(buffer) {

			this.__buffer += buffer;
			this.__index  += buffer.length;

		}

	};



	/*
	 * ENCODER and DECODER
	 */

	var _encode = function(stream, data) {

		// null,false,true: Boolean or Null or EOS
		if (typeof data === 'boolean' || data === null) {

			if (data === null) {
				stream.writeRAW('null');
			} else if (data === false) {
				stream.writeRAW('false');
			} else if (data === true) {
				stream.writeRAW('true');
			}


		// 123,12.3: Integer or Float
		} else if (typeof data === 'number') {

			var type = 1;
			if (data < 268435456 && data !== (data | 0)) {
				type = 2;
			}


			// Negative value
			var sign = 0;
			if (data < 0) {
				data = -data;
				sign = 1;
			}


			if (sign === 1) {
				stream.writeRAW('-');
			}


			// TODO: Find a better way to serialize Numbers
			if (type === 1) {
				stream.writeRAW('' + data.toString());
			} else {
				stream.writeRAW('' + data.toString());
			}


		// "": String
		} else if (typeof data === 'string') {

			stream.writeRAW('"');

			stream.writeRAW(_sanitize_string(data));

			stream.writeRAW('"');


		// []: Array
		} else if (data instanceof Array) {

			stream.writeRAW('[');

			for (var d = 0, dl = data.length; d < dl; d++) {

				_encode(stream, data[d]);

				if (d < dl - 1) {
					stream.writeRAW(',');
				}

			}

			stream.writeRAW(']');


		// {}: Object
		} else if (data instanceof Object && typeof data.serialize !== 'function') {

			stream.writeRAW('{');

			var keys = Object.keys(data);

			for (var k = 0, kl = keys.length; k < kl; k++) {

				var key = keys[k];

				_encode(stream, key);
				stream.writeRAW(':');

				_encode(stream, data[key]);

				if (k < kl - 1) {
					stream.writeRAW(',');
				}

			}

			stream.writeRAW('}');


		// Custom High-Level Implementation
		} else if (data instanceof Object && typeof data.serialize === 'function') {

			stream.writeRAW('%');

			var blob = lychee.serialize(data);

			_encode(stream, blob);

			stream.writeRAW('%');

		}

	};


	var _decode = function(stream) {

		var value  = undefined;
		var size   = 0;
		var tmp    = 0;
		var errors = 0;
		var check  = null;


		if (stream.pointer() < stream.length()) {

			var seek = stream.seekRAW(1);


			// null,false,true: Boolean or Null or EOS
			if (seek === 'n' || seek === 'f' || seek === 't') {

				if (stream.seekRAW(4) === 'null') {
					stream.readRAW(4);
					value = null;
				} else if (stream.seekRAW(5) === 'false') {
					stream.readRAW(5);
					value = false;
				} else if (stream.seekRAW(4) === 'true') {
					stream.readRAW(4);
					value = true;
				}


			// 123: Number
			} else if (!isNaN(parseInt(seek, 10))) {

				size = stream.seek([ ',', ']', '}' ]);

				if (size > 0) {

					tmp = stream.readRAW(size);

					if (tmp.indexOf('.') !== -1) {
						value = parseFloat(tmp, 10);
					} else {
						value = parseInt(tmp, 10);
					}

				}

			// "": String
			} else if (seek === '"') {

				stream.readRAW(1);

				size = stream.seek([ '\\', '"' ]);

				if (size > 0) {
					value = stream.readRAW(size);
				} else {
					value = '';
				}


				check = stream.readRAW(1);


				while (check === '\\') {

					value[value.length - 1] = check;

					var special = stream.seekRAW(1);
					if (special === 'n') {

						stream.readRAW(1);
						value += '\n';

					} else if (special === 't') {

						stream.readRAW(1);
						value += '\t';

					}


					size   = stream.seek([ '\\', '"' ]);
					value += stream.readRAW(size);
					check  = stream.readRAW(1);

				}


			// []: Array
			} else if (seek === '[') {

				value = [];


				stream.readRAW(1);

				while (errors === 0) {

					value.push(_decode(stream));

					check = stream.seekRAW(1);

					if (check === ',') {
						stream.readRAW(1);
					} else if (check === ']') {
						break;
					} else {
						errors++;
					}

				}

				stream.readRAW(1);


			// {}: Object
			} else if (seek === '{') {

				value = {};


				stream.readRAW(1);

				while (errors === 0) {

					var object_key = _decode(stream);
					check = stream.readRAW(1);

					if (check !== ':') {
						errors++;
					}

					var object_value = _decode(stream);
					check = stream.seekRAW(1);


					value[object_key] = object_value;


					if (check === ',') {
						stream.readRAW(1);
					} else if (check === '}') {
						break;
					} else {
						errors++;
					}

				}

				stream.readRAW(1);

			// %%: Custom High-Level Implementation
			} else if (seek === '%') {

				stream.readRAW(1);

				var blob = _decode(stream);

				value = lychee.deserialize(blob);
				check = stream.readRAW(1);

				if (check !== '%') {
					value = undefined;
				}

			} else {

				// Invalid seek, assume it's a space character

				stream.readRAW(1);
				return _decode(stream);

			}

		}


		return value;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'lychee.data.JSON',
				'blob':      null
			};

		},

		encode: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

				var stream = new _Stream('', _Stream.MODE.write);

				_encode(stream, data);

				return stream.toString();

			}


			return null;

		},

		decode: function(data) {

			data = typeof data === 'string' ? data : null;


			if (data !== null) {

				var stream = new _Stream(data, _Stream.MODE.read);
				var object = _decode(stream);
				if (object !== undefined) {
					return object;
				}

			}


			return null;

		}

	};


	return Module;

});


lychee.define('lychee.effect.Alpha').exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _is_alpha = function(alpha) {

		if (typeof alpha === 'number') {
			return alpha >= 0 && alpha <= 1;
		}


		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(settings) {

		this.type     = Class.TYPE.easeout;
		this.delay    = 0;
		this.duration = 250;
		this.alpha    = 1;

		this.__origin = null;
		this.__start  = null;


		// No data validation garbage allowed for effects

		var type     = lychee.enumof(Class.TYPE, settings.type) ? settings.type           : null;
		var delay    = typeof settings.delay === 'number'       ? (settings.delay | 0)    : null;
		var duration = typeof settings.duration === 'number'    ? (settings.duration | 0) : null;
		var alpha    = _is_alpha(settings.alpha)                ? settings.alpha          : null;

		if (type !== null) {
			this.type = type;
		}

		if (delay !== null) {
			this.delay = delay;
		}

		if (duration !== null) {
			this.duration = duration;
		}

		if (alpha !== null) {
			this.alpha = alpha;
		}

	};


	Class.TYPE = {
		linear:        0,
		easein:        1,
		easeout:       2,
		bounceeasein:  3,
		bounceeaseout: 4
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.type !== Class.TYPE.easeout) settings.type     = this.type;
			if (this.delay !== 0)                 settings.delay    = this.delay;
			if (this.duration !== 250)            settings.duration = this.duration;
			if (this.alpha !== 1)                 settings.alpha    = this.alpha;


			return {
				'constructor': 'lychee.effect.Alpha',
				'arguments':   [ settings ]
			};

		},

		render: function(renderer, offsetX, offsetY) {

		},

		update: function(entity, clock, delta) {

			if (this.__start === null) {

				this.__start  = clock + this.delay;
				this.__origin = entity.alpha || 1;

			}


			var t = (clock - this.__start) / this.duration;
			if (t < 0) {
				return true;
			}


			var origin = this.__origin;
			var alpha  = this.alpha;

			var a      = origin;

			if (t <= 1) {

				var f  = 0;
				var da = alpha - origin;


				var type = this.type;
				if (type === Class.TYPE.linear) {

					a += t * da;

				} else if (type === Class.TYPE.easein) {

					f = 1 * Math.pow(t, 3);

					a += f * da;

				} else if (type === Class.TYPE.easeout) {

					f = Math.pow(t - 1, 3) + 1;

					a += f * da;

				} else if (type === Class.TYPE.bounceeasein) {

					var k = 1 - t;

					if ((k /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(k, 2) );
					} else if (k < ( 2 / 2.75 )) {
						f = 7.5625 * ( k -= ( 1.5   / 2.75 )) * k + 0.75;
					} else if (k < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( k -= ( 2.25  / 2.75 )) * k + 0.9375;
					} else {
						f = 7.5625 * ( k -= ( 2.625 / 2.75 )) * k + 0.984375;
					}

					a += (1 - f) * da;

				} else if (type === Class.TYPE.bounceeaseout) {

					if ((t /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(t, 2) );
					} else if (t < ( 2 / 2.75 )) {
						f = 7.5625 * ( t -= ( 1.5   / 2.75 )) * t + 0.75;
					} else if (t < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( t -= ( 2.25  / 2.75 )) * t + 0.9375;
					} else {
						f = 7.5625 * ( t -= ( 2.625 / 2.75 )) * t + 0.984375;
					}

					a += f * da;

				}


				entity.alpha = a;


				return true;

			} else {

				entity.alpha = alpha;


				return false;

			}

		}

	};


	return Class;

});


lychee.define('lychee.effect.Color').exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _is_color = function(color) {

		if (typeof color === 'string') {

			if (color.match(/(#[AaBbCcDdEeFf0-9]{6})/) || color.match(/(#[AaBbCcDdEeFf0-9]{8})/)) {
				return true;
			}

		}


		return false;

	};

	var _rgba_to_color = function(r, g, b) {

		var strr = r > 15 ? (r).toString(16) : '0' + (r).toString(16);
		var strg = g > 15 ? (g).toString(16) : '0' + (g).toString(16);
		var strb = b > 15 ? (b).toString(16) : '0' + (b).toString(16);

		return '#' + strr + strg + strb;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(settings) {

		this.type     = Class.TYPE.easeout;
		this.delay    = 0;
		this.duration = 250;
		this.color    = '#000000';

		this.__origin = null;
		this.__start  = null;


		// No data validation garbage allowed for effects

		var type     = lychee.enumof(Class.TYPE, settings.type) ? settings.type           : null;
		var delay    = typeof settings.delay === 'number'       ? (settings.delay | 0)    : null;
		var duration = typeof settings.duration === 'number'    ? (settings.duration | 0) : null;
		var color    = _is_color(settings.color)                ? settings.color          : null;

		if (type !== null) {
			this.type = type;
		}

		if (delay !== null) {
			this.delay = delay;
		}

		if (duration !== null) {
			this.duration = duration;
		}

		if (color !== null) {
			this.color = color;
		}

	};


	Class.TYPE = {
		linear:        0,
		easein:        1,
		easeout:       2,
		bounceeasein:  3,
		bounceeaseout: 4
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.type !== Class.TYPE.easeout) settings.type     = this.type;
			if (this.delay !== 0)                 settings.delay    = this.delay;
			if (this.duration !== 250)            settings.duration = this.duration;
			if (this.color !== '#000000')         settings.color    = this.color;


			return {
				'constructor': 'lychee.effect.Color',
				'arguments':   [ settings ]
			};

		},

		render: function(renderer, offsetX, offsetY) {

		},

		update: function(entity, clock, delta) {

			if (this.__start === null) {

				this.__start  = clock + this.delay;
				this.__origin = entity.color || '#000000';

			}


			var origin  = this.__origin;
			var color   = this.color;

			var originr = parseInt(origin.substr(1, 2), 16) || 0;
			var origing = parseInt(origin.substr(3, 2), 16) || 0;
			var originb = parseInt(origin.substr(5, 2), 16) || 0;

			var colorr  = parseInt(color.substr(1, 2), 16) || 0;
			var colorg  = parseInt(color.substr(3, 2), 16) || 0;
			var colorb  = parseInt(color.substr(5, 2), 16) || 0;

			var r       = originr;
			var g       = origing;
			var b       = originb;


			var t = (clock - this.__start) / this.duration;
			if (t < 0) {
				return true;
			}

			if (t <= 1) {

				var f  = 0;
				var dr = colorr - originr;
				var dg = colorg - origing;
				var db = colorb - originb;


				var type = this.type;
				if (type === Class.TYPE.linear) {

					r += t * dr;
					g += t * dg;
					b += t * db;

				} else if (type === Class.TYPE.easein) {

					f = 1 * Math.pow(t, 3);

					r += f * dr;
					g += f * dg;
					b += f * db;

				} else if (type === Class.TYPE.easeout) {

					f = Math.pow(t - 1, 3) + 1;

					r += f * dr;
					g += f * dg;
					b += f * db;

				} else if (type === Class.TYPE.bounceeasein) {

					var k = 1 - t;

					if ((k /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(k, 2) );
					} else if (k < ( 2 / 2.75 )) {
						f = 7.5625 * ( k -= ( 1.5   / 2.75 )) * k + 0.75;
					} else if (k < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( k -= ( 2.25  / 2.75 )) * k + 0.9375;
					} else {
						f = 7.5625 * ( k -= ( 2.625 / 2.75 )) * k + 0.984375;
					}

					r += (1 - f) * dr;
					g += (1 - f) * dg;
					b += (1 - f) * db;

				} else if (type === Class.TYPE.bounceeaseout) {

					if ((t /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(t, 2) );
					} else if (t < ( 2 / 2.75 )) {
						f = 7.5625 * ( t -= ( 1.5   / 2.75 )) * t + 0.75;
					} else if (t < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( t -= ( 2.25  / 2.75 )) * t + 0.9375;
					} else {
						f = 7.5625 * ( t -= ( 2.625 / 2.75 )) * t + 0.984375;
					}

					r += f * dr;
					g += f * dg;
					b += f * db;

				}


				entity.color = _rgba_to_color(r | 0, g | 0, b | 0);


				return true;

			} else {

				entity.color = _rgba_to_color(colorr | 0, colorg | 0, colorb | 0);


				return false;

			}

		}

	};


	return Class;

});


lychee.define('lychee.effect.Lightning').exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _draw_strike = function(x1, y1, x2, y2, color1, color2) {

		var dx = x2 - x1;
		var dy = y2 - y1;

		var distance = Math.sqrt(dx * dx + dy * dy);
		var width    = distance / 10;

		var x = x1;
		var y = y1;

		for (var s = 0; s <= 10; s++) {

			var magnitude = (width * s) / distance;
			var x3        = magnitude * x2 + (1 - magnitude) * x1;
			var y3        = magnitude * y2 + (1 - magnitude) * y1;

			if (s !== 0 && s !== 10) {
				x3 += (Math.random() * width) - (width / 2);
				y3 += (Math.random() * width) - (width / 2);
			}

			this.drawLine(
				x,
				y,
				x3,
				y3,
				color1,
				12
			);

			this.drawCircle(
				x3,
				y3,
				6,
				color1,
				true
			);

			this.drawLine(
				x,
				y,
				x3,
				y3,
				color2,
				6
			);

			this.drawCircle(
				x3,
				y3,
				3,
				color2,
				true
			);


			x = x3;
			y = y3;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(settings) {

		this.type     = Class.TYPE.easeout;
		this.delay    = 0;
		this.duration = 250;
		this.position = { x: null, y: null };

		this.__alpha  = 1;
		this.__clock  = null;
		this.__origin = { x: null, y: null, alpha: 1 };
		this.__start  = null;


		// No data validation garbage allowed for effects

		var type     = lychee.enumof(Class.TYPE, settings.type) ? settings.type           : null;
		var delay    = typeof settings.delay === 'number'       ? (settings.delay | 0)    : null;
		var duration = typeof settings.duration === 'number'    ? (settings.duration | 0) : null;
		var position = settings.position instanceof Object      ? settings.position       : null;

		if (type !== null) {
			this.type = type;
		}

		if (delay !== null) {
			this.delay = delay;
		}

		if (duration !== null) {
			this.duration = duration;
		}

		if (position !== null) {
			this.position.x = typeof position.x === 'number' ? (position.x | 0) : null;
			this.position.y = typeof position.y === 'number' ? (position.y | 0) : null;
		}

	};


	Class.TYPE = {
		linear:        0,
		easein:        1,
		easeout:       2,
		bounceeasein:  3,
		bounceeaseout: 4
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.type !== Class.TYPE.easeout) settings.type     = this.type;
			if (this.delay !== 0)                 settings.delay    = this.delay;
			if (this.duration !== 250)            settings.duration = this.duration;


			if (this.position.x !== null || this.position.y !== null || this.position.z !== null) {

				settings.position = {};

				if (this.position.x !== null) settings.position.x = this.position.x;
				if (this.position.y !== null) settings.position.y = this.position.y;

			}


			return {
				'constructor': 'lychee.effect.Lightning',
				'arguments':   [ settings ]
			};

		},

		render: function(renderer, offsetX, offsetY) {

			var t = (this.__clock - this.__start) / this.duration;
			if (t > 0 && t <= 1) {

				var origin   = this.__origin;
				var position = this.position;

				var x1 = origin.x   + offsetX;
				var y1 = origin.y   + offsetY;
				var x2 = position.x + offsetX;
				var y2 = position.y + offsetY;


				renderer.setAlpha(this.__alpha);


				_draw_strike.call(
					renderer,
					x1,
					y1,
					x2,
					y2,
					'#557788',
					'#7799aa'
				);

				_draw_strike.call(
					renderer,
					x1,
					y1,
					x2,
					y2,
					'#cfefff',
					'#ffffff'
				);


				renderer.setAlpha(1);

			}

		},

		update: function(entity, clock, delta) {

			this.__clock = clock;


			if (this.__start === null) {
				this.__start = clock + this.delay;
			}


			var t = (clock - this.__start) / this.duration;
			if (t < 0) {

				return true;

			} else {

				this.__origin.alpha = 1;

				if (this.__origin.x === null) {
					this.__origin.x = entity.position.x;
				}

				if (this.__origin.y === null) {
					this.__origin.y = entity.position.y;
				}

			}


			var origin = this.__origin.alpha;
			var alpha  = 0;

			var a      = origin;

			if (t <= 1) {

				var f  = 0;
				var da = alpha - origin;


				var type = this.type;
				if (type === Class.TYPE.linear) {

					a += t * da;

				} else if (type === Class.TYPE.easein) {

					f = 1 * Math.pow(t, 3);

					a += f * da;

				} else if (type === Class.TYPE.easeout) {

					f = Math.pow(t - 1, 3) + 1;

					a += f * da;

				} else if (type === Class.TYPE.bounceeasein) {

					var k = 1 - t;

					if ((k /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(k, 2) );
					} else if (k < ( 2 / 2.75 )) {
						f = 7.5625 * ( k -= ( 1.5   / 2.75 )) * k + 0.75;
					} else if (k < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( k -= ( 2.25  / 2.75 )) * k + 0.9375;
					} else {
						f = 7.5625 * ( k -= ( 2.625 / 2.75 )) * k + 0.984375;
					}

					a += (1 - f) * da;

				} else if (type === Class.TYPE.bounceeaseout) {

					if ((t /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(t, 2) );
					} else if (t < ( 2 / 2.75 )) {
						f = 7.5625 * ( t -= ( 1.5   / 2.75 )) * t + 0.75;
					} else if (t < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( t -= ( 2.25  / 2.75 )) * t + 0.9375;
					} else {
						f = 7.5625 * ( t -= ( 2.625 / 2.75 )) * t + 0.984375;
					}

					a += f * da;

				}

				this.__alpha = a;


				return true;

			} else {

				this.__alpha = 0;


				return false;

			}

		}

	};


	return Class;

});


lychee.define('lychee.effect.Offset').exports(function(lychee, global, attachments) {

	var Class = function(settings) {

		this.type     = Class.TYPE.easeout;
		this.delay    = 0;
		this.duration = 250;
		this.offset   = { x: null, y: null };

		this.__origin = { x: null, y: null };
		this.__start  = null;


		// No data validation garbage allowed for effects

		var type     = lychee.enumof(Class.TYPE, settings.type) ? settings.type           : null;
		var delay    = typeof settings.delay === 'number'       ? (settings.delay | 0)    : null;
		var duration = typeof settings.duration === 'number'    ? (settings.duration | 0) : null;
		var offset   = settings.offset instanceof Object        ? settings.offset         : null;

		if (type !== null) {
			this.type = type;
		}

		if (delay !== null) {
			this.delay = delay;
		}

		if (duration !== null) {
			this.duration = duration;
		}

		if (offset !== null) {
			this.offset.x = typeof offset.x === 'number' ? (offset.x | 0) : null;
			this.offset.y = typeof offset.y === 'number' ? (offset.y | 0) : null;
		}

	};


	Class.TYPE = {
		linear:        0,
		easein:        1,
		easeout:       2,
		bounceeasein:  3,
		bounceeaseout: 4
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.type !== Class.TYPE.easeout) settings.type     = this.type;
			if (this.delay !== 0)                 settings.delay    = this.delay;
			if (this.duration !== 250)            settings.duration = this.duration;


			if (this.offset.x !== null || this.offset.y !== null) {

				settings.offset = {};

				if (this.offset.x !== null) settings.offset.x = this.offset.x;
				if (this.offset.y !== null) settings.offset.y = this.offset.y;

			}


			return {
				'constructor': 'lychee.effect.Offset',
				'arguments':   [ settings ]
			};

		},

		render: function(renderer, offsetX, offsetY) {

		},

		update: function(entity, clock, delta) {

			if (this.__start === null) {

				this.__start    = clock + this.delay;
				this.__origin.x = entity.offset.x;
				this.__origin.y = entity.offset.y;

			}


			var t = (clock - this.__start) / this.duration;
			if (t < 0) {
				return true;
			}


			var origin  = this.__origin;
			var originx = origin.x;
			var originy = origin.y;

			var offset  = this.offset;
			var offsetx = offset.x;
			var offsety = offset.y;

			var x       = originx;
			var y       = originy;

			if (t <= 1) {

				var f  = 0;
				var dx = offsetx - originx;
				var dy = offsety - originy;


				var type = this.type;
				if (type === Class.TYPE.linear) {

					x += t * dx;
					y += t * dy;

				} else if (type === Class.TYPE.easein) {

					f = 1 * Math.pow(t, 3);

					x += f * dx;
					y += f * dy;

				} else if (type === Class.TYPE.easeout) {

					f = Math.pow(t - 1, 3) + 1;

					x += f * dx;
					y += f * dy;

				} else if (type === Class.TYPE.bounceeasein) {

					var k = 1 - t;

					if ((k /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(k, 2) );
					} else if (k < ( 2 / 2.75 )) {
						f = 7.5625 * ( k -= ( 1.5   / 2.75 )) * k + 0.75;
					} else if (k < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( k -= ( 2.25  / 2.75 )) * k + 0.9375;
					} else {
						f = 7.5625 * ( k -= ( 2.625 / 2.75 )) * k + 0.984375;
					}

					x += (1 - f) * dx;
					y += (1 - f) * dy;

				} else if (type === Class.TYPE.bounceeaseout) {

					if ((t /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(t, 2) );
					} else if (t < ( 2 / 2.75 )) {
						f = 7.5625 * ( t -= ( 1.5   / 2.75 )) * t + 0.75;
					} else if (t < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( t -= ( 2.25  / 2.75 )) * t + 0.9375;
					} else {
						f = 7.5625 * ( t -= ( 2.625 / 2.75 )) * t + 0.984375;
					}

					x += f * dx;
					y += f * dy;

				}


				if (offsetx !== null) entity.offset.x = x;
				if (offsety !== null) entity.offset.y = y;


				return true;

			} else {

				if (offsetx !== null) entity.offset.x = offsetx;
				if (offsety !== null) entity.offset.y = offsety;


				return false;

			}

		}

	};


	return Class;

});


lychee.define('lychee.effect.Position').exports(function(lychee, global, attachments) {

	var Class = function(settings) {

		this.type     = Class.TYPE.easeout;
		this.delay    = 0;
		this.duration = 250;
		this.position = { x: null, y: null, z: null };

		this.__origin = { x: null, y: null, z: null };
		this.__start  = null;


		// No data validation garbage allowed for effects

		var type     = lychee.enumof(Class.TYPE, settings.type) ? settings.type           : null;
		var delay    = typeof settings.delay === 'number'       ? (settings.delay | 0)    : null;
		var duration = typeof settings.duration === 'number'    ? (settings.duration | 0) : null;
		var position = settings.position instanceof Object      ? settings.position       : null;

		if (type !== null) {
			this.type = type;
		}

		if (delay !== null) {
			this.delay = delay;
		}

		if (duration !== null) {
			this.duration = duration;
		}

		if (position !== null) {
			this.position.x = typeof position.x === 'number' ? (position.x | 0) : null;
			this.position.y = typeof position.y === 'number' ? (position.y | 0) : null;
			this.position.z = typeof position.z === 'number' ? (position.z | 0) : null;
		}

	};


	Class.TYPE = {
		linear:        0,
		easein:        1,
		easeout:       2,
		bounceeasein:  3,
		bounceeaseout: 4
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.type !== Class.TYPE.easeout) settings.type     = this.type;
			if (this.delay !== 0)                 settings.delay    = this.delay;
			if (this.duration !== 250)            settings.duration = this.duration;


			if (this.position.x !== null || this.position.y !== null || this.position.z !== null) {

				settings.position = {};

				if (this.position.x !== null) settings.position.x = this.position.x;
				if (this.position.y !== null) settings.position.y = this.position.y;
				if (this.position.z !== null) settings.position.z = this.position.z;

			}


			return {
				'constructor': 'lychee.effect.Position',
				'arguments':   [ settings ]
			};

		},

		render: function(renderer, offsetX, offsetY) {

		},

		update: function(entity, clock, delta) {

			if (this.__start === null) {

				this.__start    = clock + this.delay;
				this.__origin.x = entity.position.x;
				this.__origin.y = entity.position.y;
				this.__origin.z = entity.position.z;

			}


			var t = (clock - this.__start) / this.duration;
			if (t < 0) {
				return true;
			}


			var origin    = this.__origin;
			var originx   = origin.x;
			var originy   = origin.y;
			var originz   = origin.z;

			var position  = this.position;
			var positionx = position.x;
			var positiony = position.y;
			var positionz = position.z;

			var x         = originx;
			var y         = originy;
			var z         = originz;

			if (t <= 1) {

				var f  = 0;
				var dx = positionx - originx;
				var dy = positiony - originy;
				var dz = positionz - originz;


				var type = this.type;
				if (type === Class.TYPE.linear) {

					x += t * dx;
					y += t * dy;
					z += t * dz;

				} else if (type === Class.TYPE.easein) {

					f = 1 * Math.pow(t, 3);

					x += f * dx;
					y += f * dy;
					z += f * dz;

				} else if (type === Class.TYPE.easeout) {

					f = Math.pow(t - 1, 3) + 1;

					x += f * dx;
					y += f * dy;
					z += f * dz;

				} else if (type === Class.TYPE.bounceeasein) {

					var k = 1 - t;

					if ((k /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(k, 2) );
					} else if (k < ( 2 / 2.75 )) {
						f = 7.5625 * ( k -= ( 1.5   / 2.75 )) * k + 0.75;
					} else if (k < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( k -= ( 2.25  / 2.75 )) * k + 0.9375;
					} else {
						f = 7.5625 * ( k -= ( 2.625 / 2.75 )) * k + 0.984375;
					}

					x += (1 - f) * dx;
					y += (1 - f) * dy;
					z += (1 - f) * dz;

				} else if (type === Class.TYPE.bounceeaseout) {

					if ((t /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(t, 2) );
					} else if (t < ( 2 / 2.75 )) {
						f = 7.5625 * ( t -= ( 1.5   / 2.75 )) * t + 0.75;
					} else if (t < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( t -= ( 2.25  / 2.75 )) * t + 0.9375;
					} else {
						f = 7.5625 * ( t -= ( 2.625 / 2.75 )) * t + 0.984375;
					}

					x += f * dx;
					y += f * dy;
					z += f * dz;

				}


				if (positionx !== null) entity.position.x = x;
				if (positiony !== null) entity.position.y = y;
				if (positionz !== null) entity.position.z = z;


				return true;

			} else {

				if (positionx !== null) entity.position.x = positionx;
				if (positiony !== null) entity.position.y = positiony;
				if (positionz !== null) entity.position.z = positionz;


				return false;

			}

		}

	};


	return Class;

});


lychee.define('lychee.effect.Radius').exports(function(lychee, global, attachments) {

	var Class = function(settings) {

		this.type     = Class.TYPE.easeout;
		this.delay    = 0;
		this.duration = 250;
		this.radius   = 0;

		this.__origin = 0;
		this.__start  = null;


		// No data validation garbage allowed for effects

		var type     = lychee.enumof(Class.TYPE, settings.type) ? settings.type           : null;
		var delay    = typeof settings.delay === 'number'       ? (settings.delay | 0)    : null;
		var duration = typeof settings.duration === 'number'    ? (settings.duration | 0) : null;
		var radius   = typeof settings.radius === 'number'      ? (settings.radius | 0)   : null;

		if (type !== null) {
			this.type = type;
		}

		if (delay !== null) {
			this.delay = delay;
		}

		if (duration !== null) {
			this.duration = duration;
		}

		if (radius !== null) {
			this.radius = radius;
		}

	};


	Class.TYPE = {
		linear:        0,
		easein:        1,
		easeout:       2,
		bounceeasein:  3,
		bounceeaseout: 4
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.type !== Class.TYPE.easeout) settings.type     = this.type;
			if (this.delay !== 0)                 settings.delay    = this.delay;
			if (this.duration !== 250)            settings.duration = this.duration;
			if (this.radius !== 0)                settings.radius   = this.radius;


			return {
				'constructor': 'lychee.effect.Radius',
				'arguments':   [ settings ]
			};

		},

		render: function(renderer, offsetX, offsetY) {

		},

		update: function(entity, clock, delta) {

			if (this.__start === null) {
				this.__start  = clock + this.delay;
				this.__origin = entity.radius || 0;
			}


			var t = (clock - this.__start) / this.duration;
			if (t < 0) {
				return true;
			}


			var origin = this.__origin;
			var radius = this.radius;

			var r      = origin;

			if (t <= 1) {

				var f  = 0;
				var dr = radius - origin;


				var type = this.type;
				if (type === Class.TYPE.linear) {

					r += t * dr;

				} else if (type === Class.TYPE.easein) {

					f = 1 * Math.pow(t, 3);

					r += f * dr;

				} else if (type === Class.TYPE.easeout) {

					f = Math.pow(t - 1, 3) + 1;

					r += f * dr;

				} else if (type === Class.TYPE.bounceeasein) {

					var k = 1 - t;

					if ((k /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(k, 2) );
					} else if (k < ( 2 / 2.75 )) {
						f = 7.5625 * ( k -= ( 1.5   / 2.75 )) * k + 0.75;
					} else if (k < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( k -= ( 2.25  / 2.75 )) * k + 0.9375;
					} else {
						f = 7.5625 * ( k -= ( 2.625 / 2.75 )) * k + 0.984375;
					}

					r += (1 - f) * dr;

				} else if (type === Class.TYPE.bounceeaseout) {

					if ((t /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(t, 2) );
					} else if (t < ( 2 / 2.75 )) {
						f = 7.5625 * ( t -= ( 1.5   / 2.75 )) * t + 0.75;
					} else if (t < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( t -= ( 2.25  / 2.75 )) * t + 0.9375;
					} else {
						f = 7.5625 * ( t -= ( 2.625 / 2.75 )) * t + 0.984375;
					}

					r += f * dr;

				}


				entity.radius = r;


				return true;

			} else {

				entity.radius = radius;


				return false;

			}

		}

	};


	return Class;

});


lychee.define('lychee.effect.Shake').exports(function(lychee, global, attachments) {

	var Class = function(settings) {

		this.type     = Class.TYPE.easeout;
		this.delay    = 0;
		this.duration = 250;
		this.shake    = { x: null, y: null, z: null };

		this.__origin = { x: null, y: null, z: null };
		this.__start  = null;


		// No data validation garbage allowed for effects

		var type     = lychee.enumof(Class.TYPE, settings.type) ? settings.type           : null;
		var delay    = typeof settings.delay === 'number'       ? (settings.delay | 0)    : null;
		var duration = typeof settings.duration === 'number'    ? (settings.duration | 0) : null;
		var shake    = settings.shake instanceof Object         ? settings.shake          : null;

		if (type !== null) {
			this.type = type;
		}

		if (delay !== null) {
			this.delay = delay;
		}

		if (duration !== null) {
			this.duration = duration;
		}

		if (shake !== null) {
			this.shake.x = typeof shake.x === 'number' ? (shake.x | 0) : null;
			this.shake.y = typeof shake.y === 'number' ? (shake.y | 0) : null;
			this.shake.z = typeof shake.z === 'number' ? (shake.z | 0) : null;
		}

	};


	Class.TYPE = {
		linear:        0,
		easein:        1,
		easeout:       2,
		bounceeasein:  3,
		bounceeaseout: 4
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.type !== Class.TYPE.easeout) settings.type     = this.type;
			if (this.delay !== 0)                 settings.delay    = this.delay;
			if (this.duration !== 250)            settings.duration = this.duration;


			if (this.shake.x !== null || this.shake.y !== null || this.shake.z !== null) {

				settings.shake = {};

				if (this.shake.x !== null) settings.shake.x = this.shake.x;
				if (this.shake.y !== null) settings.shake.y = this.shake.y;
				if (this.shake.z !== null) settings.shake.z = this.shake.z;

			}


			return {
				'constructor': 'lychee.effect.Shake',
				'arguments':   [ settings ]
			};

		},

		render: function(renderer, offsetX, offsetY) {

		},

		update: function(entity, clock, delta) {

			if (this.__start === null) {

				this.__start    = clock + this.delay;
				this.__origin.x = entity.position.x;
				this.__origin.y = entity.position.y;
				this.__origin.z = entity.position.z;

			}


			var t = (clock - this.__start) / this.duration;
			if (t < 0) {
				return true;
			}


			var origin   = this.__origin;
			var originx  = origin.x;
			var originy  = origin.y;
			var originz  = origin.z;

			var shake    = this.shake;
			var shakex   = shake.x;
			var shakey   = shake.y;
			var shakez   = shake.z;

			var x        = originx;
			var y        = originy;
			var z        = originz;

			if (t <= 1) {

				var f   = 0;
				var pi2 = Math.PI * 2;
				var dx  = shakex;
				var dy  = shakey;
				var dz  = shakez;


				var type = this.type;
				if (type === Class.TYPE.linear) {

					x += Math.sin(t * pi2) * dx;
					y += Math.sin(t * pi2) * dy;
					z += Math.sin(t * pi2) * dz;

				} else if (type === Class.TYPE.easein) {

					f = 1 * Math.pow(t, 3);

					x += Math.sin(f * pi2) * dx;
					y += Math.sin(f * pi2) * dy;
					z += Math.sin(f * pi2) * dz;

				} else if (type === Class.TYPE.easeout) {

					f = Math.pow(t - 1, 3) + 1;

					x += Math.sin(f * pi2) * dx;
					y += Math.sin(f * pi2) * dy;
					z += Math.sin(f * pi2) * dz;

				} else if (type === Class.TYPE.bounceeasein) {

					var k = 1 - t;

					if ((k /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(k, 2) );
					} else if (k < ( 2 / 2.75 )) {
						f = 7.5625 * ( k -= ( 1.5   / 2.75 )) * k + 0.75;
					} else if (k < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( k -= ( 2.25  / 2.75 )) * k + 0.9375;
					} else {
						f = 7.5625 * ( k -= ( 2.625 / 2.75 )) * k + 0.984375;
					}

					x += Math.sin((1 - f) * pi2) * dx;
					y += Math.sin((1 - f) * pi2) * dy;
					z += Math.sin((1 - f) * pi2) * dz;

				} else if (type === Class.TYPE.bounceeaseout) {

					if ((t /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(t, 2) );
					} else if (t < ( 2 / 2.75 )) {
						f = 7.5625 * ( t -= ( 1.5   / 2.75 )) * t + 0.75;
					} else if (t < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( t -= ( 2.25  / 2.75 )) * t + 0.9375;
					} else {
						f = 7.5625 * ( t -= ( 2.625 / 2.75 )) * t + 0.984375;
					}

					x += Math.sin(f * pi2) * dx;
					y += Math.sin(f * pi2) * dy;
					z += Math.sin(f * pi2) * dz;

				}


				if (shakex !== null) entity.position.x = x;
				if (shakey !== null) entity.position.y = y;
				if (shakez !== null) entity.position.z = z;


				return true;

			} else {

				if (shakex !== null) entity.position.x = originx;
				if (shakey !== null) entity.position.y = originy;
				if (shakez !== null) entity.position.z = originz;


				return false;

			}

		}

	};


	return Class;

});


lychee.define('lychee.effect.Velocity').exports(function(lychee, global, attachments) {

	var Class = function(settings) {

		this.type     = Class.TYPE.easeout;
		this.delay    = 0;
		this.duration = 250;
		this.velocity = { x: null, y: null, z: null };

		this.__origin = { x: null, y: null, z: null };
		this.__start  = null;


		// No data validation garbage allowed for effects

		var type     = lychee.enumof(Class.TYPE, settings.type) ? settings.type           : null;
		var delay    = typeof settings.delay === 'number'       ? (settings.delay | 0)    : null;
		var duration = typeof settings.duration === 'number'    ? (settings.duration | 0) : null;
		var velocity = settings.velocity instanceof Object      ? settings.velocity       : null;

		if (type !== null) {
			this.type = type;
		}

		if (delay !== null) {
			this.delay = delay;
		}

		if (duration !== null) {
			this.duration = duration;
		}

		if (velocity !== null) {
			this.velocity.x = typeof velocity.x === 'number' ? (velocity.x | 0) : null;
			this.velocity.y = typeof velocity.y === 'number' ? (velocity.y | 0) : null;
			this.velocity.z = typeof velocity.z === 'number' ? (velocity.z | 0) : null;
		}

	};


	Class.TYPE = {
		linear:        0,
		easein:        1,
		easeout:       2,
		bounceeasein:  3,
		bounceeaseout: 4
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.type !== Class.TYPE.easeout) settings.type     = this.type;
			if (this.delay !== 0)                 settings.delay    = this.delay;
			if (this.duration !== 250)            settings.duration = this.duration;


			if (this.velocity.x !== null || this.velocity.y !== null || this.velocity.z !== null) {

				settings.velocity = {};

				if (this.velocity.x !== null) settings.velocity.x = this.velocity.x;
				if (this.velocity.y !== null) settings.velocity.y = this.velocity.y;
				if (this.velocity.z !== null) settings.velocity.z = this.velocity.z;

			}


			return {
				'constructor': 'lychee.effect.Velocity',
				'arguments':   [ settings ]
			};

		},

		render: function(renderer, offsetX, offsetY) {

		},

		update: function(entity, clock, delta) {

			if (this.__start === null) {

				this.__start    = clock + this.delay;
				this.__origin.x = entity.velocity.x;
				this.__origin.y = entity.velocity.y;
				this.__origin.z = entity.velocity.z;

			}


			var t = (clock - this.__start) / this.duration;
			if (t < 0) {
				return true;
			}


			var origin    = this.__origin;
			var originx   = origin.x;
			var originy   = origin.y;
			var originz   = origin.z;

			var velocity  = this.velocity;
			var velocityx = velocity.x;
			var velocityy = velocity.y;
			var velocityz = velocity.z;

			var x         = originx;
			var y         = originy;
			var z         = originz;

			if (t <= 1) {

				var f  = 0;
				var dx = velocityx - originx;
				var dy = velocityy - originy;
				var dz = velocityz - originz;


				var type = this.type;
				if (type === Class.TYPE.linear) {

					x += t * dx;
					y += t * dy;
					z += t * dz;

				} else if (type === Class.TYPE.easein) {

					f = 1 * Math.pow(t, 3);

					x += f * dx;
					y += f * dy;
					z += f * dz;

				} else if (type === Class.TYPE.easeout) {

					f = Math.pow(t - 1, 3) + 1;

					x += f * dx;
					y += f * dy;
					z += f * dz;

				} else if (type === Class.TYPE.bounceeasein) {

					var k = 1 - t;

					if ((k /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(k, 2) );
					} else if (k < ( 2 / 2.75 )) {
						f = 7.5625 * ( k -= ( 1.5   / 2.75 )) * k + 0.75;
					} else if (k < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( k -= ( 2.25  / 2.75 )) * k + 0.9375;
					} else {
						f = 7.5625 * ( k -= ( 2.625 / 2.75 )) * k + 0.984375;
					}

					x += (1 - f) * dx;
					y += (1 - f) * dy;
					z += (1 - f) * dz;

				} else if (type === Class.TYPE.bounceeaseout) {

					if ((t /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(t, 2) );
					} else if (t < ( 2 / 2.75 )) {
						f = 7.5625 * ( t -= ( 1.5   / 2.75 )) * t + 0.75;
					} else if (t < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( t -= ( 2.25  / 2.75 )) * t + 0.9375;
					} else {
						f = 7.5625 * ( t -= ( 2.625 / 2.75 )) * t + 0.984375;
					}

					x += f * dx;
					y += f * dy;
					z += f * dz;

				}


				if (velocityx !== null) entity.velocity.x = x;
				if (velocityy !== null) entity.velocity.y = y;
				if (velocityz !== null) entity.velocity.z = z;


				return true;

			} else {

				if (velocityx !== null) entity.velocity.x = velocityx;
				if (velocityy !== null) entity.velocity.y = velocityy;
				if (velocityz !== null) entity.velocity.z = velocityz;


				return false;

			}

		}

	};


	return Class;

});


lychee.define('lychee.event.Emitter').exports(function(lychee, global) {

	/*
	 * HELPERS
	 */

	var _bind = function(event, callback, scope, once) {

		if (event === null || callback === null) {
			return false;
		}


		var pass_event = false;
		var pass_self  = false;

		var modifier = event.charAt(0);
		if (modifier === '@') {

			event      = event.substr(1, event.length - 1);
			pass_event = true;

		} else if (modifier === '#') {

			event     = event.substr(1, event.length - 1);
			pass_self = true;

		}


		if (this.___events[event] === undefined) {
			this.___events[event] = [];
		}


		this.___events[event].push({
			pass_event: pass_event,
			pass_self:  pass_self,
			callback:   callback,
			scope:      scope,
			once:       once
		});


		return true;

	};

	var _trigger = function(event, data) {

		if (this.___events[event] !== undefined) {

			var value = undefined;

			for (var e = 0; e < this.___events[event].length; e++) {

				var args  = [];
				var entry = this.___events[event][e];

				if (entry.pass_event === true) {

					args.push(event);
					args.push(this);

				} else if (entry.pass_self === true) {

					args.push(this);

				}


				if (data !== null) {
					args.push.apply(args, data);
				}


				var result = entry.callback.apply(entry.scope, args);
				if (result !== undefined) {
					value = result;
				}


				if (entry.once === true) {

					if (this.unbind(event, entry.callback, entry.scope) === true) {
						e--;
					}

				}

			}


			if (value !== undefined) {
				return value;
			} else {
				return true;
			}

		}


		return false;

	};

	var _unbind = function(event, callback, scope) {

		var found = false;

		if (event !== null) {

			found = _unbind_event.call(this, event, callback, scope);

		} else {

			for (event in this.___events) {

				var result = _unbind_event.call(this, event, callback, scope);
				if (result === true) {
					found = true;
				}

			}

		}


		return found;

	};

	var _unbind_event = function(event, callback, scope) {

		if (this.___events[event] !== undefined) {

			var found = false;

			for (var e = 0, el = this.___events[event].length; e < el; e++) {

				var entry = this.___events[event][e];

				if ((callback === null || entry.callback === callback) && (scope === null || entry.scope === scope)) {

					found = true;

					this.___events[event].splice(e, 1);
					el--;

				}

			}


			return found;

		}


		return false;

	};


	if (lychee.debug === true) {

		var _original_bind    = _bind;
		var _original_trigger = _trigger;
		var _original_unbind  = _unbind;


		_bind = function(event, callback, scope, once) {

			var result = _original_bind.call(this, event, callback, scope, once);
			if (result !== false) {

				this.___timeline.bind.push({
					time:     Date.now(),
					event:    event,
					callback: lychee.serialize(callback),
					// scope:    lychee.serialize(scope),
					scope:    null,
					once:     once
				});

			}

			return result;

		};

		_trigger = function(event, data) {

			var result = _original_trigger.call(this, event, data);
			if (result !== false) {

				this.___timeline.trigger.push({
					time:  Date.now(),
					event: event,
					data:  lychee.serialize(data)
				});

			}

			return result;

		};

		_unbind = function(event, callback, scope) {

			var result = _original_unbind.call(this, event, callback, scope);
			if (result !== false) {

				this.___timeline.unbind.push({
					time:     Date.now(),
					event:    event,
					callback: lychee.serialize(callback),
					// scope:    lychee.serialize(scope)
					scope:    null
				});

			}

			return result;

		};

	}



	/*
	 * IMPLEMENTATION
	 */

	var Class = function() {

		this.___events   = {};
		this.___timeline = {
			bind:    [],
			trigger: [],
			unbind:  []
		};

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.events instanceof Object) {
				// TODO: deserialize events
			}

			if (blob.timeline instanceof Object) {
				// TODO: deserialize timeline
			}

		},

		serialize: function() {

			var blob = {};


			if (Object.keys(this.___events).length > 0) {

				blob.events = {};

				for (var event in this.___events) {

					blob.events[event] = [];

					for (var e = 0, el = this.___events[event].length; e < el; e++) {

						var entry = this.___events[event][e];

						blob.events[event].push({
							pass_event: entry.pass_event,
							pass_self:  entry.pass_self,
							callback:   lychee.serialize(entry.callback),
							// scope:      lychee.serialize(entry.scope),
							scope:      null,
							once:       entry.once
						});

					}

				}

			}


			if (this.___timeline.bind.length > 0 || this.___timeline.trigger.length > 0 || this.___timeline.unbind.length > 0) {

				blob.timeline = {};


				if (this.___timeline.bind.length > 0) {

					blob.timeline.bind = [];

					for (var b = 0, bl = this.___timeline.bind.length; b < bl; b++) {
						blob.timeline.bind.push(this.___timeline.bind[b]);
					}

				}

				if (this.___timeline.trigger.length > 0) {

					blob.timeline.trigger = [];

					for (var t = 0, tl = this.___timeline.trigger.length; t < tl; t++) {
						blob.timeline.trigger.push(this.___timeline.trigger[t]);
					}

				}

				if (this.___timeline.unbind.length > 0) {

					blob.timeline.unbind = [];

					for (var u = 0, ul = this.___timeline.unbind.length; u < ul; u++) {
						blob.timeline.unbind.push(this.___timeline.unbind[u]);
					}

				}

			}


			return {
				'constructor': 'lychee.event.Emitter',
				'arguments':   [],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		bind: function(event, callback, scope, once) {

			event    = typeof event === 'string'    ? event    : null;
			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;
			once     = once === true;


			return _bind.call(this, event, callback, scope, once);

		},

		trigger: function(event, data) {

			event = typeof event === 'string' ? event : null;
			data  = data instanceof Array     ? data : null;


			return _trigger.call(this, event, data);

		},

		unbind: function(event, callback, scope) {

			event    = typeof event === 'string'    ? event    : null;
			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : null;


			return _unbind.call(this, event, callback, scope);

		}

	};


	return Class;

});


lychee.define('lychee.event.Flow').includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _process_stack = function() {

		var entry = this.___stack.shift() || null;
		if (entry !== null) {

			var that  = this;
			var data  = entry.data;
			var event = entry.event;
			var args  = data !== null ? [ event, data ] : [ event, [function(result) {

				if (result === true) {
					_process_stack.call(that);
				} else {
					that.trigger('error', [ event ]);
				}

			}]];


			var result = this.trigger.apply(this, args);
			if (result === false) {
				this.trigger('error', [ event ]);
			}

		} else {

			this.trigger('complete');

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function() {

		this.___init  = false;
		this.___stack = [];

		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.event.Flow';

			var blob = (data['blob'] || {});


			if (this.___stack.length > 0) {

				blob.stack = [];

				for (var s = 0, sl = this.___stack.length; s < sl; s++) {

					var entry = this.___stack[s];

					blob.stack.push({
						event: entry.event,
						data:  lychee.serialize(entry.data)
					});

				}

			}


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		then: function(event, data) {

			event = typeof event === 'string' ? event : null;
			data  = data instanceof Array     ? data  : null;


			if (event !== null) {

				this.___stack.push({
					event: event,
					data:  data
				});

				return true;

			}


			return false;

		},

		init: function() {

			if (this.___init === false) {

				this.___init = true;


				if (this.___stack.length > 0) {

					_process_stack.call(this);

					return true;

				}

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.event.Promise').includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _process_stack = function(data) {

		data = data instanceof Object ? data : null;


		var entry = this.___stack.shift() || null;
		if (entry !== null) {

			if (data === null) {
				data = entry.data || null;
			}


			var that = this;

			entry.callback.call(entry.scope, data, function(result) {

				if (result instanceof Object) {
					_process_stack.call(that, result);
				} else if (result === true) {
					_process_stack.call(that);
				} else {
					that.trigger('error');
				}

			});

		} else {

			this.trigger('complete');

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function() {

		this.___init  = false;
		this.___stack = [];

		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.event.Promise';

			var blob = (data['blob'] || {});


			if (this.___stack.length > 0) {

				blob.stack = [];

				for (var s = 0, sl = this.___stack.length; s < sl; s++) {

					var entry = this.___stack[s];

					blob.stack.push({
						data:     lychee.serialize(entry.data),
						callback: lychee.serialize(entry.callback),
						// scope:    lychee.serialize(entry.scope)
						scope:    null
					});

				}

			}


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		then: function(data, callback, scope) {

			data     = data instanceof Object       ? data     : null;
			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;


			if (callback !== null) {

				this.___stack.push({
					callback: callback,
					scope:    scope,
					data:     data
				});

				return true;

			}


			return false;

		},

		init: function() {

			if (this.___init === false) {

				this.___init = true;


				if (this.___stack.length > 0) {

					_process_stack.call(this);

					return true;

				}

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.event.Queue').includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _process_stack = function() {

		var data = this.___stack.shift() || null;
		if (data !== null) {

			var that = this;

			this.trigger('update', [ data, function(result) {

				if (result instanceof Object) {
					_process_stack.call(that);
				} else if (result === true) {
					_process_stack.call(that);
				} else {
					that.trigger('error');
				}

			}]);

		} else {

			this.trigger('complete');

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function() {

		this.___init  = false;
		this.___stack = [];

		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.event.Queue';

			var blob = (data['blob'] || {});


			if (this.___stack.length > 0) {

				blob.stack = [];

				for (var s = 0, sl = this.___stack.length; s < sl; s++) {

					var data = this.___stack[s];

					blob.stack.push(lychee.serialize(data));

				}

			}


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		then: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

				this.___stack.push(data);

				return true;

			}


			return false;

		},

		init: function() {

			if (this.___init === false) {

				this.___init = true;


				if (this.___stack.length > 0) {

					_process_stack.call(this);

					return true;

				} else {

					this.trigger('error');

				}

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.game.Background').includes([
	'lychee.game.Sprite'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _is_color = function(color) {

		if (typeof color === 'string') {

			if (color.match(/(#[AaBbCcDdEeFf0-9]{6})/) || color.match(/(#[AaBbCcDdEeFf0-9]{8})/)) {
				return true;
			}

		}


		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.color  = null;
		this.origin = { x: 0, y: 0 };

		this.__buffer  = null;
		this.__isDirty = true;


		lychee.game.Sprite.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.setColor(settings.color);
		this.setOrigin(settings.origin);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.game.Sprite.prototype.serialize.call(this);
			data['constructor'] = 'lychee.game.Background';

			var settings = data['arguments'][0];


			if (this.origin.x !== 0 || this.origin.y !== 0) {

				settings.origin = {};

				if (this.origin.x !== 0) settings.origin.x = this.origin.x;
				if (this.origin.y !== 0) settings.origin.y = this.origin.y;

			}


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			var alpha    = this.alpha;
			var color    = this.color;
			var texture  = this.texture;
			var position = this.position;
			var map      = this.getMap();


			var x1 = position.x + offsetX - this.width  / 2;
			var y1 = position.y + offsetY - this.height / 2;
			var x2 = x1 + this.width;
			var y2 = y1 + this.height;


			if (alpha !== 1) {
				renderer.setAlpha(alpha);
			}


			if (color !== null) {

				renderer.drawBox(
					x1,
					y1,
					x2,
					y2,
					color,
					true
				);

			}


			if (texture !== null && map !== null) {

				if (this.__buffer === null) {

					this.__buffer = renderer.createBuffer(
						this.width,
						this.height
					);

				}


				var buffer = this.__buffer;

				if (this.__isDirty === true) {

					renderer.setBuffer(buffer);


					if (map.w !== 0 && map.h !== 0 && (map.w <= this.width || map.h <= this.height)) {

						var px = this.origin.x - map.w;
						var py = this.origin.y - map.h;


						while (px < this.width) {

							py = this.origin.y - map.h;

							while (py < this.height) {

								renderer.drawSprite(
									px,
									py,
									texture,
									map
								);

								py += map.h;

							}

							px += map.w;

						}

					} else {

						renderer.drawSprite(
							0,
							0,
							texture,
							map
						);

					}


					renderer.setBuffer(null);

					this.__buffer  = buffer;
					this.__isDirty = false;

				}


				renderer.drawBuffer(
					x1,
					y1,
					buffer
				);

			}


			if (alpha !== 1) {
				renderer.setAlpha(1);
			}


			if (lychee.debug === true) {

				renderer.drawBox(
					x1,
					y1,
					x2,
					y2,
					'#ffff00',
					false,
					1
				);

			}

		},



		/*
		 * CUSTOM API
		 */

		setColor: function(color) {

			color = _is_color(color) ? color : null;


			if (color !== null) {

				this.color = color;

				return true;

			}


			return false;

		},

		setOrigin: function(origin) {

			origin = origin instanceof Object ? origin : null;


			if (origin !== null) {

				this.origin.x = typeof origin.x === 'number' ? origin.x : this.origin.x;
				this.origin.y = typeof origin.y === 'number' ? origin.y : this.origin.y;

				var map = this.getMap();
				if (map !== null) {
					this.origin.x %= map.w;
					this.origin.y %= map.h;
				}

				this.__isDirty = true;


				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.game.Emitter').requires([
	'lychee.game.Entity'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.delay      = 0;
		this.duration   = 1000;
		this.entity     = null;
		this.lifetime   = 1000;
		this.position   = { x: 0, y: 0, z: 0 };
		this.velocity   = { x: 0, y: 0, z: 0 };
		this.type       = Class.TYPE.explosion;

		this.__create    = 0;
		this.__entities  = [];
		this.__lifetimes = [];
		this.__start     = null;


		this.setDuration(settings.duration);
		this.setEntity(settings.entity);
		this.setLifetime(settings.lifetime);
		this.setPosition(settings.position);
		this.setType(settings.type);
		this.setVelocity(settings.velocity);


		lychee.event.Emitter.call(this);

		settings = null;

	};


	Class.TYPE = {
		explosion: 0,
		stream:    1
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.game.Emitter';

			var settings = {};


			if (this.delay !== 0)                   settings.delay    = this.delay;
			if (this.duration !== 1000)             settings.duration = this.duration;
			if (this.entity !== null)               settings.entity   = this.entity;
			if (this.lifetime !== 1000)             settings.lifetime = this.lifetime;
			if (this.type !== Class.TYPE.explosion) settings.type     = this.type;


			if (this.position.x !== 0 || this.position.y !== 0 || this.position.z !== 0) {

				settings.position = {};

				if (this.position.x !== 0) settings.position.x = this.position.x;
				if (this.position.y !== 0) settings.position.y = this.position.y;
				if (this.position.z !== 0) settings.position.z = this.position.z;

			}


			if (this.velocity.x !== 0 || this.velocity.y !== 0 || this.velocity.z !== 0) {

				settings.velocity = {};

				if (this.velocity.x !== 0) settings.velocity.x = this.velocity.x;
				if (this.velocity.y !== 0) settings.velocity.y = this.velocity.y;
				if (this.velocity.z !== 0) settings.velocity.z = this.velocity.z;

			}


			data['arguments'][0] = settings;


			return data;

		},

		// HINT: Renderer skips if no render() method exists
		// render: function(renderer, offsetX, offsetY) {},

		update: function(clock, delta) {

			var create = this.__create;
			if (create > 0) {

				if (this.__start === null) {

					this.__start = clock + this.delay;

				}


				var px = this.position.x;
				var py = this.position.y;
				var pz = this.position.z;


				var t = (clock - this.__start) / this.duration;
				if (t > 0 && t <= 1) {

					var entity = lychee.deserialize(this.entity);
					if (entity !== null) {

						var velocity = entity.velocity || null;
						if (velocity !== null) {

							var vx = this.velocity.x;
							var vy = this.velocity.y;
							var vz = this.velocity.z;

							var type = this.type;
							if (type === Class.TYPE.explosion) {

								vx += (Math.random() * 1000) | 0;
								vy += (Math.random() * 1000) | 0;
								vz += (Math.random() * 1000) | 0;

								var index = this.__entities.length;
								if (index % 4 === 0) {
									vx *= -1;
									vy *= -1;
								} else if (index % 4 === 1) {
									vy *= -1;
								} else if (index % 4 === 2) {
									// bottom right
								} else {
									vx *= -1;
								}

								entity.velocity.x = vx;
								entity.velocity.y = vy;
								entity.velocity.z = vz;

							} else if (type === Class.TYPE.stream) {

								var vxabs = Math.abs(vx);
								var vyabs = Math.abs(vy);
								var vzabs = Math.abs(vz);
								var f     = Math.random() / 4;

								if (vxabs !== 0) {

									vx += (Math.random() * vx) | 0;

									if (vxabs > vyabs && vxabs > vzabs) {
										vy += (Math.random() * f * vx) | 0;
										vy *= Math.random() > 0.5 ? -1 : 1;
										vz += (Math.random() * f * vx) | 0;
										vz *= Math.random() > 0.5 ? -1 : 1;
									}

								}

								if (vyabs !== 0) {

									vy += (Math.random() * vy) | 0;

									if (vyabs > vxabs && vyabs > vzabs) {
										vx += (Math.random() * f * vy) | 0;
										vx *= Math.random() > 0.5 ? -1 : 1;
										vz += (Math.random() * f * vy) | 0;
										vz *= Math.random() > 0.5 ? -1 : 1;
									}

								}

								if (vzabs !== 0) {

									vz += (Math.random() * vz) | 0;

									if (vzabs > vxabs && vzabs > vyabs) {
										vx += (Math.random() * f * vz) | 0;
										vx *= Math.random() > 0.5 ? -1 : 1;
										vy += (Math.random() * f * vz) | 0;
										vy *= Math.random() > 0.5 ? -1 : 1;
									}

								}


								entity.velocity.x = vx;
								entity.velocity.y = vy;
								entity.velocity.z = vz;

							}


							entity.position.x = px;
							entity.position.y = py;
							entity.position.z = pz;

						}


						this.trigger('create', [ entity ]);
						this.__lifetimes.push(clock + this.lifetime);
						this.__entities.push(entity);

					}


					this.__create = create - 1;
					this.__start  = null;

				}

			}


			var entities  = this.__entities;
			var lifetimes = this.__lifetimes;
			for (var l = 0, ll = lifetimes.length; l < ll; l++) {

				var lifetime = lifetimes[l];
				if (clock > lifetime) {

					this.trigger('destroy', [ entities[l] ]);
					lifetimes.splice(l, 1);
					entities.splice(l, 1);

					ll--;
					l--;

				}

			}

		},



		/*
		 * CUSTOM API
		 */

		create: function(amount) {

			amount = typeof amount === 'number' ? (amount | 0) : null;


			if (amount !== null) {

				this.__create += amount;

				return true;

			}


			return false;

		},

		setDuration: function(duration) {

			duration = typeof duration === 'number' ? (duration | 0) : null;


			if (duration !== null) {

				this.duration = duration;

				return true;

			}


			return false;

		},

		setEntity: function(entity) {

			entity = lychee.deserialize(entity) !== null ? entity : null;


			if (entity !== null) {

				this.entity = entity;

				return true;

			}


			return false;

		},

		setLifetime: function(lifetime) {

			lifetime = typeof lifetime === 'number' ? (lifetime | 0) : null;


			if (lifetime !== null) {

				this.lifetime = lifetime;

				return true;

			}


			return false;

		},

		setPosition: function(position) {

			position = position instanceof Object ? position : null;


			if (position !== null) {

				this.position.x = typeof position.x === 'number' ? position.x : this.position.x;
				this.position.y = typeof position.y === 'number' ? position.y : this.position.y;
				this.position.z = typeof position.z === 'number' ? position.z : this.position.z;

				return true;

			}


			return false;

		},

		setType: function(type) {

			type = lychee.enumof(Class.TYPE, type) ? type : null;


			if (type !== null) {

				this.type = type;

				return true;

			}


			return false;

		},

		setVelocity: function(velocity) {

			velocity = velocity instanceof Object ? velocity : null;


			if (velocity !== null) {

				this.velocity.x = typeof velocity.x === 'number' ? velocity.x : this.velocity.x;
				this.velocity.y = typeof velocity.y === 'number' ? velocity.y : this.velocity.y;
				this.velocity.z = typeof velocity.z === 'number' ? velocity.z : this.velocity.z;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.game.Entity').exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _sphere_sphere = function(a, b) {

		var dx  = Math.sqrt(Math.pow(b.position.x - a.position.x, 2));
		var dy  = Math.sqrt(Math.pow(b.position.y - a.position.y, 2));
		var dz  = Math.sqrt(Math.pow(b.position.z - a.position.z, 2));

		var rxy = 0;
		var rxz = 0;

		if (a.shape === Class.SHAPE.sphere) {
			rxy += a.radius;
			rxz += a.radius;
		}

		if (b.shape === Class.SHAPE.sphere) {
			rxy += b.radius;
			rxz += b.radius;
		}

		return ((dx + dy) <= rxy && (dx + dz) <= rxz);

	};

	var _sphere_cuboid = function(a, b) {

		var r  = a.radius;
		var hw = b.width  / 2;
		var hh = b.height / 2;
		var hd = b.depth  / 2;

		var ax = a.position.x;
		var ay = a.position.y;
		var az = a.position.z;

		var bx = b.position.x;
		var by = b.position.y;
		var bz = b.position.z;

		var colx = (ax + r >= bx - hw) && (ax - r <= bx + hw);
		var coly = (ay + r >= by - hh) && (ay - r <= by + hh);

		if (a.shape === Class.SHAPE.circle) {
			r = 0;
		}

		var colz = (az + r >= bz - hd) && (az - r <= bz + hd);

		return (colx && coly && colz);

	};

	var _cuboid_cuboid = function(a, b) {

		var dx = Math.abs(b.position.x - a.position.x);
		var dy = Math.abs(b.position.y - a.position.y);
		var dz = Math.abs(b.position.z - a.position.z);

		var hw = (a.width  + b.width)  / 2;
		var hh = (a.height + b.height) / 2;
		var hd = (a.depth  + b.depth)  / 2;

		return (dx <= hw && dy <= hh && dz <= hd);

	};



	/*
	 * IMPLEMENTATION
	 */

	var _default_state  = 'default';
	var _default_states = { 'default': null };

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.width  = typeof settings.width === 'number'  ? settings.width  : 0;
		this.height = typeof settings.height === 'number' ? settings.height : 0;
		this.depth  = typeof settings.depth === 'number'  ? settings.depth  : 0;
		this.radius = typeof settings.radius === 'number' ? settings.radius : 0;

		this.alpha     = 1;
		this.collision = Class.COLLISION.none;
		this.effects   = [];
		this.shape     = Class.SHAPE.rectangle;
		this.state     = _default_state;
		this.position  = { x: 0, y: 0, z: 0 };
		this.velocity  = { x: 0, y: 0, z: 0 };

		this.__states  = _default_states;


		if (settings.states instanceof Object) {

			this.__states = { 'default': null };

			for (var id in settings.states) {

				if (settings.states.hasOwnProperty(id)) {
					this.__states[id] = settings.states[id];
				}

			}

		}


		this.setAlpha(settings.alpha);
		this.setCollision(settings.collision);
		this.setShape(settings.shape);
		this.setState(settings.state);
		this.setPosition(settings.position);
		this.setVelocity(settings.velocity);


		settings = null;

	};


	Class.COLLISION = {
		none: 0,
		A:    1,
		B:    2,
		C:    3,
		D:    4
	};


	// Same ENUM values as lychee.ui.Entity
	Class.SHAPE = {
		circle:    0,
		rectangle: 1,
		sphere:    2,
		cuboid:    3
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.width  !== 0) settings.width  = this.width;
			if (this.height !== 0) settings.height = this.height;
			if (this.depth  !== 0) settings.depth  = this.depth;
			if (this.radius !== 0) settings.radius = this.radius;

			if (this.alpha !== 1)                         settings.alpha     = this.alpha;
			if (this.collision !== Class.COLLISION.none)  settings.collision = this.collision;
			if (this.shape !== Class.SHAPE.rectangle)     settings.shape     = this.shape;
			if (this.state !== _default_state)            settings.state     = this.state;
			if (this.__states !== _default_states)        settings.states    = this.__states;


			if (this.position.x !== 0 || this.position.y !== 0 || this.position.z !== 0) {

				settings.position = {};

				if (this.position.x !== 0) settings.position.x = this.position.x;
				if (this.position.y !== 0) settings.position.y = this.position.y;
				if (this.position.z !== 0) settings.position.z = this.position.z;

			}


			if (this.velocity.x !== 0 || this.velocity.y !== 0 || this.velocity.z !== 0) {

				settings.velocity = {};

				if (this.velocity.x !== 0) settings.velocity.x = this.velocity.x;
				if (this.velocity.y !== 0) settings.velocity.y = this.velocity.y;
				if (this.velocity.z !== 0) settings.velocity.z = this.velocity.z;

			}


			return {
				'constructor': 'lychee.game.Entity',
				'arguments':   [ settings ],
				'blob':        null
			};

		},

		// HINT: Renderer skips if no render() method exists
		render: function(renderer, offsetX, offsetY) {

			var effects = this.effects;
			for (var e = 0, el = effects.length; e < el; e++) {
				effects[e].render(renderer, offsetX, offsetY);
			}

		},

		update: function(clock, delta) {

			var velocity = this.velocity;

			if (velocity.x !== 0 || velocity.y !== 0 || velocity.z !== 0) {

				var x = this.position.x;
				var y = this.position.y;
				var z = this.position.z;


				var vt = delta / 1000;

				if (velocity.x !== 0) {
					x += velocity.x * vt;
				}

				if (velocity.y !== 0) {
					y += velocity.y * vt;
				}

				if (velocity.z !== 0) {
					z += velocity.z * vt;
				}


				this.position.x = x;
				this.position.y = y;
				this.position.z = z;

			}


			var effects = this.effects;
			for (var e = 0, el = this.effects.length; e < el; e++) {

				var effect = this.effects[e];
				if (effect.update(this, clock, delta) === false) {
					this.removeEffect(effect);
					el--;
					e--;
				}

			}

		},



		/*
		 * CUSTOM API
		 */

		isAtPosition: function(position) {

			if (position instanceof Object) {

				if (typeof position.x === 'number' && typeof position.y === 'number') {

					var ax = position.x;
					var ay = position.y;
					var bx = this.position.x;
					var by = this.position.y;


					var shape = this.shape;
					if (shape === Class.SHAPE.circle) {

						var dist = Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
						if (dist < this.radius) {
							return true;
						}

					} else if (shape === Class.SHAPE.rectangle) {

						var hwidth  = this.width  / 2;
						var hheight = this.height / 2;
						var colX    = (ax >= bx - hwidth)  && (ax <= bx + hwidth);
						var colY    = (ay >= by - hheight) && (ay <= by + hheight);


						return colX && colY;

					}

				}

			}


			return false;

		},

		collidesWith: function(entity) {

			var none = Class.COLLISION.none;
			if (this.collision !== entity.collision || this.collision === none || entity.collision === none) {
				return false;
			}


			var circle    = Class.SHAPE.circle;
			var sphere    = Class.SHAPE.sphere;
			var rectangle = Class.SHAPE.rectangle;
			var cuboid    = Class.SHAPE.cuboid;

			var shapeA    = this.shape;
			var shapeB    = entity.shape;

			var issphereA = shapeA === circle    || shapeA === sphere;
			var issphereB = shapeB === circle    || shapeB === sphere;
			var iscuboidA = shapeA === rectangle || shapeA === cuboid;
			var iscuboidB = shapeB === rectangle || shapeB === cuboid;

			if (issphereA && issphereB) {
				return _sphere_sphere(this, entity);
			} else if (iscuboidA && iscuboidB) {
				return _cuboid_cuboid(this, entity);
			} else if (issphereA && iscuboidB) {
				return _sphere_cuboid(this, entity);
			} else if (iscuboidA && issphereB) {
				return _sphere_cuboid(entity, this);
			}


			return false;

		},

		setAlpha: function(alpha) {

			alpha = (typeof alpha === 'number' && alpha >= 0 && alpha <= 1) ? alpha : null;


			if (alpha !== null) {

				this.alpha = alpha;

				return true;

			}


			return false;

		},

		setCollision: function(collision) {

			if (lychee.enumof(Class.COLLISION, collision)) {

				this.collision = collision;

				return true;

			}


			return false;

		},

		addEffect: function(effect) {

			effect = effect instanceof Object && typeof effect.update === 'function' ? effect : null;


			if (effect !== null) {

				var index = this.effects.indexOf(effect);
				if (index === -1) {

					this.effects.push(effect);

					return true;

				}

			}


			return false;

		},

		removeEffect: function(effect) {

			effect = effect instanceof Object && typeof effect.update === 'function' ? effect : null;


			if (effect !== null) {

				var index = this.effects.indexOf(effect);
				if (index !== -1) {

					this.effects.splice(index, 1);

					return true;

				}

			}


			return false;

		},

		removeEffects: function() {

			var effects = this.effects;

			for (var e = 0, el = effects.length; e < el; e++) {

				effects[e].update(this, Infinity, 0);
				this.removeEffect(effects[e]);

				el--;
				e--;

			}


			return true;

		},

		setPosition: function(position) {

			position = position instanceof Object ? position : null;


			if (position !== null) {

				this.position.x = typeof position.x === 'number' ? position.x : this.position.x;
				this.position.y = typeof position.y === 'number' ? position.y : this.position.y;
				this.position.z = typeof position.z === 'number' ? position.z : this.position.z;

				return true;

			}


			return false;

		},

		setShape: function(shape) {

			if (lychee.enumof(Class.SHAPE, shape)) {

				this.shape = shape;

				return true;

			}


			return false;

		},

		getStateMap: function() {
			return this.__states[this.state];
		},

		setState: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.__states[id] !== undefined) {

				this.state = id;

				return true;

			}


			return false;

		},

		setVelocity: function(velocity) {

			velocity = velocity instanceof Object ? velocity : null;


			if (velocity !== null) {

				this.velocity.x = typeof velocity.x === 'number' ? velocity.x : this.velocity.x;
				this.velocity.y = typeof velocity.y === 'number' ? velocity.y : this.velocity.y;
				this.velocity.z = typeof velocity.z === 'number' ? velocity.z : this.velocity.z;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.game.Jukebox').exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _refresh_channels = function(amount) {

		var sounds = [];

		for (var a = 0; a < amount; a++) {
			sounds.push(null);
		}

		this.__sounds = sounds;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.channels = 8;
		this.music    = true;
		this.sound    = true;

		this.__music  = null;
		this.__sounds = [
			null, null,
			null, null,
			null, null,
			null, null
		];


		this.setChannels(settings.channels);
		this.setMusic(settings.music);
		this.setSound(settings.sound);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.channels !== 8) settings.channels = this.channels;
			if (this.music !== true) settings.music    = this.music;
			if (this.sound !== true) settings.sound    = this.sound;


			return {
				'constructor': 'lychee.game.Jukebox',
				'arguments':   [ settings ],
				'blob':        null
			};

		},



		/*
		 * CUSTOM API
		 */

		play: function(track) {

			if (track instanceof Music && this.music === true) {

				var music = this.__music;
				if (music !== null) {
					music.stop();
				}


				this.__music = track;
				this.__music.play();


				return true;

			} else if (track instanceof Sound && this.sound === true) {

				var sounds = this.__sounds;
				for (var s = 0, sl = sounds.length; s < sl; s++) {

					var sound = sounds[s];
					if (sound === null) {

						sounds[s] = track.clone();
						sounds[s].play();

						break;

					} else if (sound.isIdle === true) {

						if (sound.url === track.url) {
							sound.play();
						} else {
							sounds[s] = track.clone();
							sounds[s].play();
						}


						break;

					}

				}


				return true;

			}


			return false;

		},

		stop: function(track) {

			track = (track instanceof Music || track instanceof Sound) ? track : null;


			var found  = false;
			var music  = this.__music;
			var sounds = this.__sounds;


			var s, sl, sound = null;

			if (track instanceof Music) {

				if (music === track) {
					found = true;
					music.stop();
				}


				this.__music = null;

			} else if (track instanceof Sound) {

				for (s = 0, sl = sounds.length; s < sl; s++) {

					sound = sounds[s];

					if (sound !== null && sound.url === track.url && sound.isIdle === false) {
						found = true;
						sound.stop();
					}

				}

			} else if (track === null) {

				if (music !== null) {
					found = true;
					music.stop();
				}


				for (s = 0, sl = sounds.length; s < sl; s++) {

					sound = sounds[s];

					if (sound !== null && sound.isIdle === false) {
						found = true;
						sound.stop();
					}

				}

			}


			return found;

		},

		setChannels: function(channels) {

			channels = typeof channels === 'number' ? channels : null;


			if (channels !== null) {

				this.channels = channels;

				_refresh_channels.call(this, channels);

				return true;

			}


			return false;

		},

		setMusic: function(music) {

			if (music === true || music === false) {

				this.music = music;

				return true;

			}


			return false;

		},

		setSound: function(sound) {

			if (sound === true || sound === false) {

				this.sound = sound;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.game.Layer').requires([
	'lychee.game.Entity'
]).exports(function(lychee, global) {

	/*
	 * HELPERS
	 */

	var _validate_entity = function(entity) {

		if (entity instanceof Object) {

			if (typeof entity.update === 'function' && typeof entity.render === 'function' && typeof entity.shape === 'number') {
				return true;
			}

		}


		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.width  = typeof settings.width  === 'number' ? settings.width  : 0;
		this.height = typeof settings.height === 'number' ? settings.height : 0;
		this.depth  = 0;


		this.effects  = [];
		this.entities = [];
		this.offset   = { x: 0, y: 0 };
		this.position = { x: 0, y: 0 };
		this.shape    = lychee.game.Entity.SHAPE.rectangle;
		this.visible  = true;

		this.__map     = {};
		this.__reshape = true;


		this.setEntities(settings.entities);
		this.setOffset(settings.offset);
		this.setPosition(settings.position);
		this.setReshape(settings.reshape);
		this.setVisible(settings.visible);


		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			var entities = [];
			for (var be = 0, bel = blob.entities.length; be < bel; be++) {
				entities.push(lychee.deserialize(blob.entities[be]));
			}

			var map = {};
			for (var bid in blob.map) {

				var index = blob.map[bid];
				if (typeof index === 'number') {
					map[bid] = index;
				}

			}


			for (var e = 0, el = entities.length; e < el; e++) {

				var id = null;
				for (var mid in map) {

					if (map[mid] === e) {
						id = mid;
					}

				}


				if (id !== null) {
					this.setEntity(id, entities[e]);
				} else {
					this.addEntity(entities[e]);
				}

			}

		},

		serialize: function() {

			var settings = {};
			var blob     = {};


			if (this.offset.x !== 0 || this.offset.y !== 0 || this.offset.z !== 0) {

				settings.offset = {};

				if (this.offset.x !== 0) settings.offset.x = this.offset.x;
				if (this.offset.y !== 0) settings.offset.y = this.offset.y;
				if (this.offset.z !== 0) settings.offset.z = this.offset.z;

			}

			if (this.__reshape !== true) settings.reshape = this.__reshape;
			if (this.visible !== true)   settings.visible = this.visible;


			var entities = [];

			if (this.entities.length > 0) {

				blob.entities = [];

				for (var e = 0, el = this.entities.length; e < el; e++) {

					var entity = this.entities[e];

					blob.entities.push(lychee.serialize(entity));
					entities.push(entity);

				}

			}


			if (Object.keys(this.__map).length > 0) {

				blob.map = {};

				for (var id in this.__map) {

					var index = entities.indexOf(this.__map[id]);
					if (index !== -1) {
						blob.map[id] = index;
					}

				}

			}


			return {
				'constructor': 'lychee.game.Layer',
				'arguments':   [ settings ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;

			var position = this.position;
			var offset   = this.offset;


			var ox = position.x + offsetX + offset.x;
			var oy = position.y + offsetY + offset.y;


			var entities = this.entities;
			for (var en = 0, enl = entities.length; en < enl; en++) {

				entities[en].render(
					renderer,
					ox,
					oy
				);

			}


			var effects = this.effects;
			for (var ef = 0, efl = effects.length; ef < efl; ef++) {
				effects[ef].render(renderer, offsetX, offsetY);
			}


			if (lychee.debug === true) {

				ox = position.x + offsetX;
				oy = position.y + offsetY;


				var hwidth   = this.width  / 2;
				var hheight  = this.height / 2;


				renderer.drawBox(
					ox - hwidth,
					oy - hheight,
					ox + hwidth,
					oy + hheight,
					'#ffff00',
					false,
					1
				);

			}

		},

		update: function(clock, delta) {

			var entities = this.entities;
			for (var en = 0, enl = entities.length; en < enl; en++) {
				entities[en].update(clock, delta);
			}

			var effects = this.effects;
			for (var ef = 0, efl = this.effects.length; ef < efl; ef++) {

				var effect = this.effects[ef];
				if (effect.update(this, clock, delta) === false) {
					this.removeEffect(effect);
					efl--;
					ef--;
				}

			}

		},



		/*
		 * CUSTOM API
		 */

		reshape: function() {

			if (this.__reshape === true) {

				var hwidth  = this.width  / 2;
				var hheight = this.height / 2;

				for (var e = 0, el = this.entities.length; e < el; e++) {

					var entity = this.entities[e];
					var boundx = Math.abs(entity.position.x + this.offset.x);
					var boundy = Math.abs(entity.position.y + this.offset.y);

					if (entity.shape === lychee.game.Entity.SHAPE.circle) {
						boundx += entity.radius;
						boundy += entity.radius;
					} else if (entity.shape === lychee.game.Entity.SHAPE.rectangle) {
						boundx += entity.width  / 2;
						boundy += entity.height / 2;
					}

					hwidth  = Math.max(hwidth,  boundx);
					hheight = Math.max(hheight, boundy);

				}

				this.width  = hwidth  * 2;
				this.height = hheight * 2;

			}

		},

		addEffect: function(effect) {

			effect = effect instanceof Object && typeof effect.update === 'function' ? effect : null;


			if (effect !== null) {

				var index = this.effects.indexOf(effect);
				if (index === -1) {

					this.effects.push(effect);

					return true;

				}

			}


			return false;

		},

		removeEffect: function(effect) {

			effect = effect instanceof Object && typeof effect.update === 'function' ? effect : null;


			if (effect !== null) {

				var index = this.effects.indexOf(effect);
				if (index !== -1) {

					this.effects.splice(index, 1);

					return true;

				}

			}


			return false;

		},

		removeEffects: function() {

			var effects = this.effects;

			for (var e = 0, el = effects.length; e < el; e++) {

				effects[e].update(this, Infinity, 0);
				this.removeEffect(effects[e]);

				el--;
				e--;

			}


			return true;

		},

		addEntity: function(entity) {

			entity = _validate_entity(entity) === true ? entity : null;


			if (entity !== null) {

				var index = this.entities.indexOf(entity);
				if (index === -1) {

					this.entities.push(entity);
					this.reshape();

					return true;

				}

			}


			return false;

		},

		setEntity: function(id, entity) {

			id     = typeof id === 'string'            ? id     : null;
			entity = _validate_entity(entity) === true ? entity : null;


			if (id !== null && entity !== null && this.__map[id] === undefined) {

				this.__map[id] = entity;

				var result = this.addEntity(entity);
				if (result === true) {
					return true;
				} else {
					delete this.__map[id];
				}

			}


			return false;

		},

		getEntity: function(id, position) {

			id        = typeof id === 'string'    ? id       : null;
			position = position instanceof Object ? position : null;


			var found = null;


			if (id !== null) {

				if (this.__map[id] !== undefined) {
					found = this.__map[id];
				}

			} else if (position !== null) {

				if (typeof position.x === 'number' && typeof position.y === 'number') {

					for (var e = this.entities.length - 1; e >= 0; e--) {

						var entity = this.entities[e];
						if (entity.isAtPosition(position) === true) {
							found = entity;
							break;
						}

					}

				}

			}


			return found;

		},

		removeEntity: function(entity) {

			entity = _validate_entity(entity) === true ? entity : null;


			if (entity !== null) {

				var found = false;

				var index = this.entities.indexOf(entity);
				if (index !== -1) {

					this.entities.splice(index, 1);
					found = true;

				}


				for (var id in this.__map) {

					if (this.__map[id] === entity) {

						delete this.__map[id];
						found = true;

					}

				}


				if (found === true) {
					this.reshape();
				}


				return found;

			}


			return false;

		},

		setEntities: function(entities) {

			var all = true;

			if (entities instanceof Array) {

				for (var e = 0, el = entities.length; e < el; e++) {

					var result = this.addEntity(entities[e]);
					if (result === false) {
						all = false;
					}

				}

			}


			return all;

		},

		removeEntities: function() {

			var entities = this.entities;

			for (var e = 0, el = entities.length; e < el; e++) {

				this.removeEntity(entities[e]);

				el--;
				e--;

			}

			return true;

		},

		setOffset: function(offset) {

			if (offset instanceof Object) {

				this.offset.x = typeof offset.x === 'number' ? offset.x : this.offset.x;
				this.offset.y = typeof offset.y === 'number' ? offset.y : this.offset.y;

				return true;

			}


			return false;

		},

		setPosition: function(position) {

			if (position instanceof Object) {

				this.position.x = typeof position.x === 'number' ? position.x : this.position.x;
				this.position.y = typeof position.y === 'number' ? position.y : this.position.y;

				return true;

			}


			return false;

		},

		setReshape: function(reshape) {

			if (reshape === true || reshape === false) {

				this.__reshape = reshape;

				return true;

			}


			return false;

		},

		setVisible: function(visible) {

			if (visible === true || visible === false) {

				this.visible = visible;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.game.Logic').requires([
	'lychee.game.Entity',
	'lychee.game.Layer',
	'lychee.game.Physic'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _project_layer = function(layer) {

		var projection = this.projection;
		var entities   = layer.entities;

		for (var e = 0, el = entities.length; e < el; e++) {
			this.projectPosition(entities[e].position, true);
		}

	};

	var _unproject_layer = function(layer) {

		var projection = this.projection;
		var entities   = layer.entities;

		for (var e = 0, el = entities.length; e < el; e++) {
			this.unprojectPosition(entities[e].position, true);
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.physic     = null;
		this.projection = Class.PROJECTION.pixel;
		this.tile       = {
			width:  1,
			height: 1,
			depth:  1
		};

		this.__layers   = [];


		this.setLayers(settings.layers);
		this.setPhysic(settings.physic);
		this.setProjection(settings.projection);
		this.setTile(settings.tile);


		settings = null;

	};


	Class.PROJECTION = {
		pixel:    0,
		tile:     1,
		isometry: 2
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			// TODO: Deserialize layer query paths

		},

		serialize: function() {

			var settings = {};
			var blob     = {};


			if (this.physic !== null)                       settings.physic     = this.physic;
			if (this.projection !== Class.PROJECTION.pixel) settings.projection = this.projection;

			if (this.tile.width !== 1 || this.tile.height !== 1 || this.tile.depth !== 1) {

				settings.tile = {};

				if (this.tile.width !== 1)  settings.tile.width  = this.tile.width;
				if (this.tile.height !== 1) settings.tile.height = this.tile.height;
				if (this.tile.depth !== 1)  settings.tile.depth  = this.tile.depth;

			}


			if (this.__layers.length > 0) {
				// TODO: Serialize layers and their query paths
			}


			return {
				'constructor': 'lychee.game.Logic',
				'arguments':   [ settings ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * STATE API
		 */

		enter: function(data) {

			var layers = this.__layers;
			for (var l = 0, ll = layers.length; l < ll; l++) {
				_project_layer.call(this, layers[l]);
			}

		},

		leave: function(data) {

			var layers = this.__layers;
			for (var l = 0, ll = layers.length; l < ll; l++) {
				_unproject_layer.call(this, layers[l]);
			}

		},

		update: function(clock, delta) {

			var physic = this.physic;
			if (physic !== null) {
				physic.update(clock, delta);
			}

		},



		/*
		 * CUSTOM API
		 */

		addLayer: function(layer) {

			layer = lychee.interfaceof(lychee.game.Layer, layer) ? layer : null;


			if (layer !== null) {

				var index = this.__layers.indexOf(layer);
				if (index === -1) {

					this.__layers.push(layer);

					return true;

				}

			}


			return false;

		},

		removeLayer: function(layer) {

			layer = lychee.interfaceof(lychee.game.Layer, layer) ? layer : null;


			if (layer !== null) {

				var index = this.__layers.indexOf(layer);
				if (index !== -1) {

					this.__layers.splice(index, 1);

					return true;

				}

			}


			return false;

		},

		setLayers: function(layers) {

			var all = true;

			if (layers instanceof Array) {

				for (var l = 0, ll = layers.length; l < ll; l++) {

					var result = this.addLayer(layers[l]);
					if (result === false) {
						all = false;
					}

				}

			}


			return all;

		},

		removeLayers: function() {

			var layers = this.__layers;

			for (var l = 0, ll = layers.length; l < ll; l++) {

				this.removeLayer(layers[l]);

				ll--;
				l--;

			}

			return true;

		},

		setPhysic: function(physic) {

			physic = lychee.interfaceof(lychee.game.Physic, physic) ? physic : null;


			if (physic !== null) {

				this.physic = physic;

				return true;

			}


			return false;

		},

		setProjection: function(projection) {

			projection = lychee.enumof(Class.PROJECTION, projection) ? projection : null;


			if (projection !== null) {

				this.projection = projection;

				return true;

			}


			return false;

		},

		setTile: function(tile) {

			if (tile instanceof Object) {

				this.tile.width  = typeof tile.width === 'number'  ? (tile.width  | 0) : this.tile.width;
				this.tile.height = typeof tile.height === 'number' ? (tile.height | 0) : this.tile.height;
				this.tile.depth  = typeof tile.depth === 'number'  ? (tile.depth  | 0) : this.tile.depth;

				return true;

			}


			return false;

		},

		projectPosition: function(position, bound) {

			position = position instanceof Object ? position : null;
			bound    = bound === true;


			if (position !== null) {

				var projection = this.projection;
				var tile       = this.tile;

				var x = position.x;
				var y = position.y;
				var z = position.z;


				if (bound === true) {

					x |= 0;
					y |= 0;
					z |= 0;

				}


				if (projection === Class.PROJECTION.tile) {

					x = x * tile.width;
					y = y * tile.height;
					z = z * tile.depth;

				} else if (projection === Class.PROJECTION.isometry) {

					x = (x - y) * tile.width;
					y = (x + y) * (tile.height / 2);
					z = 0;

				}


				position.x = x;
				position.y = y;
				position.z = z;


				return true;

			}


			return false;

		},

		unprojectPosition: function(position, bound) {

			position = position instanceof Object ? position : null;
			bound    = bound === true;


			if (position !== null) {

				var projection = this.projection;
				var tile       = this.tile;

				var x = position.x;
				var y = position.y;
				var z = position.z;


				if (projection === Class.PROJECTION.tile) {

					x = x / tile.width;
					y = y / tile.height;
					z = z / tile.depth;

				} else if (projection === Class.PROJECTION.isometry) {

					x = (y / tile.height) + (x / (2 * tile.width));
					y = (y / tile.height) - (x / (2 * tile.width));
					z = 0;

				}


				if (bound === true) {

					x |= 0;
					y |= 0;
					z |= 0;

				}


				position.x = x;
				position.y = y;
				position.z = z;


				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.game.Loop').includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof setInterval === 'function') {
		return true;
	}

	return false;

}).exports(function(lychee, global) {

    var _instances = [];
 	var _id        = 0;



	/*
	 * EVENTS
	 */

	var _listeners = {

		interval: function() {

			var now = Date.now();

			for (var i = 0, l = _instances.length; i < l; i++) {

				var instance = _instances[i];
				var clock    = now - instance.__start;

				_update_loop.call(instance, clock);
				_render_loop.call(instance, clock);

			}

		}

	};



	/*
	 * FEATURE DETECTION
	 */

	(function(delta) {

		var interval = typeof global.setInterval === 'function';
		if (interval === true) {
			global.setInterval(_listeners.interval, delta);
		}


		if (lychee.debug === true) {

			var methods = [];

			if (interval) methods.push('setInterval');

			if (methods.length === 0) {
				console.error('lychee.game.Loop: Supported methods are NONE');
			} else {
				console.log('lychee.game.Loop: Supported methods are ' + methods.join(', '));
			}

		}

	})((1000 / 60) | 0);



	/*
	 * HELPERS
	 */

	var _update_loop;

	if (lychee.debug === true) {

		_update_loop = function(clock) {

			if (this.__state !== 1) return;


			var delta = clock - this.__updateclock;
			if (delta >= this.__updatedelay) {

				this.trigger('update', [ clock, delta ]);


				for (var iid in this.__intervals) {

					var interval = this.__intervals[iid];

					if (clock >= interval.clock) {

						try {

							interval.callback.call(
								interval.scope,
								clock,
								clock - interval.clock,
								interval.step++
							);

						} catch(err) {
							lychee.Debugger.report(null, err, null);
							this.stop();
						} finally {
							interval.clock = clock + interval.delta;
						}

					}

				}


				for (var tid in this.__timeouts) {

					var timeout = this.__timeouts[tid];
					if (clock >= timeout.clock) {

						try {

							timeout.callback.call(
								timeout.scope,
								clock,
								clock - timeout.clock
							);

						} catch(err) {
							lychee.Debugger.report(null, err, null);
							this.stop();
						} finally {
							delete this.__timeouts[tid];
						}

					}

				}


				this.__updateclock = clock;

			}

		};


	} else {

		_update_loop = function(clock) {

			if (this.__state !== 1) return;


			var delta = clock - this.__updateclock;
			if (delta >= this.__updatedelay) {

				this.trigger('update', [ clock, delta ]);


				for (var iid in this.__intervals) {

					var interval = this.__intervals[iid];

					if (clock >= interval.clock) {

						interval.callback.call(
							interval.scope,
							clock,
							clock - interval.clock,
							interval.step++
						);

						interval.clock = clock + interval.delta;

					}

				}


				for (var tid in this.__timeouts) {

					var timeout = this.__timeouts[tid];
					if (clock >= timeout.clock) {

						timeout.callback.call(
							timeout.scope,
							clock,
							clock - timeout.clock
						);

						delete this.__timeouts[tid];

					}

				}


				this.__updateclock = clock;

			}

		};

	}


	var _render_loop = function(clock) {

		if (this.__state !== 1) return;


		var delta = clock - this.__renderclock;
		if (delta >= this.__renderdelay) {

			this.trigger('render', [ clock, delta ]);


			this.__renderclock = clock;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.update = 40;
		this.render = 40;

		this.__timeouts  = {};
		this.__intervals = {};

		this.__pause       = 0;
		this.__start       = Date.now();
		this.__state       = 1;
		this.__renderclock = 0;
		this.__renderdelay = 1000 / this.update;
		this.__updateclock = 0;
		this.__updatedelay = 1000 / this.render;


		this.setUpdate(settings.update);
		this.setRender(settings.render);


		lychee.event.Emitter.call(this);

		_instances.push(this);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (typeof blob.state === 'number') {

				this.__state = blob.state;
				this.__pause = blob.pause;

			}

			if (typeof blob.updateclock === 'number') this.__updateclock = blob.updateclock;
			if (typeof blob.renderclock === 'number') this.__renderclock = blob.renderclock;


			if (blob.timeouts instanceof Array) {
				// TODO: deserialize timeouts
			}

			if (blob.intervals instanceof Array) {
				// TODO: deserialize intervals
			}

		},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.game.Loop';


			var settings = {};
			var blob     = (data['blob'] || {});


			if (this.update !== 40) settings.update = this.update;
			if (this.render !== 40) settings.render = this.render;


			if (Object.keys(this.__timeouts).length > 0) {

				blob.timeouts = [];

				for (var tid in this.__timeouts) {

					var timeout = this.__timeouts[tid];

					blob.timeouts.push({
						delta:    timeout.clock - this.__updateclock,
						callback: lychee.serialize(timeout.callback),
						// scope:    lychee.serialize(timeout.scope)
						scope:    null
					});

				}

			}


			if (Object.keys(this.__intervals).length > 0) {

				blob.intervals = [];

				for (var iid in this.__intervals) {

					var interval = this.__intervals[iid];

					blob.intervals.push({
						clock:    interval.clock - this.__updateclock,
						delta:    interval.delta,
						step:     interval.step,
						callback: lychee.serialize(interval.callback),
						// scope:    lychee.serialize(interval.scope)
						scope:    null
					});

				}

			}


			if (this.__state !== 1) {

				blob.pause = this.__pause;
				blob.state = this.__state;

			}

			blob.updateclock = this.__updateclock;
			blob.renderclock = this.__renderclock;


			return {
				'constructor': 'lychee.game.Loop',
				'arguments':   [ settings ],
				'blob':        null
			};

		},



		/*
		 * CUSTOM API
		 */

		start: function() {

			this.__state = 1;
			this.__start = Date.now();

		},

		stop: function() {

			this.__state = 0;

		},

		pause: function() {

			this.__state = 0;
			this.__pause = Date.now() - this.__start;

		},

		resume: function() {

			this.__state = 1;
			this.__start = Date.now() - this.__pause;
			this.__pause = 0;

		},

		setTimeout: function(delta, callback, scope) {

			delta    = typeof delta === 'number'    ? delta    : null;
			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : global;


			if (delta === null || callback === null) {
				return null;
			}


			var id = _id++;

			this.__timeouts[id] = {
				clock:    this.__updateclock + delta,
				callback: callback,
				scope:    scope
			};


			return id;

		},

		removeTimeout: function(id) {

			id = typeof id === 'number' ? id : null;


			if (id !== null && this.__timeouts[id] !== undefined) {

				delete this.__timeouts[id];

				return true;

			}


			return false;

		},

		setInterval: function(delta, callback, scope) {

			delta    = typeof delta === 'number'    ? delta    : null;
			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : global;


			if (delta === null || callback === null) {
				return null;
			}


			var id = _id++;

			this.__intervals[id] = {
				clock:    this.__updateclock + delta,
				delta:    delta,
				step:     1,
				callback: callback,
				scope:    scope
			};


			return id;

		},

		removeInterval: function(id) {

			id = typeof id === 'number' ? id : null;


			if (id !== null && this.__intervals[id] !== undefined) {

				delete this.__intervals[id];

				return true;

			}


			return false;

		},

		setUpdate: function(update) {

			update = typeof update === 'number' ? update : null;


			if (update !== null && update > 0) {

				this.update        = update;
				this.__updatedelay = 1000 / update;

				return true;

			} else if (update === 0) {

				this.update        = update;
				this.__updatedelay = Infinity;

				return true;

			}


			return false;

		},

		setRender: function(render) {

			render = typeof render === 'number' ? render : null;


			if (render !== null && render > 0) {

				this.render        = render;
				this.__renderdelay = 1000 / render;

				return true;

			} else if (render === 0) {

				this.render        = render;
				this.__renderdelay = Infinity;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.game.Main').requires([
	'lychee.Input',
	'lychee.Renderer',
	'lychee.Storage',
	'lychee.Viewport',
	'lychee.event.Flow',
	'lychee.game.Jukebox',
	'lychee.game.Loop',
	'lychee.game.State',
	'lychee.net.Client',
	'lychee.net.Server'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _api_origin = '';

	(function(location) {

		var origin = location.origin || null;
		if (origin === 'file://') {
			_api_origin = 'http://lycheejs.org';
		} else if (origin !== null) {
			_api_origin = location.origin;
		}

	})(global.location || {});


	var _load_api = function(url, callback, scope) {

		url = typeof url === 'string' ? url : '/api/Server?identifier=boilerplate';


		var config = new Config(_api_origin + url);

		config.onload = function(result) {
			callback.call(scope, result === true ? this.buffer : null);
		};

		config.load();

	};

	var _initialize = function() {

		var settings = this.settings;

		if (settings.client !== null) {
			this.client = new lychee.net.Client(settings.client);
			this.client.connect();
		}

		if (settings.server !== null) {
			this.server = new lychee.net.Server(settings.server);
			this.server.connect();
		}

		if (settings.input !== null) {
			this.input = new lychee.Input(settings.input);
		}

		if (settings.jukebox !== null) {
			this.jukebox = new lychee.game.Jukebox(settings.jukebox);
		}

		if (settings.loop !== null) {

			this.loop = new lychee.game.Loop(settings.loop);
			this.loop.bind('render', _on_render, this);
			this.loop.bind('update', _on_update, this);

		}

		if (settings.renderer !== null) {
			this.renderer = new lychee.Renderer(settings.renderer);
		}

		if (settings.storage !== null) {
			this.storage = new lychee.Storage(settings.storage);
		}

		if (settings.viewport !== null) {

			this.viewport = new lychee.Viewport();
			this.viewport.bind('reshape', _on_reshape, this);
			this.viewport.bind('hide',    _on_hide,    this);
			this.viewport.bind('show',    _on_show,    this);

			this.viewport.setFullscreen(settings.viewport.fullscreen);

		}


		if (this.loop !== null && this.viewport !== null) {

			this.loop.setTimeout(10, function() {
				this.trigger('reshape', []);
			}, this.viewport);

		}

	};

	var _on_hide = function() {

		var loop = this.loop;
		if (loop !== null) {
			loop.pause();
		}

	};

	var _on_render = function(clock, delta) {

		if (this.state !== null) {
			this.state.render(clock, delta);
		}

	};

	var _on_reshape = function(orientation, rotation) {

		var renderer = this.renderer;
		if (renderer !== null) {

			var settings = this.settings;
			if (settings.renderer !== null) {
				renderer.setWidth(settings.renderer.width);
				renderer.setHeight(settings.renderer.height);
			}

		}

	};

	var _on_show = function() {

		var loop = this.loop;
		if (loop !== null) {
			loop.resume();
		}

	};

	var _on_update = function(clock, delta) {

		if (this.state !== null) {
			this.state.update(clock, delta);
		}

	};



	/*
	 * DEFAULT SETTINGS
	 * and SERIALIZATION CACHE
	 */

	var _defaults = {

		client: null,
		server: null,

		input: {
			delay:       0,
			key:         false,
			keymodifier: false,
			touch:       true,
			swipe:       false
		},

		jukebox: {
			channels: 8,
			music:    true,
			sound:    true
		},

		loop: {
			render: 60,
			update: 60
		},

		renderer: {
			width:      null,
			height:     null,
			id:         'game',
			background: '#222222'
		},

		storage: {
			id:    'game',
			model: {},
			type:  lychee.Storage.TYPE.persistent
		},

		viewport: {
			fullscreen: false
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(settings) {

		this.settings = lychee.extendunlink({}, _defaults, settings);
		this.defaults = lychee.extendunlink({}, this.settings);

		this.client   = null;
		this.server   = null;

		this.input    = null;
		this.jukebox  = null;
		this.loop     = null;
		this.renderer = null;
		this.storage  = null;
		this.viewport = null;

		this.state    = null;
		this.__states = {};


		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.client instanceof Object)   this.client   = lychee.deserialize(blob.client);
			if (blob.server instanceof Object)   this.server   = lychee.deserialize(blob.server);

			if (blob.input instanceof Object)    this.input    = lychee.deserialize(blob.input);
			if (blob.jukebox instanceof Object)  this.jukebox  = lychee.deserialize(blob.jukebox);
			if (blob.loop instanceof Object)     this.loop     = lychee.deserialize(blob.loop);
			if (blob.renderer instanceof Object) this.renderer = lychee.deserialize(blob.renderer);
			if (blob.storage instanceof Object)  this.storage  = lychee.deserialize(blob.storage);
			if (blob.viewport instanceof Object) this.viewport = lychee.deserialize(blob.viewport);


			if (blob.states instanceof Object) {

				for (var id in blob.states) {

					var stateblob = blob.states[id];

					for (var a = 0, al = stateblob.arguments.length; a < al; a++) {
						if (stateblob.arguments[a] === '#MAIN') {
							stateblob.arguments[a] = this;
						}
					}

					this.setState(id, lychee.deserialize(stateblob));

				}

			}

		},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.game.Main';

			var settings = lychee.extendunlink({}, this.settings);
			var blob     = data['blob'] || {};


			if (this.client !== null)   blob.client   = lychee.serialize(this.client);
			if (this.server !== null)   blob.server   = lychee.serialize(this.server);

			if (this.input !== null)    blob.input    = lychee.serialize(this.input);
			if (this.jukebox !== null)  blob.jukebox  = lychee.serialize(this.jukebox);
			if (this.loop !== null)     blob.loop     = lychee.serialize(this.loop);
			if (this.renderer !== null) blob.renderer = lychee.serialize(this.renderer);
			if (this.storage !== null)  blob.storage  = lychee.serialize(this.storage);
			if (this.viewport !== null) blob.viewport = lychee.serialize(this.viewport);


			if (Object.keys(this.__states).length > 0) {

				blob.states = {};

				for (var id in this.__states) {
					blob.states[id] = lychee.serialize(this.__states[id]);
				}

			}


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * INITIALIZATION
		 */

		init: function() {

			var flow       = new lychee.event.Flow();
			var client_api = this.settings.client;
			var server_api = this.settings.server;


			flow.then('load-api');
			flow.then('load');
			flow.then('init');


			flow.bind('load-api', function(oncomplete) {

				var c = typeof client_api === 'string';
				var s = typeof server_api === 'string';


				if (c === true && s === true) {

					_load_api(client_api, function(settings) {

						this.settings.client = lychee.extend({}, settings);

						_load_api(server_api, function(settings) {
							this.settings.server = lychee.extend({}, settings);
							oncomplete(true);
						}, this);

					}, this);

				} else if (c === true) {

					_load_api(client_api, function(settings) {
						this.settings.client = lychee.extend({}, settings);
						oncomplete(true);
					}, this);

				} else if (s === true) {

					_load_api(server_api, function(settings) {
						this.settings.server = lychee.extend({}, settings);
						oncomplete(true);
					}, this);

				} else {

					oncomplete(true);

				}

			}, this);

			flow.bind('load', function(oncomplete) {

				var result = this.trigger('load', [ oncomplete ]);
				if (result === false) {
					oncomplete(true);
				}

			}, this);

			flow.bind('init', function(oncomplete) {

				_initialize.call(this);
				oncomplete(true);

			}, this);

			flow.bind('complete', function() {
				this.trigger('init', []);
			}, this);

			flow.bind('error', function() {
				_initialize.call(this);
			}, this);

			flow.init();

		},



		/*
		 * STATE MANAGEMENT
		 */

		setState: function(id, state) {

			id = typeof id === 'string' ? id : null;


			if (lychee.interfaceof(lychee.game.State, state)) {

				if (id !== null) {

					this.__states[id] = state;

					return true;

				}

			}


			return false;

		},

		getState: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.__states[id] !== undefined) {
				return this.__states[id];
			}


			return null;

		},

		removeState: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.__states[id] !== undefined) {

				delete this.__states[id];

				if (this.state === this.__states[id]) {
					this.changeState(null);
				}

				return true;

			}


			return false;

		},

		changeState: function(id, data) {

			id   = typeof id === 'string' ? id   : null;
			data = data instanceof Object ? data : null;


			var oldstate = this.state;
			var newstate = this.__states[id] || null;

			if (newstate !== null) {

				if (oldstate !== null) {
					oldstate.leave();
				}

				if (newstate !== null) {
					newstate.enter(data);
				}

				this.state = newstate;

			} else {

				if (oldstate !== null) {
					oldstate.leave();
				}

				this.state = null;

			}


			return true;

		}

	};


	return Class;

});


lychee.define('lychee.game.Physic').exports(function(lychee, global, attachments) {

	var Class = function(data) {
	};


	Class.prototype = {
	};


	return Class;

});


lychee.define('lychee.game.Sprite').includes([
	'lychee.game.Entity'
]).exports(function(lychee, global) {

	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.frame   = 0;
		this.texture = null;

		this.__animation = {
			active:   false,
			start:    null,
			frames:   0,
			duration: 0,
			loop:     false
		};
		this.__map = {};


		this.setAnimation(settings.animation);
		this.setTexture(settings.texture);
		this.setMap(settings.map);

		delete settings.texture;
		delete settings.map;


		lychee.game.Entity.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			var texture = lychee.deserialize(blob.texture);
			if (texture !== null) {
				this.setTexture(texture);
			}

		},

		serialize: function() {

			var data = lychee.game.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lyche.game.Sprite';

			var settings = data['arguments'][0];
			var blob     = data['blob'] = (data['blob'] || {});


			if (this.__animation.active === true) {

				settings.animation = {};

				if (this.__animation.duration !== 1000) settings.animation.duration = this.__animation.duration;
				if (this.frame !== 0)                   settings.animation.frame    = this.frame;
				if (this.__animation.frames !== 25)     settings.animation.frames   = this.__animation.frames;
				if (this.__animation.loop !== false)    settings.animation.loop     = true;

			}

			if (Object.keys(this.__map).length > 0) {

				settings.map = {};


				for (var stateId in this.__map) {

					settings.map[stateId] = [];


					var frames = this.__map[stateId];
					for (var f = 0, fl = frames.length; f < fl; f++) {

						var frame  = frames[f];
						var sframe = {};

						if (frame.x !== 0) sframe.x = frame.x;
						if (frame.y !== 0) sframe.y = frame.y;
						if (frame.w !== 0) sframe.w = frame.w;
						if (frame.h !== 0) sframe.h = frame.h;


						settings.map[stateId].push(sframe);

					}

				}

			}


			if (this.texture !== null) blob.texture = lychee.serialize(this.texture);


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			lychee.game.Entity.prototype.render.call(this, renderer, offsetX, offsetY);


			var texture = this.texture;
			if (texture !== null) {

				var alpha    = this.alpha;
				var position = this.position;

				var x1 = 0;
				var y1 = 0;


				if (alpha !== 1) {
					renderer.setAlpha(alpha);
				}


				var map = this.getMap();
				if (map !== null) {

					x1 = position.x + offsetX - map.w / 2;
					y1 = position.y + offsetY - map.h / 2;

					renderer.drawSprite(
						x1,
						y1,
						texture,
						map
					);

				} else {

					var hw = (this.width / 2)  || this.radius;
					var hh = (this.height / 2) || this.radius;

					x1 = position.x + offsetX - hw;
					y1 = position.y + offsetY - hh;

					renderer.drawSprite(
						x1,
						y1,
						texture
					);

				}


				if (alpha !== 1) {
					renderer.setAlpha(1);
				}

			}

		},

		update: function(clock, delta) {

			lychee.game.Entity.prototype.update.call(this, clock, delta);


			var animation = this.__animation;

			// 1. Animation (Interpolation)
			if (animation.active === true) {

				if (animation.start === null) {
					animation.start = clock;
				}

				if (animation.start !== null) {

					var t = (clock - animation.start) / animation.duration;
					if (t <= 1) {

						this.frame = Math.max(0, Math.ceil(t * animation.frames) - 1);

					} else {

						if (animation.loop === true) {
							animation.start = clock;
						} else {
							this.frame = animation.frames - 1;
							animation.active = false;
						}

					}

				}

			}

		},



		/*
		 * CUSTOM API
		 */

		setAnimation: function(settings) {

			settings = settings instanceof Object ? settings : null;


			if (settings !== null) {

				var duration = typeof settings.duration === 'number' ? settings.duration : 1000;
				var frame    = typeof settings.frame === 'number'    ? settings.frame    : 0;
				var frames   = typeof settings.frames === 'number'   ? settings.frames   : 25;
				var loop     = settings.loop === true;


				var animation = this.__animation;

				animation.start    = null;
				animation.active   = true;
				animation.duration = duration;
				animation.frames   = frames;
				animation.loop     = loop;

				this.frame = frame;

				return true;

			}


			return false;

		},

		clearAnimation: function() {

			this.__animation.active = false;
			this.frame = 0;

		},

		setState: function(id) {

			var result = lychee.game.Entity.prototype.setState.call(this, id);
			if (result === true) {

				var map = this.__map[this.state] || null;
				if (map !== null) {

					if (map instanceof Array) {

						var statemap = this.getStateMap();
						if (statemap !== null && statemap instanceof Object) {

							this.clearAnimation();

							if (statemap.animation === true) {

								this.setAnimation({
									duration: statemap.duration || 1000,
									frame:    0,
									frames:   map.length,
									loop:     statemap.loop === true
								});

							}

						}


						map = map[0];

					}


					if (map.width !== undefined && typeof map.width === 'number') {
						this.width = map.width;
					}

					if (map.height !== undefined && typeof map.height === 'number') {
						this.height = map.height;
					}

					if (map.radius !== undefined && typeof map.radius === 'number') {
						this.radius = map.radius;
					}

				}

			}


			return result;

		},

		setTexture: function(texture) {

			if (texture instanceof Texture || texture === null) {

				this.texture = texture;

				return true;

			}


			return false;

		},

		getMap: function() {

			var state = this.state;
			var frame = this.frame;


			if (this.__map[state] instanceof Array && this.__map[state][frame] !== undefined) {
				return this.__map[state][frame];
			}


			return null;

		},

		setMap: function(map) {

			map = map instanceof Object ? map : null;


			var valid = false;

			if (map !== null) {

				for (var stateId in map) {

					var frames = map[stateId];
					if (frames instanceof Array) {

						this.__map[stateId] = [];


						for (var f = 0, fl = frames.length; f < fl; f++) {

							var frame = frames[f];
							if (frame instanceof Object) {

								frame.x = typeof frame.x === 'number' ? frame.x : 0;
								frame.y = typeof frame.y === 'number' ? frame.y : 0;
								frame.w = typeof frame.w === 'number' ? frame.w : 0;
								frame.h = typeof frame.h === 'number' ? frame.h : 0;


								this.__map[stateId].push(frame);

							}

						}


						valid = true;

					}

				}

			}


			return valid;

		}

	};


	return Class;

});


lychee.define('lychee.game.State').requires([
	'lychee.game.Layer',
	'lychee.game.Logic',
	'lychee.ui.Layer'
]).exports(function(lychee, global) {

	/*
	 * HELPERS
	 */

	var _on_key = function(key, name, delta) {

		var focus = this.__focus;
		if (focus !== null) {

			var result = focus.trigger('key', [ key, name, delta ]);
			if (result === true && key === 'return' && focus.state === 'default') {
				this.__focus = null;
			}

		}

	};

	var _on_reshape = function(orientation, rotation) {

		var renderer = this.renderer;
		if (renderer !== null) {

			var position = {
				x: 1/2 * renderer.width,
				y: 1/2 * renderer.height
			};


			for (var id in this.__layers) {
				this.__layers[id].setPosition(position);
				this.__layers[id].reshape();
			}

		}

	};

	var _on_swipe = function(id, type, position, delta, swipe) {

		var touch = this.__touches[id];
		if (touch.entity !== null) {

			if (touch.layer.visible === false) return;


			var args   = [ id, type, position, delta, swipe ];
			var result = false;

			var renderer = this.renderer;
			if (renderer !== null) {

				args[2].x -= renderer.offset.x;
				args[2].y -= renderer.offset.y;

			}


			if (type === 'start') {

				_trace_entity_offset.call(
					touch.offset,
					touch.entity,
					touch.layer
				);


				args[2].x -= touch.offset.x;
				args[2].y -= touch.offset.y;
				result     = touch.entity.trigger('swipe', args);

				if (result === false) {
					touch.entity = null;
					touch.layer  = null;
				}

			} else if (type === 'move') {

				args[2].x -= touch.offset.x;
				args[2].y -= touch.offset.y;
				result     = touch.entity.trigger('swipe', args);

				if (result === false) {
					touch.entity = null;
					touch.layer  = null;
				}

			} else if (type === 'end') {

				args[2].x -= touch.offset.x;
				args[2].y -= touch.offset.y;
				result     = touch.entity.trigger('swipe', args);

				if (result === false) {
					touch.entity = null;
					touch.layer  = null;
				}

			}

		}

	};

	var _on_touch = function(id, position, delta) {

		var args = [ id, {
			x: 0,
			y: 0
		}, delta ];


		var x = position.x;
		var y = position.y;


		var renderer = this.renderer;
		if (renderer !== null) {

			x -= renderer.offset.x;
			y -= renderer.offset.y;

		}


		var touch_layer  = null;
		var touch_entity = null;

		for (var lid in this.__layers) {

			var layer = this.__layers[lid];
			if (layer.visible === false) continue;

			if (lychee.interfaceof(lychee.ui.Layer, layer)) {

				args[1].x = x - layer.position.x;
				args[1].y = y - layer.position.y;


				var result = layer.trigger('touch', args);
				if (result !== true && result !== false && result !== null) {

					touch_entity = result;
					touch_layer  = layer;

					break;

				}

			}

		}


		var old_focus = this.__focus;
		var new_focus = touch_entity;

		// 1. Reset Touch trace data if no Entity was touched
		if (new_focus === null) {
			this.__touches[id].entity = null;
			this.__touches[id].layer  = null;
		}


		// 2. Change Focus State Interaction
		if (new_focus !== old_focus) {

			if (old_focus !== null) {

				if (old_focus.state !== 'default') {
					old_focus.trigger('blur');
				}

			}

			if (new_focus !== null) {

				if (new_focus.state === 'default') {
					new_focus.trigger('focus');
				}

			}


			this.__focus = new_focus;

		}


		// 3. Prepare UI Swipe event
		if (touch_entity !== null) {

			var touch = this.__touches[id];

			touch.entity   = new_focus;
			touch.layer    = touch_layer;


			// TODO: Fix intelligent reshape() calls for resizing entities on touch events
			this.loop.setTimeout(300, touch.layer.reshape, touch.layer);


			_trace_entity_offset.call(
				touch.offset,
				touch.entity,
				touch.layer
			);

		}

	};

	var _trace_entity_offset = function(entity, layer, offsetX, offsetY) {

		if (offsetX === undefined || offsetY === undefined) {

			this.x  = 0;
			this.y  = 0;
			offsetX = layer.position.x;
			offsetY = layer.position.y;

		}


		if (layer === entity) {

			this.x = offsetX;
			this.y = offsetY;

			return true;

		} else if (layer.entities !== undefined) {

			var entities = layer.entities;
			for (var e = entities.length - 1; e >= 0; e--) {

				var dx = layer.offset.x + entities[e].position.x;
				var dy = layer.offset.y + entities[e].position.y;


				var result = _trace_entity_offset.call(
					this,
					entity,
					entities[e],
					offsetX + dx,
					offsetY + dy
				);

				if (result === true) {
					return true;
				}

			}

		}


		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		this.main     = main          || null;
		this.client   = main.client   || null;
		this.server   = main.server   || null;

		this.input    = main.input    || null;
		this.jukebox  = main.jukebox  || null;
		this.loop     = main.loop     || null;
		this.renderer = main.renderer || null;
		this.storage  = main.storage  || null;
		this.viewport = main.viewport || null;


		this.__layers  = {};
		this.__logics  = [];
		this.__focus   = null;
		this.__touches = [
			{ entity: null, layer: null, offset: { x: 0, y: 0 } },
			{ entity: null, layer: null, offset: { x: 0, y: 0 } },
			{ entity: null, layer: null, offset: { x: 0, y: 0 } },
			{ entity: null, layer: null, offset: { x: 0, y: 0 } },
			{ entity: null, layer: null, offset: { x: 0, y: 0 } },
			{ entity: null, layer: null, offset: { x: 0, y: 0 } },
			{ entity: null, layer: null, offset: { x: 0, y: 0 } },
			{ entity: null, layer: null, offset: { x: 0, y: 0 } },
			{ entity: null, layer: null, offset: { x: 0, y: 0 } },
			{ entity: null, layer: null, offset: { x: 0, y: 0 } }
		];



		/*
		 * INITIALIZATION
		 */

		var viewport = this.viewport;
		if (viewport !== null) {
			viewport.bind('reshape', _on_reshape, this);
		}

	};


	Class.prototype = {

		/*
		 * STATE API
		 */

		deserialize: function(blob) {

			if (blob.layers) {

				for (var laid in blob.layers) {
					this.setLayer(laid, lychee.deserialize(blob.layers[laid]));
				}

			}

			if (blob.logics) {

				for (var l = 0, ll = blob.logics.length; b < bl; b++) {
					this.addLogic(lychee.deserialize(blob.logics[l]));
				}

			}

		},

		serialize: function() {

			var settings = this.main !== null ? '#MAIN' : null;
			var blob     = {};


			if (Object.keys(this.__layers).length > 0) {

				blob.layers = {};

				for (var lid in this.__layers) {
					blob.layers[lid] = lychee.serialize(this.__layers[lid]);
				}

			}


			if (this.__logics.length > 0) {

				blob.logics = [];

				for (var l = 0, ll = this.__logics.length; l < ll; l++) {
					blob.logics.push(lychee.serialize(this.__logics[l]));
				}

			}


			return {
				'constructor': 'lychee.game.State',
				'arguments':   [ settings ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		enter: function(data) {

			var input = this.input;
			if (input !== null) {
				input.bind('key',   _on_key,   this);
				input.bind('touch', _on_touch, this);
				input.bind('swipe', _on_swipe, this);
			}

			var logics = this.__logics;
			for (var l = 0, ll = logics.length; l < ll; l++) {
				logics[l].enter(data);
			}

		},

		leave: function() {

			var focus = this.__focus;
			if (focus !== null) {
				focus.trigger('blur');
			}


			for (var t = 0, tl = this.__touches.length; t < tl; t++) {

				var touch = this.__touches[t];
				if (touch.entity !== null) {
					touch.entity = null;
					touch.layer  = null;
				}

			}


			this.__focus = null;


			var logics = this.__logics;
			for (var l = 0, ll = logics.length; l < ll; l++) {
				logics[l].leave();
			}

			var input = this.input;
			if (input !== null) {
				input.unbind('swipe', _on_swipe, this);
				input.unbind('touch', _on_touch, this);
				input.unbind('key',   _on_key,   this);
			}

		},

		render: function(clock, delta, custom) {

			custom = custom === true;


			var renderer = this.renderer;
			if (renderer !== null) {

				if (custom === false) {
					renderer.clear();
				}


				for (var id in this.__layers) {

					var layer = this.__layers[id];
					if (layer.visible === false) continue;

					layer.render(
						renderer,
						0,
						0
					);

				}


				if (custom === false) {
					renderer.flush();
				}

			}

		},

		update: function(clock, delta) {

			for (var id in this.__layers) {

				var layer = this.__layers[id];
				if (layer.visible === false) continue;

				layer.update(clock, delta);

			}


			var logics = this.__logics;
			for (var l = 0, ll = logics.length; l < ll; l++) {
				logics[l].update(clock, delta);
			}

		},



		/*
		 * LAYER API
		 */

		setLayer: function(id, layer) {

			id    = typeof id === 'string'                                                                       ? id    : null;
			layer = (lychee.interfaceof(lychee.game.Layer, layer) || lychee.interfaceof(lychee.ui.Layer, layer)) ? layer : null;


			if (id !== null) {

				if (layer !== null) {

					this.__layers[id] = layer;

					return true;

				}

			}


			return false;

		},

		getLayer: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.__layers[id] !== undefined) {
				return this.__layers[id];
			}


			return null;

		},

		queryLayer: function(id, query) {

			id    = typeof id === 'string'    ? id    : null;
			query = typeof query === 'string' ? query : null;


			if (id !== null && query !== null) {

				var layer = this.getLayer(id);
				if (layer !== null) {

					var entity = layer;
					var ids    = query.split(' > ');

					for (var i = 0, il = ids.length; i < il; i++) {

						entity = entity.getEntity(ids[i]);

						if (entity === null) {
							break;
						}

					}


					return entity;

				}

			}


			return null;

		},

		removeLayer: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.__layers[id] !== undefined) {

				delete this.__layers[id];

				return true;

			}


			return false;

		},

		/*
		 * LOGIC API
		 */

		addLogic: function(logic) {

			logic = lychee.interfaceof(lychee.game.Logic, logic) ? logic : null;


			if (logic !== null) {

				var index = this.__logics.indexOf(logic);
				if (index === -1) {

					this.__logics.push(logic);

					return true;

				}

			}


			return false;

		},

		removeLogic: function(logic) {

			logic = lychee.interfaceof(lychee.game.Logic, logic) ? logic : null;


			if (logic !== null) {

				var index = this.__logics.indexOf(logic);
				if (index !== -1) {

					this.__logics.splice(index, 1);

					return true;

				}

			}


			return false;

		},

		setLogics: function(logics) {

			var all = true;

			if (logics instanceof Array) {

				for (var l = 0, ll = logics.length; l < ll; l++) {

					var result = this.addLogic(logics[l]);
					if (result === false) {
						all = false;
					}

				}

			}


			return all;

		},

		removeLogics: function() {

			var logics = this.__logics;

			for (var l = 0, ll = logics.length; l < ll; l++) {

				this.removeLogic(logics[l]);

				ll--;
				l--;

			}

			return true;

		}

	};


	return Class;

});


lychee.define('lychee.math.Matrix4').exports(function(lychee, global) {

	var _type = typeof Float32Array !== 'undefined' ? Float32Array : Array;


	var Class = function() {

		this._data = new _type(16);

		this.set(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);

	};


	Class.IDENTITY = new _type(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	);


	Class.PRECISION = 0.000001;


	Class.prototype = {

		clone: function() {

			var clone = new Class();
			var d = this._data;

			clone.set(
			     d[0],  d[1],  d[2],  d[3],
			     d[4],  d[5],  d[6],  d[7],
			     d[8],  d[9], d[10], d[11],
				d[12], d[13], d[14], d[15]
			);

			return clone;

		},

		copy: function(matrix) {

			var d = this._data;

			matrix.set(
			     d[0],  d[1],  d[2],  d[3],
			     d[4],  d[5],  d[6],  d[7],
			     d[8],  d[9], d[10], d[11],
				d[12], d[13], d[14], d[15]
			);

		},

		set: function(a0, a1, a2, a3, b0, b1, b2, b3, c0, c1, c2, c3, d0, d1, d2, d3) {

			var d = this._data;

			d[0]  = a0;
			d[1]  = a1;
			d[2]  = a2;
			d[3]  = a3;
			d[4]  = b0;
			d[5]  = b1;
			d[6]  = b2;
			d[7]  = b3;
			d[8]  = c0;
			d[9]  = c1;
			d[10] = c2;
			d[11] = c3;
			d[12] = d0;
			d[13] = d1;
			d[14] = d2;
			d[15] = d3;

		},

		transpose: function() {

			var tmp;
			var d = this._data;

			tmp =  d[1];  d[1] =  d[4];  d[4] = tmp;
			tmp =  d[2];  d[2] =  d[8];  d[8] = tmp;
			tmp =  d[6];  d[6] =  d[9];  d[9] = tmp;
			tmp =  d[3];  d[3] = d[12]; d[12] = tmp;
			tmp =  d[7];  d[7] = d[13]; d[13] = tmp;
			tmp = d[11]; d[11] = d[14]; d[14] = tmp;

		},

		invert: function(matrix) {

			var d;

			// Invert this matrix
			if (matrix === undefined) {
				d = this._data;

			// Invert other matrix, but target is this matrix
			} else {
				d = matrix._data;
			}


			var m00 =  d[0], m01 =  d[1], m02 =  d[2], m03 =  d[3];
			var m10 =  d[4], m11 =  d[5], m12 =  d[6], m13 =  d[7];
			var m20 =  d[8], m21 =  d[9], m22 = d[10], m23 = d[11];
			var m30 = d[12], m31 = d[13], m32 = d[14], m33 = d[15];

			var b00 = m00 * m11 - m01 * m10;
			var b01 = m00 * m12 - m02 * m10;
			var b02 = m00 * m13 - m03 * m10;
			var b03 = m01 * m12 - m02 * m11;
			var b04 = m01 * m13 - m03 * m11;
			var b05 = m02 * m13 - m03 * m12;
			var b06 = m20 * m31 - m21 * m30;
			var b07 = m20 * m32 - m22 * m30;
			var b08 = m20 * m33 - m23 * m30;
			var b09 = m21 * m32 - m22 * m31;
			var b10 = m21 * m33 - m23 * m31;
			var b11 = m22 * m33 - m23 * m32;


			var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
			if (det !== 0) {

				var out = this._data;

				det = 1.0 / det;


				out[0]  = (m11 * b11 - m12 * b10 + m13 * b09) * det;
				out[1]  = (m02 * b10 - m01 * b11 - m03 * b09) * det;
				out[2]  = (m31 * b05 - m32 * b04 + m33 * b03) * det;
				out[3]  = (m22 * b04 - m21 * b05 - m23 * b03) * det;
				out[4]  = (m12 * b08 - m10 * b11 - m13 * b07) * det;
				out[5]  = (m00 * b11 - m02 * b08 + m03 * b07) * det;
				out[6]  = (m32 * b02 - m30 * b05 - m33 * b01) * det;
				out[7]  = (m20 * b05 - m22 * b02 + m23 * b01) * det;
				out[8]  = (m10 * b10 - m11 * b08 + m13 * b06) * det;
				out[9]  = (m01 * b08 - m00 * b10 - m03 * b06) * det;
				out[10] = (m30 * b04 - m31 * b02 + m33 * b00) * det;
				out[11] = (m21 * b02 - m20 * b04 - m23 * b00) * det;
				out[12] = (m11 * b07 - m10 * b09 - m12 * b06) * det;
				out[13] = (m00 * b09 - m01 * b07 + m02 * b06) * det;
				out[14] = (m31 * b01 - m30 * b03 - m32 * b00) * det;
				out[15] = (m20 * b03 - m21 * b01 + m22 * b00) * det;

			}

		},

		determinant: function() {

			var a00 =  this._data[0], a01 =  this._data[1], a02 =  this._data[2], a03 =  this._data[3];
			var a10 =  this._data[4], a11 =  this._data[5], a12 =  this._data[6], a13 =  this._data[7];
			var a20 =  this._data[8], a21 =  this._data[9], a22 = this._data[10], a23 = this._data[11];
			var a30 = this._data[12], a31 = this._data[13], a32 = this._data[14], a33 = this._data[15];

			var b00 = a00 * a11 - a01 * a10;
			var b01 = a00 * a12 - a02 * a10;
			var b02 = a00 * a13 - a03 * a10;
			var b03 = a01 * a12 - a02 * a11;
			var b04 = a01 * a13 - a03 * a11;
			var b05 = a02 * a13 - a03 * a12;
			var b06 = a20 * a31 - a21 * a30;
			var b07 = a20 * a32 - a22 * a30;
			var b08 = a20 * a33 - a23 * a30;
			var b09 = a21 * a32 - a22 * a31;
			var b10 = a21 * a33 - a23 * a31;
			var b11 = a22 * a33 - a23 * a32;


			return (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

		},

		translate: function(vector) {

			var x = vector._data[0];
			var y = vector._data[1];
			var z = vector._data[2];

			var d = this._data;

			d[12] =  d[0] * x +  d[4] * y +  d[8] * z + d[12];
			d[13] =  d[1] * x +  d[5] * y +  d[9] * z + d[13];
			d[14] =  d[2] * x +  d[6] * y + d[10] * z + d[14];
			d[15] =  d[3] * x +  d[7] * y + d[11] * z + d[15];

		},

		rotateX: function(radian) {

			var d = this._data;
			var sin = Math.sin(radian);
			var cos = Math.cos(radian);

			var a10 =  a[4];
			var a11 =  a[5];
			var a12 =  a[6];
			var a13 =  a[7];
			var a20 =  a[8];
			var a21 =  a[9];
			var a22 = a[10];
			var a23 = a[11];


			 d[4] = a10 * cos + a20 * sin;
			 d[5] = a11 * cos + a21 * sin;
			 d[6] = a12 * cos + a22 * sin;
			 d[7] = a13 * cos + a23 * sin;
			 d[8] = a20 * cos - a10 * sin;
			 d[9] = a21 * cos - a11 * sin;
			d[10] = a22 * cos - a12 * sin;
			d[11] = a23 * cos - a13 * sin;

		},

		rotateY: function(radian) {

			var d = this._data;
			var sin = Math.sin(radian);
			var cos = Math.cos(radian);

			var a00 =  a[0];
			var a01 =  a[1];
			var a02 =  a[2];
			var a03 =  a[3];
			var a20 =  a[8];
			var a21 =  a[9];
			var a22 = a[10];
			var a23 = a[11];


			 d[0] = a00 * cos - a20 * sin;
			 d[1] = a01 * cos - a21 * sin;
			 d[2] = a02 * cos - a22 * sin;
			 d[3] = a03 * cos - a23 * sin;
			 d[8] = a00 * sin + a20 * cos;
			 d[9] = a01 * sin + a21 * cos;
			d[10] = a02 * sin + a22 * cos;
			d[11] = a03 * sin + a23 * cos;

		},

		rotateZ: function(radian) {

			var d = this._data;
			var sin = Math.sin(radian);
			var cos = Math.cos(radian);

			var a00 = a[0];
			var a01 = a[1];
			var a02 = a[2];
			var a03 = a[3];
			var a10 = a[4];
			var a11 = a[5];
			var a12 = a[6];
			var a13 = a[7];


			d[0] = a00 * cos + a10 * sin;
			d[1] = a01 * cos + a11 * sin;
			d[2] = a02 * cos + a12 * sin;
			d[3] = a03 * cos + a13 * sin;
			d[4] = a10 * cos - a00 * sin;
			d[5] = a11 * cos - a01 * sin;
			d[6] = a12 * cos - a02 * sin;
			d[7] = a13 * cos - a03 * sin;

		},

		rotateAxis: function(axis, radian) {

			var x = axis._data[0];
			var y = axis._data[1];
			var z = axis._data[2];

			if (x === 1 && y === 0 && z === 0) {
				return this.rotateX(radian);
			} else if (x === 0 && y === 1 && z === 0) {
				return this.rotateY(radian);
			} else if (x === 0 && y === 0 && z === 1) {
				return this.rotateZ(radian);
			}


			var length = Math.sqrt(x * x + y * y + z * z);
			if (Math.abs(length) < Class.PRECISION) {
				return;
			}


			var sin = Math.sin(radian);
			var cos = Math.cos(radian);
			var t   = 1 - cos;


			x *= (1 / length);
			y *= (1 / length);
			z *= (1 / length);


			var d = this._data;

			var a00 = d[0], a01 = d[1], a02 =  d[2], a03 =  d[3];
			var a10 = d[4], a11 = d[5], a12 =  d[6], a13 =  d[7];
			var a20 = d[8], a21 = d[9], a22 = d[10], a23 = d[11];


			// Rotation Matrix
			var r00 = x * x * t + c;
			var r01 = y * x * t + z * s;
			var r02 = z * x * t - y * s;

			var r10 = x * y * t - z * s;
			var r11 = y * y * t + c;
			var r12 = z * y * t + x * s;

			var r20 = x * z * t + y * s;
			var r21 = y * z * t - x * s;
			var r22 = z * z * t + c;


			 d[0] = a00 * r00 + a10 * r01 + a20 * r02;
			 d[1] = a01 * r00 + a11 * r01 + a21 * r02;
			 d[2] = a02 * r00 + a12 * r01 + a22 * r02;
			 d[3] = a03 * r00 + a13 * r01 + a23 * r02;
			 d[4] = a00 * r10 + a10 * r11 + a20 * r12;
			 d[5] = a01 * r10 + a11 * r11 + a21 * r12;
			 d[6] = a02 * r10 + a12 * r11 + a22 * r12;
			 d[7] = a03 * r10 + a13 * r11 + a23 * r12;
			 d[8] = a00 * r20 + a10 * r21 + a20 * r22;
			 d[9] = a01 * r20 + a11 * r21 + a21 * r22;
			d[10] = a02 * r20 + a12 * r21 + a22 * r22;
			d[11] = a03 * r20 + a13 * r21 + a23 * r22;

		},

		scale: function(vector) {

			var x = vector._data[0];
			var y = vector._data[1];
			var z = vector._data[2];


			d[0] *= x; d[4] *= y;  d[8] *= z;
			d[1] *= x; d[5] *= y;  d[9] *= z;
			d[2] *= x; d[6] *= y; d[10] *= z;
			d[3] *= x; d[7] *= y; d[11] *= z;

		},

		frustum: function(left, right, bottom, top, near, far) {

			var rl = 1 / (right - left);
			var tb = 1 / (top - bottom);
			var nf = 1 / (near - far);


			var d = this._data;

			 d[0] = (near * 2) * rl;
			 d[1] = 0;
			 d[2] = 0;
			 d[3] = 0;
			 d[4] = 0;
			 d[5] = (near * 2) * tb;
			 d[6] = 0;
			 d[7] = 0;
			 d[8] = (right + left) * rl;
			 d[9] = (top + bottom) * tb;
			d[10] = (far + near) * nf;
			d[11] = -1;
			d[12] = 0;
			d[13] = 0;
			d[14] = (far * near * 2) * nf;
			d[15] = 0;

		},

		perspective: function(fovy, aspect, near, far) {

			var f  = 1.0 / Math.tan(fovy / 2);
			var nf = 1 / (near - far);


			var d = this._data;

			 d[0] = f / aspect;
			 d[1] = 0;
			 d[2] = 0;
			 d[3] = 0;
			 d[4] = 0;
			 d[5] = f;
			 d[6] = 0;
			 d[7] = 0;
			 d[8] = 0;
			 d[9] = 0;
			d[10] = (far + near) * nf;
			d[11] = -1;
			d[12] = 0;
			d[13] = 0;
			d[14] = (2 * far * near) * nf;
			d[15] = 0;

		},

		ortho: function(left, right, bottom, top, near, far) {

			var lr = 1 / (left - right);
			var bt = 1 / (bottom - top);
			var nf = 1 / (near - far);


			var d = this._data;

			 d[0] = -2 * lr;
			 d[1] = 0;
			 d[2] = 0;
			 d[3] = 0;
			 d[4] = 0;
			 d[5] = -2 * bt;
			 d[6] = 0;
			 d[7] = 0;
			 d[8] = 0;
			 d[9] = 0;
			d[10] = 2 * nf;
			d[11] = 0;
			d[12] = (left + right) * lr;
			d[13] = (top + bottom) * bt;
			d[14] = (far + near) * nf;
			d[15] = 1;

		},

		lookAt: function(eyex, eyey, eyez, centerx, centery, centerz, upx, upy, upz) {

			var len;


			var z0 = eyex - centerx;
			var z1 = eyey - centery;
			var z2 = eyez - centerz;

			if (Math.abs(z0) < Class.PRECISION && Math.abs(z1) < Class.PRECISION && Math.abs(z2) < Class.PRECISION) {
				return;
			}


			len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
			z0 *= len;
			z1 *= len;
			z2 *= len;


			var x0 = upy * z2 - upz * z1;
			var x1 = upz * z0 - upx * z2;
			var x2 = upx * z1 - upy * z0;

			len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
			if (len === 0) {

				x0 = 0;
				x1 = 0;
				x2 = 0;

			} else {

				len = 1 / len;
				x0 *= len;
				x1 *= len;
				x2 *= len;

			}


			var y0 = z1 * x2 - z2 * x1;
			var y1 = z2 * x0 - z0 * x2;
			var y2 = z0 * x1 - z1 * x0;

			len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
			if (len === 0) {

				y0 = 0;
				y1 = 0;
				y2 = 0;

			} else {

				len = 1 / len;
				y0 *= len;
				y1 *= len;
				y2 *= len;

			}


			var d = this._data;

			 d[0] = x0;
			 d[1] = y0;
			 d[2] = z0;
			 d[3] = 0;
			 d[4] = x1;
			 d[5] = y1;
			 d[6] = z1;
			 d[7] = 0;
			 d[8] = x2;
			 d[9] = y2;
			d[10] = z2;
			d[11] = 0;
			d[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
			d[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
			d[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
			d[15] = 1;

		}

	};


	return Class;

});


lychee.define('lychee.math.Quaternion').exports(function(lychee, global) {

	var _type = typeof Float32Array !== 'undefined' ? Float32Array : Array;


	var Class = function() {

		this._data = new _type(4);

		this.set(0, 0, 0, 1);

	};


	Class.IDENTITY = new _type(0, 0, 0, 1);


	Class.prototype = {

		clone: function() {

			var clone = new Class();

			clone.set(this._data[0], this._data[1], this._data[2], this._data[3]);

			return clone;

		},

		copy: function(quaternion) {

			var d = this._data;
			var q = quaternion._data;

			q[0] = d[0];
			q[1] = d[1];
			q[2] = d[2];
			q[3] = d[3];

		},

		set: function(x, y, z, w) {

			var d = this._data;

			d[0] = x;
			d[1] = y;
			d[2] = z;
			d[3] = w;

		},

		add: function(quaternion) {

			var d = this._data;
			var q = quaternion._data;


			d[0] += q[0];
			d[1] += q[1];
			d[2] += q[2];
			d[3] += q[3];

		},

		subtract: function(quaternion) {

			var d = this._data;
			var q = quaternion._data;


			d[0] -= q[0];
			d[1] -= q[1];
			d[2] -= q[2];
			d[3] -= q[3];

		},

		multiply: function(quaternion) {

			var d = this._data;
			var q = quaternion._data;

			var ax = d[0], ay = d[1], az = d[2], aw = d[3];
			var bx = q[0], by = q[1], bz = q[2], bw = q[3];


			d[0] = ax * bw + aw * bx + ay * bz - az * by;
			d[1] = ay * bw + aw * by + az * bx - ax * bz;
			d[2] = az * bw + aw * bz + ax * by - ay * bx;
			d[3] = aw * bw - ax * bx - ay * by - az * bz;

		},

		min: function(quaternion) {

			var d = this._data;
			var q = quaternion._data;


			d[0] = Math.min(d[0], q[0]);
			d[1] = Math.min(d[1], q[1]);
			d[2] = Math.min(d[2], q[2]);
			d[3] = Math.min(d[3], q[3]);

		},

		max: function(quaternion) {

			var d = this._data;
			var q = quaternion._data;


			d[0] = Math.max(d[0], q[0]);
			d[1] = Math.max(d[1], q[1]);
			d[2] = Math.max(d[2], q[2]);
			d[3] = Math.max(d[3], q[3]);

		},

		scale: function(scale) {

			var d = this._data;


			d[0] *= scale;
			d[1] *= scale;
			d[2] *= scale;
			d[3] *= scale;

		},

		length: function() {

			var d = this._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];
			var w = d[3];


			return Math.sqrt(x * x + y * y + z * z + w * w);

		},

		squaredLength: function() {

			var d = this._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];
			var w = d[3];


			return (x * x + y * y + z * z + w * w);

		},

		invert: function() {

			var d = 0;

			var x = d[0];
			var y = d[1];
			var z = d[2];
			var w = d[3];


			var invDot = 0;
			var dot = (x * x + y * y + z * z + w * w);
			if (dot > 0) {

				invDot = 1.0 / dot;

				d[0] = -x * invDot;
				d[1] = -y * invDot;
				d[2] = -z * invDot;
				d[3] =  w * invDot;

			}

		},

		normalize: function() {

			var d = this._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];
			var w = d[3];


			var length = (x * x + y * y + z * z + w * w);
			if (length > 0) {

				length = 1 / Math.sqrt(length);

				d[0] *= length;
				d[1] *= length;
				d[2] *= length;
				d[3] *= length;

			}

		},

		scalar: function(quaternion) {

			var d = this._data;
			var q = quaternion._data;


			return (d[0] * q[0] + d[1] * q[1] + d[2] * q[2] + d[3] * q[3]);

		},

		interpolate: function(vector, t) {

			var d = this._data;
			var v = vector._data;


			d[0] += t * (v[0] - d[0]);
			d[1] += t * (v[1] - d[1]);
			d[2] += t * (v[2] - d[2]);
			d[3] += t * (v[3] - d[3]);

		},

		rotateX: function(radian) {

			var sin = Math.sin(radian * 0.5);
			var cos = Math.cos(radian * 0.5);

			var d = this._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];
			var w = d[3];


			d[0] = x * cos + w * sin;
			d[1] = y * cos + z * sin;
			d[2] = z * cos - y * sin;
			d[3] = w * cos - x * sin;

		},

		rotateY: function(radian) {

			var sin = Math.sin(radian * 0.5);
			var cos = Math.cos(radian * 0.5);

			var d = this._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];
			var w = d[3];


			d[0] = x * cos - z * sin;
			d[1] = y * cos + w * sin;
			d[2] = z * cos + x * sin;
			d[3] = w * cos - y * sin;

		},

		rotateZ: function(radian) {

			var sin = Math.sin(radian * 0.5);
			var cos = Math.cos(radian * 0.5);

			var d = this._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];
			var w = d[3];


			d[0] = x * cos + y * sin;
			d[1] = y * cos - x * sin;
			d[2] = z * cos + w * sin;
			d[3] = w * cos - z * sin;

		},

		rotateAxis: function(axis, radian) {

			var sin = Math.sin(radian * 0.5);
			var cos = Math.cos(radian * 0.5);

			var a = axis._data;
			var d = this._data;


			d[0] = sin * a[0];
			d[1] = sin * a[1];
			d[2] = sin * a[2];
			d[3] = cos;

		},

		calculateW: function() {

			var d = this._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];


			d[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));

		}

	};


	return Class;

});


lychee.define('lychee.math.Vector2').exports(function(lychee, global) {

	var _type = typeof Float32Array !== 'undefined' ? Float32Array : Array;


	var Class = function() {

		this._data = new _type(2);

	};


	Class.prototype = {

		clone: function() {

			var clone = new Class();

			this.copy(clone);

			return clone;

		},

		copy: function(vector) {

			vector.set(this._data[0], this._data[1]);

		},

		set: function(x, y) {

			var d = this._data;


			d[0] = x;
			d[1] = y;

		},

		add: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] += v[0];
			d[1] += v[1];

		},

		subtract: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] -= v[0];
			d[1] -= v[1];

		},

		multiply: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] *= v[0];
			d[1] *= v[1];

		},

		divide: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] /= v[0];
			d[1] /= v[1];

		},

		min: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] = Math.min(d[0], v[0]);
			d[1] = Math.min(d[1], v[1]);

		},

		max: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] = Math.max(d[0], v[0]);
			d[1] = Math.max(d[1], v[1]);

		},

		scale: function(scale) {

			var d = this._data;
			var v = vector._data;


			d[0] *= scale;
			d[1] *= scale;

		},

		distance: function(vector) {

			var d = this._data;
			var v = vector._data;

			var x = v[0] - d[0];
			var y = v[1] - d[1];


			return Math.sqrt(x * x + y * y);

		},

		squaredDistance: function(vector) {

			var d = this._data;
			var v = vector._data;

			var x = v[0] - d[0];
			var y = v[1] - d[1];


			return (x * x + y * y);

		},

		length: function() {

			var d = this._data;

			var x = d[0];
			var y = d[1];


			return Math.sqrt(x * x + y * y);

		},

		squaredLength: function() {

			var d = this._data;

			var x = d[0];
			var y = d[1];


			return (x * x + y * y);

		},

		invert: function() {

			var d = this._data;

			d[0] *= -1;
			d[1] *= -1;

		},

		normalize: function() {

			var d = this._data;

			var x = d[0];
			var y = d[1];


			var length = (x * x + y * y);
			if (length > 0) {

				length = 1 / Math.sqrt(length);

				d[0] *= length;
				d[1] *= length;

			}

		},

		scalar: function(vector) {

			var d = this._data;
			var v = vector._data;


			return (d[0] * v[0] + d[1] * v[1]);

		},

		cross: function(vector) {

			var d = this._data;
			var v = vector._data;

			// R^2 -> R^2 will just flip the coordinates
			// to have the assumed orthogonal behaviour
			// of the resulting vector

			d[0] =      v[1];
			d[1] = -1 * v[0];

		},

		interpolate: function(vector, t) {

			var d = this._data;
			var v = vector._data;


			d[0] += t * (v[0] - d[0]);
			d[1] += t * (v[1] - d[1]);

		},

		interpolateAdd: function(vector, t) {

			var d = this._data;
			var v = vector._data;


 			d[0] += t * v[0];
			d[1] += t * v[1];

		},

		interpolateSet: function(vector, t) {

			var d = this._data;
			var v = vector._data;


 			d[0] = t * v[0];
			d[1] = t * v[1];

		}

	};


	return Class;

});


lychee.define('lychee.math.Vector3').exports(function(lychee, global) {

	var _type = typeof Float32Array !== 'undefined' ? Float32Array : Array;


	var Class = function() {

		this._data = new _type(3);

	};


	Class.prototype = {

		clone: function() {

			var clone = new Class();

			this.copy(clone);

			return clone;

		},

		copy: function(vector) {

			vector.set(this._data[0], this._data[1], this._data[2]);

		},

		set: function(x, y, z) {

			var d = this._data;


			d[0] = x;
			d[1] = y;
			d[2] = z;

		},

		add: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] += v[0];
			d[1] += v[1];
			d[2] += v[2];

		},

		subtract: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] -= v[0];
			d[1] -= v[1];
			d[2] -= v[2];

		},

		multiply: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] *= v[0];
			d[1] *= v[1];
			d[2] *= v[2];

		},

		divide: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] /= v[0];
			d[1] /= v[1];
			d[2] /= v[2];

		},

		min: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] = Math.min(d[0], v[0]);
			d[1] = Math.min(d[1], v[1]);
			d[2] = Math.min(d[2], v[2]);

		},

		max: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] = Math.max(d[0], v[0]);
			d[1] = Math.max(d[1], v[1]);
			d[2] = Math.max(d[2], v[2]);

		},

		scale: function(scale) {

			var d = this._data;
			var v = vector._data;


			d[0] *= scale;
			d[1] *= scale;
			d[2] *= scale;

		},

		distance: function(vector) {

			var d = this._data;
			var v = vector._data;

			var x = v[0] - d[0];
			var y = v[1] - d[1];
			var z = v[2] - d[2];


			return Math.sqrt(x * x + y * y + z * z);

		},

		squaredDistance: function(vector) {

			var d = this._data;
			var v = vector._data;

			var x = v[0] - d[0];
			var y = v[1] - d[1];
			var z = v[2] - d[2];


			return (x * x + y * y + z * z);

		},

		length: function() {

			var d = this._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];


			return Math.sqrt(x * x + y * y + z * z);

		},

		squaredLength: function() {

			var d = this._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];


			return (x * x + y * y + z * z);

		},

		invert: function() {

			var d = this._data;

			d[0] *= -1;
			d[1] *= -1;
			d[2] *= -1;

		},

		normalize: function() {

			var d = this._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];


			var length = (x * x + y * y + z * z);
			if (length > 0) {

				length = 1 / Math.sqrt(length);

				d[0] *= length;
				d[1] *= length;
				d[2] *= length;

			}

		},

		scalar: function(vector) {

			var d = this._data;
			var v = vector._data;


			return (d[0] * v[0] + d[1] * v[1] + d[2] * v[2]);

		},

		cross: function(vector) {

			var d = this._data;
			var v = vector._data;

			var ax = d[0];
			var ay = d[1];
			var az = d[2];

			var bx = v[0];
			var by = v[1];
			var bz = v[2];


			d[0] = ay * bz - az * by;
			d[1] = az * bx - ax * bz;
			d[2] = ax * by - ay * bx;

		},

		interpolate: function(vector, t) {

			var d = this._data;
			var v = vector._data;


			d[0] += t * (v[0] - d[0]);
			d[1] += t * (v[1] - d[1]);
			d[2] += t * (v[2] - d[2]);

		},

		interpolateAdd: function(vector, t) {

			var d = this._data;
			var v = vector._data;


 			d[0] += t * v[0];
			d[1] += t * v[1];
			d[2] += t * v[2];

		},

		interpolateSet: function(vector, t) {

			var d = this._data;
			var v = vector._data;


 			d[0] = t * v[0];
			d[1] = t * v[1];
			d[2] = t * v[2];

		},

		applyMatrix4: function(matrix) {

			var d = this._data;
			var m = matrix._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];


			d[0] = m[0]*x  +  m[4]*y  + m[8]*z  + m[12];
			d[1] = m[1]*x  +  m[5]*y  + m[9]*z  + m[13];
			d[2] = m[2]*x  +  m[6]*y  + m[10]*z + m[14];

		},

		applyQuaternion: function(quaternion) {

			var d = this._data;
			var q = quaternion._data;


			var vx = d[0];
			var vy = d[1];
			var vz = d[2];

			var qx = q[0];
			var qy = q[1];
			var qz = q[2];
			var qw = q[3];

			var ix =  qw * vx + qy * vz - qz * vy;
			var iy =  qw * vy + qz * vx - qx * vz;
			var iz =  qw * vz + qx * vy - qy * vx;
			var iw = -qx * vx - qy * vy - qz * vz;


			d[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
			d[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
			d[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;

		}

	};


	return Class;

});


lychee.define('lychee.math.Vector4').exports(function(lychee, global) {

	var _type = typeof Float32Array !== 'undefined' ? Float32Array : Array;


	var Class = function() {

		this._data = new _type(4);

	};


	Class.prototype = {

		clone: function() {

			var clone = new Class();

			clone.set(
				this._data[0],
				this._data[1],
				this._data[2],
				this._data[3]
			);


			return clone;

		},

		copy: function(vector) {

			var d = this._data;
			var v = vector._data;


			v[0] = d[0];
			v[1] = d[1];
			v[2] = d[2];
			v[3] = d[3];

		},

		set: function(x, y, z, w) {

			var d = this._data;


			d[0] = x;
			d[1] = y;
			d[2] = z;
			d[3] = w;

		},

		add: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] += v[0];
			d[1] += v[1];
			d[2] += v[2];
			d[3] += v[3];

		},

		subtract: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] -= v[0];
			d[1] -= v[1];
			d[2] -= v[2];
			d[3] -= v[3];

		},

		multiply: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] *= v[0];
			d[1] *= v[1];
			d[2] *= v[2];
			d[3] *= v[3];

		},

		divide: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] /= v[0];
			d[1] /= v[1];
			d[2] /= v[2];
			d[3] /= v[3];

		},

		min: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] = Math.min(d[0], v[0]);
			d[1] = Math.min(d[1], v[1]);
			d[2] = Math.min(d[2], v[2]);
			d[3] = Math.min(d[3], v[3]);

		},

		max: function(vector) {

			var d = this._data;
			var v = vector._data;


			d[0] = Math.max(d[0], v[0]);
			d[1] = Math.max(d[1], v[1]);
			d[2] = Math.max(d[2], v[2]);
			d[3] = Math.max(d[3], v[3]);

		},

		scale: function(scale) {

			var d = this._data;


			d[0] *= scale;
			d[1] *= scale;
			d[2] *= scale;
			d[3] *= scale;

		},

		distance: function(vector) {

			var d = this._data;
			var v = vector._data;

			var x = v[0] - d[0];
			var y = v[1] - d[1];
			var z = v[2] - d[2];
			var w = v[3] - d[3];


			return Math.sqrt(x * x + y * y + z * z + w * w);

		},

		squaredDistance: function(vector) {

			var d = this._data;
			var v = vector._data;

			var x = v[0] - d[0];
			var y = v[1] - d[1];
			var z = v[2] - d[2];
			var w = v[3] - d[3];


			return (x * x + y * y + z * z + w * w);

		},

		length: function() {

			var d = this._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];
			var w = d[3];


			return Math.sqrt(x * x + y * y + z * z + w * w);

		},

		squaredLength: function() {

			var d = this._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];
			var w = d[3];


			return (x * x + y * y + z * z + w * w);

		},

		invert: function() {

			var d = this._data;


			d[0] *= -1;
			d[1] *= -1;
			d[2] *= -1;
			d[3] *= -1;

		},

		normalize: function() {

			var d = this._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];
			var w = d[3];


			var length = (x * x + y * y + z * z + w * w);
			if (length > 0) {

				length = 1 / Math.sqrt(length);

				d[0] *= length;
				d[1] *= length;
				d[2] *= length;
				d[3] *= length;

			}

		},

		scalar: function(vector) {

			var d = this._data;
			var v = vector._data;


			return (d[0] * v[0] + d[1] * v[1] + d[2] * v[2] + d[3] * v[3]);

		},

		interpolate: function(vector, t) {

			var d = this._data;
			var v = vector._data;


			d[0] += t * (v[0] - d[0]);
			d[1] += t * (v[1] - d[1]);
			d[2] += t * (v[2] - d[2]);
			d[3] += t * (v[3] - d[3]);

		},

		interpolateAdd: function(vector, t) {

			var d = this._data;
			var v = vector._data;


 			d[0] += t * v[0];
			d[1] += t * v[1];
			d[2] += t * v[2];
			d[3] += t * v[3];

		},

		interpolateSet: function(vector, t) {

			var d = this._data;
			var v = vector._data;


 			d[0] = t * v[0];
			d[1] = t * v[1];
			d[2] = t * v[2];
			d[3] = t * v[3];

		},

		applyMatrix4: function(matrix) {

			var d = this._data;
			var m = matrix._data;

			var x = d[0];
			var y = d[1];
			var z = d[2];
			var w = d[3];


			d[0] =  m[0] * x +  m[4] * y +  m[8] * z + m[12] * w;
			d[1] =  m[1] * x +  m[5] * y +  m[9] * z + m[13] * w;
			d[2] =  m[2] * x +  m[6] * y + m[10] * z + m[14] * w;
			d[3] =  m[3] * x +  m[7] * y + m[11] * z + m[15] * w;

		},

		applyQuaternion: function(quaternion) {

			var d = this._data;
			var q = quaternion._data;

			var vx = d[0];
			var vy = d[1];
			var vz = d[2];

			var qx = q[0];
			var qy = q[1];
			var qz = q[2];
			var qw = q[3];

			var ix =  qw * vx + qy * vz - qz * vy;
			var iy =  qw * vy + qz * vx - qx * vz;
			var iz =  qw * vz + qx * vy - qy * vx;
			var iw = -qx * vx - qy * vy - qz * vz;


			d[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
			d[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
			d[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;

		}

	};


	return Class;

});


lychee.define('lychee.net.Service').includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _services = {};

	var _plug_broadcast = function() {

		var id = this.id;
		if (id !== null) {

			var cache = _services[id] || null;
			if (cache === null) {
				cache = _services[id] = [];
			}


			var found = false;

			for (var c = 0, cl = cache.length; c < cl; c++) {

				if (cache[c] === this) {
					found = true;
					break;
				}

			}


			if (found === false) {
				cache.push(this);
			}

		}

	};

	var _unplug_broadcast = function() {

		this.setMulticast([]);


		var id = this.id;
		if (id !== null) {

			var cache = _services[id] || null;
			if (cache !== null) {

				for (var c = 0, cl = cache.length; c < cl; c++) {

					if (cache[c] === this) {
						cache.splice(c, 1);
						break;
					}

				}

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(id, tunnel, type) {

		id     = typeof id === 'string'                        ? id     : null;
		tunnel = lychee.interfaceof(lychee.net.Tunnel, tunnel) ? tunnel : null;
		type   = lychee.enumof(Class.TYPE, type)               ? type   : null;


		this.id     = id;
		this.tunnel = tunnel;
		this.type   = type;

		this.__multicast = [];


		if (lychee.debug === true) {

			if (this.id === null) {
				console.error('lychee.net.Service: Invalid (string) id. It has to be kept in sync with the lychee.net.Client and lychee.net.Remote instance.');
			}

			if (this.tunnel === null) {
				console.error('lychee.net.Service: Invalid (lychee.net.Tunnel) tunnel.');
			}

			if (this.type === null) {
				console.error('lychee.net.Service: Invalid (lychee.net.Service.TYPE) type.');
			}

		}


		lychee.event.Emitter.call(this);



		/*
		 * INITIALIZATION
		 */

		if (this.type === Class.TYPE.remote) {

			this.bind('plug',   _plug_broadcast,   this);
			this.bind('unplug', _unplug_broadcast, this);

		}

	};


	Class.TYPE = {
		// 'default': 0, (deactivated)
		'client': 1,
		'remote': 2
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.Service';

			var id     = null;
			var tunnel = null;
			var type   = null;
			var blob   = (data['blob'] || {});


			if (this.id !== null)   id   = this.id;
			if (this.type !== null) type = this.type;

			if (this.type === Class.TYPE.client) {
				tunnel = '#MAIN.client';
			} else {
				tunnel = null;
			}


			data['arguments'][0] = id;
			data['arguments'][1] = tunnel;
			data['arguments'][2] = type;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * SERVICE API
		 */

		multicast: function(data, service) {

			data    = data instanceof Object    ? data    : null;
			service = service instanceof Object ? service : null;


			if (data === null) {
				return false;
			}


			var type = this.type;
			if (type === Class.TYPE.client) {

				if (service === null) {

					service = {
						id:    this.id,
						event: 'multicast'
					};

				}


				if (this.tunnel !== null) {

					this.tunnel.send({
						data:    data,
						service: service
					}, {
						id:     this.id,
						method: 'multicast'
					});

					return true;

				}

			} else if (type === Class.TYPE.remote) {

				if (data.service !== null) {

					for (var m = 0, ml = this.__multicast.length; m < ml; m++) {

						var tunnel = this.__multicast[m];
						if (tunnel !== this.tunnel) {

							data.data.tid = this.tunnel.host + ':' + this.tunnel.port;

							tunnel.send(
								data.data,
								data.service
							);

						}

					}

					return true;

				}

			}


			return false;

		},

		broadcast: function(data, service) {

			data    = data instanceof Object    ? data    : null;
			service = service instanceof Object ? service : null;


			if (data === null || this.id === null) {
				return false;
			}


			var type = this.type;
			if (type === Class.TYPE.client) {

				if (service === null) {

					service = {
						id:    this.id,
						event: 'broadcast'
					};

				}


				if (this.tunnel !== null) {

					this.tunnel.send({
						data:    data,
						service: service
					}, {
						id:     this.id,
						method: 'broadcast'
					});

					return true;

				}

			} else if (type === Class.TYPE.remote) {

				if (data.service !== null) {

					var broadcast = _services[this.id] || null;
					if (broadcast !== null) {

						for (var b = 0, bl = broadcast.length; b < bl; b++) {

							var tunnel = broadcast[b].tunnel;
							if (tunnel !== this.tunnel) {

								data.data.tid = this.tunnel.host + ':' + this.tunnel.port;

								tunnel.send(
									data.data,
									data.service
								);

							}

						}

						return true;

					}

				}

			}


			return false;

		},

		report: function(message, blob) {

			message = typeof message === 'string' ? message : null;
			blob    = blob instanceof Object      ? blob    : null;


			if (message !== null) {

				if (this.tunnel !== null) {

					this.tunnel.send({
						message: message,
						blob:    blob
					}, {
						id:    this.id,
						event: 'error'
					});

				}

			}

		},

		setMulticast: function(multicast) {

			if (multicast instanceof Array) {

				var valid = true;
				var type  = this.type;

				for (var m = 0, ml = multicast.length; m < ml; m++) {

					if (lychee.interfaceof(lychee.net.Tunnel, multicast[m]) === false) {
						valid = false;
						break;
					}

				}

				this.__multicast = multicast;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.net.Tunnel').requires([
	'lychee.data.BENCODE',
	'lychee.data.BitON',
	'lychee.data.JSON',
	'lychee.net.Service'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	var _BitON = lychee.data.BitON;
	var _JSON  = lychee.data.JSON;



	/*
	 * HELPERS
	 */

	var _plug_service = function(id, service) {

		id = typeof id === 'string' ? id : null;

		if (id === null || service === null) {
			return;
		}


		var found = false;

		for (var w = 0, wl = this.__services.waiting.length; w < wl; w++) {

			if (this.__services.waiting[w] === service) {
				this.__services.waiting.splice(w, 1);
				found = true;
				wl--;
				w--;
			}

		}


		if (found === true) {

			this.__services.active.push(service);

			service.trigger('plug', []);

			if (lychee.debug === true) {
				console.log('lychee.net.Tunnel: Remote plugged in Service (' + id + ')');
			}

		}

	};

	var _unplug_service = function(id, service) {

		id = typeof id === 'string' ? id : null;

		if (id === null || service === null) {
			return;
		}


		var found = false;

		for (var w = 0, wl = this.__services.waiting.length; w < wl; w++) {

			if (this.__services.waiting[w] === service) {
				this.__services.waiting.splice(w, 1);
				found = true;
				wl--;
				w--;
			}

		}

		for (var a = 0, al = this.__services.active.length; a < al; a++) {

			if (this.__services.active[a] === service) {
				this.__services.active.splice(a, 1);
				found = true;
				al--;
				a--;
			}

		}


		if (found === true) {

			service.trigger('unplug', []);

			if (lychee.debug === true) {
				console.log('lychee.net.Tunnel: Remote unplugged Service (' + id + ')');
			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.codec     = lychee.interfaceof(_JSON, settings.codec) ? settings.codec : _JSON;
		this.port      = 1337;
		this.host      = 'localhost';
		this.binary    = false;
		this.reconnect = 0;


		this.__services  = {
			waiting: [],
			active:  []
		};


		this.setHost(settings.host);
		this.setPort(settings.port);
		this.setBinary(settings.binary);
		this.setReconnect(settings.reconnect);


		lychee.event.Emitter.call(this);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('disconnect', function() {

			for (var a = 0, al = this.__services.active.length; a < al; a++) {
				this.__services.active[a].trigger('unplug', []);
			}

			this.__services.active  = [];
			this.__services.waiting = [];


			if (this.reconnect > 0) {

				var that = this;

				setTimeout(function() {
					that.trigger('connect', []);
				}, this.reconnect);

			}

		}, this);

	};


	Class.STATUS = {
		1000: 'Normal Closure',
		1001: 'Going Away',
		1002: 'Protocol Error',
		1003: 'Unsupported Data',
		1005: 'No Status Received',
		1006: 'Abnormal Closure',
		1008: 'Policy Violation',
		1009: 'Message Too Big',
		1011: 'Internal Error',
		1012: 'Service Restart',
		1013: 'Try Again Later'
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.services instanceof Array) {

				for (var s = 0, sl = blob.services.length; s < sl; s++) {
					this.addService(lychee.deserialize(blob.services[s]));
				}

			}

		},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.Tunnel';

			var settings = {};
			var blob     = data['blob'] = (data['blob'] || {});


			if (this.codec !== _JSON)      settings.codec     = lychee.serialize(this.codec);
			if (this.host !== 'localhost') settings.host      = this.host;
			if (this.port !== 1337)        settings.port      = this.port;
			if (this.binary !== false)     settings.binary    = this.binary;
			if (this.reconnect !== 0)      settings.reconnect = this.reconnect;


			if (this.__services.active.length > 0) {

				blob.services = [];

				for (var a = 0, al = this.__services.active.length; a < al; a++) {

					var service = this.__services.active[a];

					blob.services.push(lychee.serialize(service));

				}

			}


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		send: function(data, service) {

			data    = data instanceof Object    ? data    : null;
			service = service instanceof Object ? service : null;


			if (data === null) {
				return false;
			}


			if (service !== null) {

				if (typeof service.id     === 'string') data._serviceId     = service.id;
				if (typeof service.event  === 'string') data._serviceEvent  = service.event;
				if (typeof service.method === 'string') data._serviceMethod = service.method;

			}


			var blob = this.codec.encode(data);
			if (blob !== null) {

				if (this.binary === true) {

					var bl    = blob.length;
					var bytes = new Uint8Array(bl);

					for (var b = 0; b < bl; b++) {
						bytes[b] = blob.charCodeAt(b);
					}

					blob = bytes.buffer;

				}


				this.trigger('send', [ blob, this.binary ]);

				return true;

			}


			return false;

		},

		receive: function(blob) {

			if (this.binary === true) {

				var bytes = new Uint8Array(blob);
				blob = String.fromCharCode.apply(null, bytes);

			}


			var data = this.codec.decode(blob);
			if (data instanceof Object && typeof data._serviceId === 'string') {

				var service = this.getService(data._serviceId);
				var event   = data._serviceEvent  || null;
				var method  = data._serviceMethod || null;


				if (method !== null) {

					if (method.charAt(0) === '@') {

						if (method === '@plug') {
							_plug_service.call(this,   data._serviceId, service);
						} else if (method === '@unplug') {
							_unplug_service.call(this, data._serviceId, service);
						}

					} else if (service !== null && typeof service[method] === 'function') {

						// Remove data frame service header
						delete data._serviceId;
						delete data._serviceMethod;

						service[method](data);

					}

				} else if (event !== null) {

					if (service !== null && typeof service.trigger === 'function') {

						// Remove data frame service header
						delete data._serviceId;
						delete data._serviceEvent;

						service.trigger(event, [ data ]);

					}

				}

			} else {

				this.trigger('receive', [ data ]);

			}


			return true;

		},

		setBinary: function(binary) {

			if (binary === true || binary === false) {

				this.binary = binary;

				return true;

			}


			return false;

		},

		setHost: function(host) {

			host = typeof host === 'string' ? host : null;


			if (host !== null) {

				this.host = host;

				return true;

			}


			return false;

		},

		setPort: function(port) {

			port = typeof port === 'number' ? (port | 0) : null;


			if (port !== null) {

				this.port = port;

				return true;

			}


			return false;

		},

		setReconnect: function(reconnect) {

			reconnect = typeof reconnect === 'number' ? (reconnect | 0) : null;


			if (reconnect !== null) {

				this.reconnect = reconnect;

				return true;

			}


			return false;

		},

		addService: function(service) {

			service = lychee.interfaceof(lychee.net.Service, service) ? service : null;


			if (service !== null) {

				var found = false;

				for (var w = 0, wl = this.__services.waiting.length; w < wl; w++) {

					if (this.__services.waiting[w] === service) {
						found = true;
						break;
					}

				}

				for (var a = 0, al = this.__services.active.length; a < al; a++) {

					if (this.__services.active[a] === service) {
						found = true;
						break;
					}

				}


				if (found === false) {

					this.__services.waiting.push(service);

					this.send({}, {
						id:     service.id,
						method: '@plug'
					});

				}


				return true;

			}


			return false;

		},

		getService: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				for (var w = 0, wl = this.__services.waiting.length; w < wl; w++) {

					var wservice = this.__services.waiting[w];
					if (wservice.id === id) {
						return wservice;
					}

				}

				for (var a = 0, al = this.__services.active.length; a < al; a++) {

					var aservice = this.__services.active[a];
					if (aservice.id === id) {
						return aservice;
					}

				}

			}


			return null;

		},

		removeService: function(service) {

			service = lychee.interfaceof(lychee.net.Service, service) ? service : null;


			if (service !== null) {

				var found = false;

				for (var w = 0, wl = this.__services.waiting.length; w < wl; w++) {

					if (this.__services.waiting[w] === service) {
						found = true;
						break;
					}

				}

				for (var a = 0, al = this.__services.active.length; a < al; a++) {

					if (this.__services.active[a] === service) {
						found = true;
						break;
					}

				}


				if (found === true) {

					this.send({}, {
						id:     service.id,
						method: '@unplug'
					});

				}


				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.net.client.Chat').includes([
	'lychee.net.Service'
]).exports(function(lychee, global, attachments) {

	var Class = function(id, client, data) {

		id = typeof id === 'string' ? id : 'chat';


		var settings = lychee.extend({}, data);


		this.room = null;
		this.user = null;


		this.setRoom(settings.room);
		this.setUser(settings.user);

		delete settings.room;
		delete settings.user;


		lychee.net.Service.call(this, id, client, lychee.net.Service.TYPE.client);

		settings = null;

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

		sync: function() {

			var user = this.user;
			var room = this.room;
			if (user !== null && room !== null) {

				if (this.tunnel !== null) {

					this.tunnel.send({
						user: user,
						room: room
					}, {
						id:    this.id,
						event: 'sync'
					});

				}

			}

		},

		message: function(message) {

			message = typeof message === 'string' ? message : null;


			if (message !== null) {

				var user = this.user;
				var room = this.room;
				if (user !== null && room !== null) {

					if (this.tunnel !== null) {

						this.tunnel.send({
							message: message,
							user:    user,
							room:    room
						}, {
							id:    this.id,
							event: 'message'
						});

					}

				}

			}

		},

		setRoom: function(room) {

			room = typeof room === 'number' ? room : null;


			if (room !== null) {

				this.room = room;
				this.sync();

				return true;

			}


			return false;

		},

		setUser: function(user) {

			user = typeof user === 'string' ? user : null;


			if (user !== null) {

				this.user = user;
				this.sync();

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.net.client.Controller').includes([
	'lychee.net.client.Session'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _generate_code = function(length) {

		length = typeof length === 'number' ? (length | 0) : 4;

		var charset = '0123456789';
		var code    = '';

		for (var i = 0; i < length; i++) {
			code += charset.charAt((Math.random() * charset.length) | 0);
		}

		return code;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(id, client, data) {

		id = typeof id === 'string' ? id : 'controller';


		var settings = lychee.extend({}, data);


		settings.autolock  = true;
		settings.autostart = true;
		settings.min       = 2;
		settings.max       = 2;
		settings.sid       = _generate_code(4);

		lychee.net.client.Session.call(this, id, client, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('start', _on_start, this);
		this.bind('stop',  _on_stop,  this);

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

		control: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

				this.multicast(data, {
					id:    this.id,
					event: 'control'
				});

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.net.client.Session').includes([
	'lychee.net.Service'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _id = 0;



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(id, client, data) {

		id = typeof id === 'string' ? id : 'session';


		var settings = lychee.extend({}, data);


		this.admin     = false;
		this.autoadmin = true;
		this.autolock  = true;
		this.autostart = true;
		this.sid       = 'session-' + _id++;
		this.tid       = null;
		this.min       = 2;
		this.max       = 4;


		this.setAutoadmin(settings.autoadmin);
		this.setAutolock(settings.autolock);
		this.setAutostart(settings.autostart);
		this.setSid(settings.sid);
		this.setMin(settings.min);
		this.setMax(settings.max);

		delete settings.autolock;
		delete settings.autostart;
		delete settings.sid;
		delete settings.min;
		delete settings.max;


		lychee.net.Service.call(this, id, client, lychee.net.Service.TYPE.client);



		/*
		 * INITIALIZATION
		 */

		this.bind('sync', function(data) {

			var type = data.type;
			if (type === 'update') {

				this.admin = data.admin;
				this.sid   = data.sid;
				this.min   = data.min;
				this.max   = data.max;

			}


			if (type === 'update' || type === 'start' || type === 'stop') {

				delete data.type;

				this.trigger(type, [ data ]);

			}

		}, this);


		if (lychee.debug === true) {

			this.bind('error', function(error) {
				console.error('lychee.net.client.Session: ' + error.message);
			}, this);

		}


		settings = null;

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

		join: function() {

			if (this.sid !== null) {

				if (this.tunnel !== null) {

					if (lychee.debug === true) {
						console.log('lychee.net.client.Session: Joining session "' + this.sid + '"');
					}


					this.tunnel.send({
						autoadmin: this.autoadmin,
						autolock:  this.autolock,
						autostart: this.autostart,
						sid:       this.sid,
						min:       this.min,
						max:       this.max
					}, {
						id:    this.id,
						event: 'join'
					});

				}

			}

		},

		start: function() {

			if (this.sid !== null) {

				if (this.tunnel !== null) {

					this.tunnel.send({
						sid: this.sid
					}, {
						id:    this.id,
						event: 'start'
					});

				}

			}

		},

		stop: function() {

			if (this.sid !== null) {

				if (this.tunnel !== null) {

					this.tunnel.send({
						sid: this.sid
					}, {
						id:    this.id,
						event: 'stop'
					});

				}

			}

		},

		leave: function() {

			if (this.sid !== null) {

				if (this.tunnel !== null) {

					if (lychee.debug === true) {
						console.log('lychee.net.client.Session: Leaving session "' + this.sid + '"');
					}


					this.tunnel.send({
						sid:   this.sid
					}, {
						id:    this.id,
						event: 'leave'
					});

				}

			}

		},

		setAutoadmin: function(autoadmin) {

			if (autoadmin === true || autoadmin === false) {

				this.autoadmin = autoadmin;

				return true;

			}


			return false;

		},

		setAutolock: function(autolock) {

			if (autolock === true || autolock === false) {

				this.autolock = autolock;

				return true;

			}


			return false;

		},

		setAutostart: function(autostart) {

			if (autostart === true || autostart === false) {

				this.autostart = autostart;

				return true;

			}


			return false;

		},

		setSid: function(sid) {

			sid = typeof sid === 'string' ? sid : null;


			if (sid !== null) {

				this.sid = sid;

				return true;

			}


			return false;

		},

		setMax: function(max) {

			max = typeof max === 'number' ? max : null;


			if (max !== null) {

				this.max = max;

				return true;

			}


			return false;

		},

		setMin: function(min) {

			min = typeof min === 'number' ? min : null;


			if (min !== null) {

				this.min = min;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.net.protocol.HTTP').exports(function(lychee, global, attachments) {



	/*
	 * HELPERS
	 */

	var _STATUS = {
		100: '100 Continue',
		200: '200 OK',
		206: '206 Partial Content',
		301: '301 Moved Permanently',
		302: '302 Found',
		304: '304 Not Modified',
		400: '400 Bad Request',
		401: '401 Unauthorized',
		403: '403 Forbidden',
		404: '404 Not Found',
		405: '405 Method Not Allowed',
		500: '500 Internal Server Error',
		501: '501 Not Implemented',
		502: '502 Bad Gateway',
		503: '503 Service Unavailable',
		504: '504 Gateway Timeout',
		505: '505 HTTP Version Not Supported'
	};

	var _encode_buffer = function(status, headers, data, binary) {

// TODO: Integrate binary support

		var type           = this.type;
		var buffer         = null;

		var status_length  = 0;
		var status_data    = null;
		var headers_length = 0;
		var headers_data   = null;
		var payload_length = data.length;
		var payload_data   = data;


		if (type === Class.TYPE.client) {

// TODO: Encode headers into request data for Client

		} else {

// TODO: Integrate headers.status via map for protocol data. status is a number here.

			if (typeof headers['Location'] === 'string') {
				status_data   = new Buffer('HTTP/1.1 ' + _STATUS[301], 'utf8');
				status_length = status_data.length;
			} else {
				status_data   = new Buffer('HTTP/1.1 ' + (_STATUS[status] || _STATUS[500]), 'utf8');
				status_length = status_data.length;
			}


			var tmp_headers = '\r\n';

			for (var key in headers) {
				tmp_headers += '' + key + ': ' + headers[key] + '\r\n';
			}

			tmp_headers += 'Content-Length: ' + payload_length + '\r\n';
//			tmp_headers += 'Connection: keep-alive\r\n';
			tmp_headers += '\r\n';


			headers_data   = new Buffer(tmp_headers, 'utf8');
			headers_length = headers_data.length;

		}


		buffer = new Buffer(status_length + headers_length + payload_length);

		status_data.copy(buffer, 0);
		headers_data.copy(buffer, status_length);
		payload_data.copy(buffer, status_length + headers_length);


		return buffer;

	};

	var _decode_buffer = function(buffer) {

		buffer = buffer.toString();


		var parsed_bytes   = -1;
		var type           = this.type;

		var headers_length = buffer.indexOf('\r\n\r\n');
		var headers_data   = buffer.substr(0, headers_length);
		var payload_data   = buffer.substr(headers_length);
		var payload_length = payload_data.length;


		parsed_bytes = headers_length + payload_length;


		var status  = 200;
		var headers = {};
		var payload = {};


		headers_data.split('\r\n').forEach(function(value) {

			if (value.indexOf(':') !== -1) {

				var tmp1 = value.split(':');
				var key  = tmp1.shift();
				var val  = tmp1.join(':');

				headers[key] = val.trim();

			} else if (value.split(' ')[0].match(/OPTIONS|GET|PUT|POST|DELETE/)){

				var tmp2   = value.split(' ');
				var method = tmp2[0].trim();
				var url    = tmp2[1].trim();

				status = 0;

				headers['method'] = method;
				headers['url']    = url;

			} else if (value.split(' ')[0].match(/([0-9]{3})/)) {

				status = parseInt(value.split(' ')[0].trim(), 10);

			}

		});


		var content_type = headers['Content-Type'] || 'text/plain';
		if (content_type.match(/text\//g)) {
			payload = buffer.toString().split('\r\n\r\n')[1];
		} else {
			payload = buffer.slice(buffer.indexOf('\r\n\r\n'));
		}


		if (Object.keys(headers).length > 0) {
			this.ondata(status, headers, payload);
		}


		return parsed_bytes;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(socket, type) {

		type = lychee.enumof(Class.TYPE, type) ? type : null;


		this.socket  = socket;
		this.type    = type;
		this.ondata  = function() {};
		this.onclose = function(err) {};


		this.__isClosed = false;



		if (lychee.debug === true) {

			if (this.type === null) {
				console.error('lychee.net.protocol.HTTP: Invalid (lychee.net.protocol.HTTP.TYPE) type.');
			}

		}



		/*
		 * INITIALIZATION
		 */

		var that = this;
		var temp = new Buffer(0);

		this.socket.on('data', function(data) {

			if (data.length > Class.FRAMESIZE) {

				that.close(Class.STATUS.bad_request);

			} else if (that.__isClosed === false) {

				var tmp = new Buffer(temp.length + data.length);
				temp.copy(tmp);
				data.copy(tmp, temp.length);
				temp = tmp;

				var parsed_bytes = _decode_buffer.call(that, temp);
				if (parsed_bytes !== -1) {

					tmp = new Buffer(temp.length - parsed_bytes);
					temp.copy(tmp, 0, parsed_bytes);
					temp = tmp;

				}

			}

		});

		this.socket.on('error', function() {
			that.close(Class.STATUS.bad_request);
		});

		this.socket.on('timeout', function() {
			that.close(Class.STATUS.request_timeout);
		});

		this.socket.on('end', function() {
			that.close(Class.STATUS.normal_closure);
		});

		this.socket.on('close', function() {
			that.close(Class.STATUS.normal_closure);
		});

	};


	// Class.FRAMESIZE = 32768; // 32kB
	Class.FRAMESIZE = 0x800000; // 8MiB


	Class.STATUS = {
		normal_closure:  200,
		redirect:        302,
		not_modified:    304,
		bad_request:     400,
		request_timeout: 408
	};


	Class.TYPE = {
		// 'default': 0, (deactivated)
		'client': 1,
		'remote': 2
	};


	Class.prototype = {

		send: function(status, headers, payload, binary) {

			status  = typeof status === 'number' ? status  : 0;
			headers = headers instanceof Object  ? headers : {};
			binary  = binary === true;


			var blob = null;

			if (typeof payload === 'string') {
				blob = new Buffer(payload, 'utf8');
			} else if (payload instanceof Buffer) {
				blob = payload;
			}


			if (blob !== null) {

				if (this.__isClosed === false) {

					var buffer = _encode_buffer.call(this, status, headers, blob, binary);
					if (buffer !== null) {

						this.socket.write(buffer);

						delete buffer;
						delete blob;

						return true;

					}

				}

			}


			return false;

		},

		close: function(status) {

			status = typeof status === 'number' ? status : Class.STATUS.normal_closure;


			if (this.__isClosed === false) {

				this.socket.end();
				this.socket.destroy();


				this.__isClosed = true;
				this.onclose(status);


				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.net.protocol.WS').exports(function(lychee, global) {

	/*
	 * HELPERS
	 */

	/*
	 * WebSocket Framing Protocol
	 *
	 *  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
	 * +-+-+-+-+-------+-+-------------+-------------------------------+
	 * |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
	 * |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
	 * |N|V|V|V|       |S|             |   (if payload len==126/127)   |
	 * | |1|2|3|       |K|             |                               |
	 * +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
	 * |     Extended payload length continued, if payload len == 127  |
	 * + - - - - - - - - - - - - - - - +-------------------------------+
	 * |                               |Masking-key, if MASK set to 1  |
	 * +-------------------------------+-------------------------------+
	 * | Masking-key (continued)       |          Payload Data         |
	 * +-------------------------------- - - - - - - - - - - - - - - - +
	 * :                     Payload Data continued ...                :
	 * + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
	 * |                     Payload Data continued ...                |
	 * +---------------------------------------------------------------+
	 *
	 */

	var _fragment = {
		operator: 0x00,
		payload:  new Buffer(0)
	};

	var _encode_buffer = function(data, binary) {

		var type           = this.type;
		var buffer         = null;

		var payload_length = data.length;
		var mask           = false;
		var mask_data      = null;
		var payload_data   = null;


		if (type === Class.TYPE.client) {

			mask      = true;
			mask_data = new Buffer(4);

			mask_data[0] = (Math.random() * 0xff) | 0;
			mask_data[1] = (Math.random() * 0xff) | 0;
			mask_data[2] = (Math.random() * 0xff) | 0;
			mask_data[3] = (Math.random() * 0xff) | 0;

			payload_data = data.map(function(value, index) {
				return value ^ mask_data[index % 4];
			});

		} else {

			mask         = false;
			mask_data    = new Buffer(4);
			payload_data = data.map(function(value) {
				return value;
			});

		}


		// 64 Bit Extended Payload Length
		if (payload_length > 0xffff) {

			var lo = payload_length | 0;
			var hi = (payload_length - lo) / 4294967296;

			buffer = new Buffer((mask === true ? 14 : 10) + payload_length);

			buffer[0] = 128 + (binary === true ? 0x02 : 0x01);
			buffer[1] = (mask === true ? 128 : 0) + 127;

			buffer[2] = (hi >> 24) & 0xff;
			buffer[3] = (hi >> 16) & 0xff;
			buffer[4] = (hi >>  8) & 0xff;
			buffer[5] = (hi >>  0) & 0xff;

			buffer[6] = (lo >> 24) & 0xff;
			buffer[7] = (lo >> 16) & 0xff;
			buffer[8] = (lo >>  8) & 0xff;
			buffer[9] = (lo >>  0) & 0xff;


			if (mask === true) {

				mask_data.copy(buffer, 10);
				payload_data.copy(buffer, 14);

			} else {

				payload_data.copy(buffer, 10);

			}


		// 16 Bit Extended Payload Length
		} else if (payload_length > 125) {

			buffer = new Buffer((mask === true ? 8 : 4) + payload_length);

			buffer[0] = 128 + (binary === true ? 0x02 : 0x01);
			buffer[1] = (mask === true ? 128 : 0) + 126;

			buffer[2] = (payload_length >> 8) & 0xff;
			buffer[3] = (payload_length >> 0) & 0xff;


			if (mask === true) {

				mask_data.copy(buffer, 4);
				payload_data.copy(buffer, 8);

			} else {

				payload_data.copy(buffer, 4);

			}


		// 7 Bit Payload Length
		} else {

			buffer = new Buffer((mask === true ? 6 : 2) + payload_length);

			buffer[0] = 128 + (binary === true ? 0x02 : 0x01);
			buffer[1] = (mask === true ? 128 : 0) + payload_length;


			if (mask === true) {

				mask_data.copy(buffer, 2);
				payload_data.copy(buffer, 6);

			} else {

				payload_data.copy(buffer, 2);

			}

		}


		return buffer;

	};

	var _decode_buffer = function(buffer) {

		var parsed_bytes = -1;
		var type         = this.type;


		var fin            = (buffer[0] & 128) === 128;
		// var rsv1        = (buffer[0] & 64) === 64;
		// var rsv2        = (buffer[0] & 32) === 32;
		// var rsv3        = (buffer[0] & 16) === 16;
		var operator       = buffer[0] & 15;
		var mask           = (buffer[1] & 128) === 128;
		var mask_data      = new Buffer(4);
		var payload_length = buffer[1] & 127;
		var payload_data   = null;

		if (payload_length <= 125) {

			if (mask === true) {
				mask_data    = buffer.slice(2, 6);
				payload_data = buffer.slice(6, 6 + payload_length);
				parsed_bytes = 6 + payload_length;
			} else {
				mask_data    = null;
				payload_data = buffer.slice(2, 2 + payload_length);
				parsed_bytes = 2 + payload_length;
			}

		} else if (payload_length === 126) {

			payload_length = (buffer[2] << 8) + buffer[3];

			if (mask === true) {
				mask_data    = buffer.slice(4, 8);
				payload_data = buffer.slice(8, 8 + payload_length);
				parsed_bytes = 8 + payload_length;
			} else {
				mask_data    = null;
				payload_data = buffer.slice(4, 4 + payload_length);
				parsed_bytes = 4 + payload_length;
			}

		} else if (payload_length === 127) {

			var hi = (buffer[2] << 24) + (buffer[3] << 16) + (buffer[4] << 8) + buffer[5];
			var lo = (buffer[6] << 24) + (buffer[7] << 16) + (buffer[8] << 8) + buffer[9];

			payload_length = (hi * 4294967296) + lo;

			if (mask === true) {
				mask_data    = buffer.slice(10, 14);
				payload_data = buffer.slice(14, 14 + payload_length);
				parsed_bytes = 14 + payload_length;
			} else {
				mask_data    = null;
				payload_data = buffer.slice(10, 10 + payload_length);
				parsed_bytes = 10 + payload_length;
			}

		}


		if (mask_data !== null) {

			payload_data = payload_data.map(function(value, index) {
				return value ^ mask_data[index % 4];
			});

		}


		// 0: Continuation Frame (Fragmentation)
		if (operator === 0x00) {

			if (fin === true) {

				if (_fragment.operator === 0x01) {
					this.ondata(_fragment.payload.toString('utf8'));
				} else if (_fragment.operator === 0x02) {
					this.ondata(_fragment.payload.toString('binary'));
				}


				_fragment.operator = 0x00;
				_fragment.payload  = new Buffer(0);

			} else if (payload_data !== null) {

				var payload = new Buffer(_fragment.payload.length + payload_length);

				_fragment.payload.copy(payload, 0);
				payload_data.copy(payload, _fragment.payload.length);

				_fragment.payload = payload;

			}


		// 1: Text Frame
		} else if (operator === 0x01) {

			if (fin === true) {

				this.ondata(payload_data.toString('utf8'));

			} else {

				_fragment.operator = operator;
				_fragment.payload  = payload_data;

			}


		// 2: Binary Frame
		} else if (operator === 0x02) {

			if (fin === true) {

				this.ondata(payload_data.toString('binary'));

			} else {

				_fragment.operator = operator;
				_fragment.payload  = payload_data;

			}


		// 8: Connection Close
		} else if (operator === 0x08) {

			this.close(Class.STATUS.normal_closure);


		// 9: Ping Frame
		} else if (operator === 0x09) {

			this.__lastping = Date.now();

			if (type === Class.TYPE.remote) {
				this.pong();
			}


		// 10: Pong Frame
		} else if (operator === 0x0a) {

			this.__lastpong = Date.now();

			if (type === Class.TYPE.client) {
				_reset_ping.call(this);
			}


		// 3-7: Reserved Non-Control Frames, 11-15: Reserved Control Frames
		} else {

			this.close(Class.STATUS.protocol_error);

		}


		return parsed_bytes;

	};

	var _reset_ping = function() {

		var type = this.type;
		if (type === Class.TYPE.client) {

			if (this.__interval !== null) {
				clearInterval(this.__interval);
			}


			var that = this;

			this.__interval = setInterval(function() {
				that.ping();
			}, 60000);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(socket, type) {

		type = lychee.enumof(Class.TYPE, type) ? type : null;


		this.socket  = socket;
		this.type    = type;
		this.ondata  = function() {};
		this.onclose = function(err) {};


		this.__lastping = 0;
		this.__lastpong = 0;
		this.__interval = null;
		this.__isClosed = false;



		if (lychee.debug === true) {

			if (this.type === null) {
				console.error('lychee.net.protocol.WS: Invalid (lychee.net.protocol.WS.TYPE) type.');
			}

		}



		/*
		 * INITIALIZATION
		 */

		var that = this;
		var temp = new Buffer(0);

		this.socket.on('data', function(data) {

			if (data.length > Class.FRAMESIZE) {

				that.close(Class.STATUS.message_too_big);

			} else if (that.__isClosed === false) {

				// Use a temporary Buffer for easier parsing
				var tmp = new Buffer(temp.length + data.length);
				temp.copy(tmp);
				data.copy(tmp, temp.length);
				temp = tmp;

				var parsed_bytes = _decode_buffer.call(that, temp);
				if (parsed_bytes !== -1) {

					tmp = new Buffer(temp.length - parsed_bytes);
					temp.copy(tmp, 0, parsed_bytes);
					temp = tmp;

				}

			}

		});

		this.socket.on('error', function() {
			that.close(Class.STATUS.protocol_error);
		});

		this.socket.on('timeout', function() {
			that.close(Class.STATUS.going_away);
		});

		this.socket.on('end', function() {
			that.close(Class.STATUS.normal_closure);
		});

		this.socket.on('close', function() {
			that.close(Class.STATUS.normal_closure);
		});


		_reset_ping.call(this);

	};


	// Class.FRAMESIZE = 32768; // 32kB
	Class.FRAMESIZE = 0x800000; // 8MiB


	Class.STATUS = {

		// IESG_HYBI
		normal_closure:     1000,
		going_away:         1001,
		protocol_error:     1002,
		unsupported_data:   1003,
		no_status_received: 1005,
		abnormal_closure:   1006,
		invalid_payload:    1007,
		policy_violation:   1008,
		message_too_big:    1009,
		missing_extension:  1010,
		internal_error:     1011,

		// IESG_HYBI Current
		service_restart:    1012,
		service_overload:   1013,

		// IESG_HYBI
		tls_handshake:      1015

	};


	Class.TYPE = {
		// 'default': 0, (deactivated)
		'client': 1,
		'remote': 2
	};


	Class.prototype = {

		ping: function() {

			var type = this.type;
			if (type === Class.TYPE.client) {

				if (Date.now() > this.__lastping + 10000) {

					var buffer = new Buffer(6);

					// FIN, Ping
					// Masked, 0 payload

					buffer[0] = 128 + 0x09;
					buffer[1] = 128 + 0x00;

					buffer[2] = (Math.random() * 0xff) | 0;
					buffer[3] = (Math.random() * 0xff) | 0;
					buffer[4] = (Math.random() * 0xff) | 0;
					buffer[5] = (Math.random() * 0xff) | 0;


					return this.socket.write(buffer);


				}

			}


			return false;

		},

		pong: function() {

			var type = this.type;
			if (type === Class.TYPE.remote) {

				if (Date.now() > this.__lastping) {

					var buffer = new Buffer(2);

					// FIN, Pong
					// Unmasked, 0 payload

					buffer[0] = 128 + 0x0a;
					buffer[1] =   0 + 0x00;


					return this.socket.write(buffer);

				}

			}


			return false;

		},

		send: function(payload, binary) {

			binary = binary === true;


			var blob = null;

			if (typeof payload === 'string') {
				blob = new Buffer(payload, 'utf8');
			} else if (payload instanceof Buffer) {
				blob = payload;
			}


			if (blob !== null) {

				if (this.__isClosed === false) {

					var buffer = _encode_buffer.call(this, blob, binary);
					if (buffer !== null) {

						this.socket.write(buffer);

						delete buffer;
						delete blob;

						return true;

					}

				}

			}


			return false;

		},

		close: function(status) {

			status = typeof status === 'number' ? status : Class.STATUS.normal_closure;


			if (this.__isClosed === false) {

				var buffer = new Buffer(4);

				buffer[0]  = 128 + 0x08;
				buffer[1]  =   0 + 0x02;

				buffer.write(String.fromCharCode((status >> 8) & 0xff) + String.fromCharCode((status >> 0) & 0xff), 2, 'binary');


				this.socket.write(buffer);
				this.socket.end();
				this.socket.destroy();


				this.__isClosed = true;
				this.onclose(status);


				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.net.remote.Chat').includes([
	'lychee.net.Service'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _cache = {};

	var _on_sync = function(data) {

		var user = data.user || null;
		var room = data.room || null;
		if (user !== null && room !== null) {


			var sync = false;


			// 1. Create Room
			var cache = _cache[room] || null;
			if (cache === null) {

				cache = _cache[room] = {
					messages: [],
					users:    [ user ],
					tunnels:  [ this.tunnel ]
				};

			// 2. Join Room
			} else {

				if (cache.users.indexOf(user) === -1) {
					cache.users.push(user);
					cache.tunnels.push(this.tunnel);
				}


				_sync_room.call(this, cache);

			}


			// 3. Leave Room (only one at a time allowed)
			for (var rId in _cache) {

				if (rId === room) continue;

				var index = _cache[rId].users.indexOf(user);
				if (index !== -1) {
					_cache[rId].users.splice(index, 1);
					_cache[rId].tunnels.splice(index, 1);
					_sync_room.call(this, _cache[rId]);
				}

			}

		}

	};

	var _on_message = function(data) {

		var user    = data.user || null;
		var room    = data.room || null;
		var message = data.message || null;
		if (user !== null && room !== null && message !== null) {

			var cache = _cache[room] || null;
			if (cache !== null) {

				var limit = this.limit;
				if (cache.messages.length > limit - 1) {
					cache.messages.splice(0, 1);
				}

				cache.messages.push({
					user:    user,
					message: message
				});


				_sync_room.call(this, cache);

			}

		}

	};

	var _sync_room = function(room) {

		var data = {
			messages: room.messages,
			users:    room.users
		};


		for (var t = 0, tl = room.tunnels.length; t < tl; t++) {

			var tunnel = room.tunnels[t];
			if (tunnel !== null) {

				tunnel.send(data, {
					id:    this.id,
					event: 'sync'
				});

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(id, remote, data) {

		id = typeof id === 'string' ? id : 'chat';


		var settings = lychee.extend({}, data);


		this.limit = 128;


		this.setLimit(settings.limit);

		delete settings.limit;


		lychee.net.Service.call(this, id, remote, lychee.net.Service.TYPE.remote);



		/*
		 * INITIALIZATION
		 */

		this.bind('sync',    _on_sync,    this);
		this.bind('message', _on_message, this);


		settings = null;

	};


	Class.prototype = {

		setLimit: function(limit) {

			limit = typeof limit === 'number' ? limit : null;


			if (limit !== null) {

				this.limit = limit;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.net.remote.Controller').includes([
	'lychee.net.remote.Session'
]).exports(function(lychee, global, attachments) {

	var Class = function(id, remote, data) {

		id = typeof id === 'string' ? id : 'controller';


		var settings = lychee.extend({}, data);


		lychee.net.remote.Session.call(this, id, remote, settings);

		settings = null;

	};

});


lychee.define('lychee.net.remote.Session').includes([
	'lychee.net.Service'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _cache = {};

	var _on_join = function(data) {

		var sid = data.sid || null;
		if (sid !== null) {

			// 1. Create Session
			var session = _cache[sid] || null;
			if (session === null) {

				var autoadmin = data.autoadmin === true      ? true     : false;
				var autolock  = data.autolock === false      ? false    : true;
				var autostart = data.autostart === false     ? false    : true;
				var min       = typeof data.min === 'number' ? data.min : 2;
				var max       = typeof data.max === 'number' ? data.max : 4;

				session = _cache[sid] = {
					autolock:  autolock,
					autostart: autostart,
					sid:       sid,
					min:       min,
					max:       max,
					admin:     autoadmin === true ? this.tunnel : null,
					tunnels:   [],
					active:    false
				};


				session.tunnels.push(this.tunnel);
				this.setMulticast(session.tunnels);

				_sync_session.call(this, session);

			// 2. Join Session
			} else {

				var index = session.tunnels.indexOf(this.tunnel);
				if (index === -1) {

					if (session.active === false && session.tunnels.length < session.max) {

						session.tunnels.push(this.tunnel);
						this.setMulticast(session.tunnels);

						_sync_session.call(this, session);

					} else if (session.active === true && session.autolock === false && session.tunnels.length < session.max) {

						session.tunnels.push(this.tunnel);
						this.setMulticast(session.tunnels);

						_sync_session.call(this, session);

					} else if (session.active === true) {

						this.report('Session is active', {
							sid: sid,
							min: session.min,
							max: session.max
						});

					} else {

						this.report('Session is full', {
							sid: sid,
							min: session.min,
							max: session.max
						});

					}

				}

			}

		}

	};

	var _on_leave = function(data) {

		var sid = data.sid || null;
		if (sid !== null) {

			// 1. Leave Session
			var session = _cache[sid] || null;
			if (session !== null) {

				var index = session.tunnels.indexOf(this.tunnel);
				if (index !== -1) {

					session.tunnels.splice(index, 1);

					this.setSession(null);
					this.setMulticast([]);

				}


				if (session.tunnels.length === 0) {

					delete _cache[sid];

				} else {

					_sync_session.call(this, session);

				}

			}

		}

	};

	var _on_start = function(data) {

		var sid = data.sid || null;
		if (sid !== null) {

			var session = _cache[sid] || null;
			if (session !== null) {

				if (session.admin === null || session.admin === this.tunnel) {

					if (session.active === false) {

						session.autostart = true;

						_sync_session.call(this, session);

					}

				}

			}

		}

	};

	var _on_stop = function(data) {

		var sid = data.sid || null;
		if (sid !== null) {

			var session = _cache[sid] || null;
			if (session !== null) {

				if (session.active === true) {
					_sync_session.call(this, session);
				}

			}

		}

	};

	var _sync_session = function(session) {

		var sid = session.sid;
		if (sid !== null) {

			var min = session.min;
			var max = session.max;

			var tunnels = [];
			for (var t = 0, tl = session.tunnels.length; t < tl; t++) {
				tunnels.push(session.tunnels[t].host + ':' + session.tunnels[t].port);
			}


			var data = {
				admin:   false,
				type:    'update',
				sid:     sid,
				min:     min,
				max:     max,
				tid:     'localhost:1337',
				tunnels: tunnels
			};


			// 1. Inactive Session
			if (session.active === false) {

				// 1.1 Session Start
				if (session.autostart === true && tunnels.length >= session.min) {

					data.type      = 'start';
					session.active = true;

					if (lychee.debug === true) {
						console.log('lychee.net.remote.Session: Starting session "' + sid + '"');
					}


				// 1.2 Session Update
				} else {

					data.type = 'update';

					if (lychee.debug === true) {
						console.log('lychee.net.remote.Session: Updating session "' + sid + '" (' + session.tunnels.length + ' of ' + session.max + ' tunnels)');
					}

				}


			// 2. Active Session
			} else {

				// 2.1 Session Stop
				if (tunnels.length < session.min) {

					data.type      = 'stop';
					session.active = false;

					if (lychee.debug === true) {
						console.log('lychee.net.remote.Session: Stopping session "' + sid + '"');
					}


				// 2.2 Session Update
				} else {

					data.type = 'update';

					if (lychee.debug === true) {
						console.log('lychee.net.remote.Session: Updating session "' + sid + '" (' + session.tunnels.length + ' of ' + session.max + ' tunnels)');
					}

				}

			}


			this.setSession(session);


			for (var st = 0, stl = session.tunnels.length; st < stl; st++) {

				var tunnel = session.tunnels[st];
				if (tunnel !== null) {

					if (session.admin !== null) {
						data.admin = session.admin === tunnel;
					} else {
						data.admin = true;
					}

					data.tid = tunnel.host + ':' + tunnel.port;


					tunnel.send(data, {
						id:    this.id,
						event: 'sync'
					});

				}

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(id, remote, data) {

		id = typeof id === 'string' ? id : 'session';


		var settings = lychee.extend({}, data);


		this.session = null;


		lychee.net.Service.call(this, id, remote, lychee.net.Service.TYPE.remote);



		/*
		 * INITIALIZATION
		 */

		this.bind('join',  _on_join,  this);
		this.bind('leave', _on_leave, this);
		this.bind('start', _on_start, this);
		this.bind('stop',  _on_stop,  this);


		this.bind('unplug', function() {

			for (var sid in _cache) {

				var session = _cache[sid];
				var index   = session.tunnels.indexOf(this.tunnel);
				if (index !== -1) {
					_on_leave.call(this, session);
				}

			}

		}, this);


		settings = null;

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

		setSession: function(session) {

			if (session === null || (session instanceof Object && session.sid !== null)) {

				this.session = session;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.ui.Button').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.label = null;
		this.font  = null;

		this.__pulse = {
			active:   false,
			duration: 250,
			start:    null,
			alpha:    0.0
		};


		this.setFont(settings.font);
		this.setLabel(settings.label);

		delete settings.font;
		delete settings.label;


		settings.width  = typeof settings.width === 'number'  ? settings.width  : 128;
		settings.height = typeof settings.height === 'number' ? settings.height : 64;
		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;


		lychee.ui.Entity.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function() {}, this);

		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {
			this.setState('default');
		}, this);


		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			var font = lychee.deserialize(blob.font);
			if (font !== null) {
				this.setFont(font);
			}

		},

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lychee.ui.Button';

			var settings = data['arguments'][0];
			var blob     = (data['blob'] || {});


			if (this.label !== null) settings.label = this.label;


			if (this.font !== null) blob.font = lychee.serialize(this.font);


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},

		update: function(clock, delta) {

			var pulse = this.__pulse;
			if (pulse.active === true) {

				if (pulse.start === null) {
					pulse.start = clock;
				}

				var t = (clock - pulse.start) / pulse.duration;
				if (t <= 1) {
					pulse.alpha = (1 - t) * 0.6;
				} else {
					pulse.alpha  = 0.0;
					pulse.active = false;
				}

			}


			lychee.ui.Entity.prototype.update.call(this, clock, delta);

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var position = this.position;

			var x = position.x + offsetX;
			var y = position.y + offsetY;

			var color  = this.state === 'active' ? '#33b5e5' : '#0099cc';
			var color2 = this.state === 'active' ? '#0099cc' : '#575757';


			var hwidth  = (this.width  - 2) / 2;
			var hheight = (this.height - 2) / 2;



			renderer.drawBox(
				x - hwidth,
				y - hheight,
				x + hwidth,
				y + hheight,
				color2,
				false,
				2
			);


			var pulse = this.__pulse;
			if (pulse.active === true) {

				renderer.setAlpha(pulse.alpha);

				renderer.drawBox(
					x - hwidth,
					y - hheight,
					x + hwidth,
					y + hheight,
					color,
					true
				);

				renderer.setAlpha(1.0);

			}


			var label = this.label;
			var font  = this.font;

			if (label !== null && font !== null) {

				renderer.drawText(
					x,
					y,
					label,
					font,
					true
				);

			}

		},



		/*
		 * CUSTOM API
		 */

		setFont: function(font) {

			font = font instanceof Font ? font : null;


			if (font !== null) {

				this.font = font;

				return true;

			}


			return false;

		},

		setLabel: function(label) {

			label = typeof label === 'string' ? label : null;


			if (label !== null) {

				this.label = label;

				return true;

			}


			return false;

		},

		setState: function(id) {

			var result = lychee.ui.Entity.prototype.setState.call(this, id);
			if (result === true) {

				var pulse = this.__pulse;


				if (id === 'active') {

					pulse.alpha  = 0.6;
					pulse.start  = null;
					pulse.active = true;

				}


				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.ui.Entity').includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _default_state  = 'default';
	var _default_states = { 'default': null, 'active': null };



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.width  = typeof settings.width  === 'number' ? settings.width  : 0;
		this.height = typeof settings.height === 'number' ? settings.height : 0;
		this.depth  = 0;
		this.radius = typeof settings.radius === 'number' ? settings.radius : 0;

		this.alpha     = 1;
		this.collision = 1; // Used for event flow, NOT modifiable
		this.effects   = [];
		this.shape     = Class.SHAPE.rectangle;
		this.state     = _default_state;
		this.position  = { x: 0, y: 0 };
		this.visible   = true;

		this.__states  = _default_states;


		if (settings.states instanceof Object) {

			this.__states = { 'default': null, 'active': null };

			for (var id in settings.states) {

				if (settings.states.hasOwnProperty(id)) {
					this.__states[id] = settings.states[id];
				}

			}

		}


		this.setAlpha(settings.alpha);
		this.setShape(settings.shape);
		this.setState(settings.state);
		this.setPosition(settings.position);
		this.setVisible(settings.visible);


		lychee.event.Emitter.call(this);

		settings = null;

	};


	// Same ENUM values as lychee.game.Entity
	Class.SHAPE = {
		circle:    0,
		rectangle: 1,
		sphere:    2,
		cuboid:    3
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) { },

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.ui.Entity';

			var settings = {};
			var blob     = (data['blob'] || {});


			if (this.width  !== 0) settings.width  = this.width;
			if (this.height !== 0) settings.height = this.height;
			if (this.radius !== 0) settings.radius = this.radius;

			if (this.alpha !== 1)                     settings.alpha   = this.alpha;
			if (this.shape !== Class.SHAPE.rectangle) settings.shape   = this.shape;
			if (this.state !== _default_state)        settings.state   = this.state;
			if (this.__states !== _default_states)    settings.states  = this.__states;
			if (this.visible !== true)                settings.visible = this.visible;


			if (this.position.x !== 0 || this.position.y !== 0) {

				settings.position = {};

				if (this.position.x !== 0) settings.position.x = this.position.x;
				if (this.position.y !== 0) settings.position.y = this.position.y;

			}


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},

		// HINT: Renderer skips if no render() method exists
		// render: function(renderer, offsetX, offsetY) {},

		update: function(clock, delta) {

			var effects = this.effects;
			for (var e = 0, el = this.effects.length; e < el; e++) {

				var effect = this.effects[e];
				if (effect.update(this, clock, delta) === false) {
					this.removeEffect(effect);
					el--;
					e--;
				}

			}

		},



		/*
		 * CUSTOM API
		 */

		isAtPosition: function(position) {

			if (position instanceof Object) {

				if (typeof position.x === 'number' && typeof position.y === 'number') {

					var ax = position.x;
					var ay = position.y;
					var bx = this.position.x;
					var by = this.position.y;


					var shape = this.shape;
					if (shape === Class.SHAPE.circle) {

						var dist = Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
						if (dist < this.radius) {
							return true;
						}

					} else if (shape === Class.SHAPE.rectangle) {

						var hwidth  = this.width  / 2;
						var hheight = this.height / 2;
						var colX    = (ax >= bx - hwidth)  && (ax <= bx + hwidth);
						var colY    = (ay >= by - hheight) && (ay <= by + hheight);


						return colX && colY;

					}

				}

			}


			return false;

		},

		setAlpha: function(alpha) {

			alpha = (typeof alpha === 'number' && alpha >= 0 && alpha <= 1) ? alpha : null;


			if (alpha !== null) {

				this.alpha = alpha;

				return true;

			}


			return false;

		},

		addEffect: function(effect) {

			effect = effect instanceof Object && typeof effect.update === 'function' ? effect : null;


			if (effect !== null) {

				var index = this.effects.indexOf(effect);
				if (index === -1) {

					this.effects.push(effect);

					return true;

				}

			}


			return false;

		},

		removeEffect: function(effect) {

			effect = effect instanceof Object && typeof effect.update === 'function' ? effect : null;


			if (effect !== null) {

				var index = this.effects.indexOf(effect);
				if (index !== -1) {

					this.effects.splice(index, 1);

					return true;

				}

			}


			return false;

		},

		removeEffects: function() {

			var effects = this.effects;

			for (var e = 0, el = effects.length; e < el; e++) {

				effects[e].update(this, Infinity, 0);
				this.removeEffect(effects[e]);

				el--;
				e--;

			}


			return true;

		},

		setPosition: function(position) {

			if (position instanceof Object) {

				this.position.x = typeof position.x === 'number' ? position.x : this.position.x;
				this.position.y = typeof position.y === 'number' ? position.y : this.position.y;

				return true;

			}


			return false;

		},

		setShape: function(shape) {

			if (lychee.enumof(Class.SHAPE, shape)) {

				this.shape = shape;

				return true;

			}


			return false;

		},

		getStateMap: function() {
			return this.__states[this.state];
		},

		setState: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.__states[id] !== undefined) {

				this.state = id;

				return true;

			}


			return false;

		},

		setVisible: function(visible) {

			if (visible === true || visible === false) {

				this.visible = visible;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.ui.Input').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.font  = null;
		this.max   = Infinity;
		this.min   = 0;
		this.type  = Class.TYPE.text;
		this.value = null;

		this.__buffer  = null;
		this.__drag    = null;
		this.__pulse   = {
			active:   false,
			duration: 250,
			start:    null,
			alpha:    0.0
		};
		this.__value   = '';
		this.__isDirty = false;


		this.setFont(settings.font);
		this.setMax(settings.max);
		this.setMin(settings.min);
		this.setType(settings.type);
		this.setValue(settings.value);

		delete settings.font;
		delete settings.max;
		delete settings.min;
		delete settings.type;
		delete settings.value;


		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;
		settings.width  = typeof settings.width === 'number'  ? settings.width  : 128;
		settings.height = typeof settings.height === 'number' ? settings.height : 64;


		lychee.ui.Entity.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function() {}, this);

		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {

			var oldvalue = this.value;
			var newvalue = null;


			var type = this.type;
			if (type === Class.TYPE.text) {

				newvalue = this.__value;

				if (newvalue !== oldvalue) {

					if (this.setValue(newvalue) === false) {
						this.setValue(newvalue.substr(0, this.max));
					}

				}

			} else if (type === Class.TYPE.number) {

				newvalue = parseInt(this.__value, 10);

				if (newvalue !== oldvalue && !isNaN(newvalue)) {

					if (this.setValue(newvalue) === false) {

						if (newvalue > this.max) {
							this.value     = this.max;
							this.__value   = this.max + '';
							this.__isDirty = true;
						} else if (newvalue < this.min) {
							this.value     = this.min;
 							this.__value   = this.min + '';
							this.__isDirty = true;
						}

					}

				}

			}


			if (oldvalue !== this.value) {
				this.trigger('change', [ this.value ]);
			}


			this.setState('default');

		}, this);

		this.bind('key', function(key, name, delta) {

			if (key === 'backspace') {

				var raw = this.__value.substr(0, this.__value.length - 1);

				if (type === Class.TYPE.text) {

					this.__value = raw;

				} else if (type === Class.TYPE.number) {

					var bsvalue = parseInt(raw, 10);
					if (!isNaN(bsvalue)) {
						this.__value = bsvalue + '';
					} else {
						this.__value = '';
					}

				}

				this.__isDirty = true;

				return;

			} else if (key === 'enter') {

				this.trigger('blur', []);

				return;

			} else if (key === 'space') {

				key = ' ';

			}



			if (key.length === 1) {

				var type = this.type;
				if (type === Class.TYPE.text && key.match(/([A-Za-z0-9\s-_]+)/)) {

					this.__value = this.__value + key;

				} else if (type === Class.TYPE.number && key.match(/[0-9-+]/)) {

					var value = parseInt('' + this.__value + key, 10);
					if (!isNaN(value)) {
						this.__value = value + '';
					} else {
						this.__value = '';
					}

				}

				this.__isDirty = true;

			}

		}, this);


		settings = null;

	};


	Class.TYPE = {
		text:   0,
		number: 1
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			var font = lychee.deserialize(blob.font);
			if (font !== null) {
				this.setFont(font);
			}

		},

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lyche.ui.Input';

			var settings = data['arguments'][0];
			var blob     = (data['blob'] || {});


			if (this.max !== Infinity)         settings.max   = this.max;
			if (this.min !== 0)                settings.min   = this.min;
			if (this.type !== Class.TYPE.text) settings.type  = this.type;
			if (this.value !== null)           settings.value = this.value;


			if (this.font !== null) blob.font = lychee.serialize(this.font);


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},

		update: function(clock, delta) {

			var pulse = this.__pulse;
			if (pulse.active === true) {

				if (pulse.start === null) {
					pulse.start = clock;
				}

				var t = (clock - pulse.start) / pulse.duration;
				if (t <= 1) {
					pulse.alpha = (1 - t) * 0.6;
				} else {
					pulse.alpha  = 0.0;
					pulse.active = false;
				}

			}


			lychee.ui.Entity.prototype.update.call(this, clock, delta);

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var buffer = this.__buffer;
			if (buffer === null) {

				buffer = renderer.createBuffer(
					this.width - 24,
					this.height
				);

				this.__buffer = buffer;

			}


			if (this.__isDirty === true) {

				renderer.clear(buffer);
				renderer.setBuffer(buffer);


				var font = this.font;
				if (font !== null) {

					var text = this.__value;
					var dim  = font.measure(text);

					if (dim.width > buffer.width) {

						renderer.drawText(
							buffer.width - dim.width,
							dim.height / 2,
							text,
							font,
							false
						);

					} else {

						renderer.drawText(
							0,
							dim.height / 2,
							text,
							font,
							false
						);

					}

				}


				renderer.setBuffer(null);


				this.__isDirty = false;

			}


			var position = this.position;

			var x = position.x + offsetX;
			var y = position.y + offsetY;

			var color  = this.state === 'active' ? '#33b5e5' : '#0099cc';
			var color2 = this.state === 'active' ? '#0099cc' : '#575757';


			var hwidth  = this.width / 2;
			var hheight = this.height / 2;

			var x1 = x - hwidth;
			var y1 = y - hheight;
			var x2 = x + hwidth;
			var y2 = y + hheight;


			renderer.drawLine(
				x1,
				y2 - 7,
				x1,
				y2,
				color,
				2
			);

			renderer.drawLine(
				x1,
				y2,
				x2,
				y2,
				color,
				2
			);

			renderer.drawLine(
				x2,
				y2 - 7,
				x2,
				y2,
				color,
				2
			);



			renderer.drawBuffer(
				x1 + 14,
				y1,
				this.__buffer
			);

		},



		/*
		 * CUSTOM API
		 */

		setFont: function(font) {

			font = font instanceof Font ? font : null;


			if (font !== null) {

				this.font = font;

				return true;

			}


			return false;

		},

		setMax: function(max) {

			max = typeof max === 'number' ? max : null;


			if (max !== null) {

				this.max = max;

				return true;

			}


			return false;

		},

		setMin: function(min) {

			min = typeof min === 'number' ? min : null;


			if (min !== null) {

				this.min = min;

				return true;

			}


			return false;

		},

		setType: function(type) {

			if (lychee.enumof(Class.TYPE, type)) {

				this.type = type;

				return true;

			}


			return false;

		},

		setValue: function(value) {

			var type = this.type;


			// 0: Text
			if (type === Class.TYPE.text && typeof value === 'string') {

				if (this.value !== value && value.length >= this.min && value.length <= this.max) {

					this.value = value;

					this.__value   = value + '';
					this.__isDirty = true;

					return true;

				}


			// 1. Number
			} else if (type === Class.TYPE.number && typeof value === 'number' && !isNaN(value)) {

				if (this.value !== value && value >= this.min && value <= this.max) {

					this.value = value;

					this.__value   = value + '';
					this.__isDirty = true;

					return true;

				}

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.ui.Joystick').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	/*
	 * HELPERS
	 */

	var _refresh_drag = function(x, y) {

		var indexx = x / (this.width / 2);
		var indexy = y / (this.height / 2);

		var value = this.value;

		value.x = indexx;
		value.y = indexy;


		var result = this.setValue(value);
		if (result === true) {
			this.trigger('change', [ value ]);
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.value = { x: 0, y: 0 };

		this.__drag  = { x: 0, y: 0 };
		this.__pulse = {
			active:   false,
			duration: 250,
			start:    null,
			alpha:    0.0
		};


		this.setValue(settings.value);

		delete settings.value;


		settings.width  = typeof settings.width === 'number'  ? settings.width  : 128;
		settings.height = typeof settings.height === 'number' ? settings.height : 128;
		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;


		lychee.ui.Entity.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function(id, position, delta) {
			_refresh_drag.call(this, position.x, position.y);
		}, this);

		this.bind('swipe', function(id, state, position, delta, swipe) {

			if (state === 'end') {
				_refresh_drag.call(this, 0, 0);
			} else {
				_refresh_drag.call(this, position.x, position.y);
			}

		}, this);

		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {
			this.setState('default');
		}, this);


		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lyche.ui.Joystick';

			var settings = data['arguments'][0];


			if (this.value !== 0) settings.value = this.value;


			return data;

		},

		update: function(clock, delta) {

			var pulse = this.__pulse;
			if (pulse.active === true) {

				if (pulse.start === null) {
					pulse.start = clock;
				}

				var t = (clock - pulse.start) / pulse.duration;
				if (t <= 1) {
					pulse.alpha = (1 - t) * 0.6;
				} else {
					pulse.alpha  = 0.0;
					pulse.active = false;
				}

			}


			lychee.ui.Entity.prototype.update.call(this, clock, delta);

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var position = this.position;

			var x = position.x + offsetX;
			var y = position.y + offsetY;


			var color  = this.state === 'active' ? '#33b5e5' : '#0099cc';
			var color2 = this.state === 'active' ? '#0099cc' : '#575757';
			var alpha  = this.state === 'active' ? 0.6       : 0.3;


			var drag    = this.__drag;
			var hwidth  = this.width / 2;
			var hheight = this.height / 2;

			var x1 = x - hwidth;
			var y1 = y - hheight;
			var x2 = x + hwidth;
			var y2 = y + hheight;


			renderer.drawBox(
				x1,
				y1,
				x2,
				y2,
				color2,
				false,
				2
			);

			renderer.drawLine(
				x,
				y1,
				x,
				y2,
				color2,
				4
			);


			renderer.drawLine(
				x1,
				y,
				x2,
				y,
				color2,
				4
			);


			renderer.drawTriangle(
				x1,
				y1 + 16,
				x1,
				y1,
				x1 + 16,
				y1,
				color2,
				true
			);


			renderer.drawTriangle(
				x2 - 16,
				y1,
				x2,
				y1,
				x2,
				y1 + 16,
				color2,
				true
			);

			renderer.drawTriangle(
				x2,
				y2 - 16,
				x2,
				y2,
				x2 - 16,
				y2,
				color2,
				true
			);


			renderer.drawTriangle(
				x1 + 16,
				y2,
				x1,
				y2,
				x1,
				y2 - 16,
				color2,
				true
			);


			var pulse = this.__pulse;
			if (pulse.active === true) {

				renderer.setAlpha(pulse.alpha);

				renderer.drawBox(
					x1,
					y1,
					x2,
					y2,
	   				color,
					true
				);

				renderer.setAlpha(1.0);

			}


			renderer.setAlpha(alpha);

			renderer.drawLine(
				x,
				y,
				x + drag.x,
				y + drag.y,
				color,
				4
			);

			renderer.drawCircle(
				x + drag.x,
				y + drag.y,
				14,
				color,
				true
			);

			renderer.setAlpha(1.0);


			renderer.drawCircle(
				x + drag.x,
				y + drag.y,
				4,
				color,
				true
			);

		},



		/*
		 * CUSTOM API
		 */

		setState: function(id) {

			var result = lychee.ui.Entity.prototype.setState.call(this, id);
			if (result === true) {

				var pulse = this.__pulse;


				if (id === 'active') {

					pulse.alpha  = 0.6;
					pulse.start  = null;
					pulse.active = true;

				}


				return true;

			}


			return false;

		},

		setValue: function(value) {

			if (value instanceof Object) {

				this.value.x = typeof value.x === 'number' ? value.x : this.value.x;
				this.value.y = typeof value.y === 'number' ? value.y : this.value.y;


				var val = 0;

				val = this.value.x;
				val = val >= -1.0 ? val : -1.0;
				val = val <=  1.0 ? val :  1.0;
				this.value.x = val;

				val = this.value.y;
				val = val >= -1.0 ? val : -1.0;
				val = val <=  1.0 ? val :  1.0;
				this.value.y = val;


				var hwidth  = this.width / 2;
				var hheight = this.height / 2;

				this.__drag.x = this.value.x * hwidth;
				this.__drag.y = this.value.y * hheight;


				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.ui.Label').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.label = null;
		this.font  = null;


		this.setFont(settings.font);
		this.setLabel(settings.label);

		delete settings.font;
		delete settings.label;


		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;
		settings.width  = this.width;
		settings.height = this.height;


		lychee.ui.Entity.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			var font = lychee.deserialize(blob.font);
			if (font !== null) {
				this.setFont(font);
			}

		},

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lychee.ui.Label';

			var settings = data['arguments'][0];
			var blob     = (data['blob'] || {});


			if (this.label !== null) settings.label = this.label;


			if (this.font !== null) blob.font = lychee.serialize(this.font);


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var position = this.position;

			var x = position.x + offsetX;
			var y = position.y + offsetY;


			var label = this.label;
			var font  = this.font;

			if (label !== null && font !== null) {

				renderer.drawText(
					x,
					y,
					label,
					font,
					true
				);

			}

		},



		/*
		 * CUSTOM API
		 */

		setFont: function(font) {

			font = font instanceof Font ? font : null;


			if (font !== null) {

				this.font = font;

				// refresh the layout
				if (this.label !== null) {
					this.setLabel(this.label);
				}

				return true;

			}


			return false;

		},

		setLabel: function(label) {

			label = typeof label === 'string' ? label : null;


			if (label !== null) {

				var font = this.font;
				if (font !== null) {

					var dim = font.measure(label);

					this.width  = dim.realwidth;
					this.height = dim.realheight;

				}

				this.label = label;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.ui.Layer').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	/*
	 * HELPERS
	 */

	var _validate_entity = function(entity) {

		if (entity instanceof Object) {

			if (typeof entity.update === 'function' && typeof entity.render === 'function' && typeof entity.shape === 'number') {

				if (typeof entity.isAtPosition === 'function') {
					return true;
				}

			}

		}


		return false;

	};

	var _process_touch = function(id, position, delta) {

		var triggered = null;
		var args      = [ id, {
			x: position.x - this.offset.x,
			y: position.y - this.offset.y
		}, delta ];


		var entity = this.getEntity(null, args[1]);
		if (entity !== null) {

			if (typeof entity.trigger === 'function') {

				args[1].x -= entity.position.x;
				args[1].y -= entity.position.y;

				var result = entity.trigger('touch', args);
				if (result === true) {
					triggered = entity;
				} else if (result !== false) {
					triggered = result;
				}

			}

		}


		return triggered;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.entities = [];
		this.offset   = { x: 0, y: 0 };
		this.visible  = true;

		this.__map     = {};
		this.__reshape = true;


		this.setEntities(settings.entities);
		this.setOffset(settings.offset);
		this.setReshape(settings.reshape);
		this.setVisible(settings.visible);

		delete settings.entities;
		delete settings.offset;
		delete settings.reshape;
		delete settings.visible;


		settings.shape = lychee.ui.Entity.SHAPE.rectangle;


		lychee.ui.Entity.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('touch', _process_touch, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			var entities = [];
			for (var be = 0, bel = blob.entities.length; be < bel; be++) {
				entities.push(lychee.deserialize(blob.entities[be]));
			}

			var map = {};
			for (var bid in blob.map) {

				var index = blob.map[bid];
				if (typeof index === 'number') {
					map[bid] = index;
				}

			}

			for (var e = 0, el = entities.length; e < el; e++) {

				var id = null;
				for (var mid in map) {

					if (map[mid] === e) {
						id = mid;
					}

				}


				if (id !== null) {
					this.setEntity(id, entities[e]);
				} else {
					this.addEntity(entities[e]);
				}

			}

		},

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lychee.ui.Layer';

			var settings = data['arguments'][0];
			var blob     = (data['blob'] || {});


			if (this.offset.x !== 0 || this.offset.y !== 0) {

				settings.offset = {};

				if (this.offset.x !== 0) settings.offset.x = this.offset.x;
				if (this.offset.y !== 0) settings.offset.y = this.offset.y;

			}

			if (this.__reshape !== true) settings.reshape = this.__reshape;
			if (this.visible !== true)   settings.visible = this.visible;


			var entities = [];

			if (this.entities.length > 0) {

				blob.entities = [];

				for (var e = 0, el = this.entities.length; e < el; e++) {

					var entity = this.entities[e];

					blob.entities.push(lychee.serialize(entity));
					entities.push(entity);

				}

			}


			if (Object.keys(this.__map).length > 0) {

				blob.map = {};

				for (var id in this.__map) {

					var index = entities.indexOf(this.__map[id]);
					if (index !== -1) {
						blob.map[id] = index;
					}

				}

			}


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},

		update: function(clock, delta) {

			lychee.ui.Entity.prototype.update.call(this, clock, delta);


			var entities = this.entities;
			for (var e = 0, el = entities.length; e < el; e++) {
				entities[e].update(clock, delta);
			}

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var position = this.position;
			var offset   = this.offset;


			var ox = position.x + offsetX + offset.x;
			var oy = position.y + offsetY + offset.y;


			var entities = this.entities;
			for (var e = 0, el = entities.length; e < el; e++) {

				entities[e].render(
					renderer,
					ox,
					oy
				);

			}


			if (lychee.debug === true) {

				ox = position.x + offsetX;
				oy = position.y + offsetY;


				var hwidth   = this.width  / 2;
				var hheight  = this.height / 2;


				renderer.drawBox(
					ox - hwidth,
					oy - hheight,
					ox + hwidth,
					oy + hheight,
					'#ff00ff',
					false,
					1
				);

			}

		},



		/*
		 * CUSTOM API
		 */

		reshape: function() {

			if (this.__reshape === true) {

				var hwidth  = this.width  / 2;
				var hheight = this.height / 2;

				for (var e = 0, el = this.entities.length; e < el; e++) {

					var entity = this.entities[e];
					if (typeof entity.reshape === 'function') {
						entity.reshape();
					}


					var boundx = Math.abs(entity.position.x + this.offset.x);
					var boundy = Math.abs(entity.position.y + this.offset.y);

					if (entity.shape === lychee.ui.Entity.SHAPE.circle) {
						boundx += entity.radius;
						boundy += entity.radius;
					} else if (entity.shape === lychee.ui.Entity.SHAPE.rectangle) {
						boundx += entity.width  / 2;
						boundy += entity.height / 2;
					}

					hwidth  = Math.max(hwidth,  boundx);
					hheight = Math.max(hheight, boundy);

				}

				this.width  = hwidth  * 2;
				this.height = hheight * 2;

			}

		},

		addEntity: function(entity) {

			entity = _validate_entity(entity) === true ? entity : null;


			if (entity !== null) {

				var index = this.entities.indexOf(entity);
				if (index === -1) {

					this.entities.push(entity);
					this.reshape();

					return true;

				}

			}


			return false;

		},

		setEntity: function(id, entity) {

			id     = typeof id === 'string'            ? id     : null;
			entity = _validate_entity(entity) === true ? entity : null;


			if (id !== null && entity !== null && this.__map[id] === undefined) {

				this.__map[id] = entity;

				var result = this.addEntity(entity);
				if (result === true) {
					return true;
				} else {
					delete this.__map[id];
				}

			}


			return false;

		},

		getEntity: function(id, position) {

			id        = typeof id === 'string'    ? id       : null;
			position = position instanceof Object ? position : null;


			var found = null;


			if (id !== null) {

				if (this.__map[id] !== undefined) {
					found = this.__map[id];
				}

			} else if (position !== null) {

				if (typeof position.x === 'number' && typeof position.y === 'number') {

					for (var e = this.entities.length - 1; e >= 0; e--) {

						var entity = this.entities[e];
						if (entity.visible === false) continue;

						if (entity.isAtPosition(position) === true) {
							found = entity;
							break;
						}

					}

				}

			}


			return found;

		},

		removeEntity: function(entity) {

			entity = _validate_entity(entity) === true ? entity : null;


			if (entity !== null) {

				var found = false;

				for (var e = 0, el = this.entities.length; e < el; e++) {

					if (this.entities[e] === entity) {
						this.entities.splice(e, 1);
						found = true;
						el--;
						e--;
					}

				}


				for (var id in this.__map) {

					if (this.__map[id] === entity) {
						delete this.__map[id];
						found = true;
					}

				}


				if (found === true) {
					this.reshape();
				}


				return found;

			}


			return false;

		},

		setEntities: function(entities) {

			var all = true;

			if (entities instanceof Array) {

				this.entities = [];

				for (var e = 0, el = entities.length; e < el; e++) {

					var result = this.addEntity(entities[e]);
					if (result === false) {
						all = false;
					}

				}

			}


			return all;

		},

		removeEntities: function() {

			var entities = this.entities;

			for (var e = 0, el = entities.length; e < el; e++) {

				this.removeEntity(entities[e]);

				el--;
				e--;

			}

			return true;

		},

		setOffset: function(offset) {

			if (offset instanceof Object) {

				this.offset.x = typeof offset.x === 'number' ? offset.x : this.offset.x;
				this.offset.y = typeof offset.y === 'number' ? offset.y : this.offset.y;

				this.reshape();

				return true;

			}


			return false;

		},

		setReshape: function(reshape) {

			if (reshape === true || reshape === false) {

				this.__reshape = reshape;

				return true;

			}


			return false;

		},

		setVisible: function(visible) {

			if (visible === true || visible === false) {

				this.visible = visible;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.ui.Select').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.font    = null;
		this.options = [];
		this.value   = '';

		this.__pulse = {
			active:   false,
			duration: 250,
			start:    null,
			alpha:    0.0,
			height:   { from: 0, to: 0 },
			position: { from: 0, to: 0 }
		};


		this.setFont(settings.font);
		this.setOptions(settings.options);
		this.setValue(settings.value);

		delete settings.font;
		delete settings.options;
		delete settings.value;


		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;
		settings.width  = typeof settings.width === 'number'  ? settings.width  : 128;
		settings.height = typeof settings.height === 'number' ? settings.height : 64;


		lychee.ui.Entity.call(this, settings);


		if (this.value === '') {
			this.setValue(this.options[0] || null);
		}



		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function(id, position, delta) {

			if (this.options.length === 0) return;


			if (this.state === 'active') {

				var index = -1;

				var size = this.height / (1 + this.options.length);
				var pos  = (position.y + this.height / 2 - size);
				if (pos > 0) {
					index = (pos / size) | 0;
				}


				if (index >= 0) {

					var value = this.options[index] || null;
					if (value !== null) {

						if (value !== this.value) {

							var result = this.setValue(value);
							if (result === true) {
								this.trigger('change', [ this.value ]);
							}

						}

					}

				}

			}

		}, this);


		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {
			this.setState('default');
		}, this);


		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			var font = lychee.deserialize(blob.font);
			if (font !== null) {
				this.setFont(font);
			}

		},

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lyche.ui.Select';

			var settings = data['arguments'][0];
			var blob     = (data['blob'] || {});


			if (this.options.length !== 0) settings.options = [].slice.call(this.options, 0);
			if (this.value !== '')         settings.value   = this.value;


			if (this.font !== null) blob.font = lychee.serialize(this.font);


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},

		update: function(clock, delta) {

			var pulse = this.__pulse;
			if (pulse.active === true) {

				if (pulse.start === null) {
					pulse.start = clock;
				}

				var t = (clock - pulse.start) / pulse.duration;
				if (t <= 1) {

					pulse.alpha = (1 - t) * 0.6;

					var height   = pulse.height;
					var position = pulse.position;

					this.height     = height.from   + t * (height.to - height.from);
					this.position.y = position.from + t * (position.to - position.from);

				} else {

					pulse.alpha  = 0.0;
					pulse.active = false;

					this.height     = pulse.height.to;
					this.position.y = pulse.position.to;

				}

			}


			lychee.ui.Entity.prototype.update.call(this, clock, delta);

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var position = this.position;

			var x = position.x + offsetX;
			var y = position.y + offsetY;

			var color  = this.state === 'active' ? '#33b5e5' : '#0099cc';
			var color2 = this.state === 'active' ? '#0099cc' : '#575757';


			var hwidth  = (this.width  - 2) / 2;
			var hheight = (this.height - 2) / 2;


			renderer.drawBox(
				x - hwidth,
				y - hheight,
				x + hwidth,
				y + hheight,
				color2,
				false,
				2
			);

			renderer.drawLine(
				x - hwidth,
				y + hheight,
				x + hwidth,
				y + hheight,
				color2,
				2
			);

			renderer.drawTriangle(
				x + hwidth - 14,
				y + hheight,
				x + hwidth,
				y + hheight - 14,
				x + hwidth,
				y + hheight,
				color2,
				true
			);


			var pulse = this.__pulse;
			if (pulse.active === true) {

				renderer.setAlpha(pulse.alpha);

				renderer.drawBox(
					x - hwidth,
					y - hheight,
					x + hwidth,
					y + hheight,
					color,
					true
				);

				renderer.setAlpha(1.0);

			}



			var font  = this.font;
			var state = this.state;


			if (state === 'default') {

				if (font !== null) {

					renderer.drawText(
						x,
						y,
						this.value,
						font,
						true
					);

				}

			} else if (state === 'active') {

				var elh = this.height / (1 + this.options.length);
				var y1  = y - this.height / 2;


				if (font !== null) {

					renderer.setAlpha(0.3);

					renderer.drawText(
						x,
						y1 + elh / 2,
						this.value,
						font,
						true
					);

					renderer.setAlpha(1.0);


					var options = this.options;
					for (var o = 0, ol = options.length; o < ol; o++) {

						if (options[o] === this.value) {

							renderer.setAlpha(0.6);

							renderer.drawBox(
								x  - hwidth,
								y1 + (o + 1) * elh,
								x  + hwidth,
								y1 + (o + 1) * elh + elh,
								color,
								true
							);

							renderer.setAlpha(1.0);

						}

						renderer.drawText(
							x,
							y1 + (o + 1) * elh + elh / 2,
							options[o],
							font,
							true
						);

					}

				}

			}

		},



		/*
		 * CUSTOM ENTITY API
		 */

		setState: function(id) {

			var result = lychee.ui.Entity.prototype.setState.call(this, id);
			if (result === true) {

				var pulse = this.__pulse;


				var size = 0;
				var ol   = 1 + this.options.length;


				if (id === 'default') {

					size = this.height / ol;


					pulse.alpha  = 0.0;
					pulse.start  = null;
					pulse.active = true;

					pulse.position.from = this.position.y;
					pulse.position.to   = this.position.y - (ol - 1) * size / 2;
					pulse.height.from   = this.height;
					pulse.height.to     = size;

				} else if (id === 'active') {

					size = this.height;


					pulse.alpha  = 0.6;
					pulse.start  = null;
					pulse.active = true;

					pulse.position.from = this.position.y;
					pulse.position.to   = this.position.y + (ol - 1) * size / 2;
					pulse.height.from   = this.height;
					pulse.height.to     = ol * size;

				}

			}


			return result;

		},



		/*
		 * CUSTOM API
		 */

		setFont: function(font) {

			font = font instanceof Font ? font : null;


			if (font !== null) {

				this.font = font;

				return true;

			}


			return false;

		},

		setOptions: function(options) {

			options = options instanceof Array ? options : null;


			if (options !== null) {

				this.options = options.map(function(option) {
					return '' + option;
				});

				return true;

			}


			return false;

		},

		setValue: function(value) {

			value = typeof value === 'string' ? value : null;


			if (value !== null) {

				if (this.options.indexOf(value) !== -1) {

					this.value = value;

					return true;

				}

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.ui.Slider').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	/*
	 * HELPERS
	 */

	var _refresh_drag = function(x, y) {

		var type   = this.type;
		var width  = this.width;
		var height = this.height;
		var index  = 0;


		if (type === Class.TYPE.horizontal) {
			index = Math.max(0.0, Math.min(1.0,     (x + width  / 2) / width));
		} else if (type === Class.TYPE.vertical) {
			index = Math.max(0.0, Math.min(1.0, 1 - (y + height / 2) / height));
		}


		var range = this.range;
		var value = index * (range.to - range.from);

		if (range.from < 0) {
			value += range.from;
		}

		value = ((value / range.delta) | 0) * range.delta;


		var result = this.setValue(value);
		if (result === true) {
			this.trigger('change', [ value ]);
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.range = { from: 0, to: 1, delta: 0.001 };
		this.type  = Class.TYPE.horizontal;
		this.value = 0;

		this.__drag = { x: 0, y: 0 };
		this.__pulse = {
			active:   false,
			duration: 250,
			start:    null,
			alpha:    0.0
		};


		this.setRange(settings.range);
		this.setType(settings.type);
		this.setValue(settings.value);

		delete settings.range;
		delete settings.type;
		delete settings.value;


		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;
		settings.width  = typeof settings.width === 'number'  ? settings.width  : 128;
		settings.height = typeof settings.height === 'number' ? settings.height : 128;


		lychee.ui.Entity.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function(id, position, delta) {
			_refresh_drag.call(this, position.x, position.y);
		}, this);

		this.bind('swipe', function(id, state, position, delta, swipe) {
			_refresh_drag.call(this, position.x, position.y);
		}, this);

		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {
			this.setState('default');
		}, this);


		// This fixes the width/height dependency problem for the drag
		this.setValue(this.value);


		settings = null;

	};


	Class.TYPE = {
		horizontal: 0,
		vertical:   1
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) { },

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lyche.ui.Slider';

			var settings = data['arguments'][0];


			if (this.type !== Class.TYPE.horizontal) settings.type   = this.type;
			if (this.value !== 0)                    settings.value  = this.value;

			if (this.range.from !== 0 || this.range.to !== 1 || this.range.delta !== 0.001) {

				settings.range = {};

				if (this.range.from !== 0)      settings.range.from  = this.range.from;
				if (this.range.to !== 1)        settings.range.to    = this.range.to;
				if (this.range.delta !== 0.001) settings.range.delta = this.range.delta;

			}


			return data;

		},

		update: function(clock, delta) {

			var pulse = this.__pulse;
			if (pulse.active === true) {

				if (pulse.start === null) {
					pulse.start = clock;
				}

				var t = (clock - pulse.start) / pulse.duration;
				if (t <= 1) {
					pulse.alpha = (1 - t) * 0.6;
				} else {
					pulse.alpha  = 0.0;
					pulse.active = false;
				}

			}


			lychee.ui.Entity.prototype.update.call(this, clock, delta);

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var position = this.position;

			var x = position.x + offsetX;
			var y = position.y + offsetY;

			var color  = this.state === 'active' ? '#33b5e5' : '#0099cc';
			var color2 = this.state === 'active' ? '#0099cc' : '#575757';
			var alpha  = this.state === 'active' ? 0.6       : 0.3;


			var drag    = this.__drag;
			var pulse   = this.__pulse;
			var hwidth  = this.width / 2;
			var hheight = this.height / 2;

			var x1 = x - hwidth;
			var y1 = y - hheight;
			var x2 = x + hwidth;
			var y2 = y + hheight;


			var type = this.type;
			if (type === Class.TYPE.horizontal) {

				renderer.drawLine(
					x1,
					y,
					x + drag.x,
					y,
					color2,
					2
				);

				renderer.drawLine(
					x + drag.x,
					y,
					x2,
					y,
					'#575757',
					2
				);


				if (pulse.active === true) {

					renderer.setAlpha(pulse.alpha);

					renderer.drawTriangle(
						x1,
						y,
						x + drag.x,
						y - 14,
						x + drag.x,
						y + 14,
						color,
						true
					);

					renderer.setAlpha(1.0);

				}

			} else if (type === Class.TYPE.vertical) {

				renderer.drawLine(
					x,
					y2,
					x,
					y + drag.y,
					color2,
					2
				);

				renderer.drawLine(
					x,
					y + drag.y,
					x,
					y1,
					'#575757',
					2
				);


				if (pulse.active === true) {

					renderer.setAlpha(pulse.alpha);

					renderer.drawTriangle(
						x,
						y2,
						x - 14,
						y + drag.y,
						x + 14,
						y + drag.y,
						color,
						true
					);

					renderer.setAlpha(1.0);

				}

			}


			renderer.setAlpha(alpha);

			renderer.drawCircle(
				x + drag.x,
				y + drag.y,
				14,
				color,
				true
			);

			renderer.setAlpha(1.0);


			renderer.drawCircle(
				x + drag.x,
				y + drag.y,
				4,
				color,
				true
			);

		},



		/*
		 * CUSTOM API
		 */

		setRange: function(range) {

			if (range instanceof Object) {

				this.range.from  = typeof range.from === 'number'  ? range.from  : this.range.from;
				this.range.to    = typeof range.to === 'number'    ? range.to    : this.range.to;
				this.range.delta = typeof range.delta === 'number' ? range.delta : this.range.delta;

				return true;

			}


			return true;

		},

		setState: function(id) {

			var result = lychee.ui.Entity.prototype.setState.call(this, id);
			if (result === true) {

				var pulse = this.__pulse;


				if (id === 'active') {

					pulse.alpha  = 0.6;
					pulse.start  = null;
					pulse.active = true;

				}


				return true;

			}


			return false;

		},

		setType: function(type) {

			if (lychee.enumof(Class.TYPE, type)) {

				this.type = type;

				return true;

			}


			return false;

		},

		setValue: function(value) {

			value = typeof value === 'number' ? value : null;


			if (value !== null) {

				var range = this.range;
				var index = (value - range.from) / (range.to - range.from);

				var type   = this.type;
				var width  = this.width  || 0;
				var height = this.height || 0;


				if (type === Class.TYPE.horizontal) {

					this.__drag.x = width * index - (width / 2);
					this.__drag.y = 0;

				} else if (type === Class.TYPE.vertical) {

					this.__drag.x = 0;
					this.__drag.y = height * (1 - index) - (height / 2);

				}


				this.value = value;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.ui.Sprite').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.frame   = 0;
		this.texture = null;

		this.__animation = {
			active:   false,
			start:    null,
			frames:   0,
			duration: 0,
			loop:     false
		};
		this.__map = {};


		this.setAnimation(settings.animation);
		this.setTexture(settings.texture);
		this.setMap(settings.map);

		delete settings.texture;
		delete settings.map;


		lychee.ui.Entity.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			var texture = lychee.deserialize(blob.texture);
			if (texture !== null) {
				this.setTexture(texture);
			}

		},

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lyche.ui.Sprite';

			var settings = data['arguments'][0];
			var blob     = (data['blob'] || {});


			if (this.__animation.active === true) {

				settings.animation = {};

				if (this.__animation.duration !== 1000) settings.animation.duration = this.__animation.duration;
				if (this.frame !== 0)                   settings.animation.frame    = this.frame;
				if (this.__animation.frames !== 25)     settings.animation.frames   = this.__animation.frames;
				if (this.__animation.loop !== false)    settings.animation.loop     = this.__animation.loop;

			}

			if (Object.keys(this.__map).length > 0) {

				settings.map = {};


				for (var stateId in this.__map) {

					settings.map[stateId] = [];


					var frames = this.__map[stateId];
					for (var f = 0, fl = frames.length; f < fl; f++) {

						var frame  = frames[f];
						var sframe = {};

						if (frame.x !== 0) sframe.x = frame.x;
						if (frame.y !== 0) sframe.y = frame.y;
						if (frame.w !== 0) sframe.w = frame.w;
						if (frame.h !== 0) sframe.h = frame.h;


						settings.map[stateId].push(sframe);

					}

				}

			}


			if (this.texture !== null) blob.texture = lychee.serialize(this.texture);


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var texture = this.texture;
			if (texture !== null) {

				var alpha    = this.alpha;
				var position = this.position;

				var x1 = 0;
				var y1 = 0;


				if (alpha !== 1) {
					renderer.setAlpha(alpha);
				}


				var map = this.getMap();
				if (map !== null) {

					x1 = position.x + offsetX - map.w / 2;
					y1 = position.y + offsetY - map.h / 2;

					renderer.drawSprite(
						x1,
						y1,
						texture,
						map
					);

				} else {

					var hw = (this.width / 2)  || this.radius;
					var hh = (this.height / 2) || this.radius;

					x1 = position.x + offsetX - hw;
					y1 = position.y + offsetY - hh;

					renderer.drawSprite(
						x1,
						y1,
						texture
					);

				}


				if (alpha !== 1) {
					renderer.setAlpha(1);
				}

			}

		},

		update: function(clock, delta) {

			lychee.ui.Entity.prototype.update.call(this, clock, delta);


			var animation = this.__animation;

			// 1. Animation (Interpolation)
			if (animation.active === true) {

				if (animation.start !== null) {

					var t = (clock - animation.start) / animation.duration;
					if (t <= 1) {

						this.frame = Math.max(0, Math.ceil(t * animation.frames) - 1);

					} else {

						if (animation.loop === true) {
							animation.start = clock;
						} else {
							this.frame = animation.frames - 1;
							animation.active = false;
						}

					}

				}

			}

		},



		/*
		 * CUSTOM API
		 */

		setAnimation: function(settings) {

			if (settings instanceof Object) {

				var duration = typeof settings.duration === 'number' ? settings.duration : 1000;
				var frame    = typeof settings.frame === 'number'    ? settings.frame    : 0;
				var frames   = typeof settings.frames === 'number'   ? settings.frames   : 25;
				var loop     = settings.loop === true;


				var animation = this.__animation;

				animation.start    = null;
				animation.active   = true;
				animation.duration = duration;
				animation.frames   = frames;
				animation.loop     = loop;

				this.frame = frame;

				return true;

			}


			return false;

		},

		clearAnimation: function() {
			this.__animation.active = false;
			this.frame = 0;
		},

		setState: function(id) {

			var result = lychee.ui.Entity.prototype.setState.call(this, id);
			if (result === true) {

				var map = this.__map[this.state] || null;
				if (map !== null) {

					if (map instanceof Array) {

						var statemap = this.getStateMap();
						if (statemap !== null && statemap instanceof Object) {

							this.clearAnimation();

							if (statemap.animation === true) {

								this.setAnimation({
									duration: statemap.duration || 1000,
									frame:    0,
									frames:   map.length,
									loop:     statemap.loop === true
								});

							}

						}


						map = map[0];

					}


					if (map.width !== undefined && typeof map.width === 'number') {
						this.width = map.width;
					}

					if (map.height !== undefined && typeof map.height === 'number') {
						this.height = map.height;
					}

					if (map.radius !== undefined && typeof map.radius === 'number') {
						this.radius = map.radius;
					}

				}

			}


			return result;

		},

		setTexture: function(texture) {

			if (texture instanceof Texture || texture === null) {

				this.texture = texture;

				return true;

			}


			return false;

		},

		getMap: function() {

			var state = this.state;
			var frame = this.frame;

			if (this.__map[state] instanceof Array && this.__map[state][frame] !== undefined) {
				return this.__map[state][frame];
			}


			return null;

		},

		setMap: function(map) {

			var valid = false;

			if (map instanceof Object) {

				for (var stateId in map) {

					var frames = map[stateId];
					if (frames instanceof Array) {

						this.__map[stateId] = [];


						for (var f = 0, fl = frames.length; f < fl; f++) {

							var frame = frames[f];
							if (frame instanceof Object) {

								frame.x = typeof frame.x === 'number' ? frame.x : 0;
								frame.y = typeof frame.y === 'number' ? frame.y : 0;
								frame.w = typeof frame.w === 'number' ? frame.w : 0;
								frame.h = typeof frame.h === 'number' ? frame.h : 0;


								this.__map[stateId].push(frame);

							}

						}


						valid = true;

					}

				}

			}


			return valid;

		}

	};


	return Class;

});


lychee.define('lychee.ui.Switch').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.font    = null;
		this.options = [ 'on', 'off' ];
		this.type    = Class.TYPE.horizontal;
		this.value   = 'off';

		this.__pulse = {
			active:   false,
			duration: 250,
			start:    null,
			alpha:    0.0
		};


		this.setFont(settings.font);
		this.setOptions(settings.options);
		this.setType(settings.type);
		this.setValue(settings.value);

		delete settings.font;
		delete settings.options;
		delete settings.type;
		delete settings.value;


		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;
		settings.width  = typeof settings.width === 'number'  ? settings.width  : 128;
		settings.height = typeof settings.height === 'number' ? settings.height : 128;


		lychee.ui.Entity.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function(id, position, delta) {

			if (this.options.length === 0) return;


			var index = -1;
			var size  = 0;
			var pos   = 0;


			var type = this.type;
			if (type === Class.TYPE.horizontal) {

				size = this.width / this.options.length;
				pos  = (position.x + this.width / 2);

				if (pos > 0) {
					index = (pos / size) | 0;
				}

			} else if (type === Class.TYPE.vertical) {

				size = this.height / this.options.length;
				pos  = (position.y + this.height / 2);

				if (pos > 0) {
					index = (pos / size) | 0;
				}

			}


			if (index >= 0) {

				var value = this.options[index] || null;
				if (value !== null) {

					if (value !== this.value) {

						var result = this.setValue(value);
						if (result === true) {
							this.trigger('change', [ this.value ]);
						}

					}

				}

			}

		}, this);

		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {
			this.setState('default');
		}, this);


		settings = null;

	};


	Class.TYPE = {
		horizontal: 0,
		vertical:   1
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			var font = lychee.deserialize(blob.font);
			if (font !== null) {
				this.setFont(font);
			}

		},

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lychee.ui.Switch';

			var settings = data['arguments'][0];
			var blob     = (data['blob'] || {});


			if (this.options.length !== 0)           settings.options = [].slice.call(this.options, 0);
			if (this.type !== Class.TYPE.horizontal) settings.type    = this.type;
			if (this.value !== '')                   settings.value   = this.value;


			if (this.font !== null) blob.font = lychee.serialize(this.font);


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},

		update: function(clock, delta) {

			var pulse = this.__pulse;
			if (pulse.active === true) {

				if (pulse.start === null) {
					pulse.start = clock;
				}

				var t = (clock - pulse.start) / pulse.duration;
				if (t <= 1) {
					pulse.alpha = (1 - t) * 0.6;
				} else {
					pulse.alpha  = 0.0;
					pulse.active = false;
				}

			}


			lychee.ui.Entity.prototype.update.call(this, clock, delta);

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var position = this.position;

			var x = position.x + offsetX;
			var y = position.y + offsetY;

			var color  = this.state === 'active' ? '#33b5e5' : '#0099cc';
			var color2 = this.state === 'active' ? '#0099cc' : '#575757';
			var alpha  = this.state === 'active' ? 0.6       : 0.3;


			var options = this.options;
			var hwidth  = this.width / 2;
			var hheight = this.height / 2;

			var x1 = x - hwidth;
			var y1 = y - hheight;
			var x2 = x + hwidth;
			var y2 = y + hheight;


			renderer.drawBox(
				x1,
				y1,
				x2,
				y2,
				color2,
				false,
				2
			);


			var pulse = this.__pulse;
			if (pulse.active === true) {

				renderer.setAlpha(pulse.alpha);

				renderer.drawBox(
					x1,
					y1,
					x2,
					y2,
					color,
					true
				);

				renderer.setAlpha(1.0);

			}


			var font = this.font;
			if (font !== null && options.length > 0) {


				var o, ol, option, size;

				var type = this.type;
				if (type === Class.TYPE.horizontal) {

					size = this.width / options.length;


					for (o = 0, ol = options.length; o < ol; o++) {

						option = options[o];

						if (option === this.value) {

							renderer.setAlpha(alpha);

							renderer.drawBox(
								x1 + o * size,
								y1,
								x1 + (o + 1) * size,
								y2,
								color,
								true
							);

							renderer.setAlpha(1.0);

						}


						renderer.drawText(
							x1 + o * size + size / 2,
							y,
							option,
							font,
							true
						);

					}


				} else if (type === Class.TYPE.vertical) {

					size = this.height / options.length;


					for (o = 0, ol = options.length; o < ol; o++) {

						option = options[o];

						if (option === this.value) {

							renderer.setAlpha(alpha);

							renderer.drawBox(
								x1,
								y1 + o * size,
								x2,
								y1 + (o + 1) * size,
								color,
								true
							);

							renderer.setAlpha(1.0);

						}


						renderer.drawText(
							x,
							y1 + o * size + size / 2,
							option,
							font,
							true
						);

					}

				}

			}

		},



		/*
		 * CUSTOM API
		 */

		setFont: function(font) {

			font = font instanceof Font ? font : null;


			if (font !== null) {

				this.font = font;

				return true;

			}


			return false;

		},

		setOptions: function(options) {

			options = options instanceof Array ? options : null;


			if (options !== null) {

				this.options = options.map(function(option) {
					return '' + option;
				});

				return true;

			}


			return false;

		},

		setState: function(id) {

			var result = lychee.ui.Entity.prototype.setState.call(this, id);
			if (result === true) {

				var pulse = this.__pulse;


				if (id === 'active') {

					pulse.alpha  = 0.6;
					pulse.start  = null;
					pulse.active = true;

				}


				return true;

			}


			return false;

		},

		setType: function(type) {

			if (lychee.enumof(Class.TYPE, type)) {

				this.type = type;

				return true;

			}


			return false;

		},

		setValue: function(value) {

			value = typeof value === 'string' ? value : null;


			if (value !== null) {

				if (this.options.indexOf(value) !== -1) {

					this.value = value;

					return true;

				}

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.ui.Textarea').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.font  = null;
		this.value = '';

		this.__buffer  = null;
		this.__drag    = { x: 0, y: 0 };
		this.__lines   = [];
		this.__value   = '';
		this.__isDirty = false;


		this.setFont(settings.font);
		this.setValue(settings.value);

		delete settings.font;
		delete settings.value;


		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;
		settings.width  = typeof settings.width  === 'number' ? settings.width  : 140;
		settings.height = typeof settings.height === 'number' ? settings.height : 140;


		lychee.ui.Entity.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function() {}, this);

		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {

			if (this.value !== this.__value) {
				this.trigger('change', [ this.value ]);
				this.__value = this.value;
			}

			this.setState('default');

		}, this);

		this.bind('key', function(key, name, delta) {

			var line      = this.__lines[this.__lines.length - 1];
			var character = key;

			if (key === 'enter') {

				this.__lines.push('');
				this.__isDirty = true;

				return false;

			} else {

				if (key === 'space') {
					character = ' ';
				} else if (key === 'tab') {
					character = '\t';
				}


				var ll = this.__lines.length;

				if (character.length === 1) {

					line += character;
					this.__lines[ll - 1] = line;
					this.__isDirty = true;

				} else if (key === 'backspace') {

					if (line.length > 0) {
						line = line.substr(0, line.length - 1);
						this.__lines[ll - 1] = line;
						this.__isDirty = true;
					} else if (ll > 1) {
						this.__lines.splice(ll - 1, 1);
						this.__isDirty = true;
					}

				}


				this.value = this.__lines.join('\n');

			}

		}, this);


		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			var font = lychee.deserialize(blob.font);
			if (font !== null) {
				this.setFont(font);
			}

		},

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lyche.ui.Textarea';

			var settings = data['arguments'][0];
			var blob     = (data['blob'] || {});


			if (this.width !== 140)  settings.width  = this.width;
			if (this.height !== 140) settings.height = this.height;
			if (this.value !== '')   settings.value  = this.value;


			if (this.font !== null) blob.font = lychee.serialize(this.font);


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var buffer = this.__buffer;
			if (buffer === null) {

				buffer = renderer.createBuffer(
					this.width  - 28,
					this.height - 28
				);

				this.__buffer = buffer;

			}


			if (this.__isDirty === true) {

				renderer.clearBuffer(buffer);
				renderer.setBuffer(buffer);


				var font = this.font;
				if (font !== null) {

					var l, ll, text;
					var kerning    = font.kerning;
					var linewidth  = 0;
					var lineheight = font.lineheight;
					var textwidth  = 0;
					var textheight = this.__lines.length * lineheight;


					text = this.__lines[this.__lines.length - 1];

					for (var t = 0, tl = text.length; t < tl; t++) {
						var chr = font.get(text[t]);
						if (chr === null) console.log(t, tl, text[t], text);
						linewidth += chr.real + kerning;
					}

					var drag  = font.get('_');
					textwidth = linewidth + drag.real;


					var offsetx = 0;
					var offsety = 0;
					var bwidth  = buffer.width;
					var bheight = buffer.height;

					if (textwidth  > bwidth)  offsetx = bwidth  - textwidth;
					if (textheight > bheight) offsety = bheight - textheight;


					for (l = 0, ll = this.__lines.length; l < ll; l++) {

						text = this.__lines[l];

						renderer.drawText(
							offsetx,
							offsety + lineheight * l,
							text,
							font,
							false
						);

					}


					if (this.state === 'active') {

						var dragx = offsetx + textwidth - drag.real;
						var dragy = offsety + lineheight * l - lineheight;

						renderer.drawBox(
							dragx,
							dragy,
							dragx + drag.real,
							dragy + lineheight,
							'#33b5e5',
							true
						);

					}

				}


				renderer.setBuffer(null);


				this.__isDirty = false;

			}


			var position = this.position;

			var x = position.x + offsetX;
			var y = position.y + offsetY;

			var color = this.state === 'active' ? '#0099cc' : '#575757';


			var hwidth  = this.width / 2;
			var hheight = this.height / 2;

			var x1 = x - hwidth;
			var y1 = y - hheight;
			var x2 = x + hwidth;
			var y2 = y + hheight;


			renderer.drawBox(
				x1,
				y1,
				x2,
				y2,
				color,
				false,
				2
			);

			renderer.drawTriangle(
				x1,
				y1 + 14,
				x1,
				y1,
				x1 + 14,
				y1,
				color,
				true
			);

			renderer.drawTriangle(
				x2,
				y2 - 14,
				x2,
				y2,
				x2 - 14,
				y2,
				color,
				true
			);



			renderer.drawBuffer(
				x1 + 14,
				y1 + 14,
				this.__buffer
			);

		},



		/*
		 * CUSTOM ENTITY API
		 */

		setState: function(id) {

			var result = lychee.ui.Entity.prototype.setState.call(this, id);
			if (result === true) {
				this.__isDirty = true;
			}


			return result;

		},



		/*
		 * CUSTOM API
		 */

		setFont: function(font) {

			font = font instanceof Font ? font : null;


			if (font !== null) {

				this.font = font;

				return true;

			}


			return false;

		},

		setValue: function(value) {

			value = typeof value === 'string' ? value : null;


			if (value !== null) {

				this.value = value;

				this.__lines   = value.split('\n');
				this.__isDirty = true;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.verlet.AngleConstraint').requires([
	'lychee.verlet.Particle',
	'lychee.verlet.Vector2'
]).exports(function(lychee, global) {

	var _particle = lychee.verlet.Particle;
	var _cache1   = new lychee.verlet.Vector2();
	var _cache2   = new lychee.verlet.Vector2();


	var _get_angle = function(positiona, positionb, positionc) {

		positiona.copy(_cache1);
		_cache1.subtract(positionb);

		positionc.copy(_cache2);
		_cache2.subtract(positionb);


		return _cache1.angle(_cache2);

	};


	var Class = function(a, b, c, rigidity) {

		this.a = a instanceof _particle ? a : null;
		this.b = b instanceof _particle ? b : null;
		this.c = c instanceof _particle ? c : null;

		this.rigidity = typeof rigidity === 'number' ? rigidity : 1;
		this.angle    = 0;


		if (this.a !== null && this.b !== null && this.c !== null) {
			this.angle = _get_angle(this.a.position, this.b.position, this.c.position);
		}

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		update: function(clock, delta) {

			var a = this.a;
			var b = this.b;
			var c = this.c;

			if (a !== null && b !== null && c !== null) {

				var u = delta / 1000;

				var ap = a.position;
				var bp = b.position;
				var cp = c.position;


				var diff = _get_angle(ap, bp, cp) - this.angle;
				if (diff <= -Math.PI) {
					diff += 2 * Math.PI;
				} else if (diff >= Math.PI) {
					diff -= 2 * Math.PI;
				}


				diff *= u * this.rigidity;


				ap.rotate(bp,  diff);
				cp.rotate(bp, -diff);

				bp.rotate(ap,  diff);
				bp.rotate(cp, -diff);

			}

		},

		render: function(renderer, offsetX, offsetY) {

			var a = this.a;
			var b = this.b;
			var c = this.c;

			if (a !== null && b !== null && c !== null) {

				var ap = a.position;
				var bp = b.position;
				var cp = c.position;

				var ax = offsetX + ap.x;
				var ay = offsetY + ap.y;
				var bx = offsetX + bp.x;
				var by = offsetY + bp.y;
				var cx = offsetX + cp.x;
				var cy = offsetY + cp.y;


				renderer.drawLine(
					ax,
					ay,
					bx,
					by,
					'#ff0000',
					1
				);

				renderer.drawLine(
					bx,
					by,
					cx,
					cy,
					'#ff0000',
					1
				);

			}

		}

	};


	return Class;

});


lychee.define('lychee.verlet.DistanceConstraint').requires([
	'lychee.verlet.Particle',
	'lychee.verlet.Vector2'
]).exports(function(lychee, global) {

	var _cache    = new lychee.verlet.Vector2();
	var _particle = lychee.verlet.Particle;


	var Class = function(a, b, rigidity) {

		this.a = a instanceof _particle ? a : null;
		this.b = b instanceof _particle ? b : null;

		this.distance = 0;
		this.rigidity = typeof rigidity === 'number' ? rigidity : 1;


		if (this.a !== null && this.b !== null) {

			this.a.position.copy(_cache);
			_cache.subtract(this.b.position);
			this.distance = _cache.squaredLength();

		}

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		update: function(clock, delta) {

			var u = delta / 1000;


			var a = this.a;
			var b = this.b;

			if (a !== null && b !== null) {

				a.position.copy(_cache);
				_cache.subtract(b.position);

				var dist  = _cache.length();
				var m     = _cache.squaredLength();
				var scale = ((this.distance - m) / m) * this.rigidity * u;

				_cache.scale(scale);

				a.position.add(_cache);
				b.position.subtract(_cache);

			}

		},

		render: function(renderer, offsetX, offsetY) {

			var a = this.a.position;
			var b = this.b.position;


			var x1 = a.x + offsetX;
			var y1 = a.y + offsetY;
			var x2 = b.x + offsetX;
			var y2 = b.y + offsetY;


			renderer.drawLine(
				x1,
				y1,
				x2,
				y2,
				'#ff0000',
				2
			);

		}

	};


	return Class;

});


lychee.define('lychee.verlet.Particle').requires([
	'lychee.verlet.Vector2'
]).exports(function(lychee, global) {

	var _vector2 = lychee.verlet.Vector2;


	var Class = function(position) {

		this.position     = new _vector2();
		this.lastposition = new _vector2();

		this.setPosition(position);

	};


	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		render: function(renderer, offsetX, offsetY) {

			var position = this.position;

			var x = position.x + offsetX;
			var y = position.y + offsetY;

			renderer.drawCircle(
				x,
				y,
				2,
				'#ff0000',
				true
			);

		},


		/*
		 * GETTERS AND SETTERS
		 */

		setPosition: function(position) {

			if (position instanceof Object) {

				this.position.x = typeof position.x === 'number' ? position.x : this.position.x;
				this.position.y = typeof position.y === 'number' ? position.y : this.position.y;

				this.lastposition.x = this.position.x;
				this.lastposition.y = this.position.y;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.verlet.Tire').requires([
	'lychee.verlet.Particle',
	'lychee.verlet.DistanceConstraint'
]).exports(function(lychee, global) {

	var _particle   = lychee.verlet.Particle;
	var _constraint = lychee.verlet.DistanceConstraint;


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.constraints = [];
		this.particles   = [];

		this.position = { x: 0, y: 0 };
		this.origin   = null;
		this.radius   = 0;
		this.segments = 0;
		this.rigidity = {
			spoke: 1,
			tread: 1
		};


		this.setPosition(settings.position);
		this.setRadius(settings.radius);
		this.setRigidity(settings.rigidity);
		this.setSegments(settings.segments);


		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var settings = {};


			if (this.radius !== 0)   settings.radius = this.radius;
			if (this.segments !== 0) settings.segments = this.segments;


			if (this.origin.position.x !== 0 || this.origin.position.y !== 0) {

				settings.origin = {};

				if (this.origin.position.x !== 0) settings.origin.x = this.origin.position.x;
				if (this.origin.position.y !== 0) settings.origin.y = this.origin.position.y;

			}

			if (this.position.x !== 0 || this.position.y !== 0) {

				settings.position = {};

				if (this.position.x !== 0) settings.position.x = this.position.x;
				if (this.position.y !== 0) settings.position.y = this.position.y;

			}

			if (this.rigidity.spoke !== 1 || this.rigidity.tread !== 1) {

				settings.rigidity = {};

				if (this.rigidity.spoke !== 1) settings.rigidity.spoke = this.rigidity.spoke;
				if (this.rigidity.tread !== 1) settings.rigidity.tread = this.rigidity.tread;

			}


			return {
				'constructor': 'lychee.verlet.Tire',
				'arguments':   [ settings ]
			};

		},

		update: function(clock, delta) {

			for (var c = 0, cl = this.constraints.length; c < cl; c++) {
				this.constraints[c].update(clock, delta);
			}

		},

		render: function(renderer, offsetX, offsetY) {

			var position = this.position;

			var x = position.x + offsetX;
			var y = position.y + offsetY;


			for (var c = 0, cl = this.constraints.length; c < cl; c++) {
				this.constraints[c].render(renderer, x, y);
			}

			for (var p = 0, pl = this.particles.length; p < pl; p++) {
				this.particles[p].render(renderer, x, y);
			}

		},



		/*
		 * CUSTOM API
		 */

		setPosition: function(position) {

			if (position instanceof Object) {

				this.position.x = typeof position.x === 'number' ? position.x : this.position.x;
				this.position.y = typeof position.y === 'number' ? position.y : this.position.y;

				return true;

			}


			return false;

		},

		setRadius: function(radius) {

			radius = typeof radius === 'number' ? radius : null;

			if (radius !== null) {

				this.radius = radius;

				return true;

			}


			return false;

		},

		setRigidity: function(rigidity) {

			if (rigidity instanceof Object) {

				this.rigidity.tread = typeof rigidity.tread === 'number' ? rigidity.tread : this.rigidity.tread;
				this.rigidity.spoke = typeof rigidity.spoke === 'number' ? rigidity.spoke : this.rigidity.spoke;

				return true;

			}


			return false;

		},

		setSegments: function(segments) {

			segments = typeof segments === 'number' ? segments : null;

			if (segments !== null && segments !== this.segments) {

				this.particles = [];


				var origin = new _particle({
					x: this.position.x,
					y: this.position.y
				});



				var stride = (2*Math.PI) / segments;

				for (var sp = 0; sp < segments; sp++) {

					var theta = sp * stride;

					this.particles.push(new _particle({
						x: origin.position.x + Math.cos(theta) * this.radius,
						y: origin.position.y + Math.sin(theta) * this.radius
					}));

				}


				var constraint;
				var spoke_rigidity = this.rigidity.spoke;
				var tread_rigidity = this.rigidity.tread;

				for (var s = 0; s < segments; s++) {

					var current = this.particles[s % segments];

					this.constraints.push(new _constraint(
						current,
						origin,
						spoke_rigidity
					));

					this.constraints.push(new _constraint(
						current,
						this.particles[(s + 1) % segments],
						tread_rigidity
					));

					this.constraints.push(new _constraint(
						current,
						this.particles[(s + 5) % segments],
						tread_rigidity
					));

				}


				this.particles.push(origin);

				this.origin   = origin;
				this.segments = segments;

			}

		}

	};


	return Class;

});


lychee.define('lychee.verlet.Vector2').exports(function(lychee, global) {

	var Class = function() {

		this.x = 0;
		this.y = 0;

	};


	Class.prototype = {

		clone: function() {

			var clone = new Class();

			this.copy(clone);

			return clone;

		},

		copy: function(vector) {

			vector.set(this.x, this.y);

		},

		set: function(x, y) {

			this.x = x;
			this.y = y;

		},

		add: function(vector) {

			this.x += vector.x;
			this.y += vector.y;

		},

		subtract: function(vector) {

			this.x -= vector.x;
			this.y -= vector.y;

		},

		multiply: function(vector) {

			this.x *= vector.x;
			this.y *= vector.y;

		},

		divide: function(vector) {

			this.x /= vector.x;
			this.y /= vector.y;

		},

		min: function(vector) {

			this.x = Math.min(this.x, vector.x);
			this.y = Math.min(this.y, vector.y);

		},

		max: function(vector) {

			this.x = Math.max(this.x, vector.x);
			this.y = Math.max(this.y, vector.y);

		},

		scale: function(scale) {

			this.x *= scale;
			this.y *= scale;

		},

		distance: function(vector) {

			var x = vector.x - this.x;
			var y = vector.y - this.y;


			return Math.sqrt(x * x + y * y);

		},

		squaredDistance: function(vector) {

			var x = vector.x - this.x;
			var y = vector.y - this.y;


			return (x * x + y * y);

		},

		length: function() {

			var x = this.x;
			var y = this.y;


			return Math.sqrt(x * x + y * y);

		},

		squaredLength: function() {

			var x = this.x;
			var y = this.y;


			return (x * x + y * y);

		},

		invert: function() {

			this.x *= -1;
			this.y *= -1;

		},

		normalize: function() {

			var x = this.x;
			var y = this.y;


			var length = (x * x + y * y);
			if (length > 0) {

				length = 1 / Math.sqrt(length);

				this.x *= length;
				this.y *= length;

			}

		},

		scalar: function(vector) {

			return (this.x * vector.x + this.y * vector.y);

		},

		cross: function(vector) {

			// R^2 -> R^2 will just flip the coordinates
			// to have the assumed orthogonal behaviour
			// of the resulting vector

			this.x =      vector.y;
			this.y = -1 * vectoy.x;

		},

		angle: function(vector) {

			return Math.atan(this.x * vector.y - this.y * vector.x, this.x * vector.x + this.y * vector.y);

		},

		rotate: function(origin, theta) {

			var x = this.x - origin.x;
			var y = this.y - origin.y;


			this.x = origin.x + x * Math.cos(theta) - y * Math.sin(theta);
			this.y = origin.y + x * Math.sin(theta) + y * Math.cos(theta);

		},

		interpolate: function(vector, t) {

			this.x += t * (vector.x - this.x);
			this.y += t * (vector.y - this.y);

		},

		interpolateAdd: function(vector, t) {

			this.x += t * vector.x;
			this.y += t * vector.y;

		},

		interpolateSet: function(vector, t) {

			this.x = t * vector.x;
			this.y = t * vector.y;

		}

	};


	return Class;

});


lychee.define('lychee.verlet.World').requires([
	'lychee.verlet.Vector2'
]).exports(function(lychee, global) {

	var _vector2 = lychee.verlet.Vector2;


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.width   = 0;
		this.height  = 0;
		this.objects = [];

		this.__friction       = 0.99;
		this.__gravity        = new _vector2();
		this.__groundfriction = 0.8;
		this.__map            = {};
		this.__velocity       = new _vector2();


		this.setWidth(settings.width);
		this.setHeight(settings.height);


		this.setFriction(settings.friction);
		this.setGravity(settings.gravity);
		this.setGroundFriction(settings.groundfriction);


		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var settings = {};
			var blob     = {};


			if (this.width  !== 0) settings.width  = this.width;
			if (this.height !== 0) settings.height = this.height;


			if (this.__friction !== 0.99)      settings.friction       = (1 - this.__friction);
			if (this.__gravity.y !== 0)        settings.gravity        = this.__gravity.y;
			if (this.__groundfriction !== 0.8) settings.groundfriction = (1 - this.__groundfriction);


			return {
				'constructor': 'lychee.verlet.World',
				'arguments':   [ settings ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		update: function(clock, delta) {

			var friction       = this.__friction;
			var groundfriction = this.__groundfriction;
			var gravity        = this.__gravity;
			var velocity       = this.__velocity;


			var hwidth  = this.width  / 2;
			var hheight = this.height / 2;


			for (var o = 0, ol = this.objects.length; o < ol; o++) {

				var object = this.objects[o];

				for (var p = 0, pl = object.particles.length; p < pl; p++) {

					var particle = object.particles[p];

					var position = particle.position;
					var lastposition = particle.lastposition;


					position.copy(velocity);
					velocity.subtract(lastposition);
					velocity.scale(friction);


					if (position.y >= hheight && velocity.squaredLength() > 0.000001) {

						var m = velocity.length();

						velocity.x /= m;
						velocity.y /= m;

						velocity.scale(m * groundfriction);

					}


					position.copy(lastposition);
					position.add(gravity);
					position.add(velocity);


					if (position.y > hheight) {
						position.y = hheight;
					}

				}

			}

		},

		render: function(clock, delta) {

		},


		setWidth: function(width) {

			width = typeof width === 'number' ? width : null;


			if (width !== null) {

				this.width = width;

				return true;

			}


			return false;

		},

		setHeight: function(height) {

			height = typeof height === 'number' ? height : null;


			if (height !== null) {

				this.height = height;

				return true;

			}


			return false;

		},



		/*
		 * CUSTOM API
		 */

		addObject: function(object) {

			object = (object instanceof Object && typeof object.update === 'function') ? object : null;


			if (object !== null) {

				var found = false;
				for (var o = 0, ol = this.objects.length; o < ol; o++) {

					var cached = this.objects[o];
					if (cached === object) {
						found = true;
						break;
					}

				}


				if (found === false) {

					this.objects.push(object);

					return true;

				}

			}


			return false;

		},

		setObject: function(id, object) {

			id     = typeof id === 'string'                                            ? id     : null;
			object = (object instanceof Object && typeof object.update === 'function') ? object : null;


			if (id !== null && object !== null) {

				if (this.__map[id] === undefined) {

					this.__map[id] = object;
					this.addObject(object);

					return true;

				}

			}


			return false;

		},

		getObject: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.__map[id] !== undefined) {
				return this.__map[id];
			}


			return null;

		},

		removeObject: function(object) {

			object = (object instanceof Object && typeof object.update === 'function') ? object : null;


			if (object !== null) {

				var found = false;

				for (var o = 0, ol = this.objects.length; o < ol; o++) {

					var cached = this.objects[o];
					if (cached === object) {
						this.objects.splice(o, 1);
						found = true;
						ol--;
						o--;
					}

				}


				for (var id in this.__map) {

					var mapped = this.__map[id];
					if (mapped === object) {
						delete this.__map[id];
						found = true;
					}

				}


				return found;

			}


			return false;

		},

		setFriction: function(friction) {

			if (typeof friction === 'number') {

				if (friction > 0 && friction < 1) {

					this.__friction = 1 - friction;

					return true;

				}

			}


			return false;

		},

		setGravity: function(gravity) {

			if (typeof gravity === 'number') {

				this.__gravity.set(0, gravity);

				return true;

			}


			return false;

		},

		setGroundFriction: function(friction) {

			if (typeof friction === 'number') {

				if (friction > 0 && friction < 1) {

					this.__groundfriction = 1 - friction;

					return true;

				}

			}


			return false;

		}

	};


	return Class;

});



lychee.init(function(sandbox) {
	console.info('lycheeJS ' + lychee.VERSION + ' ready.');
});

