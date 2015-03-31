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
			_collectionView.hide(__fetchData);
		}
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
		// handle filtering options

		_.sendNotification("collectionReady");
		_collectionView.load(_collection);

		if (_loadedCollection.indexOf(collection.name) === -1) {
			_loadedCollection.push(collection.name);

			_.loadStyle(_.collectionStyleUrl(collection.name + ".css"), function cb_collectionStyleLoaded() {
				console.log("style loaded");
			});
			O4.ProjectViewController.prototype.createThemes(collection.items); // TODO: shouldn't access .items

			_fetchAssets();
		} else {
			setTimeout(_collectionView.reveal, 100);
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
					_collectionView.reveal();
				}
			}
		}
	}
};