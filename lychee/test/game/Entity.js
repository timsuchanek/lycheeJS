
test.define('lychee.game.Entity').exports(function(lychee, test) {

	test.sync({
		method:    'setPosition',
		garbage:   false,
		property:  'position',
		arguments: new test.Arguments({
			x: new test.Integer(0, 1337)
			y: new test.Integer(0, 1337)
		}]),
		condition: function(args, self) {

			if (args[0] !== self.position) {

				if (
					   args[0].x === self.position.x
					&& args[0].y === self.position.y
				) {
					return true;
				}

			}


			return false;

		}
	});


	var delta = new test.Integer(0, 10000);

	test.async({
		method:    'setTween',
		garbage:   true,
		property:  '__tween',
		timeout:   delta,
		arguments: new test.Arguments([{
			delta: delta
			to: {
				x: new test.Integer(0, 1337),
				y: new test.Integer(0, 1337)
			}
		}]),
		condition: function(args, self) {

			if (args[0].to !== self.position) {

				if (
					   args[0].to.x === self.position.x
					&& args[0].to.y === self.position.y
				) {
					return true;
				}

			}


			return false;

		}
	});

});

