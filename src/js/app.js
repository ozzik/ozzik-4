/* ===== Main app ===== */

var app = {
	navigationController: null,
	viewportController: null,
	noticeViewController: null,
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
		Projects.setup();

		app.setup_analytics();
		
		// Loading page / collection
		if (app.landingView.view === "home") {
			Home.setup();
			Showcases.setup();
		} else {
			$(".pages").addClass("hidden"); // Hiding pages
			Showcases.activeCollection = app.landingView.meta.collection;
			Projects.load(app.landingView.meta.item, null, true);
		}

		// Resize message
		app.noticeViewController = new O4.NoticeViewController();
	},

	setup_analytics: function() {
		var links = document.querySelectorAll(".page[data-for='about'] a");
		
		for (var i = 0; i < links.length; i++) {
			links[i].addEventListener("click", function() {
				_.send_analytics("about", "link", this.getAttribute("href"));
			});
		}

		app.dontAnalytics = _isMe;
	}
};

document.addEventListener("DOMContentLoaded", app.init);