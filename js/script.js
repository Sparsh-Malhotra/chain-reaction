//Game Constants Declaration
const width = 420;
const height = 630;
const gapWidth = width / 6;
const gapHeight = height / 9;
const gameSpeed = 300;

//Game Variables Declaration
let turnCount = 0;
let gameTimer;
let countMatrix = new Array(9);
let colorMatrix = new Array(9);
let undoCount = new Array(9);
let undoColor = new Array(9);
let isGameOver = false;
let counterAnimate = 0;
let flag = false;

//DOM Elements Selection
const canvas = document.getElementById("arena");
const undoBtn = document.getElementById("undo-btn");
const turnIndicator = document.getElementById("player-detail");

let gameArena = canvas.getContext("2d");

//Event Listeners
canvas.addEventListener("click", gameLoop);
undoBtn.addEventListener("click", undoMove);

initialiseMatrix();
initialiseGameState();

function initialiseMatrix() {
  for (let counter = 0; counter < 9; counter++) {
    countMatrix[counter] = new Array(6);
    colorMatrix[counter] = new Array(6);
    undoCount[counter] = new Array(6);
    undoColor[counter] = new Array(6);
  }
}

function initialiseGameState() {
  undoBtn.style.visibility = "visible";
  turnIndicator.style.visibility = "visible";
  isGameOver = false;
  matrixDefault();
  drawArena();
  turnCount = 0;
  counterAnimate = 0;
  gameTimer = setInterval(updateMatrix, gameSpeed);
}

function matrixDefault() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 6; j++) {
      colorMatrix[i][j] = ""; //No color
      countMatrix[i][j] = 0; //No value
      undoCount[i][j] = 0; //No value
      undoColor[i][j] = ""; //No color
    }
  }
}

function drawArena() {
  gameArena.clearRect(0, 0, width, height);

  if (turnCount % 2 == 0) {
    gameArena.strokeStyle = "red";
    turnIndicator.style.color = "red";
    turnIndicator.innerHTML = "Player 1 turn";
  } else {
    gameArena.strokeStyle = "green";
    turnIndicator.style.color = "green";
    turnIndicator.innerHTML = "Player 2 turn";
  }
  for (let counter = 1; counter < 6; counter++) {
    gameArena.beginPath();
    gameArena.moveTo(counter * gapWidth, 0);
    gameArena.lineTo(counter * gapWidth, height);
    gameArena.closePath();
    gameArena.stroke();
  }

  for (let counter = 1; counter < 9; counter++) {
    gameArena.beginPath();
    gameArena.moveTo(0, counter * gapHeight);
    gameArena.lineTo(width, counter * gapHeight);
    gameArena.closePath();
    gameArena.stroke();
  }

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 6; j++) {
      if (countMatrix[i][j] == 0) continue;
      if (countMatrix[i][j] == 1) oneCircle(i, j, colorMatrix[i][j]);
      else if (countMatrix[i][j] == 2) twoCircle(i, j, colorMatrix[i][j]);
      else threeCircle(i, j, colorMatrix[i][j]);
    }
  }
}

function undoMove() {
  if (turnCount > 0 && flag == false) {
    flag = true;
    turnCount--;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 6; j++) {
        countMatrix[i][j] = undoCount[i][j];
        colorMatrix[i][j] = undoColor[i][j];
      }
    }
  } else {
    $('.undo-message').stop().fadeIn(400).delay(2000).fadeOut(400); //fade out after 2 seconds
  }
}

function updateUndoMatrices() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 6; j++) {
      undoCount[i][j] = countMatrix[i][j];
      undoColor[i][j] = colorMatrix[i][j];
    }
  }
}

function gameLoop(event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  let row = Math.floor(x / gapWidth);
  let column = Math.floor(y / gapHeight);

  if (!isGameOver) {
    updateUndoMatrices();
    if (
      turnCount % 2 == 0 &&
      (colorMatrix[column][row] == "" || colorMatrix[column][row] == "red")
    ) {
      countMatrix[column][row]++;
      colorMatrix[column][row] = "red";
      turnCount++;
      flag = false;
    }
    if (
      turnCount % 2 == 1 &&
      (colorMatrix[column][row] == "" || colorMatrix[column][row] == "green")
    ) {
      countMatrix[column][row]++;
      colorMatrix[column][row] = "green";
      turnCount++;
      flag = false;
    }
  }
}

