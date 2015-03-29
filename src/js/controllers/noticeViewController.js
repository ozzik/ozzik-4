//
// Controls the page's notice overlays
//

var O4 = O4 || {};

O4.NoticeViewController = function(options) {
	var _minScreenWidth = document.querySelector(".home-work").offsetWidth;
	
	// Notices
	var _screenWidthNoticeView = new O4.ScreenWidthNoticeView(_minScreenWidth);

	function _toggleScreenWidthNotice() {
		if (app.viewportController.getWidth() < _minScreenWidth && !_screenWidthNoticeView.isVisible) {
			_screenWidthNoticeView.toggle(true);
		} else if (app.viewportController.getWidth() >= _minScreenWidth && _screenWidthNoticeView.isVisible) {
			_screenWidthNoticeView.toggle(false);
		}
	}

	app.viewportController.hook("resize", _toggleScreenWidthNotice);
	_toggleScreenWidthNotice();
};