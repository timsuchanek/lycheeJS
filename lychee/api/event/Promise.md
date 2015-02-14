
={constructor}

# new lychee.event.Promise(void);

This constructor returns an instance of *lychee.event.Promise*.

```javascript
var promise = new lychee.event.Promise();

promise.then(function(result) {

	// This will return a successful execution
	result(true);

});

promise.then(function(result) {

	// This will return an unsuccessful execution
	result(false);

});

promise.bind('ready', function() {
	console.log('promise was successful!');
});

promise.bind('error', function() {
	console.log('promise was unsuccessful!');
});

promise.init();
```



={methods-serialize}

### (Serialization Object) lychee.event.Promise.prototype.serialize(void);

- This method has no arguments.

This method is not intended for direct usage. You can serialize an
object using the [lychee.serialize()](lychee#methods-serialize) method.

```javascript
var foo1 = new lychee.event.Promise();
var data = lychee.serialize(foo1);
var foo2 = lychee.deserialize(data);

data; // { constructor: 'lychee.event.Promise', arguments: []}
foo2; // lychee.event.Promise instance
```



={methods-then}

### (Boolean) lychee.event.Promise.prototype.then(callback [, scope]);

- *(Function) callback* is the callback that is executed when the stack is processed.
- *(Object) scope* is the scope of the callback.

This method returns *true* on success and *false* on failure.
It will try to bind the callback to the stack.

```javascript
var promise = new lychee.event.Promise();

promise.then(function(result) { result(true);  }); // true
promise.then(function(result) { result(false); }); // true
promise.then('not a function');                    // false

promise.bind('ready', function() {
	console.log('promise was successful!');
});

promise.bind('error', function() {
	console.log('promise was unsuccessful!');
});

promise.init();
```



={methods-init}

### (Boolean) lychee.event.Promise.prototype.init(void);

- This method has no arguments.

This method returns *true* on success and *false* on failure.
It will try to initialize the processing of the stack.

```javascript
var promise = new lychee.event.Promise();

promise.bind('ready', function() {
	console.log('promise was successful!');
});

promise.init();                                    // false
promise.then(function(result) { result(true);  });
promise.init();                                    // true
```

