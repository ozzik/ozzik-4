//
// Controls the showcase collection element
//

var O4 = O4 || {};

O4.ShowcaseCollectionViewController = function() {
	var _collection = null,
		_collectionView = new O4.ShowcaseCollectionView(".showcases"),
		_self = this,
		_loadedCollection = [],
		_pendingAssets;

	_setupFilterControl();

	// ==== Exposed methods ====
	this.load = function(collection) {
		_.send_analytics(collection, "load", "");

		function __fetchData() {
			_fetchData(collection);
		}

		_collectionView.reset();

		if (!_collection) {
			__fetchData();
		} else {
			_collectionView.dismiss(__fetchData);
		}
	};

	this.getName = function() {
		return _collection.name;
	};

	// ==== Private ====
	function _fetchData(collection) {
		O4.Library.getCollection({
			name: collection,
			successHandler: _handleData
		});
	}

	function _handleData(collection) {
		_collection = collection;
		_toggleFilterControlAvailability();

		_.sendNotification("collectionReady");
		_collectionView.load(_collection);

		if (_loadedCollection.indexOf(collection.name) === -1) {
			_loadedCollection.push(collection.name);

			_.loadStyle(_.collectionStyleUrl(collection.name + ".css")); // TODO: refactor, used too many times
			O4.ProjectViewController.prototype.createThemes(collection.items); // TODO: shouldn't access .items

			_fetchAssets();
		} else {
			setTimeout(_collectionView.present, 100);
		}
	}

	function _fetchAssets() {
		var img;

		_pendingAssets = _collection.length;

		for (var i = 0; i < _collection.length; i++) {
			img = new Image();
			img.src = _.projectShowcaseUrl(_collection.getShowcaseAtIndex(i).id + ".png");
			img.onload = function(e) {
				_pendingAssets--;

				if (!_pendingAssets) {
					_collectionView.present();
				}
			}
		}
	}

	function _setupFilterControl() {
		$(".strip-menu-button").on("click", function() {
		    var menu = document.querySelector(".showcases-menu");

		    $([ this, menu ]).toggleClass("active");
		});

		$(".showcases-menu .filter-item").on("click", function() {
		    $(".showcases-menu .filter-item.active").removeClass("active");
		    $(this).addClass("active");

		    _filter("scope", this.getAttribute("data-value"));
		});
	}

	function _toggleFilterControlAvailability() {
		if (_collection.isFilterable) {
			$(".strip-menu-button").removeClass("disabled");
		} else {
			$(".strip-menu-button").addClass("disabled").removeClass("active");
			$(".showcases-menu, .showcases-menu .filter-item.active").removeClass("active");
			$(".showcases-menu .filter-item:first-child").addClass("active");
		}
	}

	function _filter(field, value) {
		var __filterHandler;

		if (field && value) {
			__filterHandler = function(i, field, value) {
				return _collection.getShowcaseAtIndex(i)[field] === value;
			};
		} else {
			__filterHandler = function(i, field, value) {
				return true;
			};
		}

		for (var i = 0; i < _collection.length; i++) {
			_collectionView.toggleShowcaseFilterState(i, __filterHandler(i, field, value));
		}
	}
};

// ==== Static methods ====
O4.ShowcaseCollectionViewController.getShowcaseArtwork = function(showcaseID) {
	return document.querySelector(".showcase-item[data-id='" + showcaseID + "'] .showcase-art");
}
