//
// Controls the display of the screen size notice
//

var O4 = O4 || {};

O4.ScreenWidthNoticeView = function(minScreenWidth) {
	this.isVisible = false;

	(function create() {
		var isMac = (navigator.platform === "MacIntel"),
			view = app.templateController.render("screen-width-notice", {
				platform: isMac ? "mac" : "win",
				isSupported: screen.width > minScreenWidth,
				windowButton: isMac ? "green" : "maximize"
			});

		document.body.appendChild(view);
	})();

	this.toggle = function(isShow) {
		this.isVisible = isShow;
		app.viewportController.toggleOverlay("screen-width", isShow);
	};
};