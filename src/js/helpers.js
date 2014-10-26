var _ = {
	url: function(str) {
		return _BASE_URL + str;
	},

	data_url: function(str) {
		return _.url("data/" + str);
	},
	style_url: function(str) {
		return _.url("assets/css/" + str);
	},
	project_style_url: function(str) {
		return _.style_url("projects/" + str);
	},

	/* RequestAnimationFrame-based scroll from (https://gist.github.com/james2doyle/5694700) */
	easeInOutCubic: function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},

	animate_scroll: function(element, callback) {
		var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); },
			eDoc = (navigator.userAgent.indexOf('Firefox') != -1 || navigator.userAgent.indexOf('MSIE') != -1) ? document.documentElement : document.body,
			scrollStart = eDoc.scrollTop,
			scrollEnd = element.offsetTop,
			change = scrollEnd - scrollStart,
			tick = 0,
			duration = 300;

		function scroll_a_bit() {
			tick += 20;
			eDoc.scrollTop = _.easeInOutCubic(tick, scrollStart, change, duration);

			if (tick < duration) {
				rAF(scroll_a_bit);
			} else {
				callback && callback();
			}
		}
		(scrollStart !== scrollEnd) && scroll_a_bit();
	}
}