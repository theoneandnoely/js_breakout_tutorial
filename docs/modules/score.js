export default class Score {
    constructor(){
        this.value = 0;
        if (!localStorage.getItem('NM_JS_BREAKOUT_HIGHSCORE')){
            this.high_score = 0;
            this.setHighScore();
        } else {
            this.high_score = localStorage.getItem('NM_JS_BREAKOUT_HIGHSCORE');
        }
    }

    checkIfHighScore(){
        if (this.value > this.high_score) {
            this.high_score = this.value;
            this.setHighScore();
            return true;
        } else {
            return false;
        }
    }

    setHighScore(){
        localStorage.setItem('NM_JS_BREAKOUT_HIGHSCORE', this.high_score);
    }

    draw(ctx){
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText(`Score: ${this.value}`, 8, 20);
    }
}