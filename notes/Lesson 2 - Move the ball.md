# Drawing Loop
Using [[JavaScript#`setInterval()`|setInterval()]] now but will use [[JavaScript#`requestAnimationFrame()`|requestAnimationFrame()]] in later lessons.

Before the loop we need to initialise the `x`, `y`, `dx`, and `dy` variables. We use [[JavaScript#`let`|let]] to declare the `x` and `y` as we intend for these to update at every frame. In the below example, I have used [[JavaScript#`const`|const]] to declare `dx` and `dy` as these will stay the same each frame but using `let` for this would also make sense as we are likely to update these to achieve more complex / dynamic movement animations.

Once the variables are initialised, the loop goes through 3 steps each frame:
1. Clear the canvas. This removes the drawing of the ball from the previous frame in order to give the illusion of movement.
2. Draw the circle at point (`x`,`y`).
3. Update the (`x`,`y`) coordinates by (`dx`,`dy`).

```JavaScript
// Initialize variables
let x = canvas.width / 2;
let y = canvas.height - 30;
const dx = 2;
const dy = -2;

function draw(){
	// Step 1: Clear the canvas
	ctx.clearRect(0,0,canvas.width, canvas.height);

	// Step 2: Draw circle at point (x,y)
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, Math.PI * 2);
	ctx.closePath();

	// Step 3: Update x and y coordinates
	x += dx;
	y += dy;
}

// Set the interval to run the draw() function @ 60Hz
setInterval(draw, 1000/60);
```
