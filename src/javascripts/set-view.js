/*
 * Constants
 */
const SHAPE_CONSTS = {height: 110, width: 50, lineWidth: 5,
  startY: 20, shadingGap: 12.5, diamondOffset: 11.5};

/**
 * Updates console message based on parameter.
 *
 * @param {string} string The message to be added to the console
 */
export function consoleMessage(string) {
  const consoleMes = document.getElementById('console-msg');
  consoleMes.innerHTML = string;
}

/**
 * Updates high score field on sidebar.
 *
 * @param {Players} players Object keeping track of player data in game
 */
export function updateHighScore(players) {
  // Obtaining the HTML high score tag
  const highScore = document.getElementById('high-score');
  let max = players.scores[0];

  // Find highest score amongst players
  for (let index = 1; index < players.scores.length; index++) {
    if (players.scores[index] > max) {
      max = players.scores[index];
    }
  }

  // Modifies score if {@code max} is greater than {@code score}
  const score = highScore.textContent.charAt(highScore.textContent.length - 1);
  if (max > parseInt(score)) {
    highScore.textContent = 'High Score: ' + max;
  }
}

/**
 * Updates the sidebar information and scores
 *
 * @param {Deck} deck Object containing all cards
 * @param {Players} players Object keeping track of player data in game
 */
export function updateView(deck, players) {
  // Obtaining cards-left and sets-found HTML tags
  const cardLeft = document.getElementById('cards-left');
  const setsFound = document.getElementById('sets-found');

  // Styling the card-box so cards have 3 columns
  document.getElementById('card-box').style.gridTemplateColumns = '30% 30% 30%';

  // Updating sets found and cards left fields in the sidebar
  setsFound.textContent = 'Sets Found: ' + players.setsFound;
  const cardsLeft = deck.deal_pile.length + deck.dealt.length;
  cardLeft.textContent = 'Cards Left: ' + cardsLeft;

  // Updating player scores in the score box and high score
  const scores = document.getElementsByClassName('score');
  for (let index = 0; index < scores.length; index++) {
    scores[index].textContent = 'Player ' + (index + 1) + ': ' +
        players.scores[index];
  }
  updateHighScore(players);
}

/**
 * Hides the button with the id specified by the parameter.
 *
 * @param {string} id The id of the button to be hidden
 */
function hideButton(id) {
  const element = document.getElementById(id);
  element.setAttribute('class', 'hidden');
}

/**
 * Shows the button with the id specified by the parameter.
 *
 * @param {string} id The id of the button to be shown
 */
function showButton(id) {
  const element = document.getElementById(id);
  element.setAttribute('class', '');
}

/**
 * Puts the screen in the view to select sets.
 * Adds necessary game-specific buttons and console messages.
 */
export function selectSetView() {
  showButton('hint');
  showButton('no-set');
  showButton('check-set');
  document.getElementById('play').textContent = 'Restart';
  consoleMessage('Click "Check Set" after selecting 3 cards');
}

/**
 * Puts the screen in the view to select players.
 * Removes game-specific buttons and styles new additions to the screen.
 */
export function selectPlayerView() {
  document.getElementById('play').textContent = 'Play';

  // Instructs user
  consoleMessage('Choose number of players then press "Play"');

  // Player number choices
  const cardBox = document.getElementById('card-box');
  cardBox.innerHTML = '';
  cardBox.style.gridTemplateColumns = '40% 40%';

  // Removes game-specific buttons
  hideButton('hint');
  hideButton('no-set');
  hideButton('check-set');
}

/**
 * Loads the newly delt cards to the card box.
 * Gives each card a unique id.
 *
 * @param {Deck} deck Object containing all cards
 * @param {Players} players Object keeping track of player data in game
 */