function populateCornerCells(i, j) {
  countMatrix[i][j] -= 2;
  countMatrix[i == 8 ? i - 1 : i + 1][j]++;
  countMatrix[i][j == 5 ? j - 1 : j + 1]++;
  colorMatrix[i == 8 ? i - 1 : i + 1][j] = colorMatrix[i][j];
  colorMatrix[i][j == 5 ? j - 1 : j + 1] = colorMatrix[i][j];
  if (countMatrix[i][j] == 0) colorMatrix[i][j] = "";
}

function populateSideHCells(i, j) {
  // H = Height
  countMatrix[i][j] -= 3;
  countMatrix[i - 1][j]++;
  countMatrix[i + 1][j]++;
  countMatrix[i][j == 0 ? j + 1 : j - 1]++;
  colorMatrix[i][j == 0 ? j + 1 : j - 1] = colorMatrix[i][j];
  colorMatrix[i - 1][j] = colorMatrix[i][j];
  colorMatrix[i + 1][j] = colorMatrix[i][j];
  if (countMatrix[i][j] == 0) colorMatrix[i][j] = "";
}

function populateSideWCells(i, j) {
  // W = Width
  countMatrix[i][j] -= 3;
  countMatrix[i == 0 ? i + 1 : i - 1][j]++;
  countMatrix[i][j - 1]++;
  countMatrix[i][j + 1]++;
  colorMatrix[i == 0 ? i + 1 : i - 1][j] = colorMatrix[i][j];
  colorMatrix[i][j - 1] = colorMatrix[i][j];
  colorMatrix[i][j + 1] = colorMatrix[i][j];
  if (countMatrix[i][j] == 0) colorMatrix[i][j] = "";
}

function updateMatrix() {
  counterAnimate++;
  drawArena();
  let cornerCord = [
    [0, 0],
    [8, 0],
    [8, 5],
    [0, 5],
  ];

  while (notStable()) {
    for (let i = 0; i < 4; i++)
      if (countMatrix[cornerCord[i][0]][cornerCord[i][1]] >= 2) {
        populateCornerCells(cornerCord[i][0], cornerCord[i][1]);
        break;
      }

    for (let i = 1; i < 8; i++) {
      if (countMatrix[i][0] >= 3) {
        populateSideHCells(i, 0);
        break;
      }
      if (countMatrix[i][5] >= 3) {
        populateSideHCells(i, 5);
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      if (countMatrix[0][i] >= 3) {
        populateSideWCells(0, i);
        break;
      }
      if (countMatrix[8][i] >= 3) {
        populateSideWCells(8, i);
        break;
      }
    }

    for (let i = 1; i < 8; i++) {
      for (let j = 1; j < 5; j++) {
        if (countMatrix[i][j] >= 4) {
          countMatrix[i][j] -= 4;
          countMatrix[i - 1][j]++;
          countMatrix[i + 1][j]++;
          countMatrix[i][j - 1]++;
          countMatrix[i][j + 1]++;
          colorMatrix[i - 1][j] = colorMatrix[i][j];
          colorMatrix[i + 1][j] = colorMatrix[i][j];
          colorMatrix[i][j - 1] = colorMatrix[i][j];
          colorMatrix[i][j + 1] = colorMatrix[i][j];
          if (countMatrix[i][j] == 0) colorMatrix[i][j] = "";
          break;
        }
      }
    }
    break;
  }
  checkGameOver();
}

function checkGameOver() {
  if (gameOver() == 1 || gameOver() == 2) {
    isGameOver = true;
    drawArena();
    undoBtn.style.visibility = "hidden";
    turnIndicator.style.visibility = "hidden";
    setTimeout(gameOverScreen.bind(null, gameOver()), 1000);
    clearInterval(gameTimer);
    setTimeout(initialiseGameState, 3000);
  }
}

function notStable() {
  let ans = false;
  if (
    countMatrix[0][0] >= 2 ||
    countMatrix[8][0] >= 2 ||
    countMatrix[8][5] >= 2 ||
    countMatrix[0][5] >= 2
  )
    ans = true;

  for (let i = 1; i < 8; i++)
    if (countMatrix[i][0] >= 3 || countMatrix[i][5] >= 3) ans = true;

  for (let i = 1; i < 5; i++)
    if (countMatrix[0][i] >= 3 || countMatrix[8][i] >= 3) ans = true;

  for (let i = 1; i < 8; i++)
    for (let j = 1; j < 8; j++) if (countMatrix[i][j] >= 4) ans = true;

  return ans;
}

function gameOver() {
  let countRed = 0;
  let countGreen = 0;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 6; j++) {
      if (colorMatrix[i][j] == "red") countRed++;
      if (colorMatrix[i][j] == "green") countGreen++;
    }
  }
  if (turnCount > 1) {
    if (countRed == 0) {
      return 2;
    }
    if (countGreen == 0) {
      return 1;
    }
  }
}

