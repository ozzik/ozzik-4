/* ===== Main app ===== */

var app = {
	dontAnalytics: false,
	hooks: {
		resize: [],
		scroll: []
	},
	viewport: {
		windowWidth: 0,
		windowHeight: 0,
		pageScrollHeight: 0,
		scrollbarWidth: 0
	},

	init: function() {
		// Detecting landing page
		app.landingView = {
			view: _landingData.page,
			meta: _landingData.meta,
			url: ""
		};


		app.navigationController = new O4.NavigationController({
			title: "Oz Pinhas",
			rootView: app.landingView.meta
		});


		Overlays.setup();
		Projects.setup();

		app.hook_events();
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
		app.setup_screen_width_requirements();
	},

	/* Events */
	hook_events: function() {
		window.addEventListener("resize", app.handle_resize);
		window.addEventListener("scroll", app.handle_scroll);
	},

	hook: function(event, fn) {
		app.hooks[event].push(fn);
	},

	handle_resize: function() {
		for (var i = 0; i < app.hooks.resize.length; i++) {
			app.hooks.resize[i]();
		}

		app.fetch_viewport_metrics();
	},

	handle_scroll: function() {
		for (var i = 0; i < app.hooks.scroll.length; i++) {
			app.hooks.scroll[i]();
		}
	},

	fetch_viewport_metrics: function() {
		app.viewport.windowWidth = window.innerWidth;
		app.viewport.windowHeight = window.innerHeight;
		app.viewport.pageScrollHeight = document.documentElement.scrollHeight;

		app.fetch_scrollbar_metrics();
	},
	
	fetch_scrollbar_metrics: function() {
		app.viewport.scrollbarWidth = window.innerWidth - document.documentElement.offsetWidth;
	},

	/* Messages */
	setup_screen_width_requirements: function() {
		// Setup
		app.minScreenWidth = document.querySelector(".home-work").offsetWidth;
		app.isScreenWidthMsg = false;

		app.create_screen_width_message();
		
		app.hook("resize", app.toggle_screen_width_message);
		app.toggle_screen_width_message();
	},

	create_screen_width_message: function() {
		var div = document.createElement("div"),
			html = "",
			isMac = (navigator.platform === "MacIntel");

		div.className = "overlay va-wrapper overlay-screen-width";

		html += '<div class="va-content"><div class="screen-width-wrapper column">';
		html += '<div class="screen-width-art column ' + (isMac ? "mac" : "win") + '"></div>';
		html += '<h2>This website isn\'t responsive (!)</h2>';
		html += '<p>Instead of making this website responsive I’ve chosen to work on another side project or just watch another hour of Grey’s Anatomy.</p>';

		if (screen.width >= app.minScreenWidth) {
			html += '<p>Now, buddy, a little birdy told me your </br>screen could fit this website perfectly.</br> Please push the ' + (isMac ? "green" : "maximize") + ' button, thank you.</p>';
			html += '<div class="screen-width-instructions column ' + (isMac ? "mac" : "win") + '"></div>';
		} else {
			html += '<p>Please use a screen of at least 768px wide.</p>';
		}

		html += '</div></div>';

		div.innerHTML = html;

		document.body.appendChild(div);
	},

	toggle_screen_width_message: function() {
		if (window.innerWidth < app.minScreenWidth && !app.isScreenWidthMsg) {
			app.isScreenWidthMsg = true;
			$(".overlay-screen-width").addClass("active");
			$("html, body").addClass("blocked");
		} else if (window.innerWidth >= app.minScreenWidth && app.isScreenWidthMsg) {
			app.isScreenWidthMsg = false;
			$(".overlay-screen-width").removeClass("active");
			$("html, body").removeClass("blocked");
		}
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