export function loadCards(deck, players) {
  // Update cards left
  updateView(deck, players);

  // Removes all cards
  const cardBox = document.getElementById('card-box');
  cardBox.innerHTML = '';

  // Add dealt cards
  for (let index = 0; index < deck.dealt.length; index++) {
    // Set card based on index
    const card = deck.dealt[index];

    // Set base value of card node
    const cardNode = document.createElement('canvas');
    cardNode.setAttribute('class', 'card');
    cardNode.setAttribute('id', index);
    cardNode.addEventListener('click', () =>
      selectSet(index.toString(), deck.choices), false);

    // Warning message if canvas is not supported
    const warnMes = 'Your browser does not support the canvas element.';
    cardNode.appendChild(document.createTextNode(warnMes));

    drawCard(card, cardNode);
    cardBox.appendChild(cardNode);
  }
}

/**
 * Selects a card
 *
 * @param {string} id The unique id of the card selected
 * @param {array} choices Array of indices of selected cards
 */
function selectSet(id, choices) {
  // Find the element id of the card
  const idNum = parseInt(id);
  const element = document.getElementById(id);
  // If the element was previously clicked-on  unselect card
  if (choices.includes(idNum)) {
    const index = choices.indexOf(idNum);
    choices.splice(index, 1);
    element.setAttribute('class', 'card');
  } else {
  // Select card and add to {@code choices} removing oldest card if
  // length larger than 3
    if (choices.length > 2) {
      const removedIndex = choices.shift();
      document.getElementById(removedIndex).setAttribute('class', 'card');
    }
    element.setAttribute('class', 'card selected');
    choices.push(idNum);
  }
}

/**
 * Hides game-specific buttons and prints out ending game message
 *
 * @param {boolean} status True or false depending on game statuses
 */
export function endGame(status) {
  hideButton('hint');
  hideButton('no-set');
  hideButton('check-set');

  if (status) {
    // If there are zero cards left
    consoleMessage('Congratulations, you have beaten the game!\n' +
        'Check out the score to your right =>');
  } else {
    // If there are cards left but no more sets
    consoleMessage('No more sets remaining!\n' +
        'Check out the score to your right =>');
  }
}

/**
 * Draws graphic representation of {@code card} so it appears in the
 *  HTML <canvas> tag corresponding to {@code target}
 *
 * @param {Card} card The card to be printed
 * @param {Element} target A canvas tag for the card to be drawn on
 */
function drawCard(card, target) {
  if (target.getContext) {
    // Set basic properties for canvas
    const canvas = target.getContext('2d');
    canvas.fillStyle = card.color;
    canvas.strokeStyle = card.color;
    canvas.lineWidth = SHAPE_CONSTS['lineWidth'];

    // Prints proper number of shapes
    switch (card.shapeNum) {
      case 1:
        drawShape(canvas, 125, card);
        break;
      case 2:
        drawShape(canvas, 67, card);
        drawShape(canvas, 184, card);
        break;
      case 3:
        drawShape(canvas, 37, card);
        drawShape(canvas, 125, card);
        drawShape(canvas, 213, card);
        break;
      default:
    }
  }
}

/**
 * Helper function that facilitates calling the proper function to draw the
 *  desired shape
 *
 * @param {CanvasRenderingContext2D} canvas Object being drawn to
 * @param {int} x Starting x offset for shape
 * @param {Card} card Card that contains details about the shape being printed
 */
function drawShape(canvas, x, card) {
  switch (card.shape) {
    case 'rectangle':
      drawRectangle(canvas, x, card.shading);
      break;
    case 'diamond':
      drawDiamond(canvas, x, card.shading);
      break;
    case 'squiggle':
      drawSquiggle(canvas, x, card.shading);
      break;
  }
}

/**
 * Draws a diamond to {@code canvas} based on passed parameters
 *
 * @param {CanvasRenderingContext2D} canvas Object being drawn to
 * @param {int} x Starting x offset for shape
 * @param {string} fill type of shading the shape has
 */
