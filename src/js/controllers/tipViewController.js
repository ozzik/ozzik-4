//
// Controls an overlay tip element
//

var O4 = O4 || {};

// TODO: refactor
O4.TipViewController = function() {
    var _tip = $(".tip"),
        _self = this;

    this.present = function(options) {
        var x = 0,
            y = 0,
            subjectParent = options.subject,
            width,
            height,
            tipWidth,
            tipHeight;

        _tip[0].className = "tip fadable " + options.layout;
        _tip[0].innerHTML = options.text;
        tipWidth = _tip[0].offsetWidth;
        tipHeight = _tip[0].offsetHeight;

        while (subjectParent.offsetParent) {
            x += subjectParent.offsetLeft;
            y += subjectParent.offsetTop;
            subjectParent = subjectParent.offsetParent;
        }
        y -= (options.relativeContainer) ? options.relativeContainer.scrollTop : 0;

        width = options.subject.offsetWidth;
        height = options.subject.offsetHeight;

        // Vertical
        if (options.layout === "top" || options.layout === "bottom") {
            y -= height * (options.layout === "bottom" ? -1 : 1);

            // Secondary
            if (options.layoutSecondary === "center") {
                x += width / 2 - 12;
            } else {
                x += width * (options.layoutSecondary === "right" ? 1 : -1);
            }
        } else { // Horizontal
            x += width * (options.layout === "left" ? -1 : 1) + 4;

            // Secondary is always center for now
            y += (height - tipHeight) / 2;
        }

        // Extra
        x += (options.horizontalOffset || 0);
        y += (options.verticalOffset || 0);

        _tip.translate(x, y);
    };

    this.dismiss = function() {
        _tip.addClass("transparent");
    };

    this.hook = function(selector, options) {
        var subject = $(selector);

        // Dirrrty :<
        subject.on("mouseover", function(e) {
            if (subject[0].isOver) { return; }

            var target = _.track_element_parent(e.target, subject[0]);

            subject[0].isOver = true;

            options.subject = subject[0];
            _self.present(options);
        });
        subject.on("mouseout", function(e) {
            var target = _.track_element_parent((e.relatedTarget), subject[0]);

            if (target === subject[0]) { return; }

            subject[0].isOver = false;

            _self.dismiss();
        });
    };
};