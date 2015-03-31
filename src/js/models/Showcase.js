//
// Model for showcase
//

var O4 = O4 || {};

O4.Showcase = function(data) {
	this.id = data.id;
	this.name = data.name;
	this.art = data.art;
	this.url = _.url(data.collection + "/" + (data.url ? data.url : data.id));
	this.color = data.color;
	this.similar = data.similar;
	this.scope = data.scope;
};

// O4.Showcase.prototype.