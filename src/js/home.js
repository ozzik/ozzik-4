var Home = {};

(function(){
	// Navigation system
	var _NAVIGATION_PUSH = 1,
		_NAVIGATION_SWITCH = 2,
		_navigationTransitions = [];

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
			Navline.select(Home.landingView.meta, true);
		} else {
			// Loading collection, and only then loading project itself
			Showcases.load(Home.landingView.meta.collection, true);
			$(".pages").addClass("off"); // Hiding pages
		}
	};

	Home.push_history = function(data) {
		console.log("=== push", data);
		history.pushState({ data: data }, null, data.url);
		_navigationTransitions.push(data.transition);
	};

	Home.handle_history_pop = function(e) {
		var transition = _navigationTransitions.pop();

		console.log("=== pop");

		// Back to home
		if (e.view === "home") {
			if (transition === Home._NAVIGATION_PUSH) {
				Projects.unload();
			} else {
				Navline.select(e.meta, true);
			}
		}
	};

	// Teaserline
	var _teaserLine = $(".teaserline-home.top"),
		_teaserTag = $(".teaserline-tag-about"),
		_ttHeight = _teaserTag[0].offsetHeight,
		_ttMinY = parseInt(_teaserTag[0].offsetHeight / -2, 10) - 3,
		_ttMaxY = parseInt((_teaserLine[0].offsetHeight - _ttHeight) / 2, 10) - _ttMinY,
		_wasPlaced;

	function setup_teaser() {
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