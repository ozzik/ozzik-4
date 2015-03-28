var O4 = O4 || {};

(function(O4) {
	function ScreenWidthNoticeView(minScreenWidth) {
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
	}

	O4.ScreenWidthNoticeView = ScreenWidthNoticeView;
})(O4);