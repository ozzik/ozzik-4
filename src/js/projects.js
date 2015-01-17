/* ===== Projects ===== */

var Projects = {
	ART_Y: 225,
	ART_DEPTH: 1.15,
	e: null,
	eArt: null,
	artData: {},
	did: {
		fetch: false,
		animate: false
	},
	activeItem: null,
	isLandingPage: false,

	/* Setup */
	setup: function() {
		Projects.e = $(".project");
		Projects.eArt = $(".project-artwork");

		$(".project .back-button").on("click", function() {
			// Initial load behavior
			_.send_analytics(Showcases.activeCollection, "unload_item", Projects.activeItem.id);

			window.location.href = _.url((Showcases.activeCollection === "products") ? "" : Showcases.activeCollection);
		});
	},

	load: function(project, item, isDontHistory) {
		Projects.isLandingPage = Main.landingView.view === "project";

		// Synthesizing args
		project = Showcases.collections[Showcases.activeCollection][project];
		item = item || document.querySelector(".showcase-item[data-id='" + project.id + "']");

		// Pushing history
		!isDontHistory && Main.push_history({
			view: "project",
			meta: project.id,
			transition: Main.NAVIGATION_PUSH,
			url: Showcases.activeCollection + "/" + (project.url ? project.url : project.id),
			title: project.name
		});
		Main.set_page_title(project.name);

		// Marking project as hasn't been loaded yet
		Projects.did.fetch = false;
		Projects.did.animate = false;

		// Loading project data
		Projects.animate_into_project(project, item);
		$.get({
			url: _.data_url(Showcases.activeCollection + "/" + project.id + ".json"),
			success: function(data) {
				data.color = project.color || project.id; // Synthesizing color data
				data.id = project.id;
				data.name = project.name;

				// Marking data as fetched, continuing to project finale only if animation has ended
				Projects.did.fetch = true;
				Projects.activeItem = data; // Saving for being used via animation end callback
				Projects.did.animate && Projects.reveal_project_page(project, item);
			}
		});

		_.send_analytics(Showcases.activeCollection, "load_item", project.id);
	},

	animate_into_project: function(project, item) {
		var realArt = (!Projects.isLandingPage) ? item.querySelector(".showcase-art") : null,
			parentForFF;

		// Adjusting back project scrolling
		Projects.e.removeClass("blocked");

		// Duplicating artwork (doing that before so we could fetch its dimensions on initial load)
		Projects.eArt[0].className = "project-artwork showcase-art transformable-rough post sa-" + project.id;
		Projects.eArt[0].innerHTML = Showcases.generate_item_artwork(project);

		// Fetching expensive things
		Projects.artData.width = realArt ? realArt.offsetWidth : Projects.eArt[0].offsetWidth;
		Projects.artData.height = realArt ? realArt.offsetHeight : Projects.eArt[0].offsetHeight;
		if (realArt && $.engine !== "moz") {
			Projects.artData.x = realArt.offsetLeft + (Main.viewport.scrollbarWidth / 2);
			Projects.artData.y = realArt.offsetTop;
		} else if (realArt) { // Firefox
			parentForFF = realArt.parentNode.parentNode.parentNode;
			Projects.artData.x = realArt.offsetLeft + parentForFF.offsetLeft + parentForFF.parentNode.offsetLeft + (Main.viewport.scrollbarWidth / 2);
			Projects.artData.y = realArt.offsetTop + parentForFF.offsetTop + parentForFF.parentNode.offsetTop;
		} else { // Landing
			Projects.artData.x = (window.innerWidth - Projects.artData.width) / 2;
			Projects.artData.y = (window.innerHeight - Projects.artData.height) / 2;
		}

		// Adjusting scroll position + blocking page interactions
		_.animate_scroll(document.body);
		$([ document.body, document.documentElement ]).addClass("blocked");
		Main.fetch_scrollbar_metrics();
		Projects.e.addClass("active");
		$(".pages").addClass("off");
		$(".overlay-loading").removeClass("blocked active"); // Removing any loading screen (via initial load)

		// Positioning dummy artwork according to original (on initial load: to screen center)
		Projects.eArt[0].style.left = Projects.artData.x + "px";
		Projects.eArt[0].style.top = Projects.artData.y + "px";

		// Hiding showcase page + real artwork
		if (!Projects.isLandingPage) {
			$(realArt).addClass("transparent");
		}
		// Pushing transition change to a different pipeline so revert-ready wouldn't be transitioned
		var sketch = Projects.eArt.find(".se-sketch").addClass("widthable revert-ready");
		setTimeout(function se_sketch_ready_for_revert() {
			sketch.removeClass("fadable");
		}, 0);

		Projects.eArt.transform("scale(" + Projects.ART_DEPTH + ")");

		$.transitionEnd("transform", Projects.eArt[0], function te_project_levitate() {
			// Moving new artwork to its actual new position
			setTimeout(function se_project_position_in() {
				Projects.artData.newX = (window.innerWidth - Projects.artData.width) / 2 - Projects.artData.x;
				Projects.artData.newY = Projects.ART_Y - Projects.artData.y - Projects.artData.height;

				Projects.eArt.transform("translate3d(" + Projects.artData.newX + "px," + Projects.artData.newY + "px,0) scale(" + Projects.ART_DEPTH + ")");

				// Marking animation as done, continuing to project finale only if data was fetched
				Projects.did.animate = true;
				Projects.did.fetch && Projects.reveal_project_page(project, Projects.activeItem);
			}, 100);
		});
	},

	reveal_project_page: function(project, data) {
		var ripple = Projects.e.find(".ripple"),
			color = (project.color || project.id );

		ripple[0].className = "ripple transformable-toned c-" + color + "-main";

		setTimeout(function se_project_reveal() {
			var sketch = Projects.eArt.find(".se-sketch");

			sketch.addClass("reverted colored");
			$.transitionEnd("width", sketch[0], function te_project_sketch() {
				Projects.eArt.find("*:not(.se-sketch)").addClass("transparent");
				sketch.removeClass("colored");

				Projects.eArt.translate(Projects.artData.newX, Projects.artData.newY);
				setTimeout(function se_project_content_reveal() {
					ripple.transform("translate3d(0,30px,0) scale(" + (window.innerWidth/1440 * 5.2) + ")");
					Projects.e.find(".project-title, .project-preface, .project-content" + (Projects.isLandingPage ? ", .back-button" : "")).addClass("fadable").removeClass("transparent");
					
					// Switching back button's transition for it to bubble on hover
					var backButton = Projects.e.find(".back-button");
					$.transitionEnd("opacity", backButton[0], function te_back_button_fade() {
						backButton.removeClass("fadable");
					});

					setTimeout(function se_project_color() {
						Projects.e.find(".project-header").addClass("colored");
					}, 200);
				}, 150);
			});
		}, 300);

		Projects.set_project_page_content(data, project);
	},

	set_project_page_content: function(data, project) {
		var title = Projects.e[0].querySelector(".project-title"),
			preface = Projects.e[0].querySelector(".project-preface"),
			content = Projects.e[0].querySelector(".project-content"),
			metaHTML = "";

		title.innerHTML = data.name;

		preface.className = "project-preface wrapper will-change c-" + data.color;
		preface.innerHTML = Projects.generate_preface(data.id, data.meta, data.synopsis, data.content ? true : false);

		data.content = data.content || "";
		
		content.innerHTML = data.content + Projects.generate_footer(project);
		content.className = "project-content will-change p-" + data.id + " c-" + data.color;

		// Loading style
		style = document.createElement("link");
		style.rel = "stylesheet";
		style.type = "text/css";
		style.href = _.project_style_url(data.id + ".css");
		document.head.appendChild(style);

		// Analytics
		$(content).find("a").on("click", function(e) {
			_.send_analytics("Project - " + Projects.activeItem.id, "link", this.href);
		});

		// Team tip
		data.meta && data.meta.team && Projects.setup_team_tip(preface);

		$([title, preface, content]).addClass("transparent");
	},

	generate_preface: function(id, meta, synopsis, hasContent) {
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
				html += Projects.generate_team(meta.team);
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
	},

	generate_team: function(team) {
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
	},

	setup_team_tip: function(preface) {
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
					relativeContainer: Projects.e[0],
					text: target.getAttribute("data-tip")
				});
			}
		});
		team.on("mouseout", function(e) {
			Overlays.hide_tip();
		});
	},

	generate_footer: function(data) {
		var html = '',
			similarProject,
			fragment = document.createElement("ul");

		// Share
		html += '<div class="teaserline teaserline-home top"><div class="teaserline-tag-wrapper teaserline-tag-project"><span class="teaserline-tag">';
		html += 'Things you can do with this page</span></div></div>';
		html += '<div class="project-footer-section project-footer-actions column-2 centered">';
		html += '<p>Share it with other people like we used to do back</br> then when there were no "f" and bird buttons.</p>';
		html += '<p><span class="column column-mid">Or maybe just</span> <a href="mailto:hey@ozzik.co?subject=SHOUT OUT&body=Hey Oz, this is me giving you a shout out. Best, Someone" class="project-action-email-link custom title-colored"><span class="contact-link contact-link-email column column-mid"></span><span class="column column-mid project-action-email-link-text linklike">give me a shout out</span></a></p>';
		html += '</div>';

		// Similar projects - dirrrrty
		if (data.similar) {
			html += '<div class="teaserline teaserline-home top"><div class="teaserline-tag-wrapper teaserline-tag-project"><span class="teaserline-tag">';
			html += (data.similar.by ? data.similar.by : 'Somehow similar things I\'ve done') + '</span></div></div>';
			html += '<ul class="project-footer-section project-footer-similar columns column-' + data.similar.items.length + '">';

			for (var i = 0; i < data.similar.items.length; i++) {
				similarProject = Showcases.create_item(Showcases.collections[Showcases.activeCollection][Showcases.catalog[data.similar.items[i]]], 0, true);

				fragment.appendChild(similarProject);
			}
			html += fragment.innerHTML;

			html += '</ul>';
		}

		return html;
	},

	unload: function() {
		_.send_analytics(Showcases.activeCollection, "unload_item", Projects.activeItem.id);

		// Prepping page + UI
		_.animate_scroll(Projects.e[0], true);

		Projects.e.addClass("blocked");
		Main.fetch_scrollbar_metrics();

		Projects.e.find(".project-title, .project-preface, .project-content, .back-button").addClass("transparent");

		Projects.e.find(".project-header").removeClass("colored").find(".ripple").addClass("transformable-rough").removeClass("transformable-toned").transform("");

		Projects.eArt.transform("translate3d(" + Projects.artData.newX + "px," + Projects.artData.newY + "px,0) scale(" + Projects.ART_DEPTH + ")");
		$.transitionEnd("transform", Projects.eArt[0], function te_project_levitate_back() {
			$(".pages").removeClass("off");
			Projects.eArt.transform("scale(" + Projects.ART_DEPTH + ")");

			$.transitionEnd("transform", Projects.eArt[0], function te_project_back() {
				// Reverting to finalized version
				var sketch = Projects.eArt.find(".se-sketch");

				sketch.addClass("c-" + Projects.activeItem.color + "-main");
				Projects.eArt.find("*").removeClass("transparent");
				sketch.removeClass("reverted").addClass("t-out t-normal");

				$.transitionEnd("width", sketch[0], function te_project_sketch_revert() {
					Projects.eArt.transform("");

					$.transitionEnd("transform", Projects.eArt[0], function te_project_delevitate() {
						Projects.eArt.addClass("transparent");
						$(".showcase-item[data-id='" + Projects.activeItem.id + "'] .showcase-art").removeClass("transparent");

						// Giving back control..
						$([ document.body, document.documentElement ]).removeClass("blocked");
						Main.fetch_scrollbar_metrics();
						Projects.e.removeClass("active");
					});
				});
			});
		});
	}
};