# Welome to the Game of Set!
The Game of Set is a classic card game, with roots tracing back all the way to 1974!!! The goal of the game is to create a "set" of 3 cards out of the 12 cards in play at any given time. It is extremely fun and not frustrating at all!

## Getting Started

To install and run the web application, type
```
npx serve src
```
NOTE: window must be at least 860px wide and 596px tall for optimal experience.

## How to play the game!
Now you're ready to run this game! As soon as you load this website, you'll notice the choice of the number of players. But you must wait! You don't even know *how to play* yet!!! But don't worry, I've got you covered. Explained here will be how to play set in general, and how to use this website specifically to play! ***Hooray!1!!!1***

### What is a set?
Each card in this game has 4 unique characteristics (color, shape, number of shapes, and shading), each with 3 variants. A set is any 3 cards which either have every feature the same or every feature different for each of the features. For example, a set would be {[1 solid red diamond], [2 solid green squiggles], [3 solid blue diamonds]}

### Basic Game Mechanics
Because there are 4 unique characteristics, each with 3 variants on each card, there are 81 cards in total (dang that's some cool math). The goal of this game is to plow your way through all of those 81 cards by selecting *sets* from the cards in play in front of you. At the start, you're given 12 cards in front of you. If you correctly identify a set, those 3 cards will be removed and 3 more different cards will be added in front of you. If there are no sets in the 12 cards, 3 more cards will be added to ensure there is a set. This continues until each every card has been put into a set! Wow so fun...

### Playing on this website
Now, you are finally at the level at which you can begin to comprehend the greatness that is this website. Underneath this text lies the information you will need to navigate this site. Listed is all of the buttons and their functionality. Good Luck.

#### Choosing Players
First, you need to choose how many players are going to be playing this game. Most of you will probably choose 1 player, since you have no friends, but if you're the grader, you'll probably choose the maximum number of players: 4, since you have *soooooo* many friends. Press "Play" once you've selected the number of players to play, and you will be transported to the mystical screen of the actual game.

#### Score Box
The box in the top right shows your scores! If you have more than 1 player, selecting that player in the score box indicates that it's that person's "turn," and if they choose a set, their score will update! So make sure that every time you choose a set, the correct player is selected!

#### Check Set --- Button
This is the button you'll probably be using the most. This button takes your selection of 3 cards and checks to see if it's a set! If it's correct, those three cards will be removed and three new cards will take their places, ready to challenge your (incredible, if you're the grader) intellect! If you chose a wrong set, your score decrements by 1! Yay!

#### No Set --- Button
Hopefully you won't need to press this button too often. This button is for when you think there's **no** set at all in the cards given out. This is possible, but very unlikely. But be careful, since if you use this button, and you're wrong, you will LOSE points!!!!

#### Hint, Please! --- Button
This is for when you need help. This will display a hint in the console at the very top of the game box, on top of the buttons and box of cards!

#### Play/Restart --- Button
At the beginning, when choosing players, you chose this button which started the game. But wait! It's not there anymore? What happened? It turned into the **Restart** button!!! Isn't that cool! Pressing the **Restart** button will reset your *current* game, meaning the score and deck will reset, but it won't change the high score or number of players playing!

#### Quit --- Button
Finally! The button to be used the most! This button brings you back to the "choose player" screen, it still keeps your high score, though, so you can always remember the magical time you had playing this incredible game!

#### How To Play --- Button
If you ever get lost and need to be reminded of how to play the game, this button pulls up an *incredible* display explaining these very rules! Isn't that ***cool!?!?!***

#### Now get out there and have some fun!!!

## Style Guidelines

 - We used the prestigious w3c validator (default settings) to ensure that the HTML for the website is up to the appropriate standards. You can find this validator here: https://validator.w3.org/
 
- Similarly, we used the w3c's equally prestigous CSS validator (default settings) to ensure that the CSS on your future website is up the highest of standards! Aren't you glad that we're making this site? It can be found here: https://jigsaw.w3.org/css-validator/

- To validate our javascript, we used the extremely prestigous eslint linter. Here are the incredibly detailed instructions used to install it:

 1. Type in console:
```
npm install --save-dev eslint eslint-config-google
```
 2. In the console, type this to run the linter:
```
npx eslint src/
```
- The file .eslintrc.json hold the config settings for the linter. We used the Google JavaScript style guide (ES2015+ version).

## Testing!
For our test cases, we used a super cool tool called Jasmine! In order to install Jasmine, one needs to run these cool commands:
- First, run this to install Jasmine:
```
npm install jasmine-es6
```
- To run Jasmine test cases do:
```
npm test
```

## Development

The development of this project brought together some of the top minds in the OSU CSE 3901 Web Apps class, each bringing a unique set of skills and giving their all to make this the best project it could possibly be. Here are their names and contributions:

- Antoni Rempala:
  - Worked on: card selection; handling wrong input; multiplayer; final score recap; high score.
- Kunal Arya:
  - Worked on: initial layout; card selection; set existence in dealt cards; hint button; score layout; end game state.
- Sam Cohen:
  - Worked on: page design; generative card graphics; score layout; how to play; README.
- Simon Kirksey:
  - Worked on: objects in set-model; generative card graphics; multiplayer; segmentation of js files.
- Zaid Badiger:
  - Worked on: objects in set-model; test cases; ability to check set; migration from middleman and modularization of code.
