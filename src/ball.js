class Ball {
    constructor(x, y, radius, speed, angle){
        this.x = x;
        this.y = y;
        this.init_x = x;
        this.init_y = y;
        this.radius = radius;
        this.speed = speed; // speed in px/ms
        this.angle = angle; // for calculating the ratio of dx:dy
    }


    updatePosition(delta){
        let [dx, dy] = this.calcUpdate(delta);
        this.x += dx;
        this.y += dy;
        console.log(delta + " " + dx + " " + dy);
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
    }
};
