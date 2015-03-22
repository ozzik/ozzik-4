/* ===== Showcases ===== */

var Showcases = {
	collections: {},
	collectionsOptions: {},
	catalog: {},
	activeCollection: null,
	animatedItems: 0,
	killAnimation: false, // Flag for stopping artwork animation handling once collection was changed
	isCollectionReady: false,

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
			Showcases.isCollectionReady = false;
			$.get({
				url: _.data_url(collection + ".json"),
				success: function cb_collection(data) {
					Showcases.handle_collection(data, isProjectLandingPage);
				}
			});
			Navline.start_loading_animation();
		} else {
			Showcases.handle_collection({ items: Showcases.collections[Showcases.activeCollection] });
		}
	},

	handle_collection: function(data, isProjectLandingPage) {
		// Creating styles + saving new data
		var isNew = !Showcases.collections[Showcases.activeCollection];
		if (isNew) {
			Showcases.create_projects_theme(data.items);
			Showcases.load_collection_style(Showcases.activeCollection);
			Showcases.collections[Showcases.activeCollection] = data.items; // Saving
			Showcases.collectionsOptions[Showcases.activeCollection] = data.options; // Saving

			// Generating catalog
			for (var i = 0; i < data.items.length; i++) {
				Showcases.catalog[data.items[i].id] = i;
			}
		}

		// Updating filter controls
		if (Showcases.collectionsOptions[Showcases.activeCollection].isFilterable) {
			$(".strip-menu-button").removeClass("disabled");
		} else {
			$(".strip-menu-button").addClass("disabled").removeClass("active");
			$(".showcases-menu, .showcases-menu .filter-item.active").removeClass("active");
			$(".showcases-menu .filter-item:first-child").addClass("active");
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

	create_projects_theme: function(items) {
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
	},

	load_collection_style: function(collection) {
		style = document.createElement("link");
		style.rel = "stylesheet";
		style.type = "text/css";
		style.href = _.collection_style_url(collection + ".css");
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

	create_item: function(item, index, isPost) {
		var element = document.createElement("li"),
			className = "showcase-item " + (!isPost ? "off" : "active"),
			html = "",
			isNestedElement,
			collection = item.collection || Showcases.activeCollection;

		className += " c-" + item.id + "-main";
		element.className = className;
		element.setAttribute("data-id", item.id);
		element.setAttribute("data-index", index);

		// Link + main wrapper
		html += '<a class="showcase-item-link va-wrapper custom" href="' + _BASE_URL + collection + "/" + (item.url ? item.url : item.id) + '" title="' + item.name + '">';
		// html += '<div class="showcase-candy s-' + item.id + '-candy transformable flockable"></div>'; // When candies are back in fashion
		html += '<div class="va-content">';

		html += '<div class="showcase-art transformable sa-' + item.id + (isPost ? " post" : "") + '">';// p-' + item.id + '">';
		// html += '<div class="showcase-art transformable flockable sa-' + item.id + (isPost ? " post" : "") + '">';// p-' + item.id + '">'; // When candies are back in fashion

		html += Showcases.generate_item_artwork(item, isPost);

		html += '</div>';
		html += '</div></a>';

		element.innerHTML = html;

		return element;
	},

	generate_item_artwork: function(item, isPost) {
		var html = '<div class="s-' + item.id + ' se-sketch fadable' + (isPost ? ' transparent' : '') + '"></div>';

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
		Showcases.isCollectionReady = true;
		$("html, body, .overlay-loading").removeClass("blocked active");
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

		var target = e.target;
		e.preventDefault();

		// Detecting item
		while (target.nodeName !== "LI") {
			target = target.parentNode;
		}

		// Showing project
		Projects.load(target.getAttribute("data-id"), target);
	},

	filter_collection: function(field, value) {
		var collection = Showcases.collections[Showcases.activeCollection];

		if (field && value) {
			for (var i = 0; i < collection.length; i++) {
				if (collection[i][field] === value) {
					$(".showcase-item[data-id='" + collection[i].id + "']").removeClass("filtered").addClass("active");
				} else {
					$(".showcase-item[data-id='" + collection[i].id + "']").addClass("filtered").removeClass("active");
				}
			}
		} else {
			$(".showcase-item").removeClass("filtered").addClass("active");
		}
	}
};