function gameOverScreen(player) {
  if (player == 2) {
    gameArena.clearRect(0, 0, width, height);
    gameArena.fillStyle = "black";
    gameArena.fillRect(0, 0, width, height);
    gameArena.fillStyle = "white";
    gameArena.font = "40px Times New Roman";
    gameArena.fillText("Player 2 wins!", width / 2 - 150, height / 2 - 50);
  } else {
    gameArena.clearRect(0, 0, width, height);
    gameArena.fillStyle = "black";
    gameArena.fillRect(0, 0, width, height);
    gameArena.fillStyle = "white";
    gameArena.font = "40px Times New Roman";
    gameArena.fillText("Player 1 wins!", width / 2 - 150, height / 2 - 50);
  }
}

function oneCircle(row, column, color) {
  gameArena.beginPath();
  gameArena.arc(
    column * gapWidth + 35,
    row * gapHeight + 35,
    15,
    0,
    Math.PI * 2
  );
  gameArena.fillStyle = color;
  gameArena.fill();
  if (
    (row == 0 && column == 0) ||
    (row == 8 && column == 0) ||
    (row == 0 && column == 5) ||
    (row == 8 && column == 5)
  ) {
    if (counterAnimate % 2 == 0) gameArena.strokeStyle = "black";
    else gameArena.strokeStyle = color;
  } else {
    gameArena.strokeStyle = "black";
  }
  gameArena.lineWidth = 3;
  gameArena.stroke();
  gameArena.closePath();
  gameArena.lineWidth = 1;
}

function twoCircle(row, column, color) {
  gameArena.beginPath();
  gameArena.arc(
    column * gapWidth + 20,
    row * gapHeight + 35,
    15,
    0,
    Math.PI * 2
  );
  gameArena.fillStyle = color;
  gameArena.fill();
  if (
    (row >= 1 && row < 8 && (column == 0 || column == 5)) ||
    ((row == 0 || row == 8) && column >= 1 && column < 5)
  ) {
    if (counterAnimate % 2 == 0) gameArena.strokeStyle = "black";
    else gameArena.strokeStyle = color;
  } else {
    gameArena.strokeStyle = "black";
  }
  gameArena.lineWidth = 3;
  gameArena.stroke();
  gameArena.closePath();
  gameArena.lineWidth = 1;

  gameArena.beginPath();
  gameArena.arc(
    column * gapWidth + 50,
    row * gapHeight + 35,
    15,
    0,
    Math.PI * 2
  );
  gameArena.fillStyle = color;
  gameArena.fill();
  if (
    (row >= 1 && row < 8 && (column == 0 || column == 5)) ||
    ((row == 0 || row == 8) && column >= 1 && column < 5)
  ) {
    if (counterAnimate % 2 == 0) gameArena.strokeStyle = "black";
    else gameArena.strokeStyle = color;
  } else {
    gameArena.strokeStyle = "black";
  }
  gameArena.lineWidth = 3;
  gameArena.stroke();
  gameArena.closePath();
  gameArena.lineWidth = 1;
}

function threeCircle(row, column, color) {
  gameArena.beginPath();
  gameArena.arc(
    column * gapWidth + 20,
    row * gapHeight + 17,
    15,
    0,
    Math.PI * 2
  );
  gameArena.fillStyle = color;
  gameArena.fill();
  if (counterAnimate % 2 == 0) gameArena.strokeStyle = "black";
  else gameArena.strokeStyle = color;
  gameArena.lineWidth = 3;
  gameArena.stroke();
  gameArena.closePath();
  gameArena.lineWidth = 1;

  gameArena.beginPath();
  gameArena.arc(
    column * gapWidth + 20,
    row * gapHeight + 53,
    15,
    0,
    Math.PI * 2
  );
  gameArena.fillStyle = color;
  gameArena.fill();
  if (counterAnimate % 2 == 0) gameArena.strokeStyle = "black";
  else gameArena.strokeStyle = color;
  gameArena.lineWidth = 3;
  gameArena.stroke();
  gameArena.closePath();
  gameArena.lineWidth = 1;

  gameArena.beginPath();
  gameArena.arc(
    column * gapWidth + 50,
    row * gapHeight + 35,
    15,
    0,
    Math.PI * 2
  );
  gameArena.fillStyle = color;
  gameArena.fill();
  if (counterAnimate % 2 == 0) gameArena.strokeStyle = "black";
  else gameArena.strokeStyle = color;
  gameArena.lineWidth = 3;
  gameArena.stroke();
  gameArena.closePath();
  gameArena.lineWidth = 1;
}
