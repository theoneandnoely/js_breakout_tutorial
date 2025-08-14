const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d"); //TODO: What is a 2D rendering context?

const ballRadius = 10;

// Set x, y variables
let x = canvas.width / 2;
let y = canvas.height - 100;
// Set dx, dy as constants. Likely need to update to lets later
let dx = 2;
let dy = -2;

let intervalId;
let colourId = 0;
const colours = ["red", "green", "blue", "yellow", "pink", "orange", "purple"]

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
    drawBall();
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