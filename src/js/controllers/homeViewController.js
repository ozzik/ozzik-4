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
            rootItem: app.landingView.meta.collection,
            navigationHandle: _handleNavigation
        });

    function _handleNavigation(view) {
        var collectionName = view,
            collectionNameForTitle = O4.HomeViewController.getTitleForCollection(collectionName);

        _showcaseCollection.load(collectionName);

        return {
            view: collectionName,
            url: (collectionName === "products") ? _.url("") : collectionName,
            title: collectionNameForTitle
        };
    }

    // About section setup
    // Tips
    app.tipViewController.hook(".about-job dd.previously", {
        layout: "top",
        layoutSecondary: "right",
        horizontalOffset: -25,
        text: "Acquired by Revizer"
    });
    app.tipViewController.hook(".about-image img", {
        layout: "right",
        text: "(I'm no pilot)"
    });
    // Links analytics
    (function _setupAboutLinksAnalytics() {
        var links = document.querySelectorAll(".page[data-for='about'] a");
    
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener("click", function() {
                _.track("about", "link", this.getAttribute("href"));
            });
        }
    })();
};

O4.HomeViewController.getTitleForCollection = function(collectionName) {
    return (collectionName !== "products") ? collectionName[0].toUpperCase() + collectionName.slice(1) : "";
}