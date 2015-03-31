//
// Controls the home page navigation line element
//

var O4 = O4 || {};

O4.NavlineViewController = function(options) {
	var _e = $(".navline"),
		_eHeader = $(".home-navigation"),
		_eActiveItem = null,
		_eHighligtedItem = null,
		_activeItem = {
			width: 0,
			transform: 0
		},
		_offsetX = 0,
		_loadingTicker = null,
		_loadingTickerBeat = 0,
		_navigationHandle = options.navigationHandle,
		_self = this;

	// Init
	_updateOffset();
	app.viewportController.hook("resize", _updateOffset);

	_eHeader.on("mouseover", _handleMouseover);
	_eHeader.on("mouseout", _handleMouseout);
	_eHeader.on("click", _handleClick);
	_eHeader.find("a").on("click", function(e) {
		e.preventDefault();
	});

	// ==== Exposed methods ====
	this.select = function(item, isViaHistory) {
		item = (typeof item === "string") ? _eHeader[0].querySelector(".home-navigation-link[data-for='" + item + "']") : item;
		_highlightItem(item);

		var stateData = _navigationHandle(item.getAttribute("data-for"));
		stateData.handlee = this;

		!isViaHistory && app.navigationController.push(stateData);
	};

	this.handlePop = function(data) {
		this.select(data, true);
	};

	this.handlePush = this.handlePop;

	// ==== Private ====
	/* Being called also via resize */
	// Fetches starting X of navline for relative positioning (translate3d)
	function _updateOffset() {
		_offsetX = _eHeader[0].offsetLeft - app.viewportController.scrollbarWidth;
	}

	function _handleMouseover(e) {
		if (!e.target || e.target.nodeName !== "A" || _eActiveItem === e.target) { return; } // Suppression

		_highlightItem(e.target, true);
	}

	function _handleMouseout(e) {
		if (_eHighligtedItem === _eActiveItem || e.relatedTarget.nodeName === "LI") { return } // Suppression

		_highlightItem(_eActiveItem);   
	}

	function _handleClick(e) {
		if (!e.target || e.target.nodeName !== "A" || _eActiveItem === e.target) { return; } // Suppression

		e.stopPropagation && e.stopPropagation();

		_self.select(e.target);
	}

	function _highlightItem(item, isTemporary) {
		var offsetWidth = item.offsetWidth;

		// Changing item active state
		_eHighligtedItem && $(_eHighligtedItem.parentNode).removeClass("active");
		_eActiveItem = (!isTemporary) ? item : _eActiveItem; // Changing item only upon selection, not hover
		_eHighligtedItem = item;
		$(item.parentNode).addClass("active");

		// Adjusting line to new item, minimized (pre-selection) or full-width
		_e[0].style.width = offsetWidth + "px";
		_e.transform("translate3d(" + (item.offsetLeft + (app.viewportController.scrollbarWidth / 2) - _offsetX) + "px,0,0) " + (isTemporary ? "scaleX(.05)" : ""));

		// Saving data for loading animation
		_activeItem.width = offsetWidth;
		_activeItem.transform = "translate3d(" + (item.offsetLeft + (app.viewportController.scrollbarWidth / 2) - _offsetX) + "px,0,0)";
	}

	// Loading methods
	function _handleCollectionReload() {
		_loadingTickerBeat = 0;

		_handleLoadingTick();
		_loadingTicker = setInterval(_handleLoadingTick, 400);
	};

	function _handleLoadingTick() {
		_e.transform(_activeItem.transform + (_loadingTickerBeat ? " scaleX(.8)" : ""));

		_loadingTickerBeat = (_loadingTickerBeat) ? 0 : 1;
	}

	function _handleCollectionReady() {
		clearInterval(_loadingTicker);
		_e.transform(_activeItem.transform);
	}

	_.subscribeForNotification("collectionReload", _handleCollectionReload);
	_.subscribeForNotification("collectionReady", _handleCollectionReady);
	
	this.select(options.rootItem, true);
};