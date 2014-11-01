/* ===== Main ===== */

var Main = {
	hooks: {
		resize: []
	},

	init: function() {
		Home.setup();
		Showcases.setup();
		Projects.setup();

		Main.hook_events();
	},

	hook_events: function() {
		window.addEventListener("resize", Main.handle_resize);
	},

	/* Events */
	hook: function(event, fn) {
		Main.hooks[event].push(fn);
	},

	handle_resize: function() {
		for (var i = 0; i < Main.hooks.resize.length; i++) {
			Main.hooks.resize[i]();
		}
	}
};

document.addEventListener("DOMContentLoaded", Main.init);