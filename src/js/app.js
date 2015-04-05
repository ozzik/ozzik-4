/* ===== Main app ===== */

var app = {
	navigationController: null,
	viewportController: null,
	noticeViewController: null,
	homeViewController: null,
	projectViewController: null,
	killAnimation: false, // Flag for stopping a callback-triggered animation
	dontAnalytics: false,

	init: function() {
		// Detecting landing page
		app.landingView = {
			view: _landingData.page,
			meta: _landingData.meta,
			url: ""
		};

		app.templateController = new O4.TemplateController();
		app.navigationController = new O4.NavigationController({
			title: "Oz Pinhas",
			rootView: app.landingView.meta
		});
		app.viewportController = new O4.ViewportController();

		Overlays.setup();
		// Projects.setup(); TODO: do

		app.dontAnalytics = _isMe;
		
		// Loading page / collection
		if (app.landingView.view === "home") {
			app.homeViewController = new O4.HomeViewController();
		} else {
			$(".pages").addClass("hidden"); // Hiding pages
			Showcases.activeCollection = app.landingView.meta.collection;
			Projects.load(app.landingView.meta.item, null, true);
		}

		// Resize message
		app.noticeViewController = new O4.NoticeViewController();
	}
};

document.addEventListener("DOMContentLoaded", app.init);