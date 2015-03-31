//
// Controls the project (case study) page
//

var O4 = O4 || {};

O4.ProjectViewController = function() {
	
	// ==== Exposed methods ====

	// ==== Private ====
	
};

// ==== Static methods ====
O4.ProjectViewController.prototype.createThemes = function(items) {
	// Creating CSS color themes
	var style = "",
		project,
		color;

	for (item in items) {
		project = items[item].id;
		color = items[item].color;

		style += ".c-" + project + "-main { background-color: #" + color + "; }";
		style += ".showcase-item.c-" + project + "-main { border-color: #" + _.adjust_brightness(color, -4) + "; }";
		style += ".c-" + project + " h2,.c-" + project + " h3,.c-" + project + " h4,.c-" + project + " em { color: #" + _.adjust_brightness(color, -30) + "; }";
		style += ".c-" + project + " .project-conclusion { border-color: " + _.adjust_saturation(_.adjust_brightness(color, -3), 300) + "; background-color: " + _.adjust_saturation(_.adjust_brightness(color, 3), 300) + "; color: " + _.adjust_saturation(_.adjust_brightness(color, -50), 100) + "; }";
		style += ".c-" + project + " .project-cue::before { background-color: #" + _.adjust_brightness(color, -4) + "; }";
		style += ".c-" + project + " .project-button { color: " + _.adjust_saturation(_.adjust_brightness(color, -30), 300) + "; }";
	}

	document.getElementById("styleRuntime").textContent += style;
};