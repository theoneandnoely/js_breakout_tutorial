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

// ID to allow the requestAnimationFrame to be canceled
let requestId;

// Score
let score = 0;
let lives = 3;

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
    drawLives();
    requestId = requestAnimationFrame(draw);
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
            lives -= 1;
            if (lives === 0) {
                stopGame("Loss");
            } else {
                spawn();
            }
        }
    }
    x += dx;
    y += dy;
}

function startGame(){
    draw();
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
    x = canvas.width / 2;
    y = canvas.height - 100;
    const xs = [-2,2];
    dx = xs[Math.round(Math.random())];
    dy = 2;
}

function reset(){
    cancelAnimationFrame(requestId);
    spawn();
    
    score = 0;
    lives = 3;

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
        paddleX = relativeX - paddleWidth/2;
    }
}