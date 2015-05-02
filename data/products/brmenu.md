# Preface
Brow.si is an engagement tool for mobile websites, which aims to simplify content sharing and conusmption; along with creating a familiar and unified experience between websites. Brow.si manifests itself as an overlay layer when accessing websites from mobile devices.
The first version had poor engagement performance and so the product had gone through a massive redesign just after its launch.
![](brmenu-v1-to-v2)


# What went wrong with v1?
## Rigid Interface
|Though the original interface had lots of animations, *it felt and looked heavy*. Brow.si was depicted as a toolbar and naturally its range of behaviors was limited due to its shape. We also had a technical issue with fixiating Brow.si on screen so we had to hide it whenever users scroll the page and slide it back in with an animation - which turned out to be highly annoying.
|@[Brow.si v1 opening and closing animation](self assets/videos/projects/brmenu/v1-rigid.mp4 assets/images/projects/brmenu/v1-rigid.jpg)


## Stateless User Interface
Brow.si's core interactions - sharing and content consumption - are tied to a back-end infrastructure, which means their results aren't immediate. Sadly, most of the actions were performed with buttons within floating "tips" which made it rather complicated to convery their processing status; hence *there wasn't any indication of what and if anything was being processed*.
@|[Brow.si v1 missing processing indication](self /assets/videos/projects/brmenu/v1-stateless.mp4 assets/images/projects/brmenu/v1-stateless.jpg)
@|[Brow.si v1 showing partial processing indication](self /assets/videos/projects/brmenu/v1-stateless2.mp4 assets/images/projects/brmenu/v1-stateless2.jpg)
_The left one is rather quick because it's being used on a local test enviornment...


## Surprising Modals
|@[Multiple popping in and out modlas in Brow.si v1](self assets/videos/projects/brmenu/v1-modals.mp4 assets/images/projects/brmenu/v1-modals.jpg)
|We didn't want to freeze the UI while waiting for server response so we closed Brow.si in the meantime and showed the action result modal sometime later. But we let users mistakenly believe an action was done as Brow.si closed itself to "free" the UI; only to take control over it a second later to inform of the action result - both a disturbing and complicated experience since *users had to recall what action they set out and learned they must wait for something to show up*.


## Destructive Actions
Using Brow.si core features requires the user to be logged in; so we have to send him off to connect via a Facebook or Twitter page. *But we failed to convey users that they were about to be referred to a login page*, we referred them immediately upon selecting the social network they wished to share with, or whenever they pressed a button which required them to have a user account. *The lack of a heads-up left users confused and upset* since every action could potentially do something unexpected like leaving the page; and practically made Brow.si *not inviting to use*.
![](brmenu-conclusions)
= 70% of the actions are destructive.<br />Most of the UI isn't inviting...


## Shit.
So we set out to redesign Brow.si and defined goals for the new UI:
*(goal) Should be as harmless as possible; thus more inviting and encouraging users to try anything.
*(goal) Keep users in a continous flow. Every action should occur in a single context and make sense.
*(goal) Should be more user-friendly and fun.


# The Redesign (v2)
|![](brmenu-v2-design)
|Brow.si was no longer a toolbar but a menu of floating buttons. When being closed, it was now just a floating button on the screen which triggered a series of other floating buttons. This freed us from the "wrapping" element physiolgy and gave room for exploring a handful of animations.

Finally, we could easily create a layouting system to put Brow.si almost anywhere on the screen. Selecting the 4 screen corners as anchors was ideal since they made Brow.si less intrusive and enabled more space for the fully-fledged menu. Users could now *move Brow.si* to whichever corner they wished, making it *less disturbing* and a bit *more personal*.

!|[](brmenu-v2-layout)
@|[Repositioning Brow.si by dragging it to any screen corner](self /assets/videos/projects/brmenu/v2-drag.mp4 assets/images/projects/brmenu/v2-drag.jpg)

We emphasized the hosting website and made the new floating button *more familiar to users* by branding it with the website icon or logo. Users shouldn't and didn't know Brow.si's 3-dot icon.

![](brmenu-v2-branding)

Buttons for toggling between states were replaced to switch-shaped buttons because, well, they should've looked like that in the first place.

![](brmenu-v2-switches)


## Hierarchies
We had buttons and we kept things simple by using them for inner menus as well, along with an animation to explain the shift between the menus; no more floating tips.
![Left one was selected. More options were tested in earlier mockups](brmenu-v2-hierarchy)


## Unified Modal
|A unified experience: getting information from the user and processing actions is always done in a modal; a single modal, which doesn't leave the screen until everything related to its action is done. </br>We've literally created a single modal object with lots of different states for confirmation, processing, showing a message - and moved the user between these states. Users could now see a visual transition between pressing a button and seeing its result, which *made it hard for them to get lost.*
|@[Simplified sharing process by using a single modal in Brow.si v2](self assets/videos/projects/brmenu/v2-share.mp4 assets/images/projects/brmenu/v2-share.jpg)

Destructive actions, like sending to a new page for login, were preceeded by simply asking the user if she would like to "connect" to a given service. This made all functions less surprising and more explorable, *users could press and try anything* without being abruptly referred to a new login page or perform an action they didn't see coming.
|@[Improved modals with icons and colors](self assets/videos/projects/brmenu/v2-modals.mp4 assets/images/projects/brmenu/v2-modals.jpg)
|Lastly, we've pushed a "subject" icon into every modal so it would be easy to recall its starting action, and also colored error messages to distinguish them more easily.

= During the first month alone of the new version, <br />Brow.si picked a *+200%* growth in user interactions.


# Alternative Concepts
We initially tried out a flipped-axis inner menus to tighten the connection of these menus with their "top level" buttons. Modals would be inline and adjacent to their summoning button which would be rised a bit to get focus.
It turned out to be a bit of a visual mess with "top level" buttons Still appearing on the screen while navigating into inner menus. It also trimmed the latter's screen real estate, so we ultimately dropped the whole concept.
@|[Alternative animation concept for modals](self /assets/videos/projects/brmenu/alpha-modal.mp4 assets/images/projects/brmenu/alpha-modal.jpg)
@|[Alternative animation and design concept for inner menus](self /assets/videos/projects/brmenu/alpha-menu.mp4 assets/images/projects/brmenu/alpha-menu.jpg)
_It looked cool, though.