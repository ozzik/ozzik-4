# Preface
Brow.si app was built as 10 a complementary app for consuming content discovered by the [Brow.si menu](products/browsi-menu "Brow.si Menu") on various mobile websites: website news by RSS subscriptions and specific articles by saving. Subscribed websites are shown inside a "Magazine" and saved articles inside a "Reading List".


# Onboarding
Similar the Brow.si menu, a social account is required to sign in into the app. In order to lower the friction for new people a "guest mode" was designed for fully using the app without any user account - and so every step is skippable.
![App walkthrough which implicitly creates the magazine](brapp-guide)
![Help tips shown when accessing specific screens on the first time](brapp-tips)


# Navigation
Items on the Magazine and Reading List are shown as webpages, thus a full browser behavior was integrated into the app. This behavior added another layer of complexity to the navigation idea - some screens are "static app" ones such as the Magazine while others are simple web pages.

Since both the Magazine and Reading List can navigate to article webpages which are still "within" their tab, they are visually marked (some sort of "drawer") to differentiate them from other normal tabs - indicating that their tab has "originated" from the Magazine/Reading List. Once a person taps the magazine quick access button (the oval one on the bottom) - meaning he/she wishes to view it - the article webpage is dissected from the Magazine, so it's till accessible for later if the person wasn't aware of it "hiding" the Magazine.
@[Navigating between different views and tabs](youtube dO-fzB8xqfE 320 568)


# Empty and Error States
![Magazine guest mode on the left, empty screen on the right](brapp-magazine)
![Reading List empty screen for first time users vs. returning users](brapp-readinglist)
![Missing internet connection in the Magazine, webpage and page not found error](brapp-errors)