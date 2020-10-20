import { ask } from './lib.js';
import {
  update as updateSnake,
  draw as drawSnake,
  getSnakeHead,
  snakeIntersection,
} from './snake.js';
import {
  update as updateFood,
  draw as drawFood,
  handleScoresButtonClick,
  restoreFromLocalStorage,
  handleGameOver,
  lastMeal,
} from './food.js';
import { outsideGrid } from './grid.js';
import { handleSpeechRecognitionResult, checkSnakeSpeed } from './input.js';
import {
  buttonStart,
  modalOuter,
  scoreEl,
  buttonScores,
  modalOuterScores,
  buttonClose,
} from './elements.js';
import { asyncMap } from './util.js';

let lastRenderTime = 0;
let gameOver = false;
let recognition;
const gameBoard = document.getElementById('game-board');

export function lastMealEmoji() {
  return lastMeal();
}

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function checkDeath() {
  gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}

function update() {
  updateSnake(gameOver);
  updateFood(gameOver);
  checkDeath();
}

function draw() {
  // remove previous segments
  gameBoard.innerHTML = '';
  drawSnake(gameBoard);
  drawFood(gameBoard);
}

// game loop -> running throughout game
async function main(currentTime) {
  if (gameOver) {
    recognition.stop();
    window.cancelAnimationFrame(main);
    const name = await asyncMap(
      [{ title: 'What is your name?', cancel: true }],
      ask
    );
    // gameOver = false;
    if (name == '') {
      scoreEl.innerHTML = 0;
      modalOuter.classList.add('open');
      // reset snake and food pos and score
      update(gameOver);
      draw();
      gameOver = false;

      return;
    }
    // store scores, display scores and go back to main menu
    handleGameOver(name);
    update(gameOver);
    draw();
    gameOver = false;

    modalOuterScores.classList.add('open');
    modalOuter.classList.add('open');

    return;
  }
  // re-call immediately
  window.requestAnimationFrame(main);
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  // make sure u dnt update too often
  if (secondsSinceLastRender < 1 / checkSnakeSpeed()) return;
  lastRenderTime = currentTime;
  // update all logic for the game
  update();
  draw();
}

function start() {
  if (!('SpeechRecognition' in window)) {
    console.log('Sorry your browser does not support speech recognition.');
    return;
  }
  // Make a new speech recognition object
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  // event listener
  recognition.onresult = handleSpeechRecognitionResult;
  recognition.start();
  modalOuter.classList.remove('open');
  main();
  scoreEl.innerHTML = '0';
}

buttonStart.addEventListener('click', start);
buttonScores.addEventListener('click', handleScoresButtonClick);
restoreFromLocalStorage();

function closeModalScores() {
  modalOuterScores.classList.remove('open');
}

modalOuterScores.addEventListener('click', function(event) {
  const isOutside = !event.target.closest('.modal-inner-scores');
  if (isOutside) {
    closeModalScores();
  }
});

window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeModalScores();
  }
});

buttonClose.addEventListener('click', closeModalScores);
