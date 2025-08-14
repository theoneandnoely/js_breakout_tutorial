const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d"); //TODO: What is a 2D rendering context?

// Circle Variables
const colours = ["red", "green", "blue", "yellow", "pink", "orange", "purple"]
let colourId = 0;
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 100;
let dx = 2;
let dy = -2;

// Paddle Variables
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// ID to allow the interval to be cleared
let intervalId;

// Paddle control variables
let rightPressed = false;
let leftPressed = false;

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
    if (x + dx > canvas.width - ballRadius|| x + dx < ballRadius) {
        dx = -dx;
        if (colourId === colours.length) {
            colourId = 0;
        } else {
            colourId++;
        }
    }

    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
        if (colourId === colours.length) {
            colourId = 0;
        } else {
            colourId++;
        }
    }
    x += dx;
    y += dy;
    paddleX = 
        Math.max(
            Math.min(
                paddleX + (7 * rightPressed) - (7 * leftPressed),
                canvas.width - paddleWidth)
            , 0
        );
    drawPaddle();
}

function startGame(){
    intervalId = setInterval(draw, 10);
    console.log(intervalId)
}

function stopGame(){
    clearInterval(intervalId);
}

function reset(){
    stopGame();
    x = canvas.width / 2;
    y = canvas.height - 100;
    dx = 2;
    dy = -2;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    colourId = 0;
    paddleX = (canvas.width - paddleWidth) / 2;
    drawBall();
    drawPaddle();
}

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");

startButton.addEventListener("click", () => {
    startGame();
    startButton.disabled = true;
    stopButton.disabled = false;
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