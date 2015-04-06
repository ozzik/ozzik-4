//
// Controls the display of a project page
//

var O4 = O4 || {};

O4.ProjectView = function(viewSelector, artworkSelector) {
	var _ART_Y = 225,
		_ART_DEPTH = 1.15;

	var _e = $(viewSelector),
		_eArt = $(artworkSelector),
		_isLandingPage = false,
		_artData = {},
		_project = null,
		_didAnimate = false,
		_eTitle = _e[0].querySelector(".project-title"),
		_ePreface = _e[0].querySelector(".project-preface"),
		_eContent = _e[0].querySelector(".project-content"),
		_eBackButton = _e[0].querySelector(".back-button");

	// ==== Exposed methods ====
	this.init = function(isLandingPage) {
		_isLandingPage = isLandingPage;
	};

	this.didAnimate = function() {
		return _didAnimate;
	};

	this.present = function(project, animatedHandler) {
		var realArt = (!_isLandingPage) ? O4.ShowcaseCollectionViewController.getShowcaseArtwork(project.id) : null,
			parentForFF;

		_project = project;

		// Adjusting back project scrolling
		_e.removeClass("blocked");

		// Duplicating artwork (doing that before so we could fetch its dimensions on initial load)
		_eArt[0].className = "project-artwork showcase-art transformable-rough post sa-" + project.id;
		_eArt[0].innerHTML = O4.ShowcaseView.generateItemArtwork(project);

		// Fetching expensive things
		_artData.width = realArt ? realArt.offsetWidth : _eArt[0].offsetWidth;
		_artData.height = realArt ? realArt.offsetHeight : _eArt[0].offsetHeight;
		if (realArt && $.engine !== "moz") {
			_artData.x = realArt.offsetLeft + (app.viewportController.scrollbarWidth / 2);
			_artData.y = realArt.offsetTop;
		} else if (realArt) { // Firefox
			parentForFF = realArt.parentNode.parentNode.parentNode;
			_artData.x = realArt.offsetLeft + parentForFF.offsetLeft + parentForFF.parentNode.offsetLeft + (app.viewportController.scrollbarWidth / 2);
			_artData.y = realArt.offsetTop + parentForFF.offsetTop + parentForFF.parentNode.offsetTop;
		} else { // Landing
			_artData.x = (app.viewportController.getWidth() - _artData.width) / 2;
			_artData.y = (app.viewportController.getHeight() - _artData.height) / 2;
		}

		// Adjusting scroll position + blocking page interactions
		_.animate_scroll(document.body);
		app.viewportController.setScrollability(false);
		app.viewportController.fetchScrollbarMetrics();
		_e.addClass("active");
		$(".pages").addClass("off");
		_isLandingPage && app.viewportController.toggleOverlay("loading", false); // Removing any loading screen (when project is landing page)

		// Positioning dummy artwork according to original (on initial load: to screen center)
		_eArt[0].style.left = _artData.x + "px";
		_eArt[0].style.top = _artData.y + "px";

		// Hiding showcase page + real artwork
		if (!_isLandingPage) {
			$(realArt).addClass("transparent");
		}
		// Pushing transition change to a different pipeline so revert-ready wouldn't be transitioned
		var sketch = _eArt.find(".se-sketch").addClass("widthable revert-ready");
		setTimeout(function se_sketch_ready_for_revert() {
			sketch.removeClass("fadable");
		}, 0);

		_eArt.transform("scale(" + _ART_DEPTH + ")");

		$.transitionEnd("transform", _eArt[0], function te_project_levitate() {
			// Moving new artwork to its actual new position
			setTimeout(function se_project_position_in() {
				_artData.newX = (app.viewportController.getWidth() - _artData.width) / 2 - _artData.x;
				_artData.newY = _ART_Y - _artData.y - _artData.height;

				_eArt.transform("translate3d(" + _artData.newX + "px," + _artData.newY + "px,0) scale(" + _ART_DEPTH + ")");

				// Marking animation as done, continuing to project finale only if data was fetched
				_didAnimate = true;
				animatedHandler();
			}, 100);
		});
	};

	this.presentContent = function(project) {
		if (!_didAnimate) { return; }

		_project = project;

		var ripple = _e.find(".ripple");

		ripple[0].className = "ripple transformable-toned c-" + _project.id + "-main";

		setTimeout(function se_project_reveal() {
			var sketch = _eArt.find(".se-sketch");

			sketch.addClass("reverted colored");
			$.transitionEnd("width", sketch[0], function te_project_sketch() {
				_eArt.find("*:not(.se-sketch)").addClass("transparent");
				sketch.removeClass("colored");

				_eArt.translate(_artData.newX, _artData.newY);
				setTimeout(function se_project_content_reveal() {
					ripple.transform("translate3d(0,30px,0) scale(" + (app.viewportController.getWidth()/1440 * 5.2) + ")");
					var eWillReveal = [ _eTitle, _ePreface, _eContent ];
					_isLandingPage && eWillReveal.push(_eBackButton);
					$(eWillReveal).addClass("fadable").removeClass("transparent");
					
					// Switching back button's transition for it to bubble on hover
					var backButton = $(_eBackButton);
					$.transitionEnd("opacity", backButton[0], function te_back_button_fade() {
						backButton.removeClass("fadable");
					});

					setTimeout(function se_project_color() {
						_e.find(".project-header").addClass("colored");
					}, 200);
				}, 150);
			});
		}, 300);

		_handleData();
	};

	this.dismiss = function() {
		_.animate_scroll(_e[0], true);

		_e.addClass("blocked");
		app.viewportController.fetchScrollbarMetrics();

		_e.find([ _eTitle, _ePreface, _eContent ]).addClass("transparent");

		_e.find(".project-header").removeClass("colored").find(".ripple").addClass("transformable-rough").removeClass("transformable-toned").transform("");

		_eArt.transform("translate3d(" + _artData.newX + "px," + _artData.newY + "px,0) scale(" + _ART_DEPTH + ")");
		$.transitionEnd("transform", _eArt[0], function te_project_levitate_back() {
			$(".pages").removeClass("off");
			_eArt.transform("scale(" + _ART_DEPTH + ")");

			$.transitionEnd("transform", _eArt[0], function te_project_back() {
				// Reverting to finalized version
				var sketch = _eArt.find(".se-sketch");

				sketch.addClass("c-" + _project.id + "-main");
				_eArt.find("*").removeClass("transparent");
				sketch.removeClass("reverted").addClass("t-out t-normal");

				$.transitionEnd("width", sketch[0], function te_project_sketch_revert() {
					_eArt.transform("");

					$.transitionEnd("transform", _eArt[0], function te_project_delevitate() {
						_eArt.addClass("transparent");
						$(O4.ShowcaseCollectionViewController.getShowcaseArtwork(_project.id)).removeClass("transparent");

						// Giving back control..
						app.viewportController.setScrollability(true);
						app.viewportController.fetchScrollbarMetrics();
						_e.removeClass("active");
					});
				});
			});
		});
	};

	// ==== Private ====
	// TODO: refactor
	function _handleData() {
		_setContent();

		// Loading style
		_.loadStyle(_.projectStyleUrl(_project.id + ".css"));

		// Analytics
		$(_eContent).find("a").on("click", function(e) {
			_.send_analytics("Project - " + _project.id, "link", this.href);
		});

		// Team tip
		_project.meta.team && _setupTeamTip();

		$([_eTitle, _ePreface, _eContent]).addClass("transparent");
	}

	function _setContent() {
		_project.content = _project.content || "";

		_eTitle.innerHTML = _project.name;

		_ePreface.className = "project-preface wrapper will-change c-" + _project.id;
		_.removeAllChildren(_ePreface);
		_ePreface.appendChild(_createPreface());
		
		_eContent.innerHTML = _project.content;
		_eContent.appendChild(_createFooter());
		_eContent.className = "project-content will-change p-" + _project.id + " c-" + _project.id;
	}
	
	function _createPreface() {
		if (!_project.synopsis) { return null; }

		var formattedMeta = [],
			hasMeta = Object.keys(_project.meta).length,
			view;

		for (var key in _project.meta) {
			formattedMeta.push({
				field: key,
				fieldName: key[0].toUpperCase() + key.slice(1),
				value: (typeof _project.meta[key] === "string") ? _project.meta[key] : ""
			});
		}

		view = app.templateController.render("project-preface", {
			projectID: _project.id,
			meta: formattedMeta,
			metaState: (!hasMeta) ? "hidden" : "",
			text: _project.synopsis.text,
			isButton: _project.synopsis.link || _project.synopsis.isDead,
			isDead: _project.synopsis.isDead,
			linkURL: (_project.synopsis.link) ? _project.synopsis.link.url : false,
			linkTitle: (_project.synopsis.link) ? _.rephrase(_project.synopsis.link.caption) : false,
			buttonTitle: (_project.synopsis.link) ? _.rephrase(_project.synopsis.link.caption) : _.phrases.dead
		});

		if (hasMeta) {
			view.childNodes[0].querySelector(".project-meta-team").appendChild(_createTeam());
		}

		return view;
	}

	function _createTeam() {
		var view,
			team = _project.meta.team,
			members = [];

		if (team) {
			for (var member in team) {
				members.push({
					id: member,
					name: _.PEOPLE[member].name,
					url: _.PEOPLE[member].url,
					role: team[member]
				});
			}

			view = app.templateController.render("project-team", { members: members });
		} else {
			view = document.createTextNode(_.rephrase("(%noteam)"));
		}

		return view;
	}

	function _setupTeamTip() {
		var team = $(_ePreface.querySelector(".project-team"));

		team.on("mouseover", function(e) {
			var target = e.target,
				travelLevel = 0;

			while (target.nodeName !== "LI" && travelLevel < 1) {
				target = target.parentNode;
				travelLevel++;
			}

			if (target.nodeName === "LI") {
				app.tipViewController.present({
					subject: target,
					layout: "bottom",
					layoutSecondary: "right",
					horizontalOffset: -18,
					verticalOffset: 4,
					relativeContainer: _e[0],
					text: target.getAttribute("data-tip")
				});
			}
		});
		team.on("mouseout", function(e) {
			app.tipViewController.dismiss();
		});
	}

	function _createFooter() {
		var view,
			similarProject,
			similarFragment = document.createDocumentFragment(),
			newThemes = [],
			newCollections = [];

		view = app.templateController.render("project-footer", {
			hasSimilar: _project.similar ? true : false,
			similarBy: (_project.similar && _project.similar.by) ? _project.similar.by : "Somehow similar things I've done",
			similarCount: (_project.similar) ? _project.similar.items.length : 0
		});

		// Similar projects - dirrrrty
		if (_project.similar) {
			for (var i = 0; i < _project.similar.items.length; i++) {
				similarProject = _project.similar.items[i];
				similarFragment.appendChild(O4.ShowcaseView.createView(similarProject, i, true));

				newThemes.push({ id: similarProject.id, color: similarProject.color });
				if (similarProject.collection !== _project.collection) {
					newCollections.push(similarProject.collection);
				}
			}
			view.querySelector(".project-footer-similar").appendChild(similarFragment);

			// Creating + loading additional CSS
			newThemes.length && O4.ProjectViewController.prototype.createThemes(newThemes);
			for (var collection in newCollections) {
				O4.ShowcaseCollectionViewController.loadStyle(newCollections[collection]);
			}
		}

		return view;
	}
};