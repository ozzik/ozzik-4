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
		_didAnimate = false;

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
					_e.find(".project-title, .project-preface, .project-content" + (_isLandingPage ? ", .back-button" : "")).addClass("fadable").removeClass("transparent");
					
					// Switching back button's transition for it to bubble on hover
					var backButton = _e.find(".back-button");
					$.transitionEnd("opacity", backButton[0], function te_back_button_fade() {
						backButton.removeClass("fadable");
					});

					setTimeout(function se_project_color() {
						_e.find(".project-header").addClass("colored");
					}, 200);
				}, 150);
			});
		}, 300);

		_setProjectPageContent();
	};

	this.dismiss = function() {
		_.animate_scroll(_e[0], true);

		_e.addClass("blocked");
		app.viewportController.fetchScrollbarMetrics();

		_e.find(".project-title, .project-preface, .project-content, .back-button").addClass("transparent");

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
	function _setProjectPageContent() {
		var title = _e[0].querySelector(".project-title"),
			preface = _e[0].querySelector(".project-preface"),
			content = _e[0].querySelector(".project-content"),
			metaHTML = "";

		title.innerHTML = _project.name;

		preface.className = "project-preface wrapper will-change c-" + _project.id;
		preface.innerHTML = _generatePreface(_project.id, _project.meta, _project.synopsis, _project.content ? true : false);

		_project.content = _project.content || "";
		
		content.innerHTML = _project.content + _generateFooter();
		content.className = "project-content will-change p-" + _project.id + " c-" + _project.id;

		// Loading style
		style = document.createElement("link");
		style.rel = "stylesheet";
		style.type = "text/css";
		style.href = _.project_style_url(_project.id + ".css");
		document.head.appendChild(style);

		// Analytics
		$(content).find("a").on("click", function(e) {
			_.send_analytics("Project - " + _project.id, "link", this.href);
		});

		// Team tip
		_project.meta && _project.meta.team && _setupTeamTip(preface);

		$([title, preface, content]).addClass("transparent");
	}
	
	// TODO: refactor. templates
	function _generatePreface(id, meta, synopsis, hasContent) {
		if (!synopsis) { return ""; }

		var html = '<div class="project-summary">';

		if (meta) {
			meta.team = meta.team || null;
		}

		html += '<dl class="project-meta' + (!meta ? ' hidden': '') + '">'
		for (var key in meta) {
			html += '<dt class="meta project-meta-' + key[0] + '">' + (key[0].toUpperCase() + key.slice(1)) + '</dt>&nbsp;<dd>';

			if (key !== "team") {
				html += meta[key];
			} else {
				html += _generateTeam(meta.team);
			}

			html += '</dd>';
		}
		html += '</dl>';

		html += '<div class="project-story">';
		html += '<p class="project-synopsis">' + synopsis.text + '</p>';
		
		// Button
		if (synopsis.link || synopsis.isDead) {
			html += (synopsis.link) ? '<a href="' + synopsis.link.url + '" target="_blank" title="' + _.rephrase(synopsis.link.caption) + '"' : '<div';
			html += ' class="project-button custom transformable ' + (synopsis.isDead ? ' dead' : '') + '">';
			html += '<span class="button-caption">' + (synopsis.link ? _.rephrase(synopsis.link.caption) : _.phrases.dead) + '</span>';
			html += '</' + (synopsis.link ? 'a' : 'div') + '>';
		}
		html += '</div></div>';

		html += '<figure class="project-preface-image ' + id + '-tldr"></figure>';

		html += '<div class="project-separator s-' + id + ' i-' + id + '"></div>';

		return html;
	}

	// TODO: refactor. templates
	function _generateTeam(team) {
		var html = "";

		if (team) {
			html += '<ul class="project-team columns">';

			for (var member in team) {
				html += '<li class="project-team-member column member-' + member + '" data-tip="<em>' + _.PEOPLE[member].name + "</em>: " + team[member] + '">';
				if (_.PEOPLE[member].url) {
					html += '<a class="project-team-member-link custom" href="' + _.PEOPLE[member].url + '" title="' + _.PEOPLE[member].name + '" target="_blank">' + _.PEOPLE[member].name + '</a>';
				} else {
					html += _.PEOPLE[member].url;
				}
				html += '</li>';
			}

			html += '</ul>';
		} else {
			html += _.rephrase("(%noteam)");
		}

		return html;
	}

	function _setupTeamTip(preface) {
		var team = $(preface.querySelector(".project-team"));

		team.on("mouseover", function(e) {
			var target = e.target,
				travelLevel = 0;

			while (target.nodeName !== "LI" && travelLevel < 1) {
				target = target.parentNode;
				travelLevel++;
			}

			if (target.nodeName === "LI") {
				Overlays.show_tip({
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
			Overlays.hide_tip();
		});
	}

	// TODO: refactor. templates
	function _generateFooter() {
		var html = '',
			similarProject,
			fragment = document.createElement("ul"),
			newThemes = [],
			newCollections = [];

		// Share
		html += '<div class="teaserline teaserline-home top"><div class="teaserline-tag-wrapper teaserline-tag-project"><span class="teaserline-tag">';
		html += 'Things you can do with this page</span></div></div>';
		html += '<div class="project-footer-section project-footer-actions column-2 centered">';
		html += '<p>Share it with other people like we used to do back</br> then when there were no "f" and bird buttons.</p>';
		html += '<p><span class="column column-mid">Or maybe just</span> <a href="mailto:hey@ozzik.co?subject=SHOUT OUT&body=Hey Oz, this is me giving you a shout out. Best, Someone" class="project-action-email-link custom title-colored"><span class="contact-link contact-link-email column column-mid"></span><span class="column column-mid project-action-email-link-text linklike">give me a shout out</span></a></p>';
		html += '</div>';

		// Similar projects - dirrrrty
		if (_project.similar) {
			html += '<div class="teaserline teaserline-home top"><div class="teaserline-tag-wrapper teaserline-tag-project"><span class="teaserline-tag">';
			html += (_project.similar.by ? _project.similar.by : 'Somehow similar things I\'ve done') + '</span></div></div>';
			html += '<ul class="project-footer-section project-footer-similar columns column-' + _project.similar.items.length + '">';

			for (var i = 0; i < _project.similar.items.length; i++) {
				similarProject = _project.similar.items[i];
				fragment.appendChild(O4.ShowcaseView.createView(similarProject, i, true));

				newThemes.push({ id: similarProject.id, color: similarProject.color });
				if (similarProject.collection !== _project.collection) {
					newCollections.push(similarProject.collection);
				}
			}
			html += fragment.innerHTML;

			html += '</ul>';
		}

		// Creating + loading additional CSS
		newThemes.length && O4.ProjectViewController.prototype.createThemes(newThemes);
		for (var collection in newCollections) {
			_.loadStyle(_.collectionStyleUrl(newCollections[collection] + ".css")); // TODO: refactor. used too many times
		}

		return html;
	}
};