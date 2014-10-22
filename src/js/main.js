/* ===== Main ===== */

var Main = {
	init: function() {
		Home.setup();
		Projects.load("products");
	}
};

document.addEventListener("DOMContentLoaded", Main.init);