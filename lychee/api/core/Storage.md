
={constructor}

# new lychee.Storage(settings);

- *settings* is an *Object*.

This constructor returns an instance of *lychee.Storage*.
The *settings* object consists of the following properties:

- *(String) id* will be passed to [setId()](#methods-setId).
- *(Object) model* will be passed to [setModel()](#methods-setModel).
- *(Enum) type* will be passed to [setType()](#methods-setType).

```javascript
var model = {
	name:  'Rainbow',
	squad: 'LazerUnicorns',
	score: 1337
};

var storage = new lychee.Storage({
	id:    'game-playerdata',
	model: model,
	type:  lychee.Storage.TYPE.persistent
});
```

