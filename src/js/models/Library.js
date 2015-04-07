//
// Interface for fetching data
//

var O4 = O4 || {};

O4.Library = {
	// TODO: cache data ._.
	getCollection: function(options) {
		$.get({
			url: _.dataUrl(options.name + ".json"),
			success: function cb_getCollectionSuccess(data) {
				data.name = options.name;
				options.successHandler(new O4.ShowcaseCollection(data));
			}
		});

		_.sendNotification("collectionReload");
	},

	getProject: function(options) {
		$.get({
			url: _.dataUrl(options.collection + "/" + options.id + ".json"),
			success: function cb_getCollectionSuccess(data) {
				options.successHandler(new O4.Project(data));
			}
		});
	}
};