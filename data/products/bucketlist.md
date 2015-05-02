# Preface
Bucket List is a drawer concept for a todo app which was designed &amp; developed to a keynote-worthy level as part of a job interview process I've taken. It's deliberately missing some basic product aspects and functionality.
Before reading this, please try it out on an iOS device or Android's Chrome - yet keep in mind it's just a rather highly developed prototype, things do go bad.
![Early concept sketches](bucketlist-sketch)


## Kickoff
Being a common human creature allows me to write down lots of aspirations - things I wish I did, songs I wish I knew and so forth. Another great benefit is that I can also do none of these, I'm a mature man - I do what I want. So I end up having these beautiful Emoji-ful todo lists that I never get to cross off.
Some apps tackle this horrible human nature by using the futuristic high-end technology of push notifications - they remind you to complete "Buy the milk" or maybe review and plan your day. However successful this approach is, I (as a typical product designer) wanted to avoid reminding people in the first place and find a way for them to *want* to accomplish that cliché "Call mom" by themselves.
I blindly think people interact more with things they have feelings for, whether for best or for worst, and so I craved to seed an emotion into every task interaction in hope it'd get it completed. Hence a speculative solution was cooked up:
<ul>
	<li class="project-cue project-cue-bullet project-cue-problem">
		Creating lots of tasks is too easy and there's no trigger for completion
		<ul class="project-cue-nested">
			<li class="project-cue project-cue-bullet project-cue-goal">Therefore, the ability to create a todo should be dependant on past creation and completion actions</li>
			<li class="project-cue project-cue-bullet project-cue-goal">Also, each interaction with tasks should be accompanied with an emotion with a shit storm evoking potential.</li>
		</ul>
	</li>
</ul>


# (Weird) Solution
Bucket list is that generic todo app, consisting of lists of tasks with a requirement to complete them by swiping right, yet with a shitload of quirks.

## Creation Threshold
The amount of lists and tasks a person can create is only as big as the size of its device. Got an iPhone 4? You get 8 slots; iPhone 5? 9; iPhone 6 Plus? 10-11, I don't know - haven't checked.
The concept is stupid but clear - I can't create more items than my screen (which nowadays is an extension of Me) can hold. Thus when that moment comes when I gotta file that movie I must watch later, I might realize that's gonna be the last movie I could have - because idiot me didn't watch all the others till now. Or even worse, I might not even be able to file it because there's no room for it - and just maybe I'd get something else crossed off to make space for My First Dragon 2.


## Handling First Time Threshold Depression
User onboarding wasn't initially onboard, but neither was upsetting people. Therefore upon creating that first ever over-the-limit task, an explanatory message pops up and lets me create that extra task, just for now, though it's not even gonna be onscreen till others are completed (since there's no visual room for it).
@[The choreography other tasks perform to make room for the new neighbor](youtube dpVVDsSogZE 300 568)


## Talking Tasks
Upon a task creation, it randomly picks up a personality which dictates its behavior throughout its lifespan (till death by completion). A task could be over cheerful and greet every new member on the list or be hideously awful and say good riddance for every task that leaves; making me wanna keep that sweet pumpkin forever on my list or just get done with that annoying bitch.
@[Thoughtful dialog between the charming and the witch](youtube eLKDSKjd_9w 300 568)


## Aging Tasks
Nothing could stop me from just completing tasks I've created ages ago just to make room for new ones - I had to teach myself to get things done *in time*. Lastly, every task had to grow.
A task grows older every week and is degradedly covered in dust, which means I can't just swipe right/left to complete/delete it; a combo of right and left swiping is required per each week till that dirt ball is completion-friendly.
Now, once a task reaches the age of 4 it becomes a dinosaur. It dresses up in reptile and annoyingly roars whenever it sees me. Actually, it roars even when I open the app.
@|[](youtube jJHZqbXr-lQ 300 568)
@|[](youtube nTkh8DyHQZk 300 568)
_Left: Cleaning in action. Right: First time explanation of the aging concept once a task has aged


# Complementary Tidbits
Setting a due date for a task is a matter of adding a time reference to it, like "Read all items on Pocket next week" or "Update website footer 1pm".
@[Adding a due date in plain English](youtube m1eGyaVOu8I 300 568)


I think lists work better with a visual cue like an icon, thus initially upon their creation, a tip for selecting an icon was planned. But ultimately, the icon was derived from the name, therefore it made more sense to have the app auto select that for me - and so the tip was thrown.
!|[](bucketlist-icon-manual figure-ios)
!|[](bucketlist-icon-autodetect figure-ios)
_Original manual icon selection vs. shipped auto-detect and selection


An undo mechanism was needed since swiping is too easy and thus error prone. It also needed to be contextual so it's easily noticeable what's about to be restored, all while being not too intrusive.
@[Pulling down the rope to undo (also shows first time undo tutorial when tapping instead of pulling)](youtube xdFLbBBqIg0 300 568)


# Small Details
## List Deletion Confirmation
Though it was originated long before the undo mechanism which renders it useless it's still a rather theatrical scenario. Deleting a list requires selecting its icon as a double confirmation, when selecting the right one makes the list jump in fear and dismissing the process - joyfully bounce as if it was spared.
@[The drama once must go through when deleting a list](youtube g2HpqCnDt7w 300 568)


## Average Age Meter
It's easy enough to clean up aged tasks and lose track of their actual age without checking the info of each and every one of them, so it might seem like I'm on top of my todo when I'm just constantly procrastinating. Here comes the "pull up" footer gauge on every screen which shows the average *real* age of tasks.
![Pull up to get a glance of the actual age of tasks](bucketlist-age-footer figure-ios)


## Empty States
There are actually not many of these.
!|[Empty lists are greeted with a cliché tumbleweed](bucketlist-tumbleweed figure-ios)
!|[Placeholders are ever changing and suggestive](bucketlist-placeholders figure-ios)
!|[When a lonesome task talk it's replied with an echo](bucketlist-echo figure-ios)


## Intro animations
Since the prototype was filled with sounds and iOS prohibits playing sounds without the any initial user action (which resulted in a playback delay on the first play), an initial tap was needed to get things started. Thus the "launch" screen was materialized, requiring the user to behave by tapping.
@[Hacky launch screen on iOS](youtube 52zY4ojK0Ww 300 568)

![](bucketlist-intro1 figure-1-3)
![](bucketlist-intro2 figure-1-3)
![](bucketlist-intro3 figure-1-3)
_Upon launch, lists enter screen in a slightly different choreography to spice things up, usually someone is always late.

@[Modals animate into and out of the screen according to user action](youtube B6B8b_GZw70 644 326)


## Sounds
They're everywhere. Just try it.