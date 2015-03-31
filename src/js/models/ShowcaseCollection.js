//
// Model for collection of showcases
//

var O4 = O4 || {};

(function() {
	function ShowcaseCollection(data) {
		this.name = data.name;
		this.catalog = data.catalog;
		this.isFilterable = data.options.isFilterable;

		this.items = _createItems(this, data.items);
		this.length = this.items.length;
	}

	function _createItems(self, items) {
		var showcases = [];
		
		for (var i = 0; i < items.length; i++) {
			items[i].collection = self.name;
			showcases.push(new O4.Showcase(items[i]));
		}

		return showcases;
	}

	ShowcaseCollection.prototype.getShowcase = function(id) {
		return this.getShowcaseAtIndex(this.catalog[id]);
	};

	ShowcaseCollection.prototype.getShowcaseAtIndex = function(index) {
		return this.items[index];
	};

	O4.ShowcaseCollection = ShowcaseCollection;
})();