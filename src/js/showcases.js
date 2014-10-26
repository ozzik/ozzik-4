/* ===== Showcases ===== */

var Showcases = {
	collections: {},
	activeCollection: null,
	animatedItems: 0,
	didChange: false, // Flag for stopping artwork animations once collection was changed

	/* === Setup === */
	setup: function() {
		$(".showcases").on("click", Showcases.handle_item_click, { isCaptured: true });
	},

	/* === Loading === */
	load: function(collection) {
		if (Showcases.activeCollection === collection) { return; } // Suppression

		// General reset
		Showcases.animatedItems = 0;

		if (!Showcases.activeCollection) { // First collection
			Showcases.fetch(collection);
		} else {
			Showcases.unload(collection); // Load is called via animation callback
		}
	},

	unload: function(newCollection) {
		Showcases.didChange = true;

		$(".showcases").addClass("flock-out").find(".showcase-item").addClass("off");
		$.transitionEnd("transform", document.querySelector(".showcase-item:first-child"), function te_flock_off() {
			var showcases = $(".showcases");
			showcases.removeClass("flock-out");

			// Killing items
			while (showcases[0].firstChild) {
				showcases[0].removeChild(showcases[0].firstChild);
			}

			Showcases.fetch(newCollection);
		});
	},

	fetch: function(collection) {
		Showcases.activeCollection = collection;

		// Requesting *new* collection data
		if (Showcases.collections[Showcases.activeCollection] === undefined) {
			$.get({
				url: _.data_url(collection + ".json"),
				success: Showcases.handle_collection
			});            
		} else {
			Showcases.handle_collection({ items: Showcases.collections[Showcases.activeCollection] });
		}
	},

	handle_collection: function(data) {
		// Creating color themes + saving new data
		if (!Showcases.collections[Showcases.activeCollection]) {
			Showcases.generate_colors(data.colors);
			Showcases.collections[Showcases.activeCollection] = data.items; // Saving
		}
		
		// Creating showcase items
		Showcases.create_collection(Showcases.activeCollection, data.items);

		// Delayed coz of HTML injection pipline, starting intro animations
		setTimeout(function se_collection_injected() {
			$(".showcases").addClass("flock").find(".showcase-item").removeClass("off");
			$.transitionEnd("transform", document.querySelector(".showcase-item:last-child"), function te_flock() {
				$(".showcases").removeClass("flock");
			});
			
			setTimeout(Showcases.animate_item, 300);
		}, 100);
	},

	create_collection: function(collectionName, items) {
		var fragment = document.createDocumentFragment();

		// Showcase items
		for (var i = 0; i < items.length; i++) {
			fragment.appendChild(Showcases.create_item(items[i], i));
		}

		document.body.querySelector(".showcases").appendChild(fragment);
	},

	generate_colors: function(colors) {
		var style = "";

		for (project in colors) {
			style += ".c-" + project + "-main { background-color: #" + colors[project] + "; }";
		}

		document.getElementById("styleRuntime").innerText += style;
	},

	/* === Showcase items creation === */
	create_item: function(item, index) {
		var element = document.createElement("li"),
			className = "showcase-item off",
			html = "",
			isNestedElement;

		className += " c-" + (item.color || item.id) + "-main";
		element.className = className;
		element.setAttribute("data-id", item.id);
		element.setAttribute("data-index", index);

		// Link + main wrapper
		html += '<a class="showcase-item-link va-wrapper custom" href="" title="">';
		html += '<div class="va-content">';

		html += '<div class="showcase-art transformable sa-' + item.id + '">';// p-' + item.id + '">';

		html += Showcases.generate_item_artwork(item);

		html += '</div>';
		html += '</div></a>';

		element.innerHTML = html;

		return element;
	},

	generate_item_artwork: function(item) {
		var html = '<div class="s-' + item.id + ' se-sketch fadable"></div>';

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

		return html;
	},

	animate_item: function() {
		// Stopping animation once collection was changed
		if (Showcases.didChange) {
			Showcases.didChange = false;
			return;
		}

		var item = $(".showcase-item[data-id='" +  Showcases.collections[Showcases.activeCollection][Showcases.animatedItems].id + "']"),
			itemID = Showcases.collections[Showcases.activeCollection][Showcases.animatedItems].id,
			steps = Showcases.collections[Showcases.activeCollection][Showcases.animatedItems].art.animation,
			i = 0;

		// Startig sketch's fade out
		item.find(".se-sketch").addClass("transparent");

		function animate_item_step() {
			var stepData = Showcases.parse_animation_step(itemID, steps[i]);

			$(stepData.e).addClass("animate-" + stepData.animation);
			$.animationEnd(stepData.waitFor, stepData.eLen, function te_showcase_art_step() {
				// Continuing to next step
				i++;
				if (i !== steps.length) {
					animate_item_step();
				} else {
					item.addClass("active").find(".se-sketch").addClass("transparent");

					Showcases.animatedItems++;

					if (Showcases.animatedItems !== Showcases.collections[Showcases.activeCollection].length) {
						setTimeout(Showcases.animate_item, 0);
					}
				}
			}, steps[i][2] || 100);
		}
		animate_item_step();
	},

	parse_animation_step: function(itemID, step) {
		var animation = (step.length === 1 ? "pop-in" : step[1]),
			waitFor = animation,
			e = "",
			eLen = (Array.isArray(step[0])) ? step[0].length : 1;

		// Composing elements
		if (eLen > 1) {
			for (var j = 0; j < eLen; j++) {
				e += (j ? "," : "") + ".s-" + itemID + ".se-" + step[0][j];
			}
		} else {
			e += ".s-" + itemID + '.se-' + step[0];
		}

		// Customized animation name when using multiple simultaneous ones
		if (step[3]) {
			waitFor = step[3];
			eLen = 1;
		}

		return {
			animation: animation,
			waitFor: waitFor,
			e: e,
			eLen: eLen
		};
	},

	/* === Interaction === */
	handle_item_click: function(e) {
		// Suppression, item isn't ready yet
		if (e.target.nodeName === "OL") { return; }

		var target = e.target,
			project;
		e.preventDefault();

		// Detecting item
		while (target.nodeName !== "LI") {
			target = target.parentNode;
		}
		project = target.getAttribute("data-id");

		// Showing project
		Projects.load(target.getAttribute("data-index"), target);
	}
};