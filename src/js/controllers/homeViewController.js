//
// Controls the home page elements (showcases + about)
//

var O4 = O4 || {};

O4.HomeViewController = function() {
    // Teaserline
    var _self = this;
    var _teaser = new O4.HomeTeaserViewController(),
        _showcaseCollection = new O4.ShowcaseCollectionViewController(),
        _navline = new O4.NavlineViewController({
            rootItem: app.landingView.meta,
            navigationHandle: _handleNavigation
        });

    function _handleNavigation(view) {
        var collectionName = view,
            collectionNameForTitle = (collectionName !== "products") ? collectionName[0].toUpperCase() + collectionName.slice(1) : null;

        _showcaseCollection.load(collectionName);

        return {
            view: collectionName,
            url: (collectionName === "products") ? _.url("") : collectionName,
            title: collectionNameForTitle
        };
    }

    // TODO: setup showcase collection (filter controls)

    // About section setup
    // Tips
    Overlays.hook_tip(".about-job dd.previously", {
        layout: "top",
        layoutSecondary: "right",
        horizontalOffset: -25,
        text: "Acquired by Revizer"
    });
    Overlays.hook_tip(".about-image img", {
        layout: "right",
        text: "(I'm no pilot)"
    });
    // Links analytics
    (function _setupAboutLinksAnalytics() {
        var links = document.querySelectorAll(".page[data-for='about'] a");
    
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener("click", function() {
                _.send_analytics("about", "link", this.getAttribute("href"));
            });
        }
    })();
};