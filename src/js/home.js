var Home = {};

(function () {
    var Navline = {
        e: null,
        eHeader: null,
        eActiveItem: null,
        eHighligtedItem: null,

        setup: function() {
            Navline.eHeader = $(".home-navigation");
            Navline.e = $(".navline");

            Navline.update_offset();
            Main.hook("resize", Navline.update_offset);

            Navline.eHeader.on("mouseover", Navline.handle_mouseover);
            Navline.eHeader.on("mouseout", Navline.handle_mouseout);
            Navline.eHeader.on("click", Navline.handle_click);

            // Auto selecting first item // TODO: URL-aware
            Navline.select(Navline.eHeader[0].querySelector(".home-navigation-link"));
        },

        /* Being called also via resize */
        update_offset: function() {
            Navline.offsetX = Navline.eHeader[0].offsetLeft;
        },

        handle_mouseover: function(e) {
            if (!e.target || e.target.nodeName !== "A" || Navline.eActiveItem === e.target) { return; } // Suppression

            Navline.select(e.target, true);
        },

        handle_mouseout: function(e) {
            if (Navline.eHighligtedItem === Navline.eActiveItem || e.relatedTarget.nodeName === "LI") { return } // Suppression

            Navline.select(Navline.eActiveItem);   
        },

        handle_click: function(e) {
            if (!e.target || e.target.nodeName !== "A") { return; } // Suppression

            Navline.select(e.target);
            Showcases.load(e.target.getAttribute("data-for"));
        },

        select: function(item, isHighlight) {
            var offsetWidth = item.offsetWidth;

            // Changing item active state
            Navline.eHighligtedItem && $(Navline.eHighligtedItem.parentNode).removeClass("active");
            Navline.eActiveItem = (!isHighlight) ? item : Navline.eActiveItem; // Changing item only upon selection, not hover
            Navline.eHighligtedItem = item;
            $(item.parentNode).addClass("active");

            // Adjusting line to new item, minimized (pre-selection) or full-width
            Navline.e[0].style.width = offsetWidth + "px";
            Navline.e.transform("translate3d(" + (item.offsetLeft - Navline.offsetX) + "px,0,0) " + (isHighlight ? "scaleX(.05)" : ""));
        }
    }

    Home.setup = function() {
        Navline.setup();
    };
})();