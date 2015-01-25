
={constructor}

# new lychee.Environment(settings);

- *settings* is an *Object*.

This constructor returns an instance of *lychee.Environment*.
The *settings* object consists of the following properties:

- *(String) id* will be passed to [setId()](#methods-setId).
- *(String) build* will be passed to [setBuild()](#methods-setBuild).
- *(Boolean) debug* will be passed to [setDebug()](#methods-setDebug).
- *(Object) definitions* will be passed to [setDefinitions()](#methods-setDefinitions).
- *(Array) packages* will be passed to [setPackages()](#methods-setPackages).
- *(Boolean) sandbox* will be passed to [setSandbox()](#methods-setSandbox).
- *(Object) tags* will be passed to [setTags()](#methods-setTags).
- *(Number) timeout* will be passed to [setTimeout()](#methods-setTimeout).
- *(String) type* will be passed to [setType()](#methods-setType).

```javascript
var environment = new lychee.Environment({
	id:      'example',
	build:   'game.Main',
	debug:   true,
	sandbox: false,
	tags:    {
		platform: [ 'html' ]
	},
	timeout: 5000,
	type:    'source'
});
```



={properties-id}

### (String) new lychee.Environment().id;

The *(String) id* property is the unique identifier
of the environment.

It influences the behaviour of the
[lychee.Debugger](lychee-Debugger.html).

It is set via *settings.id* in the [constructor](#constructor)
or via [setId](#methods-setId).

```javascript
var environment = new lychee.Environment({
	id: 'test'
});

environment.id;               // 'test'
environment.setId('example'); // true
environment.id;               // 'example'
environment.setId(null);      // false
environment.id;               // 'example'
```



={properties-build}

### (String) new lychee.Environment().build;

The *(String) build* property is the build target of the
environment instance.

It influences the [init()](#methods-init) callback behaviour.

It is set via *settings.build* in the [constructor](#constructor)
or via [setBuild()](#methods-setBuild).

```javascript
var environment = new lychee.Environment({
	build: 'example.Foo',
	packages: [
		new lychee.Package('example', './lychee.pkg')
	]
});

environment.build;                   // 'example.Foo'
environment.setBuild('example.Bar'); // true

environment.init(function(sandbox) {

	var lychee  = sandbox.lychee;
	var example = sandbox.example;

	// example.Bar is now loaded and available

});
```



={properties-debug}

### (Boolean) new lychee.Environment().debug;

The *(Boolean) debug* property is the state whether the debugging
mode is activated or not.

It influences the logging of additional debug data to the console.
It is reflected by the [lychee.debug](lychee.html#properties-debug)
property inside the sandbox.

It is set via *settings.debug* in the [constructor](#constructor)
or via [setDebug()](#methods-setDebug).

```javascript
var environment = new lychee.Environment({
	debug: false
});

environment.debug;          // false
environment.setDebug(true); // true
environment.debug;          // true

environment.init(function(sandbox) {

	var lychee = sandbox.lychee;
	if (lychee.debug === true) {
		console.log('Additional debug data is dumped to console');
	}

});

```



={properties-definitions}

### (Object) new lychee.Environment().definitions;

The *(Object) definitions* property is the object consisting of
the map of available [lychee.Definition](lychee-Definition.html)
instances inside the environment, each mapped as the available
identifier.

It is set via *settings.definitions* in the [constructor](#constructor)
or via [setDefinitions()](#methods-setDefinitions).

```javascript
var Foo = new lychee.Definition('example.Foo');
var Bar = new lychee.Definition('example.Bar');

var environment = new lychee.Definition({
	debug: true,
	build: 'example.Foo',
	type:  'build' // avoid loading from source path
});

environment.setDefinitions({
	'example.Foo': Foo,
	'example.Bar': Bar,
	'example.Qux': Foo,
	'another.Bar': Bar
});

environment.init(function(sandbox) {

	var lychee  = sandbox.lychee;
	var another = sandbox.another;
	var example = sandbox.example;

	// Note the mapped namespaces by the setDefinitions() call

});
```



={properties-packages}

### (Array) new lychee.Environment().packages;

The *(Array) packages* property is an array of all registered
[lychee.Package](lychee-Package.html) instances.

It influences the behaviour of loading additional definitions
into the environment. As each package's id is associated with
the equivalent namespace, they are responsible for loading 
definitions inside their namespace.

It is set via *settings.packages* in the [constructor](#constructor)
or via [setPackages()](#methods-setPackages).

```javascript
var foo = new lychee.Package('foo', './foo/lychee.pkg');
var bar = new lychee.Package('bar', './bar/lychee.pkg');

var environment = new lychee.Environment({
	debug:    false,
	packages: [ foo ]
});

// Note that the lychee package is auto-filled
environment.packages.length;           // 2

environment.setPackages([ foo, bar ]); // true
environment.packages.length;           // 3
```



={properties-sandbox}

### (Boolean) new lychee.Environment().sandbox;

The *(Boolean) sandbox* property is the state whether the sandboxing
mode is activated or not.

It influences how the *global* property of the environment is built
up. If sandboxing mode is activated, it will create an isolated
scope for the build.

It is set via *settings.sandbox* in the [constructor](#constructor)
or via [setSandbox()](#methods-setSandbox).

```javascript
var global      = this;
var environment = new lychee.Environment({
	sandbox: true
});

environment.sandbox;           // true
environment.global === global; // false

environment.init(function(sandbox) {
	sandbox === environment.global; // true
});
```



={properties-tags}

### new lychee.Environment().tags;

// TODO:
={properties-timeout}
={properties-type}
={methods-createAsset}
={methods-deserialize}
={methods-serialize}
={methods-load}
={methods-define}
={methods-init}
={methods-inject}
={methods-setBuild}
={methods-setDebug}
={methods-setDefinitions}
={methods-setId}
={methods-setPackages}
={methods-setSandbox}
={methods-setTags}
={methods-setTimeout}
={methods-setType}
 
