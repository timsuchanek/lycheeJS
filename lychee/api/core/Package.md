
={constructor}

# new lychee.Package(id, url);

- *(String) id* is a unique identifier.
- *(String) url* is the url to the *lychee.pkg* file.

This constructor returns an instance of *lychee.Package*.

```javascript
// Package initialized as namespace 'lychee'
var pkg1 = new lychee.Package('lychee', '/lychee/lychee.pkg');

// Package initialized as namespace 'myname'
var pkg2 = new lychee.Package('myname', '/lychee/lychee.pkg');
```



={methods-serialize}

### (Serialization Object) lychee.Package.prototype.serialize(void);

- This method has no arguments.

This method returns the *Serialization Object* of the instance.



={methods-isReady}

### (Boolean) lychee.Package.prototype.isReady(void);

This method returns *true* if the instance is ready and *false*
if the instance is not ready.

Due to asynchronous loading behaviours, this method might give
different results on otherwise identical systems. The *lychee.pkg*
file is loaded and parsed. After this process is done, the *lychee.Package*
instance is marked as being ready.

This method is not intended for public usage. It is called
by the [lychee.Environment](lychee-Environment.html) instance.



={methods-load}

### (Boolean) lychee.Package.prototype.load(id, tags);

- *(String) id* is the unique identifier of a Definition.
- *(Object) tags* is an object consisting of a key and an Array of values.

This method returns *true* on success and *false* on failure.
It will try to load a Definition that matches the given tags
and is properly supporting the target environment.

This method is not intended for public usage. It is called
by the [lychee.Environment](lychee-Environment.html) instance.



={methods-setEnvironment}

### (Boolean) lychee.Package.prototype.setEnvironment(environment);

- *(lychee.Environment) environment* is a
[lychee.Environment](lychee-Environment.html) instance.

This method returns *true* on success and *false* on failure.
It will set the [environment property](#properties-delay) of the instance.

```javascript
var pkg = new lychee.Package('game', './lychee.pkg');

pkg.environment;         // null
pkg.setEnvironment(env); // true

```



={methods-setType}

### (Boolean) lychee.Package.prototype.setType(type);

- *(String) type* is a string that can have the following
values: *source*, *export* or *build*.

This method returns *true* on success and *false* on failure.
It will set the type of the package that influences the
behaviour of the [load()](#methods-load) method.

This method is not intended for public usage. It is called
by the [lychee.Environment](lychee-Environment.html) instance.

