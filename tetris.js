class Tetris {
    constructor(el){
        this.el = el;
        this.canvas = el.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.scoreDiv = el.querySelector('.score');
        this.context.scale(20,20);
        this.arena = new Arena(12, 20);
        console.log(this);
        this.player = new Player(this);

        this.colors = [
            null,
            'red',
            'blue',
            'violet',
            'green',
            'purple',
            'orange',
            'pink'
        ]

        let lastTime = 0;

        const update = (time = 0) => {
            
            const deltaTime = time - lastTime;
            lastTime = time;
            this.player.update(deltaTime);
            this.draw();
            requestAnimationFrame(update)
        }
        update();
        this.updateScore();
    }


    clear(){
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }


draw(){
    this.clear();
    this.drawMatrix(this.arena.matrix, {x: 0, y: 0 });
    this.drawMatrix(this.player.matrix, this.player.pos);
}


drawMatrix(matrix, offset){
    matrix.forEach((row,y) => {
        row.forEach((value, x) => {
            if(value !== 0){

                this.context.fillStyle = this.colors[value];
                this.context.fillRect(   
                                x + offset.x,
                                y + offset.y,
                                1,
                                1
                                );
            }
        })
    })
}

updateScore(){
    this.scoreDiv.innerText = this.player.score;
}




}