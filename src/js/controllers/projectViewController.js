//
// Controls the project (case study) page
//

var O4 = O4 || {};

O4.ProjectViewController = function(options) {
	var _project = null,
		_projectView = new O4.ProjectView(".project", ".project-artwork"),
		_didFetch = false,
		_isLandingPage = options && options.isLandingPage,
		_self = this;

	_isLandingPage && _initAsLandingPage();

	// ==== Exposed methods ====
	this.present = function(showcase, isViaHistory) {
		// TODO: refactor isViaHistory for landing page
		!isViaHistory && app.navigationController.push({
			view: "project",
			meta: showcase.id,
			url: showcase.url,
			title: showcase.name,
			handlee: this
		});

		_didFetch = false;
		_projectView.init(_isLandingPage);

		if (!_isLandingPage) {
			_projectView.present(showcase, _handleArtworkAnimated);
		} else {
			$(".pages").addClass("hidden");
		}

		_project = showcase;
		_fetchData(showcase);

		_.send_analytics(_project.collection, "load_item", _project.id);
	};

	this.dismiss = function() {
		_.send_analytics(_project.collection, "unload_item", _project.id);

		// Prepping page + UI
		_projectView.dismiss();

		// TODO: refactor
		app.navigationController.setPageTitle(_project.collection !== "products" ? _project.collection[0].toUpperCase() + _project.collection.slice(1) : "");
	};

	this.handlePop = this.dismiss;

	this.handlePush = function() {
		this.present(_project, true);
	};

	// ==== Private ====
	function _fetchData(showcase) {
		O4.Library.getProject({
			collection: showcase.collection,
			id: showcase.id,
			successHandler: _handleData
		});
	}

	function _handleData(project) {
		if (!_project.name) { // Initial data was partial (=project landing page)
			app.navigationController.setPageTitle(project.name);

			// TODO: refactor
			O4.ProjectViewController.prototype.createThemes([ project ]);

			O4.ShowcaseCollectionViewController.loadStyle(project.collection, function cb_collectionStyleLoaded() {
				_projectView.present(_project, _handleArtworkAnimated);
			});
		}

		// Marking data as fetched, continuing to project finale only if animation has ended
		_didFetch = true;
		_project = project; // Saving for being used via animation end callback

		_projectView.presentContent(_project);
	}

	function _handleArtworkAnimated() {
		_didFetch && _projectView.presentContent(_project);
	}

	function _initAsLandingPage() {
		$(".project .back-button").on("click", function() {
			_.send_analytics(_project.collection, "unload_item", _project.id);

			window.location.href = _.url((_project.collection === "products") ? "" : _project.collection);
		});
	}
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