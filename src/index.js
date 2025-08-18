 import Ball from './modules/ball.js';
 import Paddle from './modules/paddle.js';
 import { Bricks } from './modules/brick.js';
 import Score from './modules/score.js';
 import Lives from './modules/lives.js';

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const cfg = {
    "ballRadius": 10,
    "ballSpeed": 0.2,
    "paddleSensitivity":7,
    "paddleWidth": 75,
    "paddleHeight": 10,
    "brickRowCount": 3,
    "brickColumnCount": 5,
    "brickHeight": 10,
    "brickWidth": 75,
    "brickPadding": 10,
    "brickOffsetLeft": 30,
    "brickOffsetTop": 30
}

const ball = new Ball(
    canvas.width / 2,
    canvas.height - 100,
    cfg.ballRadius,
    0.2,
    [1,1]
);

const paddle = new Paddle(
    cfg.paddleWidth,
    cfg.paddleHeight,
    (canvas.width - cfg.paddleWidth) / 2
);

const b = new Bricks(
    cfg.brickRowCount, 
    cfg.brickColumnCount,
    cfg.brickWidth,
    cfg.brickHeight,
    cfg.brickPadding,
    [cfg.brickOffsetLeft, cfg.brickOffsetTop]
);

const score = new Score();
const lives = new Lives(3);

// ID to allow the requestAnimationFrame to be canceled
let requestId;
let start;

// Paddle control variables
let rightPressed = false;
let leftPressed = false;
let paused = false;
let coll = 0;

function draw(timestamp){
    if (start === undefined){
        start = timestamp;
    }
    const elapsed = timestamp - start;
    start = timestamp;
    if (ball.released) {
        ball.updatePosition(elapsed);
    }
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ball.draw(ctx);
    paddle.x = Math.max(
        Math.min(
            paddle.x + (cfg.paddleSensitivity * rightPressed) - (cfg.paddleSensitivity * leftPressed),
            canvas.width - paddle.width),
        0
    );
    paddle.draw(ctx, canvas.height);
    b.draw(ctx);
    score.draw(ctx);
    lives.draw(ctx, canvas.width);
    coll = ball.detectCollision(canvas.width, canvas.height, paddle, b);
    if (coll >= 0) {
        score.value += coll;
        requestId = requestAnimationFrame(draw);
        if (
            !(b.remaining) 
            && ball.y > (cfg.brickOffsetTop + (cfg.brickRowCount * (cfg.brickHeight + cfg.brickPadding)))
        ){
            b.newScreen();
            ball.speed = ball.speed * 1.25;
        }
    } else {
        lives.num -= 1;
        console.log(lives);
        if (lives.num === 0) {
            stopGame("Loss");
        } else {
            requestId = requestAnimationFrame(draw);
            spawn();
        }
    }
}

function startGame(){
    requestAnimationFrame(draw);
    startButton.disabled = true;
    stopButton.disabled = false;
}

function stopGame(state){
    cancelAnimationFrame(requestId);
    if (state === "Loss"){
        startButton.disabled = true;
        stopButton.disabled = true;
        ctx.clearRect(0,0,canvas.width, canvas.height);
        paddle.draw(ctx, canvas.height);
        b.draw(ctx);
        score.draw(ctx);
        lives.draw(ctx, canvas.width);
        // Semi-opaque Background
        ctx.beginPath();
        ctx.rect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255 255 255 /0.5)"
        ctx.fill();
        ctx.closePath();
        // Text
        ctx.font = "50px Arial";
        ctx.fillStyle = "#1F1F1F";
        ctx.fillText("GAME OVER", 100, 150);
        ctx.font = "45px Arial";
        ctx.fillStyle = "#DD2020";
        ctx.fillText(`Score: ${score.value}`, 160, 200);
    }
}

function spawn(){
    ball.reset();
    const xs = [-0.5,0.5];
    ball.angle = [xs[Math.round(Math.random())],1];
}

function reset(){
    cancelAnimationFrame(requestId);
    spawn();
    
    score.value = 0;
    lives.num = 3;
    ball.speed = cfg.ballSpeed;

    ctx.clearRect(0,0,canvas.width, canvas.height);
    paddle.x = (canvas.width - paddle.width) / 2;
    ball.draw(ctx);
    paddle.draw(ctx, canvas.height);
    b.newScreen();
    b.draw(ctx);
    score.draw(ctx);
    lives.draw(ctx, canvas.width);
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
document.addEventListener("mousemove", mouseMoveHandler, false);

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
    } else if (e.key === "Escape") {
        if (paused){
            start = undefined;
            startGame();
            paused = false;
        } else {
            stopGame();
            paused = true;
        }
    } else if (e.key === " "){
        ball.release();
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width && e.clientY < canvas.height){
        paddle.x = relativeX - paddle.width/2;
    }
}