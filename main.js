
const tetri = [];
const playerElements = document.querySelectorAll('.player');
[...playerElements].forEach( (el, i) => {
    const canvas = el.querySelector('canvas');
    tetri[i] = new Tetris(el);
})



// const matrix = [
//     [0,0,0],
//     [1,1,1],
//     [0,1,0],
// ];











// const player = {
//     pos: {x: 0, y: 0},
//     matrix: null, 
//     score: 0,
// }





// console.log(arena);
// console.table(arena);

const keyListener = (event) => {
    [
        ['q', 'w', 'a', 's','d'],['i','o','j','k','l']
    ].forEach((key, index) => {
        const {player} = tetri[index];
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



