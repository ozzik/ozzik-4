//
// Controls the display of the showcase collection
//

var O4 = O4 || {};

O4.ShowcaseCollectionView = function(viewSelector) {
	var _e = $(viewSelector),
		_showcases = [],
		_collection = null,
		_order = null,
		_animatedItems = 0;

	_e.on("click", _handleItemClick, { isCaptured: true });

	// ==== Exposed methods ====
	this.reset = function() {
		app.killAnimation = _collection && _animatedItems !== _collection.length;
		_animatedItems = 0;
	};

	this.load = function(collection) {
		_collection = collection;
		_showcases = [];

		_determineOrder();
		_create();
	};

	this.reveal = function() {
		app.viewportController.toggleOverlay("loading", false); // TODO: Send event for success
		app.viewportController.fetchMetrics();

		// TODO: refactor access to .showcase-item (-> _showcases)
		setTimeout(function se_collectionReadyForReveal() {
			_e.addClass("flock").find(".showcase-item").removeClass("off");
			$.transitionEnd("transform", document.querySelector(".showcase-item:last-child"), function te_flock() {
				_e.removeClass("flock");

				setTimeout(_animateShowcases, 100);
			});
		}, 100);
	};

	this.hide = function(doneHandler) {
		// TODO: refactor access to .showcase-item (-> _showcases)
		_e.addClass("flock-out").find(".showcase-item").addClass("off");
		$.transitionEnd("transform", document.querySelector(".showcase-item:first-child"), function te_flockOff() {
			var showcases = _e;
			showcases.removeClass("flock-out");

			// Killing items
			while (showcases[0].firstChild) {
				showcases[0].removeChild(showcases[0].firstChild);
			}

			doneHandler();
		});
	};

	this.toggleShowcaseFilterState = function(index, isUnfiltered) {
		_showcases[index].toggleFilterState(isUnfiltered);
	};

	// ==== Private ====
	function _determineOrder() {
		var randomizedItem,
			maxCount = _collection.length - 1;

		_order = [];

		while (_order.length !== _collection.length) {
			randomizedItem = _.random(maxCount);

			if (_order.indexOf(randomizedItem) === -1) {
				_order.push(randomizedItem);
			}
		}
	}

	function _create() {
		var fragment = document.createDocumentFragment();

		for (var i = 0; i < _collection.length; i++) {
			_showcases.push(new O4.ShowcaseView(_collection.getShowcaseAtIndex(i), i));
			fragment.appendChild(_showcases[i].getElement());
		}

		_e[0].appendChild(fragment);
	}

	function _animateShowcases() {
		// Stopping animation once collection was changed
		if (app.killAnimation) {
			app.killAnimation = false;
			return;
		}

		var showcase = _collection.getShowcaseAtIndex(_order[_animatedItems]);
			showcaseView = _showcases[_order[_animatedItems]];

		showcaseView.animate(showcase.id, showcase.art.animation, function cb_showcaseAnimated() {
			_animatedItems++;

			if (_animatedItems !== _collection.length) {
				setTimeout(_animateShowcases, 0);
			}
		});
	}

	// TODO: refactor :<
	function _handleItemClick(e) {
		// Suppression, item isn't ready yet
		if (e.target.nodeName === "OL") { return; }

		var target = e.target;
		e.preventDefault();

		// Detecting item
		while (target.nodeName !== "LI") {
			target = target.parentNode;
		}

		// Showing project
		Projects.load(target.getAttribute("data-id"), target);
	}
};