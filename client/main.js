const tetrisManager = new TetrisManager(document);
const localTetris = tetrisManager.createPlayer();
localTetris.el.classList.add('local');
localTetris.run();

const connectionManager = new ConnectionManager(tetrisManager);

var HOST = location.origin.replace(/^http/, 'ws')
connectionManager.connect(HOST);
// connectionManager.connect('ws://localhost:5000');


// setTimeout(removePlayer, 3000);

// for(let i = 0; i< 30; i++){
//     tetrisManager.createPlayer();
// }


// function removePlayer(){
//     tetrisManager.removePlayer(b);
// }
// tetrisManager.createPlayer();
// tetrisManager.createPlayer();
// tetrisManager.createPlayer();
// tetrisManager.createPlayer();
// tetrisManager.createPlayer();
// tetrisManager.createPlayer();
// tetrisManager.createPlayer();


// const tetri = [];
// const playerElements = document.querySelectorAll('.player');
// [...playerElements].forEach( (el, i) => {
//     const canvas = el.querySelector('canvas');
//     tetri[i] = new Tetris(el);
// })

const keyListener = (event) => {
    [
        ['q', 'w', 'a', 's','d'],['i','o','j','k','l']
    ].forEach((key, index) => {
        const {player} = localTetris;
        if(event.type === 'keydown'){
            if(event.key === key[0]){
                player.rotate(-1);
              
            } else if(event.key === key[1]){
                player.rotate(1);
            } else if(event.key === key[2]){
                // console.log('down arrow');
                player.move(-1);
                
            } else if(event.key === key[4]){
                player.move(1);
            }
        } 
        if(event.key === key[3]){
            if(event.type === 'keydown'){
                if(player.dropInterval !== player.DROP_FAST){
                    player.drop();
                    player.dropInterval = player.DROP_FAST;
                }
            } else {
                player.dropInterval = player.DROP_SLOW;
            }
            
        } 
    })
    

}


document.addEventListener('keydown',  keyListener);
document.addEventListener('keyup',  keyListener);


// updateScore();



