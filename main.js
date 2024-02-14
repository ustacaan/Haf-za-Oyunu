const startOverlay = document.querySelector('[data-game-start]');
const startOverlayText = document.querySelector('[data-game-start-text]');
const cards = document.querySelectorAll('.card');
const timer = document.querySelector('[data-time-remaining]');
const ticker = document.querySelector('[data-flips]');
const restartButtons = document.querySelectorAll('[data-game-restart]');
const nameInput = document.querySelector('[data-name-input]');
const nameInputForm = document.querySelector('[data-name-form]');
const playerLastScore = document.querySelector('[data-player-score]');

// Game Settings
let cardToCheck = null;
let totalClicks = 0;
let timeRemaining = 100;
let matchedCards = []
let busy = false;
let countDown;
let playerName;

function restartGame() {
  cardToCheck = null;
  totalClicks = 0;
  timeRemaining = 100;
  matchedCards = []
  busy = false;
  countDown;

  document.querySelector('[data-victory-text]').classList.remove('visible')
  document.querySelector('[data-game-over-text]').classList.remove('visible')
  
  cards.forEach(card => {
    card.classList.add('visible');

    card.querySelector('.card-back').classList.add('none');
    card.querySelector('.card-front').classList.remove('none');
  })

  overlayHandler();
  actionGame();
}

function playerScoreAction() {
  let score;
  if (localStorage.getItem('score') < Number(timer.innerText) - Number(totalClicks)) {
    score = Number(timer.innerText) - Number(totalClicks);
  } else {
    score = localStorage.getItem('score') || Number(timer.innerText) - Number(totalClicks);
    localStorage.setItem('score', score)
  }
  
  localStorage.setItem('score', score);
  playerLastScore.innerText = score;
}

function renderPlayerScore() {
  playerLastScore.innerHTML = localStorage.getItem('score');
}

// Click Restart Buttons
restartButtons.forEach(restartButton => {
  restartButton.addEventListener('click', restartGame);
});

function overlayHandlerTwo(e) {
  startOverlay.classList.remove('visible');

  e.preventDefault();
  document.querySelector('[data-player-name]').innerHTML = nameInput.value

  overlayHandler()
}

nameInputForm.addEventListener('submit', overlayHandlerTwo);

function hideCards() {
  cards.forEach(card => {
    card.classList.remove('visible');

    card.querySelector('.card-back').classList.remove('none');
    card.querySelector('.card-front').classList.add('none');
  })
}
function overlayHandler() {
  startOverlay.classList.remove('visible');

  // Started Game
  // Game Started and Shuffle Cards
  setTimeout(() => {
    // Hide Cards
    hideCards()
    
    // Shuffle Cards
    shuffle(cards)

    // Start Cound Down
    // Count
    countDown = setInterval(() => {
      timer.innerHTML = --timeRemaining;
      
      if(timeRemaining === 0) {
        gameOver(countDown);
      }
    }, 1000)
  }, 3000);
}

function turnCard(card) {
  card.classList.add('visible');
  
  setTimeout(() => {
    card.querySelector('.card-front').classList.remove('none');
    card.querySelector('.card-back').classList.add('none');
  }, 300);
}

function reTurnCard(cardOne, cardTwo) {
  cardOne.classList.remove('visible');
  cardTwo.classList.remove('visible');
  

  cardOne.querySelector('.card-back').classList.remove('none');
  cardOne.querySelector('.card-front').classList.add('none');

  cardTwo.querySelector('.card-back').classList.remove('none');
  cardTwo.querySelector('.card-front').classList.add('none');
}


function cardMissMatch(cardOne, cardTwo) {
  busy = true;
  setTimeout(() => {
    reTurnCard(cardOne, cardTwo)
    busy = false;
  }, 1000);
}

function CardMatch(cardOne, cardTwo) {
  matchedCards.push(cardOne);
  matchedCards.push(cardTwo);
  cardOne.classList.add('matched');
  cardTwo.classList.add('matched');

  if (matchedCards.length === cards.length) {
    playerScoreAction();
    victory(countDown)
  }
}

function checkForCardMatch(card) {
  if(getCardType(card) === getCardType(cardToCheck)) {
    CardMatch(card, cardToCheck)
  } else {
    cardMissMatch(card, cardToCheck);
  }

  cardToCheck = null;
}

function getCardType(card) {
  return card.querySelector('.card-front > img').src
}

function flipCard(card) {
  if (!busy && !matchedCards.includes(card) && card !== cardToCheck) {
    ticker.innerText = ++totalClicks;
    turnCard(card);

    // statement

    if (cardToCheck) {
      checkForCardMatch(card)
    } else {
      cardToCheck = card;
    }
  }
}

function shuffle(cards) {
  for(let i = cards.length - 1; i > 0; i--) {
    let randIndex = Math.floor(Math.random() * (i + 1));
    cards[randIndex].style.order = i;
    cards[i].style.order = randIndex
  }
}

function victory(countDown) {
  clearInterval(countDown)
  document.querySelector('[data-victory-text]').classList.add('visible')
}

function gameOver(countDown) {
  playerScoreAction();
  clearInterval(countDown);
  document.querySelector('[data-game-over-text]').classList.add('visible')
}

function actionGame() {
  // Default Game Settings
  timer.innerHTML = timeRemaining;
  ticker.innerHTML = 0;

  // Form Action
  

  // Overlays
  startOverlayText.addEventListener('click', overlayHandler);
  
  // Cards
  cards.forEach(card => {
    card.addEventListener('click', function() {
      getCardType(card)
      flipCard(card)
    })
  })
}

actionGame();
renderPlayerScore();