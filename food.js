import { onSnake, expandSnake } from './snake.js';
import { randomGridPosition } from './grid.js';
import { scoreEl, scoresList, modalOuterScores } from './elements.js';
import { wait } from './util';

let foodEmoji = '😂';
const emojis = [
  '🚶‍♀️',
  '🚶‍♂️',
  '🏃',
  '⛹',
  '🤸',
  '🐕',
  '🐈',
  '🐁',
  '🍇',
  '🍉',
  '🍈',
  '🍓',
  '🍑',
  '🍍',
  '🍌',
  '🥝',
  '🍏',
  '🍎',
];

function randomElementFromArray(arr) {
  const element = arr[Math.floor(Math.random() * arr.length)];
  return element;
}

export function lastMeal() {
  console.log(foodEmoji);
  return foodEmoji;
}

function getRandomFoodPosition() {
  let newFoodPosition;
  // check to make sure food not created on snake
  // loops until it finds a valid new food position
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    newFoodPosition = randomGridPosition();
  }
  foodEmoji = randomElementFromArray(emojis);
  return newFoodPosition;
}

// CSS grid starts at 1
// food start pos
let food = getRandomFoodPosition();
const EXPANSION_RATE = 1;
let currentScore = 0;
let scores = [];
// when snake has eaten
export function update(gameOver) {
  if (onSnake(food)) {
    expandSnake(EXPANSION_RATE);
    // new food pos
    food = getRandomFoodPosition();
    currentScore += 1;
    scoreEl.innerHTML = currentScore;
  }
  if (gameOver) {
    currentScore = 0;
    food = getRandomFoodPosition();
  }
}

export function draw(gameBoard) {
  const foodElement = document.createElement('div');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add('food');
  foodElement.textContent = foodEmoji;

  gameBoard.appendChild(foodElement);
}

function mirrorToLocalStorage() {
  console.info('saving items to local storage');
  // convert object to string first
  localStorage.setItem('scores', JSON.stringify(scores));
}

export function displayItems() {
  // sort scores from highest to lowest
  // sort by value
  if (scores.length === 0) {
    scoresList.innerHTML = `<li>No Scores</li>`;
  } else {
    const scoresByRank = scores.sort(function(a, b) {
      return b.value - a.value;
    });
    const html = scoresByRank
      .map(
        score => `<li class="high-score-item"><span>${score.name}</span><span>${
          score.value
        }</span>
      <button 
        class="delete-score-btn"
        aria-label="Remove score for ${score.name}"
        value="${score.id}"
      >&times;</button></li>`
      )
      .join('');

    const deleteAllbtn = `<button 
        class="delete-all-scores-btn"
        aria-label="Remove all scores"
      >Delete All</button>`;
    scoresList.innerHTML = html + deleteAllbtn;
  }
}

export function handleScoresButtonClick() {
  displayItems();
  // show modal
  modalOuterScores.classList.add('open');
}

export async function handleGameOver(name) {
  // add score and user input to object and store in local storage
  const score = {
    name,
    value: currentScore,
    id: Date.now(),
  };
  scores.push(score);
  scoresList.dispatchEvent(new CustomEvent('scoresListUpdated'));
  mirrorToLocalStorage();
  // display high scores pop up
  await wait(1100);
  handleScoresButtonClick();
  scoreEl.innerHTML = 0;
}

export function restoreFromLocalStorage() {
  // pull the items from LS
  // convert string to object
  const lsItems = JSON.parse(localStorage.getItem('scores'));
  if (!lsItems) return;
  if (lsItems.length) {
    // update items...
    scores = lsItems;
    scoresList.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

function deleteItem(id) {
  // update our items array without this one
  scores = scores.filter(score => score.id !== id);
  mirrorToLocalStorage();
  // display new updated list, without the deleted item and save to local storage
  scoresList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function deleteAll() {
  scores = [];
  scoresList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

scoresList.addEventListener('click', async function(e) {
  // target is thing that clicked, currentTarget is the thing that ur listening on (ul (list))
  // event delegation -> listen for click on list ul but then delegate the click over to the btn if that was clicked
  const id = parseInt(e.target.value);
  if (e.target.matches('.delete-score-btn')) {
    // convert id to number... pulled out as string here...
    deleteItem(id);
    await wait(50);
    displayItems();
  }
  if (e.target.matches('.delete-all-scores-btn')) {
    deleteAll();
    await wait(50);
    displayItems();
  }
});
