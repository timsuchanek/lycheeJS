
(function(global) {

	if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {

		document.addEventListener('DOMContentLoaded', function() {

			var _get_parent = function(node) {

				var selfname = node.tagName.toLowerCase();
				if (selfname === 'article' || selfname === 'menu') {
					return node;
				}


				var parentnode = node.parentNode;
				var parentname = parent.tagName.toLowerCase();
				if (parentname === 'article' || tagname === 'menu') {
					return parentnode;
				} else if (tagname === 'body') {
					return null;
				} else {
					return _get_parent(parentnode);
				}

			};


			var elements = [].slice.call(document.querySelectorAll('main menu, main article'));
			if (elements.length > 0) {

				document.body.style.overflow = 'hidden';


				elements.forEach(function(element) {

					element.style.webkitOverflowScrolling = 'touch';
					element.style.overflow                = 'scroll';


					element.addEventListener('touchstart', function() {

						var top     = this.scrollTop;
						var total   = this.scrollHeight;
						var current = this.scrollTop + this.offsetHeight;

						if (top === 0) {
							this.scrollTop = 1;
						} else if (current === total) {
							this.scrollTop = top - 1;
						}

					});

					element.addEventListener('touchmove', function(event) {

						if (this.offsetHeight < this.scrollHeight) {
							this._isScroller = true;
						}

					});

				});

				document.body.addEventListener('touchmove', function(event) {

					var parent = _get_parent(event.target);
					if (parent === null || !parent._isScroller) {
						event.preventDefault();
					}

				}, true);

			}

		});

	}

})(this);

