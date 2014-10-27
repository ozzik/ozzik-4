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

	/* Setup */
	setup: function() {
		Projects.e = $(".project");
		Projects.eArt = $(".project-artwork");

		$(".project .back-button").on("click", Projects.unload);
	},

	load: function(project, item) {
		// Synthesizing args
		project = Showcases.collections[Showcases.activeCollection][project];
		item = item || document.querySelector(".showcase-item[data-id='" + project.id + "']");

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
	},

	animate_into_project: function(project, item) {
		var realArt = item.querySelector(".showcase-art");

		// Fetching expensive things
		Projects.artData.x = realArt.offsetLeft;
		Projects.artData.y = realArt.offsetTop;
		Projects.artData.width = realArt.offsetWidth;
		Projects.artData.height = realArt.offsetHeight;

		// Adjusting scroll position + blocking page interactions
		_.animate_scroll(document.body);
		$(document.body).addClass("mode-project");
		Projects.e.addClass("active");

		$(".pages").addClass("off");

		// Duplicating artwork + positioning
		Projects.eArt[0].className = "project-artwork showcase-art transformable-rough post sa-" + project.id;
		Projects.eArt[0].innerHTML = Showcases.generate_item_artwork(project);
		Projects.eArt[0].style.left = Projects.artData.x + "px";
		Projects.eArt[0].style.top = Projects.artData.y + "px";

		// Hiding showcase page + real artwork
		$(realArt).addClass("transparent");
		Projects.eArt.find(".se-sketch").addClass("widthable revert-ready").removeClass("fadable");

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
					ripple.transform("translate3d(0,30px,0) scale(5.2)");
					Projects.e.find(".project-title, .project-meta, .project-content, .back-button").addClass("fadable").removeClass("transparent");
					
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

		content.innerHTML = Projects.generate_synopsis(data.id, data.synopsis) + data.content;
		content.className = "project-content p-" + data.id + " c-" + data.color;

		$([title, meta, content]).addClass("transparent");
	},

	generate_synopsis: function(id, synopsis) {
		if (!synopsis) { return ""; }

		var html = '<div class="project-synopsis centered">';

		html += '<div class="project-separator s-' + id + ' i-' + id + '"></div>';

		html += '<h2>In one sentence & one hipsta button</h2>';
		html += '<p>' + synopsis.text + '</p>';
		
		// Button
		html += (synopsis.link) ? '<a href="' + synopsis.link.url + '" target="_blank"' : '<div';
		html += ' class="project-button custom transformable ' + (!synopsis.link ? ' dead' : '') + '">';
		html += '<span class="button-caption">' + (synopsis.link ? _.rephrase(synopsis.link.caption) : _.phrases.dead) + '</span>';
		html += '</' + (synopsis.link ? 'a' : 'div') + '>';

		html += '<div class="project-separator s-' + id + ' i-' + id + '"></div>';
		html += '</div>';

		return html;
	},

	unload: function() {
		// Prepping page + UI
		_.animate_scroll(Projects.e[0], true);

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
						$(document.body).removeClass("mode-project");
						Projects.e.removeClass("active");
					});
				});
			});
		});
	}
};