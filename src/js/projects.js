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
		console.log(isDontHistory);
		console.trace();
		!isDontHistory && Main.push_history({
			view: "project",
			meta: project.id,
			transition: Main.NAVIGATION_PUSH,
			url: Showcases.activeCollection + "/" + project.id,
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
					Projects.e.find(".project-title, .project-meta, .project-content" + (Projects.isLandingPage ? ", .back-button" : "")).addClass("fadable").removeClass("transparent");
					
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

		Projects.set_project_page_content(data);
	},

	set_project_page_content: function(data) {
		var title = Projects.e[0].querySelector(".project-title"),
			meta = Projects.e[0].querySelector(".project-meta"),
			content = Projects.e[0].querySelector(".project-content"),
			metaHTML = "";

		// Meta
		for (key in data.meta) {
			metaHTML += '<dt class="meta">' + (key[0].toUpperCase() + key.slice(1)) + '</dt>&nbsp;' + '<dd>' + data.meta[key] + '</dd>';
		}

		title.innerHTML = data.name;
		meta.innerHTML = metaHTML;

		data.content = data.content || "";
		
		content.innerHTML = Projects.generate_synopsis(data.id, data.synopsis) + data.content;
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

		$([title, meta, content]).addClass("transparent");
	},

	generate_synopsis: function(id, synopsis) {
		if (!synopsis) { return ""; }

		var html = '<div class="project-synopsis column-2 centered">';

		html += '<figure class="' + id + '-tldr"></figure>';
		html += '<p>' + synopsis.text + '</p>';
		
		// Button
		if (synopsis.link || synopsis.isDead) {
			html += (synopsis.link) ? '<a href="' + synopsis.link.url + '" target="_blank" title="' + _.rephrase(synopsis.link.caption) + '"' : '<div';
			html += ' class="project-button custom transformable ' + (synopsis.isDead ? ' dead' : '') + '">';
			html += '<span class="button-caption">' + (synopsis.link ? _.rephrase(synopsis.link.caption) : _.phrases.dead) + '</span>';
			html += '</' + (synopsis.link ? 'a' : 'div') + '>';
		}
		html += '<div class="project-separator s-' + id + ' i-' + id + '"></div>';
		html += '</div>';

		return html;
	},

	unload: function() {
		_.send_analytics(Showcases.activeCollection, "unload_item", Projects.activeItem.id);

		// Prepping page + UI
		_.animate_scroll(Projects.e[0], true);

		Projects.e.addClass("blocked");
		Main.fetch_scrollbar_metrics();

		Projects.e.find(".project-title, .project-meta, .project-content, .back-button").addClass("transparent");

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