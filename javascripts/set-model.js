/**
 * This Class handles all interactions with the cards.
 * It is split into three arrays
 * {@code deal_pile} The cards that have yet to be dealt
 * {@code dealt} The currently dealt cards
 * {@code discarded} The cards which have been dealt and used to form a set
 */
export class Deck {
  /**
   * Creates Deck object with initial values
   * {@code this.deal_pile} Originally contains each combination of card based
   *    on passed arrays
   * {@code this.dealt} Initalized as empty
   * {@code this.discarded} Initialized as empty
   *
   * @param {array} shapeNums Array of accepted number of shapes per card
   * @param {array} shapes Array of accepted shape types
   * @param {array} shadings Array of accepted shadings for shapes
   * @param {array} colors Array of accepted colors for shapes
   */
  constructor(shapeNums, shapes, shadings, colors) {
    // Sets inital values
    this.deal_pile = [];
    this.dealt = [];
    this.discarded = [];
    this.choices = [];

    // Generates and adds cards to {@code this.deal_pile}
    for (const shapeNum of shapeNums) {
      if (typeof shapeNum === 'number') {
        for (const shape of shapes) {
          if (typeof shape === 'string') {
            for (const shading of shadings) {
              if (typeof shading === 'string') {
                for (const color of colors) {
                  if (typeof color === 'string') {
                    this.deal_pile.push(
                        new Card(shapeNum, shape, shading, color));
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Deals {@code quantity} cards from {@code this.deal_pile}
   *    to {@code this.dealt}
   *
   * @param {int} quantity Number of cards to be dealt
   * @return {array} array of card objects
   */
  deal(quantity) {
    const localDeck = [];
    for (let i=0; i < quantity; i++) {
      const val = this.deal_pile.pop();
      this.dealt.push(val);
      localDeck.push(val);
    }
    return localDeck;
  }

  /**
   * Moves chosen cards from {@code this.dealt} to {@code this.discarded}
   *    based on passed indices
   *
   * @param {array} choices Array of indices of cards in {@code this.dealt}
   *    to be discarded
   */
  pick(choices) {
    // Need to dealt largest indices first to preserve other indices accuracy
    choices.sort((a, b) => b - a);
    choices.forEach((index) => {
      this.discarded.push(this.dealt[index]);
      this.dealt.splice(index, 1);
    });

    this.choices = [];
  }

  /**
   * Puts all the cards back into {@code this.deal_pile} and shuffles them
   */
  shuffle() {
    this.reset();
    // Temporary variable that holds the sorted deck.
    const newDeck = [];
    while (this.deal_pile.length > 0) {
      /* Randomly chose a card to be moved from {@code this.deal_pile}
       *    to {@code this.newDeck}
       */
      const randIndex = Math.floor(Math.random() * this.deal_pile.length);
      newDeck.push(this.deal_pile[randIndex]);
      this.deal_pile.splice(randIndex, 1);
    }
    this.deal_pile = newDeck;
  }

  /**
   * Puts all the cards back into {@code this.deal_pile}
   */
  reset() {
    this.deal_pile = this.deal_pile.concat(this.dealt, this.discarded);
    this.dealt = [];
    this.discarded = [];
  }

  /**
   * Checks to see if there exists a set within the dealt cards
   * @return {array} Returns first set found or an empty array
   */
  setExists() {
    for (let i = 0; i < this.dealt.length; i++) {
      for (let j = i + 1; j < this.dealt.length; j++) {
        for (let k = j + 1; k < this.dealt.length; k++) {
          const combo = [this.dealt[i], this.dealt[j], this.dealt[k]];
          // Change to return a possible set for future hint implementation
          if (isSet(combo)) {
            return combo;
          }
        }
      }
    }
    const emptyArray=[];
    return emptyArray;
  }
}

/**
 * This class dicates how the data for cards will be stored.
 * No card is intended to be modified once created.
 */
export class Card {
  /**
   * Creates {@code Card} object and sets respective variables based
   *    on passed values.
   *
   * @param {number} shapeNum Number of shapes for the card
   * @param {string} shape Shape type for the card
   * @param {string} shading Shading for the card
   * @param {string} color Color for the card
   */
  constructor(shapeNum, shape, shading, color) {
    this.shapeNum = shapeNum;
    this.shape = shape;
    this.shading = shading;
    this.color = color;
  }
}

/**
 * Determines the Player object for the game
 */
export class Players {
  /**
   * @param {*} numOfPlayers number of players selected to play
   */
  constructor(numOfPlayers) {
    this.setsFound = 0;
    this.chosen = 0;
    this.count = numOfPlayers;
    this.scores = new Array(numOfPlayers);
    this.scores.fill(0, 0, numOfPlayers);
  }
}

/**
   * Takes an array of 3 cards and checks if they form a set
   *
   * @param {array} cards Array of Card objects
   * @return {boolean} Whether the cards form a set
   */
export function isSet(cards) {
  const shapeNums=[];
  const shapes=[];
  const shadings=[];
  const colors=[];
  cards.forEach(function(elt, i, a) {
    shapeNums.push(elt.shapeNum);
    shapes.push(elt.shape);
    shadings.push(elt.shading);
    colors.push(elt.color);
  });
  let check = isSameOrDiff(shapeNums);
  check = check && isSameOrDiff(shapes);
  check = check && isSameOrDiff(shadings);
  check = check && isSameOrDiff(colors);
  return check;
}

/**
   * Takes an array of attributes and checks whether they are all the same
   * or all different
   *
   * @param {array} attributes Array of attributes
   * @return {boolean} Whether the attributes are all same or are all different
   */
export function isSameOrDiff(attributes) {
  let allSame = attributes[0] === attributes[1];
  allSame = allSame && attributes[1] === attributes[2];
  let allDiff = attributes[0] !== attributes[1];
  allDiff = allDiff && attributes[1] !== attributes[2];
  allDiff = allDiff && attributes[0] !== attributes[2];
  return allSame || allDiff;
}
