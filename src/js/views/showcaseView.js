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
			$.animationEnd(stepData.waitFor, stepData.eLen, function te_showcase_art_step() {
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

		view.querySelector(".showcase-art").innerHTML = O4.ShowcaseView.generateItemArtwork(data, isPost);

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
		// TODO: make template
		var html = '<div class="s-' + data.id + ' se-sketch fadable' + (isPost ? ' transparent' : '') + '"></div>',
			isNestedElement;

		for (var i = 0; i < data.art.elements.length; i++) {
			isNestedElement = Array.isArray(data.art.elements[i]);
			html += '<div class="s-' + data.id + ' se-' + (!isNestedElement ? data.art.elements[i] : data.art.elements[i][0]) + '">';

			// Nested elements
			if (isNestedElement) {
				for (var j = 1; j < data.art.elements[i].length; j++) {
					html += '<div class="s-' + data.id + ' se-' + data.art.elements[i][j] + '"></div>';
				}
			}

			html += '</div>';
		}

		return html;
	};

	ShowcaseView.createView = function(data, index, isPost) {
		return _createView(data, index, isPost);
	};

	O4.ShowcaseView = ShowcaseView;
})();