var Home = {};

(function () {
    var Navline = {
        e: null,
        eHeader: null,
        eActive: null,
        startX: 0,
        itemWidth: 0,

        setup: function() {
            Navline.eHeader = $(".home-navigation");
            Navline.e = $(".navline");

            Navline.update_offset();
            Navline.eActive = Navline.eHeader[0].querySelector(".home-navigation-link");

            Navline.eHeader.on("mouseover", Navline.handle_mouseover);
            Navline.eHeader.on("mouseout", Navline.handle_mouseout);
            Navline.eHeader.on("click", Navline.handle_click);
            Navline.handle_mouseover({ target: Navline.eActive }, true);
        },

        update_offset: function() {
            Navline.offsetX = Navline.eHeader[0].offsetLeft;
        },

        handle_mouseover: function(e, isRevert) {
            // Suppression
            if (!e.target || e.target.nodeName !== "A") { return; }

            Navline.itemWidth = e.target.offsetWidth;

            Navline.e[0].style.width = Navline.itemWidth + "px";
            Navline.e.transform("translate3d(" + (e.target.offsetLeft - Navline.offsetX) + "px,0,0) " + (!isRevert ? "scaleX(.05)" : ""));
        },

        handle_mouseout: function(e) {
            if (e.relatedTarget.nodeName === "UL") { return; };
            Navline.handle_mouseover({ target: Navline.eActive }, true);
        },

        handle_click: function(e) {
            // Suppression
            if (!e.target || e.target.nodeName !== "A") { return; }

            Projects.load(e.target.getAttribute("data-for"));
        }
    }

    Home.setup = function() {
        Navline.setup();
    };
})();