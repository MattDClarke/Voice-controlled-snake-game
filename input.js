let inputDirection = { x: 0, y: 0 };
let lastInputDirection = { x: 0, y: 0 };

export function handleSpeechRecognitionResult({ results }) {
  const words = results[results.length - 1][0].transcript
    .toLowerCase()
    .replace(/\s/g, '');
  console.log(words);

  // change direction depending on voice command
  switch (words) {
    case 'up':
      // checks to prevent snake moving in opposite direction to its prev movement
      if (lastInputDirection.y !== 0) break;
      inputDirection = { x: 0, y: -1 };
      break;
    case 'down':
      if (lastInputDirection.y !== 0) break;
      inputDirection = { x: 0, y: 1 };
      break;
    case 'left':
      if (lastInputDirection.x !== 0) break;
      inputDirection = { x: -1, y: 0 };
      break;
    case 'right':
      if (lastInputDirection.x !== 0) break;
      inputDirection = { x: 1, y: 0 };
      break;
    default:
      break;
  }
}

export function getInputDirection(gameOver) {
  if (gameOver) {
    inputDirection = { x: 0, y: 0 };
  }
  lastInputDirection = inputDirection;
  return inputDirection;
}
