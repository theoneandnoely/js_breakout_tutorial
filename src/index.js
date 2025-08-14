const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d"); //TODO: What is a 2D rendering context?

// Circle Variables
const colours = ["red", "green", "blue", "pink", "orange", "purple"]
let colourId = 0;
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 100;
let dx = 2;
let dy = 2;

// Paddle Variables
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Brick variables
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { 
            x: brickOffsetLeft + (c * (brickWidth + brickPadding)), 
            y: brickOffsetTop + (r * (brickHeight + brickPadding)),
            status: 1,
        };
    }
}

// ID to allow the interval to be cleared
let intervalId;

// Score
let score = 0;

// Paddle control variables
let rightPressed = false;
let leftPressed = false;

function collisionDetection(){
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight && b.status === 1){
                b.status = 0;
                dy = -dy;
                score++;
                if (score === (brickColumnCount * brickRowCount)){
                    stopGame("Win");
                }
                if (colourId === colours.length) {
                    colourId = 0;
                } else {
                    colourId++;
                }
            }
        }
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawBricks(){
    for (let c = 0; c < brickColumnCount; c++){
        for (let r = 0; r < brickRowCount; r++){
            if (bricks[c][r].status === 1) {
                ctx.beginPath();
                ctx.rect(
                    bricks[c][r].x, 
                    bricks[c][r].y, 
                    brickWidth, 
                    brickHeight
                );
                ctx.fillStyle = `${colours[colourId]}`;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = `${colours[colourId]}`;
    ctx.fill();
    ctx.closePath;
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = `${colours[colourId]}`;
    ctx.fill();
    ctx.closePath();
}

function draw(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawBall();
    paddleX = Math.max(
        Math.min(
            paddleX + (7 * rightPressed) - (7 * leftPressed),
            canvas.width - paddleWidth),
        0
    );
    drawPaddle();
    drawBricks();
    drawScore();
    collisionDetection();
    if (x + dx > canvas.width - ballRadius|| x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if ( y + dy > canvas.height - paddleHeight) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            stopGame("Loss");
        }
    }
    x += dx;
    y += dy;
}

function startGame(){
    intervalId = setInterval(draw, 10);
    startButton.disabled = true;
    stopButton.disabled = false;
}

function stopGame(state){
    clearInterval(intervalId);
    if (state === "Loss"){
        startButton.disabled = true;
        stopButton.disabled = true;
        ctx.beginPath();
        ctx.rect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255 255 255 /0.5)"
        ctx.fill();
        ctx.closePath();
        ctx.font = "50px Arial";
        ctx.fillStyle = "#1F1F1F";
        ctx.fillText("GAME OVER", 100, 100);
        ctx.font = "45px Arial";
        ctx.fillStyle = "#DD2020";
        ctx.fillText(`Score: ${score}`, 150, 250);
    } else if (state === "Win") {
        startButton.disabled = true;
        stopButton.disabled = true;
        ctx.beginPath();
        ctx.rect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = "#0d700d"
        ctx.fill();
        ctx.closePath();
        ctx.font = "80px Arial";
        ctx.fillStyle = "#9a9e14";
        ctx.fillText("YOU WON!", 40, 190);
    }
}

function reset(){
    clearInterval(intervalId);
    x = canvas.width / 2;
    y = canvas.height - 100;
    const xs = [-2,2];
    dx = xs[Math.round(Math.random())];
    dy = 2;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    colourId = 0;
    paddleX = (canvas.width - paddleWidth) / 2;
    drawBall();
    drawPaddle();
    for (let c = 0; c < brickColumnCount; c++){
        for (let r = 0; r < brickRowCount; r++){
            bricks[c][r].status = 1;
        }
    }
    drawBricks();
    score = 0;
    drawScore();
}

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");

startButton.addEventListener("click", () => {
    startGame();
})

stopButton.addEventListener("click", () => {
    stopGame();
    stopButton.disabled = true;
    startButton.disabled = false;
})

resetButton.addEventListener("click", () => {
    reset();
    startButton.disabled = false;
})

reset();
stopButton.disabled = true;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") {
        leftPressed = false;
    }
}