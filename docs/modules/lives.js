export default class Lives {
    constructor(num){
        this.num = num;
    }

    draw(ctx, width){
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Lives: ", width - 150, 20);
        let l_anchor;
        console.log(this.num);
        for (let l = 0; l < this.num; l++){
            l_anchor = (width - 90) + l * 25;
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
}