class TetrisManager {
    constructor(document){
        this.document = document;
        this.template = document.getElementById('player-template');
        this.instances = new Set;
        const playerElements = document.querySelectorAll('.player');
        // [...playerElements].forEach( (el, i) => {
        //     const canvas = el.querySelector('canvas');
        //     this.instances[i] = new Tetris(el);
        //     })
    }

    createPlayer(){
        const el = this.document
                                .importNode(this.template.content, true)
                                .children[0];
        const tetris = new Tetris(el);                        
        this.instances.add(tetris);
        this.document.body.appendChild(tetris.el);
        return tetris
    }

    removePlayer(tetris){
        this.instances.delete(tetris);
        this.document.body.removeChild(tetris.el);
    }

}

