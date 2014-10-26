var _ = {
	phrases: {
		watch: [ "watch", "see", "have a look" ],
		download: [  ],
	},

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

	animate_scroll: function(element, isInner, callback) {
		var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); },
			eScrollTarget = !isInner ? (navigator.userAgent.indexOf('Firefox') != -1 || navigator.userAgent.indexOf('MSIE') != -1 ? document.documentElement : document.body) : element,
			scrollStart = eScrollTarget.scrollTop,
			scrollEnd = element.offsetTop,
			change = scrollEnd - scrollStart,
			tick = 0,
			duration = 300;

		function scroll_a_bit() {
			tick += 20;
			eScrollTarget.scrollTop = _.easeInOutCubic(tick, scrollStart, change, duration);

			if (tick < duration) {
				rAF(scroll_a_bit);
			} else {
				callback && callback();
			}
		}
		(scrollStart !== scrollEnd) && scroll_a_bit();
	},

	hex_to_rgb: function(color, isObject) {
	    var hexVals = color.match(/\w{2}/g),
	        rgbKeys = ["r", "g", "b"],
	        rgb = (isObject) ? {} : "";

	    for (var i = 0; i < hexVals.length; i++) {
	        if (isObject) {
	            rgb[rgbKeys[i]] = parseInt(hexVals[i], 16);
	        } else {
	            rgb += parseInt(hexVals[i], 16) + ",";
	        }
	    }
	    if (!isObject) {
	        rgb = rgb.substring(0, rgb.length - 1);
	    }

	    return rgb;
	},

	rgb_to_hex: function(color) {
	    if (color.replace) { // String
	        color = color.replace(/(rgba\(|\))/g,""); // Stripping everything not number/comma;
	        color = color.split(",");
	    } else if (!Array.isArray(color)) {
	        color = [ color.r, color.g, color.b ];
	    }

	    var r = parseInt(color[0], 10).toString(16),
	        g = parseInt(color[1], 10).toString(16),
	        b = parseInt(color[2], 10).toString(16);

	    return "#" + (r < 10 ? "0" : "") + r + (g < 10 ? "0" : "") + g + (b < 10 ? "0" : "") + b;
	},

	adjust_brightness: function(color, percent) {
	    color = color.replace("#", "");
	    var num = parseInt(color, 16),
	        amt = Math.round(2.55 * percent),
	        r = (num >> 16) + amt,
	        b = (num >> 8 & 0x00FF) + amt,
	        g = (num & 0x0000FF) + amt;

	    return (0x1000000 + (r < 255 ? r < 1 ? 0 : r : 255) * 0x10000 + (b < 255 ? b < 1 ? 0 : b : 255) * 0x100 + (g < 255 ? g < 1 ? 0 : g : 255)).toString(16).slice(1);
	},

	adjust_saturation: function(color, percent) {
	    percent = percent / 100;
	    color = _.hex_to_rgb(color, true);
	    var gray = color.r * 0.3086 + color.g * 0.6094 + color.b * 0.0820;

	    color.r = Math.round(color.r * percent + gray * (1 - percent));
	    color.g = Math.round(color.g * percent + gray * (1 - percent));
	    color.b = Math.round(color.b * percent + gray * (1 - percent));

	    return _.rgb_to_hex(color);
	},

	random: function(max, min) {
	    min = min || 0;
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	rephrase: function(string) {
		var token = /%[a-z]+/i.exec(string)[0],
			phrases = _.phrases[token.slice(1)];

		if (phrases) {
			string = string.replace(token, phrases[_.random(phrases.length - 1)])
		}

		return string[0].toUpperCase() + string.slice(1);
	}
}