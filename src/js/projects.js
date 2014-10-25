/* ===== Projects ===== */

var Projects = {
	ART_Y: 225,
	ART_DEPTH: 1.15,
	ART_REVERT_DURATION: 300,
	items: {},
	activeCollection: null,
	animatedItems: 0,
	e: null,
	eArt: null,
	artData: {},
	did: {
		projectData: false,
		projectAnimation: false
	},
	projectData: null,
	activeProject: null,

	/* Setup */
	setup: function() {
		Projects.e = $(".project");
		Projects.eArt = $(".project-artwork");

		$(".projects").on("click", Projects.handle_item_activation, { isCaptured: true });

		$(".project .back-button").on("click", Projects.navigate_back);
	},

	/* Creation */
	load: function(collection) {
		$.get({
			url: _.data_url(collection + ".json"),
			success: function(data) {
				Projects.activeCollection = collection;
				Projects.handle_collection(collection, data.items, data.colors);

				Projects.items[Projects.activeCollection] = data.items;

				// Delayed coz of HTML injection pipline
				setTimeout(function() {
					$(".projects").addClass("flock").find(".project-item").removeClass("pop-ready");
					$.transitionEnd("transform", document.querySelector(".project-item:last-child"), function() {
						$(".projects").removeClass("flock");
					});
					
					setTimeout(Projects.animate_item, 300);
				}, 100);
			}
		});
	},

	handle_collection: function(collectionName, items, colors) {
		var fragment = document.createDocumentFragment();

		// Colors
		(Projects.items[Projects.activeCollection] === undefined) && Projects.generate_colors(colors);

		// Project items
		for (var i = 0; i < items.length; i++) {
			fragment.appendChild(Projects.create_item(items[i], i));
		}

		document.body.querySelector(".projects").appendChild(fragment);
	},

	generate_colors: function(colors) {
		var style = "";

		for (project in colors) {
			style += ".c-" + project + "-main { background-color: #" + colors[project] + "; }";
		}

		document.getElementById("styleRuntime").innerText = style;
	},

	create_item: function(item, index) {
		var element = document.createElement("li"),
			className = "project-item pop-ready",
			html = "",
			isNestedElement;

		className += " c-" + (item.color || item.id) + "-main";
		element.className = className;
		element.setAttribute("data-id", item.id);
		element.setAttribute("data-index", index);

		// Link + main wrapper
		html += '<a class="project-item-link va-wrapper custom" href="" title="">';
		html += '<div class="va-content">';

		html += '<div class="showcase-art transitionable sa-' + item.id + '">';// p-' + item.id + '">';

		html += Projects.generate_item_artwork(item);

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

	animate_item: function() {
		var item = $(".project-item[data-id='" +  Projects.items[Projects.activeCollection][Projects.animatedItems].id + "']");

		// Pop in
		item.find(".se-sketch").addClass("transparent");
		// $.transitionEnd("transform", item[0], function() {
			// Color
			// item.addClass("colored");
			// $.transitionEnd("background-color", item[0], function() {
				var itemID = Projects.items[Projects.activeCollection][Projects.animatedItems].id,
					steps = Projects.items[Projects.activeCollection][Projects.animatedItems].art.animation,
					i = 0;

				function animate_item_step() {
					var stepData = Projects.parse_animation_step(itemID, steps[i]);

					$(stepData.e).addClass("animate-" + stepData.animation);

					$.animationEnd(stepData.waitFor, stepData.eLen, function() {
						// Cycling
						i++;
						if (i !== steps.length) {
							animate_item_step();
						} else {
							item.addClass("active").find(".se-sketch").addClass("transparent");

							Projects.animatedItems++;

							if (Projects.animatedItems !== Projects.items[Projects.activeCollection].length) {
								setTimeout(Projects.animate_item, 0);
							}
						}
					}, steps[i][2] || 100);
				}
				animate_item_step();
			// }, 100);
		// }, 100);
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

	/* Interaction */
	handle_item_activation: function(e) {
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
		Projects.navigate(target.getAttribute("data-index"), target);
	},

	navigate: function(project, item) {
		// Synthesizing args
		project = Projects.items[Projects.activeCollection][project];
		item = item || document.querySelector(".project-item[data-id='" + project.id + "']");

		// Marking project as hasn't been loaded yet
		Projects.did.projectData = false;
		Projects.did.projectAnimation = false;
		Projects.activeProject = project.id;

		// Loading project data
		Projects.animate_into_project(project, item);
		$.get({
			url: _.data_url(Projects.activeCollection + "/" + project.id + ".json"),
			success: function(data) {
				data.color = project.color || project.id; // Synthesizing color data

				// Marking data as fetched, continuing to project finale only if animation has ended
				Projects.did.projectData = true;
				Projects.projectData = data; // Saving for being used via animation end callback
				Projects.did.projectAnimation && Projects.reveal_project_page(project, item);
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

		// Prepping page + UI
		_.animate_scroll(document.body);
		$(document.body).addClass("mode-project");
		Projects.e.addClass("active");

		// Duplicating artwork + positioning
		Projects.eArt[0].className = "project-artwork showcase-art transitionable-rough post sa-" + project.id;
		Projects.eArt[0].innerHTML = Projects.generate_item_artwork(project);
		Projects.eArt[0].style.left = Projects.artData.x + "px";
		Projects.eArt[0].style.top = Projects.artData.y + "px";

		$(".pages").addClass("off");
		
		// Hiding showcase page + real artwork
		$(realArt).addClass("transparent");
		Projects.eArt.find(".se-sketch").addClass("widthable revert-ready").removeClass("fadable");

		Projects.eArt.transform("scale(" + Projects.ART_DEPTH + ")");

		$.transitionEnd("transform", Projects.eArt[0], function() {
			// Moving new artwork to its actual new position
			setTimeout(function() {
				Projects.artData.newX = (window.innerWidth - Projects.artData.width) / 2 - Projects.artData.x;
				Projects.artData.newY = Projects.ART_Y - Projects.artData.y - Projects.artData.height;

				Projects.eArt.transform("translate3d(" + Projects.artData.newX + "px," + Projects.artData.newY + "px,0) scale(" + Projects.ART_DEPTH + ")");

				// Marking animation as done, continuing to project finale only if data was fetched
				Projects.did.projectAnimation = true;
				Projects.did.projectData && Projects.reveal_project_page(project, Projects.projectData);
			}, 100);
		});
	},

	reveal_project_page: function(project, data) {
		var ripple = Projects.e.find(".ripple"),
			color = (project.color || project.id );

		ripple[0].className = "ripple transitionable-toned c-" + color + "-main";

		setTimeout(function() {
			var sketch = Projects.eArt.find(".se-sketch");

			sketch.addClass("reverted colored");
			$.transitionEnd("width", sketch[0], function() {
				Projects.eArt.find("*:not(.se-sketch)").addClass("transparent");
				sketch.removeClass("colored");

				Projects.eArt.translate(Projects.artData.newX, Projects.artData.newY);
				setTimeout(function() {
					ripple.transform("translate3d(0,30px,0) scale(5)");
					Projects.e.find(".project-title, .project-meta, .project-separator, .project-content, .back-button").addClass("fadable").removeClass("transparent");
					
					setTimeout(function() {
						Projects.e.find(".project-header").addClass("colored");
					}, 200);
				}, 200);
			});
		}, 300);

		Projects.set_project_page_content(data);
	},

	set_project_page_content: function(data) {
		var title = Projects.e[0].querySelector(".project-title"),
			meta = Projects.e[0].querySelector(".project-meta"),
			separator = Projects.e[0].querySelector(".project-separator"),
			content = Projects.e[0].querySelector(".project-content"),
			metaHTML = "";

		// Meta
		for (key in data.meta) {
			metaHTML += '<dt class="meta">' + (key[0].toUpperCase() + key.slice(1)) + '</dt>&nbsp;' + '<dd>' + data.meta[key] + '</dd>';
		}

		title.innerHTML = data.name;
		meta.innerHTML = metaHTML;

		separator.className = "project-separator s-" + data.id + " i-" + data.id;

		content.innerHTML = data.content;
		content.className = "project-content p-" + data.id + " c-" + data.color;

		$([title, meta, separator, content]).addClass("transparent");
	},

	navigate_back: function() {
		// Prepping page + UI
		_.animate_scroll(document.body);

		Projects.e.find(".project-title, .project-meta, .project-separator, .project-content, .back-button").addClass("transparent");

		Projects.e.find(".project-header").removeClass("colored").find(".ripple").transform("");

		Projects.eArt.transform("translate3d(" + Projects.artData.newX + "px," + Projects.artData.newY + "px,0) scale(" + Projects.ART_DEPTH + ")");
		$.transitionEnd("transform", Projects.eArt[0], function() {
			$(".pages").removeClass("off");
			Projects.eArt.transform("scale(" + Projects.ART_DEPTH + ")");

			$.transitionEnd("transform", Projects.eArt[0], function() {
				// Reverting to finalized version
				var sketch = Projects.eArt.find(".se-sketch");

				sketch.addClass("c-" + Projects.activeProject + "-main");
				Projects.eArt.find("*").removeClass("transparent");
				sketch.removeClass("reverted");

				$.transitionEnd("width", sketch[0], function() {
					Projects.eArt.transform("");

					$.transitionEnd("transform", Projects.eArt[0], function() {
						Projects.eArt.addClass("transparent");
						$(".project-item[data-id='" + Projects.activeProject + "'] .showcase-art").removeClass("transparent");

						// Giving back control..
						$(document.body).removeClass("mode-project");
						Projects.e.removeClass("active");
					});
				});
			});
		});
	}
};