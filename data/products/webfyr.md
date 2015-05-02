<section class="project-section">
# Preface
Webfyr is a concept product - a rather mature one, yet a concept. We didn't set any goal or spec features or experiences, we just wanted to envision a better experience for consuming RSS-based content.
There were problems we knew we wanted to tackle from the beginning, like handling the reality of excerpt-only RSS feeds, but there were also many of them we discovered as we started working on specific parts of the product.
Oh, and onboarding wasn't part of the concept.
![Early concept sketches](webfyr-sketch)
![Initial kick off mockups](webfyr-tabs)


# Reading Experience
## Inline Browsing
One big caveat of RSS-based web products is users bounce off to other website to read content. Hence we went on and created a "mini browser" pane to show articles and websites within. Using such pane made it easier to improve the consumption experience by enabling users to quickly scan and mark the items they like and read them one by one inside the reading pane.
@[Marking multiple items for reading](youtube fLA68MT-n7Y 644 362)


## Up Next
The reading pane behaves very much like Reeder and Safari. When users reach the end an article, it suggests the next relevant item for reading - whether that's the next item they marked for reading, one they saved from long ago or just the next item on the feed.
@[Contextul suggestion of items for reading next](youtube DZvOKdG0SWk 644 362)


# Shit Content Reality
Products like Feedly provide a well crafted reading experience, yet often times they are failing in handling the reality of the RSS-based publication world - many websites are deliberately providing excerpt-only versions of their articles via RSS, some even go further by providing only links and others just spare providing images.
## Image Placeholders
Users could subscribe to any website (RSS feed) they wanted, even ones without any feature images. We initially tried not showing any image when there wasn't any but that's created a bad reading experience where items would have different text start positions according to image presence. So we went on to always showing an image with a placeholder fallback which was worse because it felt like something was missing and more specifically - distinguishing and recalling image-less articles was rather hard since they all looked the same.
Here came the website-aware placeholder, an artwork tinted to match the website most prominent color - based on the website favicon - and varied into multiple brightness variants to spice up some diversity. And that semi-unique artwork is associated to an article throughout its entire lifespan in the product.
![Image placeholder for The Next Web and TechCrunch](webfyr-placeholder)


## Memory view mode
Excerpt- and links-only websites were tackled by adding a View Mode toggle which remembers the user selection - once a user selects to view an article in its original full website view, that's the way that website's articles will be viewed.


# Tidbits
New items are pushed into the feed with a "New Posts" floating button which clicking on it inserts the fresh items and scrolls the page to the top so the user would notice them. Since sometimes the new content isn't relevant for the user or perhaps triggered by accident - a reversible "Get back down?" button for getting back to where the user was is always shown.
@[Anytime users jump to a new position in their timeline, they can get back to the previous one](youtube 2CJo6UewCtQ 644 362)

Also, new content is always pushed into a "Just Now" section while the existing is pushed to "Earlier Today" so it's easy to tell what's new.
Empty states always engage users with new or existing content - whether by adding new content to their feed, or reviewing "saved for later" or archived articles.
![Empty screens for the Reading List and Timeline](webfyr-empty);

Modals are transitional in a way that helps understand the flow - the intermediate modal states are animated and the main modal button is transitioned according to user feedback.
![Different modal states](webfyr-modals)

# From the Drawer
Lots of ideas were sketched but were not shipped, one of them is a smart item saving mechanism for reading later. The shipped version of Webfyr supports only saving items for future dates but it was planned to also support daily reading scenarios, like moving betwenen devices (save to mobile/desktop), going offline (save local copy) and generally curating items into dedicated lists. Along with a contextual "save tip", a matching filter tip was also cooked.
![Shipped filter tip for browsing saved items vs. unshipped version](webfyr-filter)