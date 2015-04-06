//
// Model for showcase
//

var O4 = O4 || {};

O4.Showcase = function(data) {
	this.id = data.id;
	this.name = data.name;
	this.art = data.art;
	this.url = data.url;
	this.collection = data.collection,
	this.color = data.color;
	this.similar = data.similar;
	this.scope = data.scope;
};

// O4.Showcase.prototype.