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
    "brickOffsetTop": 30,
    "numLives": 3,
    "brickDistribution":{
        "Normal": 0.85,
        "Ghost": 0.05,
        "Stone":0.05,
        "Gold": 0.05
    }
};

const gameState = {
    "state": "Preplay",
    "paused": false,
    "rightPressed": false,
    "leftPressed": false,
    "requestId": undefined,
    "start": undefined,
    "coll": 0,
    "hs": false,
    "frame":0,
};

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
    (canvas.width - cfg.paddleWidth) / 2,
    cfg.paddleSensitivity,
    canvas.width - cfg.paddleWidth
);

const b = new Bricks(
    cfg.brickRowCount, 
    cfg.brickColumnCount,
    cfg.brickWidth,
    cfg.brickHeight,
    cfg.brickPadding,
    [cfg.brickOffsetLeft, cfg.brickOffsetTop],
    cfg.brickDistribution
);

const score = new Score();
const lives = new Lives(cfg.numLives);

function draw(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ball.draw(ctx);
    paddle.draw(ctx, canvas.height);
    b.draw(ctx);
    score.draw(ctx);
    lives.draw(ctx, canvas.width);
}

function step(timestamp){
    if (gameState.start === undefined){
        gameState.start = timestamp;
    }
    const elapsed = timestamp - gameState.start;
    gameState.start = timestamp;
    if (ball.released) {
        ball.updatePosition(elapsed);
    }
    paddle.updatePosition(gameState.rightPressed, gameState.leftPressed);
    b.ressurectGhosts(timestamp);
    draw();
    gameState.coll = ball.detectCollision(canvas.width, canvas.height, paddle, b, timestamp);
    if (gameState.coll >= 0) {
        score.value += gameState.coll;
        gameState.requestId = requestAnimationFrame(step);
        if (
            !(b.remaining) 
            && ball.y > (cfg.brickOffsetTop + (cfg.brickRowCount * (cfg.brickHeight + cfg.brickPadding)))
        ){
            b.newScreen();
            ball.speed = ball.speed * 1.25;
        }
    } else {
        lives.num -= 1;
        if (lives.num === 0) {
            stopGame("Loss");
        } else {
            gameState.requestId = requestAnimationFrame(step);
            spawn();
        }
    }
}

function startGame(){
    gameState.requestId = requestAnimationFrame(step);
    startButton.disabled = true;
    stopButton.disabled = false;
}

function stopGame(state){
    cancelAnimationFrame(gameState.requestId);
    if (state === "Loss"){
        startButton.disabled = true;
        stopButton.disabled = true;
        gameState.hs = score.checkIfHighScore();
        draw();
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
        ctx.fillText(`Score: ${score.value}`, 155, 200);
        // High Score
        ctx.font = "25px Arial";
        if (gameState.hs) {
            ctx.fillStyle = "#f3df0b";
            ctx.fillText(`NEW HIGH SCORE!`, 145, 230);
        } else {
            ctx.fillStyle = "#555555";
            ctx.fillText(`High Score: ${score.high_score}`, 157, 230);
        }
        
    }
}

function spawn(){
    ball.reset();
    const xs = [-0.5,0.5];
    ball.angle = [xs[Math.round(Math.random())],1];
    paddle.x = (canvas.width - paddle.width) / 2;
    
    draw();
}

function reset(){
    cancelAnimationFrame(gameState.requestId);
    
    score.value = 0;
    lives.num = cfg.numLives;
    ball.speed = cfg.ballSpeed;
    b.newScreen();

    spawn();
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
        gameState.rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") {
        gameState.leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d") {
        gameState.rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") {
        gameState.leftPressed = false;
    } else if (e.key === "Escape") {
        if (gameState.paused){
            gameState.start = undefined;
            startGame();
            gameState.paused = false;
        } else {
            stopGame();
            gameState.paused = true;
        }
    } else if (e.key === " "){
        ball.release();
    } else if (e.key === "f"){
        gameState.frame++;
        gameState.requestId = requestAnimationFrame(step);
        console.log(`${gameState.frame}: ${ball.x}, ${ball.y}, ${ball.angle}`);
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width && e.clientY < canvas.height){
        paddle.x = relativeX - paddle.width/2;
    }
}