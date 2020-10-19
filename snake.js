import { getInputDirection } from './input.js';
import { lastMealEmoji } from './game.js';

let lastMealsList = ['👀'];
export const SNAKE_SPEED = 5;
// start pos
export const snakeBody = [{ x: 15, y: 15 }];
let newSegments = 0;

function addSegments() {
  for (let i = 0; i < newSegments; i += 1) {
    // take last segment of snake (a copy of it) and add it to the end of the snake
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  newSegments = 0;
}

export function update(gameOver) {
  if (gameOver) {
    getInputDirection(gameOver);
    snakeBody[0].x = 15;
    snakeBody[0].y = 15;
    newSegments = 0;
    // removeSegments
    snakeBody.splice(1);
    lastMealsList = ['👀'];
    return;
  }
  addSegments();
  const inputDirection = getInputDirection();
  // start from 2nd last segment of snake, and loop back to front
  for (let i = snakeBody.length - 2; i >= 0; i -= 1) {
    // i + 1 = last element
    // shift snake pos up one
    snakeBody[i + 1] = { ...snakeBody[i] };
  }
  // update the head
  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;
}

export function draw(gameBoard) {
  const { x } = getInputDirection();
  const { y } = getInputDirection();
  for (let i = 0; i < snakeBody.length; i += 1) {
    const snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = snakeBody[i].y;
    snakeElement.style.gridColumnStart = snakeBody[i].x;
    snakeElement.classList.add('snake');
    snakeElement.textContent = lastMealsList[i];
    // rotate head
    if (i === 0) {
      snakeElement.style.zIndex = '1';
      if (x === 1) {
        snakeElement.style.transform = 'rotate(-90deg)';
      }
      if (x === -1) {
        snakeElement.style.transform = 'rotate(90deg)';
      }
      if (y === 1) {
        snakeElement.style.transform = 'rotate(0deg)';
      }
      if (y === -1) {
        snakeElement.style.transform = 'rotate(180deg)';
      }
    }
    gameBoard.appendChild(snakeElement);
  }
}

export function expandSnake(amount) {
  lastMealsList.push(lastMealEmoji());
  newSegments += amount;
}

// returns true if 2 positions are the same
function equalPositions(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

// check if any 2 positions are the same (snake and food)
export function onSnake(position, { ignoreHead = false } = {}) {
  return snakeBody.some((segment, index) => {
    // skip snake head (index = 0) when checking all segments for intersection
    if (ignoreHead && index === 0) return false;
    return equalPositions(segment, position);
  });
}

export function getSnakeHead() {
  return snakeBody[0];
}

export function snakeIntersection() {
  return onSnake(snakeBody[0], { ignoreHead: true });
}
