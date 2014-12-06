var Home = {};

(function () {
	var Navline = {
		e: null,
		eHeader: null,
		eActiveItem: null,
		eHighligtedItem: null,

		setup: function() {
			Navline.eHeader = $(".home-navigation");
			Navline.e = $(".navline");

			Navline.update_offset();
			Main.hook("resize", Navline.update_offset);

			Navline.eHeader.on("mouseover", Navline.handle_mouseover);
			Navline.eHeader.on("mouseout", Navline.handle_mouseout);
			Navline.eHeader.on("click", Navline.handle_click);
			Navline.eHeader.find("a").on("click", function(e) {
				e.preventDefault();
			});
		},

		/* Being called also via resize */
		update_offset: function() {
			Navline.offsetX = Navline.eHeader[0].offsetLeft;
		},

		handle_mouseover: function(e) {
			if (!e.target || e.target.nodeName !== "A" || Navline.eActiveItem === e.target) { return; } // Suppression

			Navline.select(e.target, true);
		},

		handle_mouseout: function(e) {
			if (Navline.eHighligtedItem === Navline.eActiveItem || e.relatedTarget.nodeName === "LI") { return } // Suppression

			Navline.select(Navline.eActiveItem);   
		},

		handle_click: function(e, isFirst) {
			if (!e.target || e.target.nodeName !== "A" || Navline.eActiveItem === e.target) { return; } // Suppression

			e.stopPropagation && e.stopPropagation();

			var collectionName = e.target.getAttribute("data-for");

			// Pushing history
			!isFirst && Home.push_history({
				view: "home",
				meta: collectionName,
				transition: Home._NAVIGATION_SWITCH,
				url: (collectionName === "products") ? _.url("") : collectionName
			});

			Navline.select(e.target);
			Showcases.load(collectionName);
		},

		select: function(item, isHighlight) {
			var offsetWidth = item.offsetWidth;

			// Changing item active state
			Navline.eHighligtedItem && $(Navline.eHighligtedItem.parentNode).removeClass("active");
			Navline.eActiveItem = (!isHighlight) ? item : Navline.eActiveItem; // Changing item only upon selection, not hover
			Navline.eHighligtedItem = item;
			$(item.parentNode).addClass("active");

			// Adjusting line to new item, minimized (pre-selection) or full-width
			Navline.e[0].style.width = offsetWidth + "px";
			Navline.e.transform("translate3d(" + (item.offsetLeft - Navline.offsetX) + "px,0,0) " + (isHighlight ? "scaleX(.05)" : ""));
		}
	};

	Home.setup = function() {
		// Detecting landing page
		Home.landingView = {
			view: _landingData.page,
			meta: _landingData.meta,
			url: ""
		};

		// Setting up navigation
		Navline.setup();
		setup_teaser();

		// Loading page / collection
		if (Home.landingView.view === "home") {
			Navline.handle_click({ target: Navline.eHeader[0].querySelector(".home-navigation-link[data-for='" + Home.landingView.meta + "']") }, true);
		} else {
			// Loading collection, and only then loading project itself
			Showcases.load(Home.landingView.meta.collection, true);
			$(".pages").addClass("off"); // Hiding pages
		}
	};

	// Navigation system
	Home._NAVIGATION_PUSH = 1;
	Home._NAVIGATION_SWITCH = 2;
	Home.navigationTransitions = [];

	Home.push_history = function(data) {
		console.log("=== push", data);
		history.pushState({ data: data }, null, data.url);
		Home.navigationTransitions.push(data.transition);
	};

	Home.handle_history_pop = function(e) {
		var transition = Home.navigationTransitions.pop();

		console.log("=== pop");

		// Back to home
		if (e.view === "home") {
			if (transition === Home._NAVIGATION_PUSH) {
				Projects.unload();
			} else {
				Navline.handle_click({ target: Navline.eHeader[0].querySelector(".home-navigation-link[data-for='" + e.meta + "']") }, true);
			}
		}
	}

	// Teaserline
	var _teaserLine = $(".teaserline-home.top"),
		_teaserTag = $(".teaserline-tag-about"),
		_ttHeight = _teaserTag[0].offsetHeight,
		_ttMinY = parseInt(_teaserTag[0].offsetHeight / -2, 10) - 3,
		_ttMaxY = parseInt((_teaserLine[0].offsetHeight - _ttHeight) / 2, 10) - _ttMinY,
		_wasPlaced;

	setup_teaser = function() {
		// Initial peeking position
		_teaserTag.translate(0, _ttMinY).find(".teaserline-tag").addClass("attention");

		Main.hook("scroll", function hook_scroll_teaser() {
			if (_wasPlaced) { return; }

			var step = window.scrollY / (Main.viewport.pageScrollHeight - Main.viewport.windowHeight);

			// Marking tag as placed so it won't move anymore
			if (step === 1) {
				_wasPlaced = true;
				setTimeout(function se_teaser_ring() {
					_teaserTag.find(".teaserline-tag").removeClass("attention");
					$(".about-image-ring").addClass("ping");
				}, 50);
			}

			_teaserTag.translate(0, _ttMaxY * step + _ttMinY);
		});
	}
})();

// History API
setTimeout(function() {
	window.addEventListener("popstate", function(e) {
		console.log(e);
		if (e.state !== null) {
			console.log("history: " + e.state.data);
			Home.handle_history_pop(e.state.data);
		} else { // Back to main
			console.log("history to landing view");
			Home.handle_history_pop(Home.landingView);
		}
	}, false);
}, 500);