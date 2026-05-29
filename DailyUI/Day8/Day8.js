document.addEventListener('DOMContentLoaded', () => {

    const gridContainer = document.getElementById('led-grid');
    const scoreDisplay = document.getElementById('score');
    const gameOverText = document.getElementById('game-over-text');

    const ledSpace = 24;
    let leds = [];
    let columns = 0;
    let rows = 0;

    // Game Variables
    let snake = [];
    let direction = 1;
    let foodIndices = []; // CHANGED: Now an array to hold multiple food blocks
    let score = 0;
    let gameInterval;
    let isGameOver = false;

    // 1. Draw the Grid
    function drawGrid() {
        gridContainer.innerHTML = '';
        leds = [];

        columns = Math.floor(window.innerWidth / ledSpace);
        rows = Math.floor(window.innerHeight / ledSpace);
        const totalLeds = columns * rows;

        for (let i = 0; i < totalLeds; i++) {
            const led = document.createElement('div');
            led.classList.add('led');
            gridContainer.appendChild(led);
            leds.push(led);
        }
    }

    // 2. Start / Reset Game
    function startGame() {
        clearInterval(gameInterval);
        isGameOver = false;
        score = 0;
        scoreDisplay.innerText = score;
        gameOverText.style.display = 'none';

        leds.forEach(led => led.className = 'led');
        foodIndices = [];

        // Generate the 404 shape out of food
        spawn404Food();

        // Start the snake slightly below the center so it doesn't instantly hit the 404
        const startX = Math.floor(columns / 2);
        const startY = Math.floor(rows / 2) + 5;
        const startPos = startY * columns + startX;

        snake = [startPos, startPos - 1, startPos - 2];
        direction = 1;

        drawGame();
        gameInterval = setInterval(gameLoop, 100);
    }

    // 3. Spawning the "404" pattern
    function spawn404Food() {
        // These are local [row, column] coordinates mapping out the shape of "404"
        const pattern404 = [
            // First '4'
            [0,0], [1,0], [2,0], [2,1], [2,2], [0,2], [1,2], [3,2], [4,2],
            // '0'
            [0,4], [0,5], [0,6], [1,4], [1,6], [2,4], [2,6], [3,4], [3,6], [4,4], [4,5], [4,6],
            // Second '4'
            [0,8], [1,8], [2,8], [2,9], [2,10], [0,10], [1,10], [3,10], [4,10]
        ];

        // Find the center of the screen, offset by half the width/height of the 404 pattern
        const offsetX = Math.floor(columns / 2) - 5;
        const offsetY = Math.floor(rows / 2) - 3;

        pattern404.forEach(coord => {
            const x = offsetX + coord[1];
            const y = offsetY + coord[0];

            // Make sure the LED is actually on the screen before adding it
            if (x >= 0 && x < columns && y >= 0 && y < rows) {
                const index = y * columns + x;
                foodIndices.push(index);
            }
        });

        // Fallback: If the screen is impossibly tiny, just spawn one random food
        if (foodIndices.length === 0) placeSingleFood();
    }

    // 4. Standard random food spawner (for after the 404 is eaten)
    function placeSingleFood() {
        let newFood;
        do {
            newFood = Math.floor(Math.random() * leds.length);
        } while (snake.includes(newFood)); // Don't spawn on the snake

        foodIndices.push(newFood);
    }

    // 5. Main Game Loop
    function gameLoop() {
        const head = snake[0];
        let nextHead = head + direction;

        const headCol = head % columns;
        const headRow = Math.floor(head / columns);
        const nextCol = nextHead % columns;
        const nextRow = Math.floor(nextHead / columns);

        // Check Wall Collisions
        if (
            (direction === 1 && nextCol === 0) ||
            (direction === -1 && nextCol === columns - 1) ||
            (direction === columns && nextRow >= rows) ||
            (direction === -columns && nextRow < 0)
        ) {
            return triggerGameOver();
        }

        // Check Self Collision
        if (snake.includes(nextHead)) {
            return triggerGameOver();
        }

        // Move Snake
        snake.unshift(nextHead);

        // CHANGED: Check if nextHead is in our array of food indices
        const eatenIndex = foodIndices.indexOf(nextHead);

        if (eatenIndex > -1) {
            // Ate food!
            score += 10;
            scoreDisplay.innerText = score;

            // Remove the specific food LED that was eaten
            leds[nextHead].classList.remove('food');
            foodIndices.splice(eatenIndex, 1);

            // If all food is gone, spawn a new single random food
            if (foodIndices.length === 0) {
                placeSingleFood();
            }
        } else {
            // If no food eaten, remove tail
            const tail = snake.pop();
            if (leds[tail]) leds[tail].classList.remove('snake');
        }

        drawGame();
    }

    // 6. Visual Updates
    function drawGame() {
        leds.forEach(led => {
            led.classList.remove('snake', 'snake-head');
        });

        snake.forEach((index, i) => {
            if (leds[index]) {
                leds[index].classList.add('snake');
                if (i === 0) leds[index].classList.add('snake-head');
            }
        });

        // Draw all remaining food blocks
        foodIndices.forEach(index => {
            if (leds[index]) leds[index].classList.add('food');
        });
    }

    function triggerGameOver() {
        clearInterval(gameInterval);
        isGameOver = true;
        gameOverText.style.display = 'block';
    }

    // 7. Controls
    document.addEventListener('keydown', (e) => {
        if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight", "Space"].indexOf(e.code) > -1) {
            e.preventDefault();
        }

        if (isGameOver && e.code === 'Space') return startGame();

        if (e.code === 'ArrowRight' && direction !== -1) direction = 1;
        else if (e.code === 'ArrowLeft' && direction !== 1) direction = -1;
        else if (e.code === 'ArrowDown' && direction !== -columns) direction = columns;
        else if (e.code === 'ArrowUp' && direction !== columns) direction = -columns;
    });

    // 8. Initialization
    drawGrid();
    startGame();

    // Restart game on resize so grid math stays accurate
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            drawGrid();
            startGame();
        }, 200); // Debounce resize to prevent crashing
    });
});