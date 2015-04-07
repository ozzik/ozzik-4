//
// Controls the display of a showcase
//

var O4 = O4 || {};

(function() {
	function ShowcaseView(data, index) {
		this._e = $(_createView(data, index));
	}

	// ==== Exposed methods ====
	ShowcaseView.prototype.getElement = function() {
		return this._e[0];
	};

	ShowcaseView.prototype.animate = function(id, steps, doneHandler) {
		var i = 0,
			_self = this;

		// Startig sketch's fade out
		this._e.find(".se-sketch").addClass("transparent");

		function animateStep() {
			var stepData = _parseAnimationStep(id, steps[i]);

			$(stepData.e).addClass("animate-" + stepData.animation);
			$.animationEnd(stepData.waitFor, stepData.eLen, function te_showcaseArtStep() {
				// Stopping animation once collection was changed (could also be called from here)
				if (app.killAnimation) {
					app.killAnimation = false;
					return;
				}

				// Continuing to next step
				i++;
				if (i !== steps.length) {
					animateStep();
				} else {
					_self._e.addClass("active").find(".se-sketch").addClass("transparent");

					doneHandler();
				}
			}, steps[i][2] || 100);
		}
		animateStep();
	};

	ShowcaseView.prototype.toggleFilterState = function(isUnfiltered) {
		this._e.toggleClass("filtered", !isUnfiltered).toggleClass("active", isUnfiltered);
	};

	// ==== Private ====
	function _createView(data, index, isPost) {
		var view = app.templateController.render("showcase", {
			id: data.id,
			index: index,
			state: !isPost ? "off" : "active",
			theme: data.id,
			link: data.url,
			linkTitle: data.name,
			animationState: isPost ? "post" : ""
		});

		view.querySelector(".showcase-art").appendChild(O4.ShowcaseView.generateItemArtwork(data, isPost));

		return view;
	}

	function _parseAnimationStep(projectID, step) {
		var animation = (step.length === 1 ? "pop-in" : step[1]),
			waitFor = animation,
			e = "",
			eLen = (Array.isArray(step[0])) ? step[0].length : 1;

		// Composing elements
		if (eLen > 1) {
			for (var j = 0; j < eLen; j++) {
				e += (j ? "," : "") + ".s-" + projectID + ".se-" + step[0][j];
			}
		} else {
			e += ".s-" + projectID + '.se-' + step[0];
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
	}

	// ==== Static methods ====
	ShowcaseView.generateItemArtwork = function(data, isPost) {
		var spec = data.art.elements,
			element,
			elements = [];

		for (item in spec) {
			if (!Array.isArray(spec[item])) {
				element = { name: spec[item] };
			} else {
				element = {
					name: spec[item][0],
					children: []
				};

				for (var childItem = 1; childItem < spec[item].length; childItem++) {
					element.children.push({ name: spec[item][childItem] });
				}
			}

			elements.push(element);
		}

		return a = app.templateController.render("artwork", {
			projectID: data.id,
			sketchState: isPost ? " transparent" : "",
			elements: elements
		});
	};

	ShowcaseView.createView = function(data, index, isPost) {
		return _createView(data, index, isPost);
	};

	O4.ShowcaseView = ShowcaseView;
})();