#Totally Not Galaga

##Overview
**Totally Not Galaga** is a Galaga clone with some variations.  Like Galaga, the player controls
a ship at the bottom of the screen with which you shoot the enemy bugs that come to attack you.

However, unlike Galaga, the bugs do not divebomb the player.  Instead, the bugs will enter from the top
and fire projectiles at the player as they move back and forth across the screen.
This changes the nature of the gameplay from classic Galaga, in that in **Totally Not Galaga**,
a large part of the gameplay strategy is to dodge the bug's projectiles, and fire at the bugs while doing so.

##The Player
The player has 3 lives available for each level, after beating a level, the remaining lives reset to 3.
The player's remaining lives are displayed on the right side of the screen, below the player's score.

##The Bugs
There are currently three different kinds of bugs, which are labeled in the code as **Type 1**, **Type 3**, and **Type 4**.
**Type 3** and **Type 4** are effectively the same from a gameplay perspective, but are different in appearance.
**Type 4**'s are the 'Boss' bugs, and take 3 hits to eliminate.

##Scoring
The scoring system works in the following way:
> - Eliminating **Type 3** and **Type 4** bugs gives the player 40 points.

> - Eliminating **Type 1** bugs gives the player 100 points.

> - Every player projectile that misses removes 5 points.  This gives the player an incentive to be tactful regarding when to fire their projectiles.

> - After each playthrough (meaning the player has either lost or has beaten all the levels), the player is awarded a **bonus** which is added to their final score.  This **bonus** is equal to sum of all the lives the player had remaining after each level multiplied by 100.
