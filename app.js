// Assumption : This is a 32*32 snake board game.
let intervalRef = void 0;
const interval = 80;
const scoreElement = document.querySelector('#score');
let score = 0;
scoreElement.textContent = score + ' 🍎';
let direction;
// let snake, food;

const wallDim = {
    l: 1,
    r: 64,
    t: 0,
    b: 64
}

let foodCoordinates = {
    x: Math.floor(Math.random() * 64),
    y: Math.floor(Math.random() * 64)
}

const snakeCoordinates = [{
    x: Math.floor(Math.random() * 64),
    y: Math.floor(Math.random() * 64)
}]

window.addEventListener('DOMContentLoaded', (event) => {
    const gameBoard = document.querySelector('.game-board');
    gameBoard.innerHTML = "";
    setFoodPosition(foodCoordinates);
    setSnakePosition();
});

const setFoodPosition = (coord) => {
    const gameBoard = document.querySelector('.game-board');
    let foodElem = document.querySelector('#food');
    if(!foodElem) {      
        foodElem = document.createElement('div');
        foodElem.setAttribute("id", "food");
        gameBoard.appendChild(foodElem);
    } 
    foodElem.style.gridRowStart = coord.y;
    foodElem.style.gridColumnStart = coord.x;
    foodCoordinates = coord;
}

const setSnakePosition = () => {
    const gameBoard = document.querySelector('.game-board');
    snakeCoordinates.forEach((coord, index) => {
        snakeElem = document.createElement('div');
        snakeElem.style.gridRowStart = coord.y;
        snakeElem.style.gridColumnStart = coord.x;
        snakeElem.classList.add('snake');
        gameBoard.appendChild(snakeElem);
    })
}

const updateSnakePosition = (coordinates) => {
    const snakes = document.getElementsByClassName('snake');
    for( let i = snakes.length - 2; i >= 0; i-- ){
        snakes[i+1].style.gridColumnStart = snakes[i].style.gridColumnStart  ;
        snakes[i+1].style.gridRowStart = snakes[i].style.gridRowStart  ;
    }
    snakeCoordinates[0] = {...coordinates};
    snakes[0].style.gridRowStart = snakeCoordinates[0].y;
    snakes[0].style.gridColumnStart = snakeCoordinates[0].x;
}

const getSnakePosition = () => {
    const snake = document.querySelector('.snake');
    return {
        y: snake.style.gridRowStart,
        x: snake.style.gridColumnStart
    }
}
window.addEventListener('keyup', (event) => {
    if (event.defaultPrevented) {
        return;
    }
    switch (event.key) {
        case 'ArrowDown': {
            if(direction!=='b'){
                const position = getSnakePosition();
                direction = 'b';
                clearInterval(intervalRef)
                intervalRef = setInterval(() => {
                    position.y = parseInt(position.y) + 1;
                    checkForError();
                    updateSnakePosition(position);    
                    checkIfCollided();
                }, interval);
            }
            break;
        }
        case 'ArrowUp': {
            if(direction!=='t'){
                const position = getSnakePosition();
                direction = 't';
                clearInterval(intervalRef)
                intervalRef = setInterval(() => {
                    position.y -= 1;
                    updateSnakePosition(position);
                    checkIfCollided();
                    checkForError();
                }, interval);
            }
            break;
        }
        case 'ArrowRight': {
            if(direction!=='r'){
                const position = getSnakePosition();
                direction = 'r';
                clearInterval(intervalRef)
                intervalRef = setInterval(() => {
                    position.x = parseInt(position.x) + 1;
                    updateSnakePosition(position);
                    checkIfCollided();
                    checkForError();
                }, interval);
            }
            break;
        }
        case 'ArrowLeft': {
            if(direction!=='l'){
                const position = getSnakePosition();
                direction = 'l';
                clearInterval(intervalRef)
                intervalRef = setInterval(() => {
                    position.x -= 1;
                    updateSnakePosition(position);
                    checkIfCollided();
                    checkForError();
                }, interval);
            }
            break;
        }
    }
}, true)

const checkForError = () => {
    let position = getSnakePosition();
    if (direction === 'l') {
        if (wallDim[direction] > position.x) {
            triggerError();
        }
    } else if (direction === 'r') {
        if (wallDim[direction] < position.x) {
            triggerError();
        }
    }
    if (direction === 't') {
        if (wallDim[direction] > position.y) {
            triggerError();
        }
    } else if (direction === 'b') {
        if (wallDim[direction] < position.y) {
            triggerError();
        }
    }
    else {
        for(let i=1; i < snakeCoordinates.length; i++){
            if( parseInt(snakeCoordinates[0].x) === parseInt(snakeCoordinates[i].x) && parseInt(snakeCoordinates[0].x) === parseInt(snakeCoordinates[i].y)  ){
                triggerError();
            }
        }
    }
}

const triggerError = () => {
    alert("Game Over!");
    clearInterval(intervalRef);
    window.location.reload();
}

const pause = () => {
    const btn = document.querySelector('#start-btn');
    btn.textContent = 'Resume';
    clearInterval(intervalRef);
}

const checkIfCollided = () => {
    const gameBoard = document.querySelector('.game-board');
    if (parseInt(snakeCoordinates[0].x) == foodCoordinates.x && parseInt(snakeCoordinates[0].y) == foodCoordinates.y) {
        let inputDirection = {
            x : 0,
            y : 0
        }
        switch (direction) {
            case 'b': {
                inputDirection.y = parseInt(inputDirection.y) + 1;
                break;
            }
            case 't': {
                inputDirection.y = parseInt(inputDirection.y) - 1;
                break;
            }
            case 'r': {
                inputDirection.x = parseInt(inputDirection.x) + 1;
                break;
            }
            case 'l': {
                inputDirection.x = parseInt(inputDirection.x) - 1;
                break;
            }
        }
        const coord = {
            y: parseInt(snakeCoordinates[0].y) + inputDirection.y,
            x: parseInt(snakeCoordinates[0].x) + inputDirection.x
        }
        snakeCoordinates.unshift({
            y : parseInt(snakeCoordinates[0].y) + inputDirection.y,
            x : parseInt(snakeCoordinates[0].x) + inputDirection.x
        });
        
        const snakeElem = document.createElement('div');
        snakeElem.style.gridRowStart = coord.y;
        snakeElem.style.gridColumnStart = coord.x;
        snakeElem.classList.add('snake');
        gameBoard.appendChild(snakeElem);
        updateScore();
        setFoodPosition({
            x: Math.floor(Math.random() * 64),
            y: Math.floor(Math.random() * 64)
        });
    }
}

const updateScore = () => {
    score += 1;
    scoreElement.textContent = score + ' 🍎';   
}