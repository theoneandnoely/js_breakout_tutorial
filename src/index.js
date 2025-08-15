 import Ball from './ball.js';
 import Paddle from './paddle.js';
 import { Bricks } from './brick.js';

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

// Colours
const colours = [
    "red", 
    "green", 
    "blue", 
    "pink", 
    "orange", 
    "purple"
];
let colourId = 0;


// ID to allow the requestAnimationFrame to be canceled
let requestId;
let start;

// Score
let score = 0;
let lives = 3;

// Paddle control variables
let rightPressed = false;
let leftPressed = false;

function collisionDetection(){
    let coll = false;
    b.bricks.forEach(brick => {
        console.log(brick);
        coll = brick.detectCollision(ball.x, ball.y, ball.radius);
        if (coll){
            ball.angle[1] = -1 * ball.angle[1];
            score++;
            if (score === (b.numBricks)){
                stopGame("Win");
            }
            if (colourId === colours.length) {
                colourId = 0;
            } else {
                colourId++;
            }
        }
    });
}

function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: ", canvas.width - 150, 20);
    let l_anchor;
    for (let l = 0; l < lives; l++){
        l_anchor = (canvas.width - 90) + l * 25;
        ctx.beginPath();
        ctx.moveTo(l_anchor, 20);
        ctx.bezierCurveTo(l_anchor - 5, 17, l_anchor - 5, 16, l_anchor - 5, 15);
        ctx.bezierCurveTo(l_anchor - 5, 10, l_anchor  , 10, l_anchor, 15);
        ctx.bezierCurveTo(l_anchor, 10, l_anchor + 5  , 10, l_anchor + 5, 15);
        ctx.bezierCurveTo(l_anchor + 5, 16, l_anchor + 5, 17, l_anchor, 20);
        ctx.stroke();
        ctx.fillStyle = "#ff2020";
        ctx.fill();
        ctx.closePath();
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawBricks(){
    b.bricks.forEach(brick => {
        if (brick.status === 1) {
                ctx.beginPath();
                ctx.rect(
                    brick.x, 
                    brick.y, 
                    brick.width, 
                    brick.height
                );
                ctx.fillStyle = `${colours[colourId]}`;
                ctx.fill();
                ctx.closePath();
            }
    });
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = `${colours[colourId]}`;
    ctx.fill();
    ctx.closePath;
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = `${colours[colourId]}`;
    ctx.fill();
    ctx.closePath();
}

function draw(timestamp){
    if (start === undefined){
        start = timestamp;
    }
    const elapsed = timestamp - start;
    start = timestamp;
    ball.updatePosition(elapsed);
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawBall();
    paddle.x = Math.max(
        Math.min(
            paddle.x + (cfg.paddleSensitivity * rightPressed) - (cfg.paddleSensitivity * leftPressed),
            canvas.width - paddle.width),
        0
    );
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    requestId = requestAnimationFrame(draw);
    collisionDetection();
    if (ball.x > canvas.width - ball.radius|| ball.x < ball.radius) {
        ball.angle[0] = -1 * ball.angle[0];
    }

    if (ball.y < ball.radius) {
        ball.angle[1] = ball.angle[1] * -1
    } else if ( ball.y > canvas.height - paddle.height) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.angle[1] = ball.angle[1] * -1;
        } else {
            lives -= 1;
            if (lives === 0) {
                stopGame("Loss");
            } else {
                spawn();
            }
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
        drawPaddle();
        drawBricks();
        drawScore();
        drawLives();
        // drawScore();
        ctx.beginPath();
        ctx.rect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255 255 255 /0.5)"
        ctx.fill();
        ctx.closePath();
        ctx.font = "50px Arial";
        ctx.fillStyle = "#1F1F1F";
        ctx.fillText("GAME OVER", 100, 150);
        ctx.font = "45px Arial";
        ctx.fillStyle = "#DD2020";
        ctx.fillText(`Score: ${score}`, 160, 200);
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
        ctx.fillText("YOU WON!", 35, 190);
    }
}

function spawn(){
    ball.reset()
    const xs = [-1,1];
    ball.angle = [xs[Math.round(Math.random())],1];
}

function reset(){
    cancelAnimationFrame(requestId);
    spawn();
    
    score = 0;
    lives = 3;

    ctx.clearRect(0,0,canvas.width, canvas.height);
    colourId = 0;
    paddle.x = (canvas.width - paddle.width) / 2;
    drawBall();
    drawPaddle();
    b.bricks.forEach(brick => {
        brick.status = 1;
    })
    drawBricks();
    drawScore();
    drawLives();
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
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width){
        paddle.x = relativeX - paddle.width/2;
    }
}