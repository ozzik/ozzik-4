//
// Provides an interface for generating views based on templates
//

var O4 = O4 || {};

O4.TemplateController = function() {
	_templates = [];

	// Setup
	(function() {
		var _templatesRaw = document.querySelectorAll("script[type='text/template']");

		for (var i = 0; i < _templatesRaw.length; i++) {
			_templates[_templatesRaw[i].id.replace("tpl-", "")] = Hogan.compile(_templatesRaw[i].textContent.replace(/\t|\n/g, ""));
			document.body.removeChild(_templatesRaw[i]);
		}
	})();
	
	this.render = function(template, data, isContent) {
		var html = _templates[template].render(data),
			renderee = html,
			fragment;

		if (!isContent) {
			renderee = document.createElement("div");
			renderee.innerHTML = html;
			
			if (renderee.childNodes.length === 1) {
				renderee = renderee.childNodes[0];
			} else {
				fragment = document.createDocumentFragment();

				while(renderee.childNodes.length) {
					fragment.appendChild(renderee.childNodes[0]);
				}

				renderee = fragment;
			}
		}

		return renderee;
	};
};