var O4 = O4 || {};

(function(O4) {
	function ViewportController(options) {
		var _hooks = {
				resize: [],
				scroll: []
			},
			_self = this;

		this.windowWidth = 0;
		this.windowHeight = 0;
		this.pageScrollHeight = 0;
		this.scrollbarWidth = 0;

		this.hook = function(event, fn) {
			_hooks[event].push(fn);
		};

		this.fetchMetrics = function() {
			this.windowWidth = this.getWidth();
			this.windowHeight = this.getHeight();
			this.pageScrollHeight = document.documentElement.scrollHeight;

			this.fetchScrollbarMetrics();
		};

		this.fetchScrollbarMetrics = function() {
			this.scrollbarWidth = app.viewportController.getWidth() - document.documentElement.offsetWidth;
		};

		this.getWidth = function() {
			return window.innerWidth;
		};

		this.getHeight = function() {
			return window.innerHeight;
		};

		this.setScrollability = function(isShow) {
			$("html, body").toggleClass("blocked", isShow);
		};

		this.toggleOverlay = function(overlay, isShow) {
			$(".overlay-" + overlay).toggleClass("active", isShow);
			this.setScrollability(isShow ? false : true);
		};

		// Events handling system
		window.addEventListener("resize", _handleResize);
		window.addEventListener("scroll", _handleScroll);

		function _handleResize() {
			for (var i = 0; i < _hooks.resize.length; i++) {
				_hooks.resize[i]();
			}

			_self.fetchMetrics();
		}

		function _handleScroll() {
			for (var i = 0; i < _hooks.scroll.length; i++) {
				_hooks.scroll[i]();
			}
		}
	}

	O4.ViewportController = ViewportController;
})(O4);