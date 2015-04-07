//
// Controls the home page's teaser element
//

var O4 = O4 || {};

O4.HomeTeaserViewController = function() {
    // Teaserline
    var _teaserLine = $(".teaserline-home.top"),
        _teaserTag = $(".teaserline-tag-about"),
        _ttHeight = _teaserTag[0].offsetHeight,
        _ttMinY = parseInt(_ttHeight / -2, 10) - 3,
        _ttMaxY = parseInt((_teaserLine[0].offsetHeight - _ttHeight) / 2, 10) - _ttMinY,
        _wasPlaced;

    // Initial peeking position
    _teaserTag.translate(0, _ttMinY).find(".teaserline-tag").addClass("attention");

    app.viewportController.hook("scroll", function hookScrollTeaser() {
        if (_wasPlaced) { return; }

        var step = window.scrollY / (app.viewportController.pageScrollHeight - app.viewportController.windowHeight);

        // Marking tag as placed so it won't move anymore
        if (step === 1) {
            _wasPlaced = true;
            setTimeout(function se_teaserRing() {
                _teaserTag.find(".teaserline-tag").removeClass("attention");
                $(".about-image-ring").addClass("ping");

                _.track("about", "reveal", "");
            }, 50);
        }

        _teaserTag.translate(0, _ttMaxY * step + _ttMinY);
    });
};