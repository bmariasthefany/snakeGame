const snakeBoard = document.getElementById("snakeBoard")
const snakeBoardCTX = snakeBoard.getContext("2d");

let snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 },
]

let dx = 10;
let dy = 0;
let changingDirection = false;
let foodX;
let foodY;
let specialFoodX;
let specialFoodY;
let time = 100;
let score = 0;
let contSpecialFood = 0;
start();
createFood();

document.addEventListener("keydown", changeDirection);

function start() {
    if (gameEnded()) return;
    changingDirection = false;

    setTimeout(function create() {
        moveSnake();
        clearBoard();
        drawSnake();
        drawFood();
        drawSnakeHead();
        drawSpecialFood()
        start();
    }, time)
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    snakeBoardCTX.fillStyle = "darkgreen";
    snakeBoardCTX.strokestyle = "white";
    snakeBoardCTX.fillRect(snakePart.x, snakePart.y, 10, 10);
    snakeBoardCTX.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnakeHead() {
    const head = { x: snake[0].x, y: snake[0].y }; //dx é a velocidade horizontal
    let coloredHead = document.getElementById("coloredHead")
    if (coloredHead.checked === true) {
        snakeBoardCTX.fillStyle = "lightgreen";
        snakeBoardCTX.fillRect(head.x, head.y, 10, 10);
        snakeBoardCTX.strokestyle = "white";
        snakeBoardCTX.strokeRect(head.x, head.y, 10, 10);
    }
}

function clearBoard() {
    snakeBoardCTX.fillStyle = "white";
    snakeBoardCTX.fillRect(0, 0, snakeBoard.width, snakeBoard.height);
    snakeBoardCTX.strokestyle = "white";
    snakeBoardCTX.strokeRect(0, 0, snakeBoard.width, snakeBoard.height);
}

function changeDirection(event) {
    const leftKey = 65;
    const rightKey = 68;
    const upKey = 87;
    const downKey = 83;

    const arrowLeft = 37;
    const arrowRight = 39;
    const arrowUp = 38;
    const arrowDown = 40;

    if (changingDirection) return;
    changingDirection = true;
    const keyPressed = event.keyCode;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;
    const goingUp = dy === -10;
    const goingDown = dy === 10;

    if (keyPressed === upKey && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === downKey && !goingUp) {
        dx = 0;
        dy = 10;
    }
    if (keyPressed === rightKey && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === leftKey && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === arrowUp && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === arrowDown && !goingUp) {
        dx = 0;
        dy = 10;
    }
    if (keyPressed === arrowRight && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === arrowLeft && !goingRight) {
        dx = -10;
        dy = 0;
    }
}

function randomFood(max, min) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function randomSpecialFood(max, min) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomFood(0, snakeBoard.width - 10);
    foodY = randomFood(0, snakeBoard.height - 10);
    snake.forEach(function hasSnakeEaten(part) {
        const hasEaten = part.x == foodX && part.y == foodY;
        if (hasEaten) {
            createFood();
            time += 5
        }
    });
}

function createSpecialFood() {
    specialFoodX = randomFood(0, snakeBoard.width - 10);
    specialFoodY = randomFood(0, snakeBoard.height - 10);
    snake.forEach(function hasEatenSpecial(special) {
        const hasEatenSpecial = special.x == specialFoodX && special.y == specialFoodY;
        if (hasEatenSpecial) {
            time += 5
        }
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy }; //dx é a velocidade horizontal
    snake.unshift(head);
    const hasEaten = snake[0].x === foodX && snake[0].y === foodY
    const hasEatenSpecial = snake[0].x === specialFoodX && snake[0].y === specialFoodY;
    let velocity = document.getElementById("velocity");
    document.getElementById('score').innerHTML = score;
    if (hasEaten) {
        score += 10;
        createFood();
        contSpecialFood++

        if (contSpecialFood === 5) { // cria a primeira special food
            createSpecialFood()
            contSpecialFood = 0;
            if(specialFoodX && specialFoodY) {
                contSpecialFood = 0;
                setTimeout(function removeSpecial() {
                        specialFoodX = undefined;
                        specialFoodY = undefined;   
                }, 5000)
            }
        }

        velocity.checked == false
        if (velocity.checked == true) {
            if (time <= 40) {
                time == 40;
            } else if (time > 40) {
                time -= 10
            }
        }

    } else if (hasEatenSpecial) {
        score += 20;
        contSpecialFood = 0;
        specialFoodX = undefined;
        specialFoodY = undefined;
        
    } else {
        snake.pop();
    }
}

function drawFood() {
    snakeBoardCTX.fillStyle = "red";
    snakeBoardCTX.fillRect(foodX, foodY, 10, 10);
    snakeBoardCTX.strokestyle = "black";
    snakeBoardCTX.strokeRect(foodX, foodY, 10, 10);
}

function drawSpecialFood() {
    snakeBoardCTX.fillStyle = "yellow";
    snakeBoardCTX.fillRect(specialFoodX, specialFoodY, 10, 10);
    snakeBoardCTX.strokestyle = "white";
    snakeBoardCTX.strokeRect(specialFoodX, specialFoodY, 10, 10);
}

function gameEnded() {
    let infinite = document.getElementById("infinite");
    const hitTopWall = snake[0].y < 0;
    const hitLeftWall = snake[0].x < 0;

    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
    }
    if (infinite.checked === false) {
        const hitBottomWall = snake[0].y > snakeBoard.height - 20;
        const hitRightWall = snake[0].x > snakeBoard.width - 20;
        return hitTopWall || hitBottomWall || hitRightWall || hitLeftWall
    }
    else if (infinite.checked === true) {
        const hitBottomWall = snake[0].y > snakeBoard.height - 10;
        const hitRightWall = snake[0].x > snakeBoard.width - 10;
        if (hitRightWall) {
            snake[0].x = dx - 10;
        } else if (hitTopWall) {
            if (snake[0].y < 400) {
                snake[0].y = snakeBoard.width - 10;
            }
        } else if (hitBottomWall) {
            snake[0].y = dy - 10;
        } else if (hitLeftWall) {
            if (snake[0].x < 400) {
                snake[0].x = snakeBoard.height - 10;
            }
        }
    }
}