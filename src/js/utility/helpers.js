var _ = {
	phrases: {
		watch: [ "watch", "see", "observe", "view", "behold" ],
		watchTransitive: [ "have a look at", "have a peek at", "look at", "gaze at", "stare at" ],
		it: [ "it", "that", "the thing" ],
		mobile: [ "mobile", "your small device", "your tiny screen", "a small device", "a small screen", "a touch device" ],
		preposition: [ "from", "on" ],
		dead: [ "PROJECT IS DEAD" ],
		download: [ "download", "get", "have", "posses" ],
		noteam: [ "♫ All by myself...", "Me, myself and I", "One man show", "🌾🍃🍂...", "...🍃..." ]
	},

	url: function(str) {
		return _BASE_URL + str;
	},

	dataUrl: function(str) {
		return _.url("data/" + str);
	},
	styleUrl: function(str) {
		return _.url("assets/css/" + str);
	},
	imageUrl: function(str) {
		return _.url("assets/images/" + (window.devicePixelRatio === 2 ? str.replace(".png", "@2x.png") : str));
	},
	collectionStyleUrl: function(str) {
		return _.styleUrl("showcases/" + str + "." + $.engine + ".css");
	},
	projectStyleUrl: function(str) {
		return _.styleUrl("projects/" + str);
	},
	projectShowcaseUrl: function(str) {
		return _.imageUrl("showcases/s-" + str);
	},

	loadStyle: function(url, loadHandler) {
		style = document.createElement("link");
		style.rel = "stylesheet";
		style.type = "text/css";
		style.href = url;
		loadHandler && style.addEventListener("load", loadHandler);
		
		document.head.appendChild(style);
	},

	/* RequestAnimationFrame-based scroll from (https://gist.github.com/james2doyle/5694700) */
	easeInOutCubic: function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},

	animateScroll: function(element, isInner, callback) {
		var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); },
			eScrollTarget = !isInner ? (navigator.userAgent.indexOf('Firefox') != -1 || navigator.userAgent.indexOf('MSIE') != -1 ? document.documentElement : document.body) : element,
			scrollStart = eScrollTarget.scrollTop,
			scrollEnd = element.offsetTop,
			change = scrollEnd - scrollStart,
			tick = 0,
			duration = 300;

		function _tinyScroll() {
			tick += 20;
			eScrollTarget.scrollTop = _.easeInOutCubic(tick, scrollStart, change, duration);

			if (tick < duration) {
				rAF(_tinyScroll);
			} else {
				callback && callback();
			}
		}
		(scrollStart !== scrollEnd) && _tinyScroll();
	},

	hexToRgb: function(color, isObject) {
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

	rgbToHex: function(color) {
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

	adjustBrightness: function(color, percent) {
		color = color.replace("#", "");
		var num = parseInt(color, 16),
			amt = Math.round(2.55 * percent),
			r = (num >> 16) + amt,
			b = (num >> 8 & 0x00FF) + amt,
			g = (num & 0x0000FF) + amt;

		return (0x1000000 + (r < 255 ? r < 1 ? 0 : r : 255) * 0x10000 + (b < 255 ? b < 1 ? 0 : b : 255) * 0x100 + (g < 255 ? g < 1 ? 0 : g : 255)).toString(16).slice(1);
	},

	adjustSaturation: function(color, percent) {
		percent = percent / 100;
		color = _.hexToRgb(color, true);
		var gray = color.r * 0.3086 + color.g * 0.6094 + color.b * 0.0820;

		color.r = Math.round(color.r * percent + gray * (1 - percent));
		color.g = Math.round(color.g * percent + gray * (1 - percent));
		color.b = Math.round(color.b * percent + gray * (1 - percent));

		color.r = Math.abs(color.r);
		color.g = Math.abs(color.g);
		color.b = Math.abs(color.b);

		return _.rgbToHex(color);
	},

	random: function(max, min) {
		min = min || 0;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	rephrase: function(string) {
		var regex = /%[a-z]+/ig,
			tokens = [],
			token,
			phrases;

		while ((token = regex.exec(string))) {
			tokens.push(token[0]);
		}

		if (tokens.length) {
			for (var i = 0; i < tokens.length; i++) {
				phrases = _.phrases[tokens[i].slice(1)];
				string = string.replace(tokens[i], phrases[_.random(phrases.length - 1)])
			}
		}

		return string[0].toUpperCase() + string.slice(1);
	},

	trackElementParent: function(child, parent) {
		var target = child,
			delegateLevel = 0;

		while (target !== parent && delegateLevel < 3) {
			target = target.parentNode;
			delegateLevel++;
		}

		return target;
	},

	replaceElementContent: function(element, newContent) {
		while (element.firstChild) {
		    element.removeChild(element.firstChild);
		}

		element.appendChild(newContent);
	},

	subscribeForNotification: function(notification, handler) {
		document.addEventListener("_" + notification, handler);
	},

	sendNotification: function(notification) {
		document.dispatchEvent(new Event("_" + notification));
	},

	/* === Analytics === */
	track: function(category, action, label) {
		// console.log("==", category, action, label);

		if (app.dontAnalytics) { return; }
		
		_gaq.push(['_trackEvent', category, action, label]);
	},

	PEOPLE: {
		gal: {
			name: "Gal Brill",
			url: "https://il.linkedin.com/in/galbrill"
		},
		kobi: {
			name: "Kobi Meirson",
			url: "https://il.linkedin.com/in/kobimeirson"
		},
		gil: {
			name: "Gil Shteinhart",
			url: ""
		},
		tomer: {
			name: "Tomer Hershkowitz",
			url: "https://il.linkedin.com/pub/tomer-hershkowitz/22/709/b50"
		},
		michael: {
			name: "Michael Hait",
			url: ""
		}
	}
}

// Concating phrases
_.phrases.watchTransitive = _.phrases.watchTransitive.concat(_.phrases.watch);