import {Deck, Players, isSet} from '../javascripts/set-model.js';
import {consoleMessage, updateHighScore, updateView, selectSetView,
  selectPlayerView, loadCards, endGame} from '../javascripts/set-view.js';

/*
 * Constants declared here for single point of change.
 */
// The possible number of each shape in a card found in {@code Deck}
const SHAPE_NUMS = [1, 2, 3];
// The possible shapes found in a card object in {@code Deck}
const SHAPES = ['rectangle', 'diamond', 'squiggle'];
// Possible shading texture found in a card object in {@code Deck}
const SHADINGS = ['solid', 'striped', 'empty'];
// Possible colors found in card object in {@code deck}
const COLORS = ['red', 'blue', 'green'];
// Maximum length of cards from {@code deck} to be dealt
const MAX_DECK_LENGTH = 15;
// Initial length of cards to be dealt from {@code deck}
const INIT_DECK_LENGTH = 12;
// Sets max number of players to be permitted to participate in-game
const MAX_PLAYERS = 4;

/*
 * State variables
 */
// Object containing generated cards based on passed values
const deck = new Deck(SHAPE_NUMS, SHAPES, SHADINGS, COLORS);
// Holds number of players selected by user
let playerSelected;
// Object that tracks player scores
let players;
// Tracks last hint given
let hintNumber = 0;

/*
 * Main function and point of execution for javascript code when rendering site.
 * Attaches essential functions to each button based on id
 */
window.onload = () => {
  getPlayers();
  // Attach event listeners to each button. Determined through Button ID
  document.getElementById('play').addEventListener('click', play, false);
  document.getElementById('how-to-play').addEventListener(
      'click', howToPlay, false);
  document.getElementById('no-set').addEventListener('click', noSet, false);
  document.getElementById('hint').addEventListener('click', giveHint, false);
  document.getElementById('check-set').addEventListener(
      'click', ()=>checkSet(deck.choices), false);
  document.getElementById('quit').addEventListener('click', quit, false);
};

/*
 * Control level functions
 */

/**
 * Processes and creates the html elements to be rendered on screen for
 * selecting the number of players participating. First view when loading game.
 */
function getPlayers() {
  // Import view function from {@file set-view}. Prepares player selection screen
  selectPlayerView();
  // Assign attributes to html elements rendered from view
  const cardBox = document.getElementById('card-box');
  for (let index = 0; index < MAX_PLAYERS; index++) {
    const playerNode = document.createElement('div');
    playerNode.setAttribute('class', 'player-count');
    playerNode.setAttribute('id', index);
    playerNode.innerHTML = '<span>' + (index + 1) + ' Players</span>';
    playerNode.addEventListener(
        'click', () => selectPlayer(index.toString()), false);
    cardBox.appendChild(playerNode);
  }
}

/**
 * Selects a number of players
 * @param {string} id the unique id of the players selected
 */
function selectPlayer(id) {
  // Increment id so it matches number of players that would play
  const idNum = parseInt(id) + 1;
  const element = document.getElementById(id);
  // If playerSelected hasn't been declared yet, set it to selected
  if (playerSelected === undefined) {
    playerSelected = idNum;
    element.setAttribute('class', 'player-count selected');
  // If they selected a different number of players, update visuals
  } else if (playerSelected !== idNum) {
    element.setAttribute('class', 'player-count selected');
    const oldChoice = document.getElementById((playerSelected - 1).toString());
    oldChoice.setAttribute('class', 'player-count');
    playerSelected = idNum;
  }
}

/**
 * Wipes current game data and redirects user to initial view
 * @updates {@code players}
 * @updates {@code playerSelected}
 */
function quit() {
  const local = players;
  // Wipe away current player data and reset {@code deck}
  deck.reset();
  // Reset player data
  players = new Players();
  // Reset score view
  initializeScores();
  // Re-render start page and reinitialize scores for player
  getPlayers();
  // Keep track of highest score acheived from players
  updateHighScore(local);
  playerSelected = undefined;
}

/**
 * Creates player objects from {@code players} and inititlizes scores
 * and view data for selecting cards
 * @updates {@code players}
 */
function play() {
  if (playerSelected === undefined) {
    consoleMessage('You need to choose the number of players to press "Play"');
    return;
  }
  // Initialize game state
  players = new Players(playerSelected);
  initialDeal();
  initializeScores();
  selectSetView();
}

/**
 * Sets up data for the score box being presented in the view
 * from {@file set-view}
 */
