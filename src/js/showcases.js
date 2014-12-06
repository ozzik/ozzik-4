/* ===== Showcases ===== */

var Showcases = {
	collections: {},
	catalog: {},
	activeCollection: null,
	animatedItems: 0,
	killAnimation: false, // Flag for stopping artwork animation handling once collection was changed

	/* === Setup === */
	setup: function() {
		$(".showcases").on("click", Showcases.handle_item_click, { isCaptured: true });
	},

	/* === Loading === */
	load: function(collection, isProjectLandingPage) {
		if (Showcases.activeCollection === collection) { return; } // Suppression

		// General reset
		// Stopping previous collection animations while changing (are handled via callbacks which can't be controlled)
		Showcases.killAnimation = Showcases.activeCollection && Showcases.animatedItems !== Showcases.collections[Showcases.activeCollection].length;
		Showcases.animatedItems = 0;

		if (!Showcases.activeCollection) { // First collection
			Showcases.fetch(collection, isProjectLandingPage);
		} else {
			Showcases.unload(collection); // Load is called via animation callback
		}
	},

	unload: function(newCollection) {
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

	fetch: function(collection, isProjectLandingPage) {
		Showcases.activeCollection = collection;

		// Requesting *new* collection data
		if (Showcases.collections[Showcases.activeCollection] === undefined) {
			$.get({
				url: _.data_url(collection + ".json"),
				success: function cb_collection(data) {
					Showcases.handle_collection(data, isProjectLandingPage);
				}
			});            
		} else {
			Showcases.handle_collection({ items: Showcases.collections[Showcases.activeCollection] });
		}
	},

	handle_collection: function(data, isProjectLandingPage) {
		// Creating styles + saving new data
		var isNew = !Showcases.collections[Showcases.activeCollection];
		if (isNew) {
			Showcases.create_styles(data.colors);
			Showcases.collections[Showcases.activeCollection] = data.items; // Saving

			// Generating catalog
			for (var i = 0; i < data.items.length; i++) {
				Showcases.catalog[data.items[i].id] = i;
			}
		}

		// Suppression when collection was loaded only for project page (direct link)
		if (isProjectLandingPage) {
			Showcases.collectionStyleReadyFn = function load_project_after_collection_style() {
				Projects.load(Showcases.catalog[Home.landingView.meta.item]);
			};

			return;
		}

		// Picking up a randomized enterance order for collection items
		Showcases.determine_collection_order(data.items.length);
		
		// Creating showcase items
		Showcases.create_collection(Showcases.activeCollection, data.items);

		// Fetching assets for appropriate callback
		if (isNew) {
			Showcases.loadFn = Showcases.reveal_collection;
			Showcases.fetch_collection_assets(data.items);
		} else {
			setTimeout(Showcases.reveal_collection, 100);
		}
	},

	fetch_collection_assets: function(items) {
		var img;

		Showcases.requiredLoadItems = items.length;

		for (var i = 0; i < items.length; i++) {
			img = new Image();
			img.src = _.project_showcase_url(items[i].id + ".png");
			img.onload = function(e) {
				Showcases.requiredLoadItems--;

				if (!Showcases.requiredLoadItems) {
					Showcases.loadFn && Showcases.loadFn();
				}
			}
		}
	},

	create_styles: function(colors) {
		// Creating CSS color themes
		var style = "";

		for (project in colors) {
			style += ".c-" + project + "-main { background-color: #" + colors[project] + "; }";
			style += ".showcase-item.c-" + project + "-main { border-color: #" + _.adjust_brightness(colors[project], -4) + "; }";
			style += ".c-" + project + " h2,.c-" + project + " h3,.c-" + project + " h4 { color: #" + _.adjust_brightness(colors[project], -30) + "; }";
			style += ".c-" + project + " .project-button { color: " + _.adjust_saturation(_.adjust_brightness(colors[project], -30), 300) + "; }";
		}

		document.getElementById("styleRuntime").innerText += style;

		// Injecting collection stylesheet
		style = document.createElement("link");
		style.rel = "stylesheet";
		style.type = "text/css";
		style.href = _.collection_style_url(Showcases.activeCollection + ".css");
		style.addEventListener("load", function onload_collection_style() {
			Showcases.collectionStyleReadyFn && Showcases.collectionStyleReadyFn();
		});
		
		document.head.appendChild(style);
	},

	determine_collection_order: function(count) {
		var randomizedItem,
			maxCount = count - 1;

		Showcases.collectionOrder = [];

		while (Showcases.collectionOrder.length !== count) {
			randomizedItem = _.random(maxCount);

			if (Showcases.collectionOrder.indexOf(randomizedItem) === -1) {
				Showcases.collectionOrder.push(randomizedItem);
			}
		}
	},

	/* === Showcase items creation === */
	create_collection: function(collectionName, items) {
		var fragment = document.createDocumentFragment();

		// Showcase items
		for (var i = 0; i < items.length; i++) {
			fragment.appendChild(Showcases.create_item(items[i], i));
		}

		document.body.querySelector(".showcases").appendChild(fragment);
	},

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
		html += '<a class="showcase-item-link va-wrapper custom" href="" title="' + item.name + '">';
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

	/* === Showcases intro === */
	reveal_collection: function() {
		$("html, body, .overlays").removeClass("blocked active");
		Main.fetch_viewport_metrics();

		setTimeout(function se_collection_ready_for_reveal() {
			$(".showcases").addClass("flock").find(".showcase-item").removeClass("off");
			$.transitionEnd("transform", document.querySelector(".showcase-item:last-child"), function te_flock() {
				$(".showcases").removeClass("flock");

				setTimeout(Showcases.animate_item, 100);
			});
		}, 100);
	},

	animate_item: function() {
		// Stopping animation once collection was changed
		if (Showcases.killAnimation) {
			Showcases.killAnimation = false;
			return;
		}

		var collectionItem = Showcases.collections[Showcases.activeCollection][Showcases.collectionOrder[Showcases.animatedItems]],
			item = $(".showcase-item[data-id='" +  collectionItem.id + "']"),
			itemID = collectionItem.id,
			steps = collectionItem.art.animation,
			i = 0;

		// Startig sketch's fade out
		item.find(".se-sketch").addClass("transparent");

		function animate_item_step() {
			var stepData = Showcases.parse_animation_step(itemID, steps[i]);

			$(stepData.e).addClass("animate-" + stepData.animation);
			$.animationEnd(stepData.waitFor, stepData.eLen, function te_showcase_art_step() {
				// Stopping animation once collection was changed (could also be called from here)
				if (Showcases.killAnimation) {
					Showcases.killAnimation = false;
					return;
				}

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