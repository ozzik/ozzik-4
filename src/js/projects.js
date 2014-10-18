/* ===== Projects ===== */

var Projects = {
	loaded: [],
	items: null,
	animatedItems: 0,

	load: function(collection) {
		$.get({
			url: _.data_url(collection + ".json"),
			success: function(data) {
				Projects.handle_collection(collection, data.items, data.colors);

				Projects.items = data.items;

				// Delayed coz of HTML injection pipline
				setTimeout(function() {
					$(".projects").addClass("flock").find(".project-item").removeClass("pop-ready");
					
					setTimeout(Projects.animate_item, 300);
				}, 0);
			}
		});
	},

	handle_collection: function(collectionName, items, colors) {
		var fragment = document.createDocumentFragment();

		// Colors
		(Projects.loaded.indexOf(collectionName) === -1) && Projects.generate_colors(colors);

		// Project items
		for (var i = 0; i < items.length; i++) {
			fragment.appendChild(Projects.create_item(items[i]));
		}

		document.body.querySelector(".projects").appendChild(fragment);
	},

	generate_colors: function(colors) {
		var style = "";

		for (project in colors) {
			style += ".color-" + project + " { background-color: #" + colors[project] + "; }";
		}

		document.getElementById("styleRuntime").innerText = style;
	},

	create_item: function(item) {
		var element = document.createElement("li"),
			className = "project-item pop-ready",
			html = "",
			isNestedElement;

		className += " color-" + (item.color || item.id);
		element.className = className;
		element.setAttribute("data-id", item.id);

		html += '<div class="showcase-content-wrapper"><div class="showcase-content">';

		html += '<div class="showcase-art">';// p-' + item.id + '">';
		html += '<div class="s-' + item.id + ' se-sketch"></div>';

		for (var i = 0; i < item.art.elements.length; i++) {
			isNestedElement = Array.isArray(item.art.elements[i]);
			html += '<div class="s-' + item.id + ' se-' + (!isNestedElement ? item.art.elements[i] : item.art.elements[i][0]) + '">';

			// Nested elements
			if (isNestedElement) {
				for (var j = 1; j < item.art.elements[i].length; j++) {
					html += '<div class="s-' + item.id + ' se-' + item.art.elements[i][j] + '"></div>';
				}
			}

			html += '</div>';
		}

		html += '</div>';
		
		html += '</div></div>';

		element.innerHTML = html;

		return element;
	},

	animate_item: function() {
		var item = $(".project-item[data-id='" +  Projects.items[Projects.animatedItems].id + "']");

		// Pop in
		item.find(".se-sketch").addClass("transparent");
		// $.transitionEnd("transform", item[0], function() {
			// Color
			// item.addClass("colored");
			// $.transitionEnd("background-color", item[0], function() {
				var itemID = Projects.items[Projects.animatedItems].id,
					steps = Projects.items[Projects.animatedItems].art.animation,
					i = 0;

				function animate_item_step() {
					var animationEnd = (steps[i].length === 1 ? "pop-in" : steps[i][1]),
						e = "",
						eLen = (Array.isArray(steps[i][0])) ? steps[i][0].length : 1;

					// Composing elements
					if (eLen > 1) {
						for (var j = 0; j < eLen; j++) {
							e += (j ? "," : "") + ".s-" + itemID + ".se-" + steps[i][0][j];
						}
					} else {
						e += ".s-" + itemID + '.se-' + steps[i][0];
					}

					$(e).addClass("animate-" + animationEnd);

					// Customized animation name when using multiple simultaneous ones
					if (steps[i][3]) {
						animationEnd = steps[i][3];
						eLen = 1;
					}

					$.animationEnd(animationEnd, eLen, function() {
						// Cycling
						i++;
						if (i !== steps.length) {
							animate_item_step();
						} else {
							item.find(".se-sketch").addClass("transparent");

							Projects.animatedItems++;

							if (Projects.animatedItems !== Projects.items.length) {
								setTimeout(Projects.animate_item, 0);
							}
						}
					}, steps[i][2] || 100);
				}
				animate_item_step();
			// }, 100);
		// }, 100);
	}
};