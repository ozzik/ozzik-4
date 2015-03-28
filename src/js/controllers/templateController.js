var O4 = O4 || {};

(function(O4) {
	function TemplateController() {
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
			var html = _templates[template].render(data);
				renderee = html;

			if (!isContent) {
				renderee = document.createElement("div");
				renderee.innerHTML = html;
				renderee = renderee.childNodes[0];
			}

			return renderee;
		};
	}

	O4.TemplateController = TemplateController;
})(O4);