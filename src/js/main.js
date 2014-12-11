/* ===== Main ===== */

var Main = {
	// Navigation system
	NAVIGATION_PUSH: 1,
	NAVIGATION_SWITCH: 2,
	navigationTransitions: [],
	poppedNavigationTransition: [],
	currentState: {},

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
		Main.landingView = {
			view: _landingData.page,
			meta: _landingData.meta,
			url: ""
		};

		Home.setup();
		Showcases.setup();
		Projects.setup();

		Main.hook_events();
	},

	hook_events: function() {
		window.addEventListener("resize", Main.handle_resize);
		window.addEventListener("scroll", Main.handle_scroll);
	},

	/* Events */
	hook: function(event, fn) {
		Main.hooks[event].push(fn);
	},

	handle_resize: function() {
		for (var i = 0; i < Main.hooks.resize.length; i++) {
			Main.hooks.resize[i]();
		}

		Main.fetch_viewport_metrics();
	},

	handle_scroll: function() {
		for (var i = 0; i < Main.hooks.scroll.length; i++) {
			Main.hooks.scroll[i]();
		}
	},

	fetch_viewport_metrics: function() {
		Main.viewport.windowWidth = window.innerWidth;
		Main.viewport.windowHeight = window.innerHeight;
		Main.viewport.pageScrollHeight = document.documentElement.scrollHeight;

		Main.fetch_scrollbar_metrics();
	},
	
	fetch_scrollbar_metrics: function() {
		Main.viewport.scrollbarWidth = window.innerWidth - document.documentElement.offsetWidth;
	},

	/* History */
	push_history: function(data) {
		console.log("=== push", data);
		history.pushState({ data: data }, null, data.url);

		Main.currentState = data;
	},

	handle_history_pop: function(e) {
		console.log("=== pop", e);
		// Back to home
		if (e.view === "home") {
			if (Main.currentState.transition === Main.NAVIGATION_PUSH) {
				Projects.unload();
			} else {
				Navline.select(e.meta, true);
			}
		} else if (e.view === "project") {
			Projects.load(Showcases.catalog[e.meta], null, true);
		}

		Main.currentState = e; // Saving current state info (as if triggered via push_history)
	}
};

// History API
setTimeout(function() {
	window.addEventListener("popstate", function(e) {
		if (e.state !== null) {
			Main.handle_history_pop(e.state.data);
		} else { // Back to main
			Main.handle_history_pop(Main.landingView);
		}
	}, false);
}, 500);

document.addEventListener("DOMContentLoaded", Main.init);