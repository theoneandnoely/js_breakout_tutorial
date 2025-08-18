export default class Ball {
    constructor(x, y, radius, speed, angle){
        this.x = x;
        this.y = y;
        this.init_x = x;
        this.init_y = y;
        this.radius = radius;
        this.speed = speed; // speed in px/ms
        this.init_speed = speed;
        this.angle = angle; // for calculating the ratio of dx:dy
        this.released = false;
    }

    updatePosition(delta){
        let [dx, dy] = this.calcUpdate(delta);
        this.x += dx;
        this.y += dy;
    }

    calcUpdate(delta){
        return [
            this.speed * delta * this.angle[0], 
            this.speed * delta * this.angle[1]
        ];
    }

    reset(){
        this.x = this.init_x;
        this.y = this.init_y;
        this.released = false;
    }

    release(){
        this.released = true;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

    detectCollision(c_width, c_height, paddle, bricks){
        // Collisiion with wall
        let wall_coll = 0;
        if (this.x + this.radius > c_width){
            wall_coll = c_width - (this.x + this.radius);
            console.log("Right Wall!");
        } else if (this.x - this.radius < 0) {
            wall_coll = (this.x - this.radius) * -1;
            console.log("Left Wall!");
        }

        // Collision with roof
        let roof_coll = 0;
        if (this.y - this.radius < 0){
            roof_coll = (this.y - this.radius) * -1;
            console.log("Roof!");
        }

        // Collision with paddle
        let paddle_x = 0;
        let paddle_y = 0;
        if (
            this.x + this.radius > paddle.x 
            && this.x < paddle.x
            && (this.y + this.radius) > (c_height - paddle.height)
        ){
            paddle_x += paddle.x - (this.x + this.radius);
            console.log("Paddle Left!");
        } else if (
            this.x - this.radius < paddle.x + paddle.width 
            && this.x > paddle.x + paddle.width
            && (this.y + this.radius) > (c_height - paddle.height) 
        ){
            paddle_x += (paddle.x + paddle.width) - (this.x - this.radius);
            console.log("Paddle Right!");

        }

        if (
            this.x + this.radius > paddle.x 
            && this.x - this.radius < paddle.x + paddle.width 
            && this.y + this.radius > c_height - paddle.height
        ){
            paddle_y = (c_height - paddle.height) - (this.y + this.radius);
            console.log("Paddle Top!");
        } else if (
            this.y > c_height
        ){
            return -1;
        }

        // Collision with brick
        let brick_x = 0;
        let brick_y = 0;
        let brick_coll = 0;
        bricks.bricks.forEach(b => {
            if (
                b.status === 1 
                && this.x + this.radius > b.x
                && this.x - this.radius < b.x + b.width
            ){
                if(
                    this.y - this.radius > b.y
                    && this.y - this.radius < b.y + b.height
                ){
                    brick_coll++;
                    b.status = 0;
                    brick_y += (b.y + b.height) - (this.y - this.radius);
                    console.log("Brick Bottom!");
                    if(
                        this.x + this.radius > b.x
                        && this.x < b.x
                    ){
                        brick_x += (this.x + this.radius) - b.x;
                        console.log("Brick Left!");
                    } else if (
                        this.x - this.radius < b.x + b.width
                        && this.x > b.x + b.width
                    ){
                        brick_x += (b.x + b.width) - (this.x - this.radius);
                        console.log("Brick Right!");
                    }
                } else if (
                    this.y + this.radius > b.y
                    && this.y + this.radius < b.y + b.height
                ){
                    brick_coll++;
                    b.status = 0;
                    brick_y += b.y - (this.y + this.radius);
                    console.log("Brick Top!");
                    if(
                        this.x + this.radius > b.x
                        && this.x < b.x
                    ){
                        brick_x += (this.x + this.radius) - b.x;
                        console.log("Brick Left!");
                    } else if (
                        this.x - this.radius < b.x + b.width
                        && this.x > b.x + b.width
                    ){
                        brick_x += (b.x + b.width) - (this.x - this.radius);
                        console.log("Brick Right!");
                    }
                }
            }
        })

        // Net forces from all collisions to determine new angle
        let x_coll = wall_coll + paddle_x + brick_x;
        let y_coll = roof_coll + paddle_y + brick_y;
        if (x_coll != 0){
            x_coll = 2 * (x_coll / Math.abs(x_coll));
        }
        if (y_coll != 0){
            y_coll = 2 * (y_coll / Math.abs(y_coll));
        }
        this.angle[0] += x_coll;
        this.angle[0] = Math.max(Math.min(this.angle[0], 1), -1);
        this.angle[1] += y_coll;
        this.angle[1] = Math.max(Math.min(this.angle[1], 1), -1);
        return brick_coll;
    }
};
