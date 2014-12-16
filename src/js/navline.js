var Navline = {};

(function () {
    var _e = null,
        _eHeader = null,
        _eActiveItem = null,
        _eHighligtedItem = null,
        _activeItem = {
            width: 0,
            transform: 0
        },
        _loadingTicker = null,
        _loadingTickerBeat = 0;

    // ==== Exposed methods ====
    Navline.setup = function() {
        _eHeader = $(".home-navigation");
        _e = $(".navline");

        update_offset();
        Main.hook("resize", update_offset);

        _eHeader.on("mouseover", handle_mouseover);
        _eHeader.on("mouseout", handle_mouseout);
        _eHeader.on("click", handle_click);
        _eHeader.find("a").on("click", function(e) {
            e.preventDefault();
        });
    };

    Navline.select = function(item, isFirst) {
        item = (typeof item === "string") ? _eHeader[0].querySelector(".home-navigation-link[data-for='" + item + "']") : item;
        var collectionName = item.getAttribute("data-for"),
            collectionNameForTitle = (collectionName !== "products") ? collectionName[0].toUpperCase() + collectionName.slice(1) : null;

        // Pushing history
        !isFirst && Main.push_history({
            view: "home",
            meta: collectionName,
            transition: Main.NAVIGATION_SWITCH,
            url: (collectionName === "products") ? _.url("") : collectionName,
            title: collectionNameForTitle
        });
        Main.set_page_title(collectionNameForTitle); // Setting title anyway

        highlight_item(item);
        Showcases.load(collectionName);

        !isFirst && _.send_analytics(collectionName, "load", "");
    };

    Navline.start_loading_animation = function() {
        _loadingTickerBeat = 0;

        handle_loading_tick();
        _loadingTicker = setInterval(handle_loading_tick, 400);
    };

    // ==== Private ====
    /* Being called also via resize */
    // Fetches starting X of navline for relative positioning (translate3d)
    function update_offset() {
        offsetX = _eHeader[0].offsetLeft - Main.viewport.scrollbarWidth;
    }

    function handle_mouseover(e) {
        if (!e.target || e.target.nodeName !== "A" || _eActiveItem === e.target) { return; } // Suppression

        highlight_item(e.target, true);
    }

    function handle_mouseout(e) {
        if (_eHighligtedItem === _eActiveItem || e.relatedTarget.nodeName === "LI") { return } // Suppression

        highlight_item(_eActiveItem);   
    }

    function handle_mouseout(e) {
        if (_eHighligtedItem === _eActiveItem || e.relatedTarget.nodeName === "LI") { return } // Suppression

        highlight_item(_eActiveItem);   
    }

    function handle_click(e) {
        if (!e.target || e.target.nodeName !== "A" || _eActiveItem === e.target) { return; } // Suppression

        e.stopPropagation && e.stopPropagation();

        Navline.select(e.target);
    }

    function highlight_item(item, isHighlight) {
        var offsetWidth = item.offsetWidth;

        // Changing item active state
        _eHighligtedItem && $(_eHighligtedItem.parentNode).removeClass("active");
        _eActiveItem = (!isHighlight) ? item : _eActiveItem; // Changing item only upon selection, not hover
        _eHighligtedItem = item;
        $(item.parentNode).addClass("active");

        // Adjusting line to new item, minimized (pre-selection) or full-width
        _e[0].style.width = offsetWidth + "px";
        _e.transform("translate3d(" + (item.offsetLeft + (Main.viewport.scrollbarWidth / 2) - offsetX) + "px,0,0) " + (isHighlight ? "scaleX(.05)" : ""));

        // Saving data for loading animation
        _activeItem.width = offsetWidth;
        _activeItem.transform = "translate3d(" + (item.offsetLeft + (Main.viewport.scrollbarWidth / 2) - offsetX) + "px,0,0)";
    }

    function handle_loading_tick() {
        if (Showcases.isCollectionReady) {
            clearInterval(_loadingTicker);
            _e.transform(_activeItem.transform);
            return;
        }

        _e.transform(_activeItem.transform + (_loadingTickerBeat ? " scaleX(.8)" : ""));

        _loadingTickerBeat = (_loadingTickerBeat) ? 0 : 1;
    }
})();