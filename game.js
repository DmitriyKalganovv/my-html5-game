const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
function resizeCanvas() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    // Вызовите здесь любую функцию, необходимую для перенастройки игры
    resetGame(); // Это может включать перезапуск или перенастройку игры
}

// Вызываем функцию resizeCanvas при загрузке страницы и при изменении размера окна
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);

let snake = [{ x: 200, y: 200 }, { x: 190, y: 200 }, { x: 180, y: 200 }];
let dx = 10;
let dy = 0;
let foodX;
let foodY;
let score = 0;
const gridSize = 10;

function resetGame() {
    snake = [{ x: 200, y: 200 }, { x: 190, y: 200 }, { x: 180, y: 200 }];
    dx = 10;
    dy = 0;
    score = 0;
    createFood();
    restartButton.style.display = 'none';
    gameLoop();
}

restartButton.addEventListener('click', resetGame);

function drawGrid() {
    ctx.strokeStyle = 'lightgrey'; // Измените цвет здесь
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
    ctx.strokeRect(snakePart.x, snakePart.y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX, foodY, gridSize, gridSize);
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, canvas.width - 10);
    foodY = randomTen(0, canvas.height - 10);
}

function didEatFood() {
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        return true;
    }
    return false;
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (didCollide) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - gridSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - gridSize;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (didEatFood()) {
        createFood();
    } else {
        snake.pop();
    }
}

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawScore();
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText("Счёт: " + score, canvas.width - 80, 30);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function gameLoop() {
    if (didGameEnd()) {
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial'; // Уменьшите размер шрифта здесь
        ctx.fillText("Игра окончена", canvas.width / 4, canvas.height / 2);
        restartButton.style.display = 'block';
        return;
    }

    setTimeout(() => {
        clearCanvas();
        advanceSnake();
        drawSnake();
        drawFood();
        gameLoop();
    }, 100);
}
function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}
// Функция для изменения направления змейки на основе сенсорного ввода
function handleTouchMove(event) {
    var touchPos = getTouchPos(canvas, event);
    var xDiff = touchPos.x - canvas.width / 2;
    var yDiff = touchPos.y - canvas.height / 2;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0 && dx !== -gridSize) {
            dx = gridSize; // Двигаться вправо
            dy = 0;
        } else if (dx !== gridSize) {
            dx = -gridSize; // Двигаться влево
            dy = 0;
        }
    } else {
        if (yDiff > 0 && dy !== -gridSize) {
            dy = gridSize; // Двигаться вниз
            dx = 0;
        } else if (dy !== gridSize) {
            dy = -gridSize; // Двигаться вверх
            dx = 0;
        }
    }
    event.preventDefault();
}
canvas.addEventListener('touchstart', handleTouchMove, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

document.addEventListener("keydown", changeDirection);

resetGame();

