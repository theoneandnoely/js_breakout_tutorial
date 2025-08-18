export default class Paddle {
    constructor(width, height, x){
        this.width = width;
        this.height = height;
        this.x = x;
        this.speed = 0;
    }

    draw(ctx, c_height){
        ctx.beginPath();
        ctx.rect(this.x, c_height - this.height, this.width, this.height);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath;
    }
}