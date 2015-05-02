# Documentation Website
Dough.js is light and simple so its website follows the all-docs-in-one-long-page stream, divided into chapters, along with small characteristic touches.
Inspired by cooking books, every chapter has its prominent space with a dough-translated illustration:
![](doughjs-chapters)

|Since the website is a rather long page, it occupies a side menu for navigating to a chapter or a method. The pages are initially hidden for the menu to be easy to review, yet stalling for a second reveals them.
|![](doughjs-sidemenu)

# More About Dough.js
Dough.js started as a constantly copied Ditto.js file between my web projects and like most JS libraries today, it supports only modern web browsers, but it's got some nice tricks missing from other libraries:

## Granular execution
Say you've got a `var buttons = $(".buttons")` object you've just used to collectively `removeClass()` to its items, and now you want to `addClass()` to the first item - you'd probably go `$(buttons[0]).addClass("active")`. Dough.js saves you from creating that extra object and instead you could just `buttons.addClass("active", 0)`; Every collection-wide method in Dough.js supports that by adding that extra index.

## Smart CSS Selector Toggling
You can't always rely on `toggleClass()` because sometimes your method is called repeatedly or simultaneously, so you end up having:
```if (isCool) {
	// Do things
	$(".button").addClass("active");
} else {
	// Do other things
	$(".button").removeClass("active");
}```
and repeating yourself only because `toggleClass()` is a monkey. But Dough.js's version is a good listener so you could tell it explicitly:
```if (isCool) {
	// Do things
} else {
	// Do other things
}
$(".button").toggleClass("active", isCool);```

## Transitions, animations and transforms
Easily act upon a CSS transition finish with `$.transitionEnd("transform", button, function() { ... })` and translate elements with `$(".box").translate(20, 10)`. No vendor prefix or callback tracking needed.