function initializeScores() {
  const scoreBox = document.getElementById('score-text');
  scoreBox.innerHTML = '';

  // Creates the html elements representing the player objects and their scores
  for (let index = 0; index < players.count; index++) {
    const scoreNode = document.createElement('button');
    scoreNode.setAttribute('id', 'player' + index.toString());

    // Add event listener to affect a player score when it is selected
    scoreNode.addEventListener('click', () => setCurrentPlayer(index), false);
    if (index === 0) {// Automatically select player 1
      scoreNode.setAttribute('class', 'score chosen');
    } else {
      scoreNode.setAttribute('class', 'score');
    }
    scoreBox.appendChild(scoreNode);
  }
  // Ensure changes reflected in view
  updateView(deck, players);
}

/**
 * Sets the chosen player based on passed id
 * @param {string} id Number signifying the new chosen player
 */
function setCurrentPlayer(id) {
  const score = document.getElementsByClassName('score');
  score[players.chosen].setAttribute('class', 'score');
  players.chosen = parseInt(id);
  score[players.chosen].setAttribute('class', 'score chosen');
}

/**
 * Creates an HTML alert with instructions on how to play the game
 */
function howToPlay() {
  alert('\t\t\t\t\tHow To Play!\n\n' +
      '- First, choose how many players you want to play with!\n' +
      '- Second, choose a set by clicking three cards, and check if it\'s a' +
      ' set by pressing the \"Check Set\" button. If you believe that no sets' +
      ' exist within the given cards, click the \"No Set\" button. If you get' +
      ' the set correct, your score will increment, else it will decrement!\n' +
      '- If you have more than 1 player, you will need to select which' +
      ' player is choosing the set by using the buttons in the top right!\n' +
      '- For more detailed instructions, visit our epic GitHub page!');
}

/**
 * Displays a hint in the console box
 */
function giveHint() {
  const possibleSet = deck.setExists();
  if (possibleSet.length !== 0) {
    consoleMessage('A set contains ' + possibleSet[hintNumber].shapeNum + 'x ' +
        possibleSet[hintNumber].color + ', ' + possibleSet[hintNumber].shading +
        ', ' + possibleSet[hintNumber].shape + ' card');
    hintNumber = (hintNumber + 1) % 3;
  } else {
    consoleMessage('Have you seen that shiny "No Set" button?');
  }
}

/**
 * Checks if there exists a set within the dealt cards and notifies the user
 */
function noSet() {
  // Handles when there is a set
  if (deck.setExists().length !== 0) {
    consoleMessage('Your guess was wrong..there IS a set');
  } else {
    consoleMessage('Weird. There is NO set');

    // Adds cards if there is space, otherwise shuffles dealt into deck
    if (deck.dealt.length < MAX_DECK_LENGTH) {
      // Adds cards if there are more to be added
      if (deck.deal_pile.length > 0) {
        addThreeCards();
      } else {
        endGame(false);
      }
    } else {
      deck.deal_pile.concat(deck.dealt);
      deck.dealt = [];
      deck.deal(INIT_DECK_LENGTH);
      loadCards(deck, players);
    }
  }
}

/**
 * Deals 12 cards in the beginning of the round
 */
function initialDeal() {
  deck.shuffle();
  deck.deal(INIT_DECK_LENGTH);
  loadCards(deck, players);
}

/**
 * Deals 3 cards to the game box
 */
function addThreeCards() {
  deck.deal(3);
  loadCards(deck, players);
}

/**
 * Checks whether the cards selected by the user are a set or not
 * @param {array} setIndices array of indices relating to the dealt array
 */
function checkSet(setIndices) {
  // Checks that three cards have been added
  if (setIndices.length !== 3) {
    consoleMessage('A set is 3 cards! 3!!!1!1!!!!');
    return;
  }

  // Extracts array of cards based on passed indices
  const setCards = [];
  for (const index of setIndices) {
    if (typeof index === 'number') {
      setCards.push(deck.dealt[index]);
    }
  }

  // Checks if it is a set
  if (isSet(setCards)) {
    consoleMessage('Nice job!');

    // Removes set from respective locations
    deck.pick(setIndices);
    deck.choices = [];

    // Deals cards if there are cards to be dealt
    if (deck.deal_pile.length > 0 && deck.dealt.length < INIT_DECK_LENGTH) {
      addThreeCards();
    }

    // Update view
    loadCards(deck, players);
    players.scores[players.chosen]++;
    players.setsFound++;
    updateView(deck, players);

    // Handles end state
    if (deck.dealt === 0) {
      endGame(true);
    }
  } else {
    // Handles consequences of incorrect set
    if (players.scores[players.chosen] > 0) {
      players.scores[players.chosen]--;
      updateView(deck, players);
    }
    consoleMessage('Incorrect! Try Again');
  }
}

