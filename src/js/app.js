/* ===== Main app ===== */

var app = {
	navigationController: null,
	viewportController: null,
	noticeViewController: null,
	homeViewController: null,
	projectViewController: null,
	tipViewController: null,
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

		app.tipViewController = new O4.TipViewController();

		app.dontAnalytics = _isMe;
		
		// Loading page / collection
		if (app.landingView.view === "home") {
			app.homeViewController = new O4.HomeViewController();
		} else {
			app.projectViewController = new O4.ProjectViewController({ isLandingPage: true });
			app.projectViewController.present({
				collection: app.landingView.meta.collection,
				id: app.landingView.meta.item
			}, true);
		}

		// Resize message
		app.noticeViewController = new O4.NoticeViewController();
	}
};

document.addEventListener("DOMContentLoaded", app.init);