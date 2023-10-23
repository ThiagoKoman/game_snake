let ranking = JSON.parse(localStorage.getItem("rank")) || [...initialRank()];
const domBoard = document.getElementById('board');
const startModal = document.getElementById('gameMenu');
const endModal = document.getElementById('gameOver');
const domScore = document.getElementById('score');
const domRank = document.getElementById('rank');
let tag = 'YOU';

let direction = 'right';
let realDirection = 'right';
let interval = null;
const snake = [[1,2],[1,1]];
let apple = randomizeApple();
let score = 0;
const awaitParts = [];


function initialRender(){
    let paramBoard = getBoardModel();
    paramBoard.forEach(list => {
        list.forEach(item =>{
            domBoard.insertAdjacentHTML('beforeend',createCard(item));
        });
    });
}
initialRender();

function renderBoard(paramBoard){
    domBoard.innerHTML = "";
    paramBoard.forEach(list => {
        list.forEach(item =>{
            domBoard.insertAdjacentHTML('beforeend',createCard(item));
        })
    });

}

function createCard(type){
    if(type == 0){
        return `<div class='card normal'></div>`
    }else if(type == -1){
        return `<div class='card apple'></div>`
    }else if(type == 1){
        return `<div class='card head dir-${realDirection}'></div>`
    }else{
        return `<div class='card snake dir-${realDirection}'></div>`
    }
}

// renderBoard(board);

document.addEventListener('keydown', (e)=>{
    if(e.key == 'ArrowLeft' || e.key.toLowerCase() == 'a'){
        direction = realDirection == 'right' ? 'right' :'left';
    }else if(e.key == 'ArrowUp' || e.key.toLowerCase() == 'w'){
        direction = realDirection == 'down' ? 'down' :'up';
    }else if(e.key == 'ArrowRight' || e.key.toLowerCase() == 'd'){
        direction = realDirection == 'left' ? 'left' :'right';
    }else if(e.key == 'ArrowDown' || e.key.toLowerCase() == 's'){
        direction = realDirection == 'up' ? 'up' :'down';
    }
});


function start(){
    playAudio('start');
    tag = document.getElementById('tag').value.toUpperCase() || 'YOU';
    startModal.style.display = 'none';
    interval = setInterval(()=>{
        movement();
        let mountedBoard = setSnakeOnBoard(snake);
        mountedBoard = setAppleOnBoard(mountedBoard);
        renderBoard(mountedBoard);
        checkIntersection();
        score+=snake.length;
        domScore.innerHTML = "Score: "+score;
    },80);
}

function movement(){
    if(direction == 'right'){
        snake.unshift([snake[0][0],snake[0][1]+1]);
        if(snake[0][1] > 19){
            snake[0][1] = 0;
            playAudio('teleport');
        }
        realDirection = 'right';
    }else if(direction == 'up'){
        snake.unshift([snake[0][0] - 1,snake[0][1]]);
        if(snake[0][0] < 0){
            snake[0][0] = 19;
            playAudio('teleport');
        }
        realDirection = 'up';
    }else if(direction == 'left'){
        snake.unshift([snake[0][0],snake[0][1]-1]);
        if(snake[0][1] < 0){
            snake[0][1] = 19;
            playAudio('teleport');
        }
        realDirection = 'left';
    }else if(direction == 'down'){
        snake.unshift([snake[0][0] + 1,snake[0][1]]);
        if(snake[0][0] > 19){
            snake[0][0] = 0;
            playAudio('teleport');
        }
        realDirection = 'down';
    }

    let flag = false;
    awaitParts.forEach((pos,index)=>{
        if(pos[0]==snake[snake.length - 1][0] && pos[1]==snake[snake.length - 1][1] && !flag){
            flag = true;
            awaitParts.splice(index,1);
        }
    })
    if(!flag){
        snake.splice(snake.length - 1, 1);
    }

    if(snake[0][0] == apple[0] && snake[0][1] == apple[1]){
        awaitParts.push(snake[0]);
        apple = randomizeApple();
        playAudio('eat');
        score+=(snake.length * 10);
    }
}

function setSnakeOnBoard(){
    const localBoard = getBoardModel();
    snake.forEach((pos, index)=>{
        localBoard[pos[0]][pos[1]] = index + 1; 
    })
    return localBoard;
}

function setAppleOnBoard(localBoard){
    localBoard[apple[0]][apple[1]] = -1;
    return localBoard;
}

function getBoardModel(){
    return [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
}

function initialRank(){
    return [
        {
            player: 'CPU',
            score: 100000,
            date: null
        },
        {
            player: 'CPU',
            score: 90000,
            date: null
        },
        {
            player: 'CPU',
            score: 80000,
            date: null
        },
        {
            player: 'CPU',
            score: 70000,
            date: null
        },
        {
            player: 'CPU',
            score: 60000,
            date: null
        },
        {
            player: 'CPU',
            score: 50000,
            date: null
        },
        {
            player: 'CPU',
            score: 40000,
            date: null
        },
        {
            player: 'CPU',
            score: 30000,
            date: null
        },
        {
            player: 'CPU',
            score: 20000,
            date: null
        },
        {
            player: 'CPU',
            score: 10000,
            date: null
        }
    ]
}

function randomizeApple(){
    let x, y, flag;
    do{
        flag = false;
        x = parseInt(Math.random() * 20);
        y = parseInt(Math.random() * 20);
        snake.forEach((item)=>{
            if(item[0] == x && item[1] == y && !flag){
                flag = true;
            }
        })
    }while(flag);
    return [x,y];
}

function checkIntersection(){
    for(let i = 0; i < snake.length; i++){
        for(let j = i+1 ; j<snake.length ; j++){
            if(snake[i][0] == snake[j][0] && snake[i][1] == snake[j][1]){
                gameOver();
            }
        }
    }
}

function gameOver(){
    clearInterval(interval);
    playAudio(`finish${parseInt(Math.random() * 7) + 1}`)
    renderRanking();
    endModal.style.display = 'flex';
}

function restart(){
    window.location.reload();
}

function renderRanking(){
    ranking.push({
        player: tag,
        score: score,
        date: new Date().toISOString().slice(0, 22)
    })

    ranking.sort((a,b)=>{return a.score > b.score ? -1 : 1});
    ranking.splice(ranking.length - 1, 1);

    ranking.forEach((item, index)=>{
        let li = document.createElement('li');
        li.innerHTML = `${index+1} - ${item.player} -> ${item.score}`;
        domRank.append(li);
    });

    localStorage.setItem("rank", JSON.stringify(ranking));
}

function playAudio(name){
    let audio = new Audio(`./sounds/${name}.mp3`);
    audio.play();
}

function setZoom(scale){
    document.body.style.transform = `scale(${scale})`;
}