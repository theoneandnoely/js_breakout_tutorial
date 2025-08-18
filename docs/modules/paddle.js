export default class Paddle {
    constructor(width, height, x, sensitivity, maxx){
        this.width = width;
        this.height = height;
        this.x = x;
        this.speed = 0;
        this.sensitivity = sensitivity;
        this.maxx = maxx;
    }

    updatePosition(rightPressed, leftPressed){
        this.x = Math.max(
            Math.min(
                this.x + (this.sensitivity * rightPressed) - (this.sensitivity * leftPressed),
                this.maxx),
            0
        );
    }

    draw(ctx, c_height){
        ctx.beginPath();
        ctx.rect(this.x, c_height - this.height, this.width, this.height);
        ctx.fillStyle = "#1F363d";
        ctx.strokeStyle = "#70A9A1"
        ctx.fill();
        ctx.stroke();
        ctx.closePath;
    }
}