function drawDiamond(canvas, x, fill) {
  canvas.save();
  canvas.beginPath();
  canvas.moveTo(x + SHAPE_CONSTS['width'] / 2, SHAPE_CONSTS['startY']);

  // top left edge
  canvas.lineTo(x, SHAPE_CONSTS['startY'] + SHAPE_CONSTS['height'] / 2);

  // bottom left edge
  canvas.lineTo(x + SHAPE_CONSTS['width'] / 2,
      SHAPE_CONSTS['startY'] + SHAPE_CONSTS['height']);

  // bottom right edge
  canvas.lineTo(x + SHAPE_CONSTS['width'],
      SHAPE_CONSTS['startY'] + SHAPE_CONSTS['height'] / 2);

  // closing the path automatically creates
  // the top right edge
  canvas.closePath();

  switch (fill) {
    case 'solid':
      canvas.fill();
      canvas.restore();
      break;
    case 'empty':
      canvas.stroke();
      canvas.restore();
      break;
    case 'striped':
      canvas.stroke();
      canvas.restore();
      const maxY = SHAPE_CONSTS['startY'] + SHAPE_CONSTS['height'];

      // Repeatedly draws horizontal lines until y values exceeds range of shape
      for (let y = SHAPE_CONSTS['startY'] + SHAPE_CONSTS['lineWidth'] / 2;
        y <= maxY - SHAPE_CONSTS['lineWidth'];
        y += SHAPE_CONSTS['lineWidth'] + SHAPE_CONSTS['shadingGap']) {
        // X value for top left edge
        const lineX1 = SHAPE_CONSTS['width'] / 2 - SHAPE_CONSTS['width'] /
          SHAPE_CONSTS['height'] * (y - SHAPE_CONSTS['startY']);

        // X value for bottom left edge
        const lineX2 = SHAPE_CONSTS['width'] / SHAPE_CONSTS['height'] *
          (y - SHAPE_CONSTS['startY']) - SHAPE_CONSTS['width'] / 2;

        // Picks proper X value and uses it to draw line for stripped shading
        const lineX = Math.max(lineX1, lineX2);
        canvas.save();
        canvas.beginPath();
        canvas.moveTo(lineX + x, y);
        canvas.lineTo(x + SHAPE_CONSTS['width'] - lineX, y);
        canvas.stroke();
        canvas.restore();
      }
  }
}

/**
 * Draws a squiggle to {@code canvas} based on passed parameters
 *
 * @param {CanvasRenderingContext2D} canvas Object being drawn to
 * @param {int} x Starting x offset for shape
 * @param {string} fill type of shading the shape has
 */
