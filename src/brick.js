class Brick {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.status = 1;
    }

    detectCollision(x,y,r){
        if (x+r > this.x && x-r < (this.x + this.width) && y+r > this.y && y-r < (this.y + this.height) && this.status === 1){
            this.status = 0;
            return true;
        } else {
            return false;
        }
    }
}

class Bricks {
    constructor(rows, cols, width, height, padding, offset ){
        this.bricks = [];
        for (let c = 0; c < cols; c++){
            for (let r = 0; r < rows; r++){
                let b = new Brick(
                    offset[0] + (c * (width + padding)),
                    offset[1] + (r * (height + padding)),
                    width,
                    height
                );
                this.bricks.push(b);
            }
        }
    }

    get numBricks(){
        return this.bricks.length;
    }
}