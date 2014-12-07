/* ===== Main ===== */

var Main = {
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
	}
};

document.addEventListener("DOMContentLoaded", Main.init);