function drawSquiggle(canvas, x, fill) {
  canvas.save();
  canvas.beginPath();

  // Start at top left corner
  canvas.moveTo(x + SHAPE_CONSTS['width'] / 8, SHAPE_CONSTS['startY']);

  // Left edge
  canvas.lineTo(x + SHAPE_CONSTS['width'] / 4,
      SHAPE_CONSTS['startY'] + SHAPE_CONSTS['height'] / 4);
  canvas.lineTo(x,
      SHAPE_CONSTS['startY'] + SHAPE_CONSTS['height'] * 3/4);
  canvas.lineTo(x + SHAPE_CONSTS['width'] / 8,
      SHAPE_CONSTS['startY'] + SHAPE_CONSTS['height']);

  // Bottom edge
  canvas.lineTo(x + SHAPE_CONSTS['width'] * 7/8,
      SHAPE_CONSTS['startY'] + SHAPE_CONSTS['height']);

  // Right edge
  canvas.lineTo(x + SHAPE_CONSTS['width'] * 3/4,
      SHAPE_CONSTS['startY'] + SHAPE_CONSTS['height'] * 3/4);
  canvas.lineTo(x + SHAPE_CONSTS['width'],
      SHAPE_CONSTS['startY'] + SHAPE_CONSTS['height'] / 4);
  canvas.lineTo(x + SHAPE_CONSTS['width'] * 7/8,
      SHAPE_CONSTS['startY']);

  // closing the path automatically creates
  // the top right edge
  canvas.closePath();

  switch (fill) {
    case 'solid':
      canvas.fill();
      canvas.restore();
      break;
    case 'empty':
      canvas.stroke();
      canvas.restore();
      break;
    case 'striped':
      canvas.stroke();
      canvas.restore();

      // Repeatedly draws horizontal lines until y values exceeds range of shape
      const maxY = SHAPE_CONSTS['startY'] + SHAPE_CONSTS['height'];
      for (let y = SHAPE_CONSTS['startY'] + SHAPE_CONSTS['diamondOffset'];
        y <= maxY - SHAPE_CONSTS['lineWidth'];
        y += SHAPE_CONSTS['lineWidth'] + SHAPE_CONSTS['shadingGap']) {
        let lineX = 0;
        if (y - SHAPE_CONSTS['startY'] < SHAPE_CONSTS['height'] / 4) {
          lineX += SHAPE_CONSTS['width'] / 8 + SHAPE_CONSTS['width'] /
              SHAPE_CONSTS['height'] * (y - SHAPE_CONSTS['startY']) / 2;
        } else if (y - SHAPE_CONSTS['startY'] > SHAPE_CONSTS['height'] * 3/4) {
          lineX += SHAPE_CONSTS['width'] / SHAPE_CONSTS['height'] *
              (y - SHAPE_CONSTS['startY'] - SHAPE_CONSTS['height'] * 3/4) / 2;
        } else {
          lineX += SHAPE_CONSTS['width'] / 4 -
              SHAPE_CONSTS['width'] / SHAPE_CONSTS['height'] *
              (y - SHAPE_CONSTS['startY'] - SHAPE_CONSTS['height'] / 4) / 2;
        }
        canvas.save();
        canvas.beginPath();
        canvas.moveTo(x + lineX, y);
        canvas.lineTo(x + lineX + SHAPE_CONSTS['width'] * 3/4, y);
        canvas.stroke();
        canvas.restore();
      }
  }
}

/**
 * Draws a rectangle to {@code canvas} based on passed parameters
 *
 * @param {CanvasRenderingContext2D} canvas Object being drawn to
 * @param {int} x Starting x offset for shape
 * @param {string} fill type of shading the shape has
 */
function drawRectangle(canvas, x, fill) {
  switch (fill) {
    case 'solid':
      canvas.fillRect(x, SHAPE_CONSTS['startY'], SHAPE_CONSTS['width'],
          SHAPE_CONSTS['height']);
      break;
    case 'empty':
      canvas.fillRect(x, SHAPE_CONSTS['startY'], SHAPE_CONSTS['width'],
          SHAPE_CONSTS['height']);
      canvas.clearRect(x + SHAPE_CONSTS['lineWidth'],
          SHAPE_CONSTS['startY'] + SHAPE_CONSTS['lineWidth'],
          SHAPE_CONSTS['width'] - 2 * SHAPE_CONSTS['lineWidth'],
          SHAPE_CONSTS['height'] - 2 * SHAPE_CONSTS['lineWidth']);
      break;
    case 'striped':
      const maxY = SHAPE_CONSTS['startY'] + SHAPE_CONSTS['height'];
      for (let y = SHAPE_CONSTS['startY'];
        y < maxY - 2 * SHAPE_CONSTS['lineWidth'];
        y += SHAPE_CONSTS['lineWidth'] + SHAPE_CONSTS['shadingGap']) {
        canvas.fillRect(x, y, SHAPE_CONSTS['width'], maxY - y);
        canvas.clearRect(x + SHAPE_CONSTS['lineWidth'],
            y + SHAPE_CONSTS['lineWidth'],
            SHAPE_CONSTS['width'] - 2 * SHAPE_CONSTS['lineWidth'],
            maxY - 2 * SHAPE_CONSTS['lineWidth'] - y);
      }
  }
}
