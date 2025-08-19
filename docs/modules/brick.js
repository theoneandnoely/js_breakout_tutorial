export class Brick {
    constructor(x, y, width, height, type){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        switch(type){
            case "Normal":
                this.status = 1;
                this.value = 1;
                break;
            case "Gold":
                this.status = 1;
                this.value = 2;
                break;
            case "Grey":
                this.status = 2;
                this.value = 0;
                this.timer = undefined;
                break;
        }
    }

    collide(timestamp){
        switch(this.type){
            case "Gold":
                this.status = 0;
                break;
            case "Grey":
                this.status = 0;
                this.timer = timestamp;
                break;
            default:
                this.status = 0;
                break;
        }
        return this.value
    }

    ressurectGhosts(timestamp){
        if (this.timer){
            if (timestamp - this.timer > 10000){
                this.status = 2;
            }
        }
    }

    detectCollision(x,y,r){
        if (x+r > this.x && x-r < (this.x + this.width) && y+r > this.y && y-r < (this.y + this.height) && this.status === 1){
            this.status = 0;
            return true;
        } else {
            return false;
        }
    }

    draw(ctx){
        ctx.beginPath();
        ctx.rect(
            this.x, 
            this.y, 
            this.width, 
            this.height
        );
        if (this.type === "Gold"){
            ctx.fillStyle = "#eecc20";
        } else if (this.type === "Grey") {
            ctx.fillStyle = "#aaaaaa";
        } else {
            ctx.fillStyle = "#ff2020";
        }
        ctx.fill();
        ctx.closePath();
    }
}

export class Bricks {
    constructor(
        rows, 
        cols, 
        width, 
        height, 
        padding, 
        offset,
        dist
    ){
        this.bricks = [];
        this.dist = dist;
        let type_p;
        let type;
        for (let c = 0; c < cols; c++){
            for (let r = 0; r < rows; r++){
                type_p = Math.random();
                if (type_p < dist.Gold){
                    type = "Gold";
                } else if (type_p < (dist.Grey + dist.Gold)){
                    type = "Grey";
                } else {
                    type = "Normal";
                }
                let b = new Brick(
                    offset[0] + (c * (width + padding)),
                    offset[1] + (r * (height + padding)),
                    width,
                    height,
                    type
                );
                this.bricks.push(b);
            }
        }
    }

    get numBricks(){
        return this.bricks.length;
    }

    get remaining(){
        let is_remaining = false;
        this.bricks.forEach(b => {
            if (b.status === 1){
                is_remaining = true;
            }
        })
        return is_remaining
    }

    newScreen(){
        let type;
        this.bricks.forEach(b => {
            type = Math.random();
            if (type < this.dist.Gold){
                b.type = "Gold";
                b.status = 1;
                b.value = 2;
            } else if (type < (this.dist.Gold + this.dist.Grey)){
                b.type = "Grey";
                b.status = 2;
                b.value = 0;
            } else {
                b.type = "Normal";
                b.status = 1;
                b.value = 1;
            }
        })
    }

    ressurectGhosts(timestamp){
        this.bricks.forEach(b => {
            b.ressurectGhosts(timestamp);
        })
    }

    draw(ctx){
        this.bricks.forEach(b => {
            if (b.status > 0) {
                b.draw(ctx);
            }
        })
    }
}