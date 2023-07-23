var ball_x, ball_y, ball_dx, ball_dy;
var paddle_x, paddle_y, paddle_width, paddle_height, paddle_dx;
var brickRows = 4, brickColumns = 4, brickWidth = 75, brickHeight = 20, brickPadding = 20, brickOffsetLeft = 15, brickOffsetTop = 10;
var score = 0;
var bricks = [];
var lost = false;
var gamePaused = false; // Variable to indicate if the game is paused

function createBricks() {
  for (var c = 0; c < brickColumns; c++) {
    for (var r = 0; r < brickRows; r++) {
      if (bricks[c][r].hidden === 0) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        fill("blue"); // Set brick color to blue
        rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
      }
    }
  }
}

function setup() {
  createCanvas(400, 400);

  ball_x = width / 2;
  ball_y = height / 2;
  ball_r = 10;
  ball_dx = 2;
  ball_dy = 2;

  paddle_width = 90;
  paddle_height = 15;
  paddle_y = height - 30;
  paddle_x = width / 2 - paddle_width / 2;
  paddle_dx = 4;

  for (var c = 0; c < brickColumns; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRows; r++) {
      bricks[c][r] = { x: 0, y: 0, hidden: 0 };
    }
  }
}

function isHorizontalBounce() {
  return ball_x >= width - ball_r / 2 || ball_x <= ball_r / 2;
}

function isVerticalBounce() {
  return ball_y < ball_r / 2 || (ball_x <= paddle_x + paddle_width && ball_x >= paddle_x && ball_y >= paddle_y);
}

function isGameOver() {
  return ball_y >= height - ball_r / 2;
}

function isBrickHit() {
  for (var c = 0; c < brickColumns; c++) {
    for (var r = 0; r < brickRows; r++) {
      if (bricks[c][r].hidden === 1) {
        continue;
      }
      if (bricks[c][r].y <= ball_y + ball_r / 2 && bricks[c][r].y + brickHeight >= ball_y + ball_r / 2 && bricks[c][r].x <= ball_x + ball_r / 2 && bricks[c][r].x + brickWidth >= ball_x + ball_r / 2) {
        ball_dy = -ball_dy;
        bricks[c][r].hidden = 1;
        score++; // Increase the score when a brick is hit
        return true;
      }
    }
  }
  return false;
}

function draw() {
  clear();
  fill("black");

  createBricks();
  fill("pink"); // Set ball color to pink
  circle(ball_x, ball_y, ball_r);

  rect(paddle_x, paddle_y, paddle_width, paddle_height);

  if (!gamePaused) { // Check if the game is not paused
    if (keyIsDown(LEFT_ARROW)) {
      paddle_x = max(paddle_x - paddle_dx, 0);
    }

    if (keyIsDown(RIGHT_ARROW)) {
      paddle_x = min(paddle_x + paddle_dx, width - paddle_width);
    }

    if (isGameOver()) {
      ball_dy = 0;
      ball_dx = 0;
      lost = true;
      gamePaused = true; // Pause the game when the ball falls down
    }

    if (isBrickHit()) {
      if (score === brickRows * brickColumns) {
        ball_dx = 0;
        ball_dy = 0;
        gamePaused = true; // Pause the game when all bricks are hidden
      }
    } else {
      if (isHorizontalBounce()) {
        ball_dx = -ball_dx;
      }

      if (isVerticalBounce()) {
        ball_dy = -ball_dy;
      }
    }

    ball_x = ball_x + ball_dx;
    ball_y = ball_y + ball_dy;
  }


  fill(0);
  textSize(24);
  text("Score: " + score, 10, height - 10);
  if (score === brickRows * brickColumns) {
    textSize(48);
    text("You Win!", width / 2 - 90, height / 2);
  }
  if (lost) {
    textSize(48);
    text("You Lose!", width / 2 - 100, height / 2);
  }
}
