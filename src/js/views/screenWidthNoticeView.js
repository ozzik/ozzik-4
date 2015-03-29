//
// Controls the display of the screen size notice
//

var O4 = O4 || {};

O4.ScreenWidthNoticeView = function(minScreenWidth) {
	this.isVisible = false;

	(function create() {
		var view = app.templateController.render("screen-width-notice", {
			platform: (navigator.platform === "MacIntel") ? "mac" : "win",
			isSupported: screen.width > minScreenWidth
		});

		document.body.appendChild(view);
	})();

	this.toggle = function(isShow) {
		this.isVisible = isShow;
		app.viewportController.toggleOverlay("screen-width", isShow);
	};
};