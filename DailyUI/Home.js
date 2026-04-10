document.addEventListener('DOMContentLoaded', () => {

    const gridContainer = document.getElementById('led-grid');
    const ledSpace = 24;
    let leds = [];
    let columns = 0;

    // NEW: Variables to store the exact physical starting position of the grid
    let offsetX = 0;
    let offsetY = 0;

    const palette = ['#FF8700' , '#005AFF', '#00E5FF', '#CCFF00', '#FFF5E6'];

    // 1. Draw the Grid
    function drawGrid() {
        const existingLeds = document.querySelectorAll('.led');
        existingLeds.forEach(led => led.remove());

        leds = [];

        columns = Math.floor(window.innerWidth / ledSpace);
        const rows = Math.floor(window.innerHeight / ledSpace);
        const totalLeds = columns * rows;

        for (let i = 0; i < totalLeds; i++) {
            const led = document.createElement('div');
            led.classList.add('led');
            gridContainer.appendChild(led);
            leds.push(led);
        }

        // NEW: Measure the exact position of the very first LED on the screen.
        // We subtract 2 to account for the 2px margin we set in the CSS!
        if (leds.length > 0) {
            const firstLedRect = leds[0].getBoundingClientRect();
            offsetX = firstLedRect.left - 2;
            offsetY = firstLedRect.top - 2;
        }
    }

    drawGrid();
    window.addEventListener('resize', drawGrid);

    // 2. The Autonomous Background Twinkle
    function lightUpRandomLED() {
        if (leds.length === 0) return;

        const randomIndex = Math.floor(Math.random() * leds.length);
        const led = leds[randomIndex];
        const randomColor = palette[Math.floor(Math.random() * palette.length)];

        led.style.transition = '0s';
        led.style.backgroundColor = randomColor;
        led.style.boxShadow = `0 0 10px ${randomColor}, 0 0 20px ${randomColor}`;

        setTimeout(() => {
            led.style.transition = 'background-color 4s ease, box-shadow 4s ease';
            led.style.backgroundColor = 'transparent';
            led.style.boxShadow = 'none';
        }, 50);
    }

    setInterval(lightUpRandomLED, 400);

    // 3. The Unblockable Mouse Trail (FIXED)
    document.addEventListener('mousemove', (event) => {
        // NEW: Subtract the grid's physical offset from the mouse coordinates
        const col = Math.floor((event.clientX - offsetX) / ledSpace);
        const row = Math.floor((event.clientY - offsetY) / ledSpace);

        // NEW: Safety check to make sure the mouse isn't mathematically outside the grid
        if (col < 0 || col >= columns || row < 0) return;

        const index = (row * columns) + col;

        if (leds[index]) {
            const led = leds[index];

            led.style.transition = '0s';
            led.style.backgroundColor = '#FF8700';
            led.style.boxShadow = '0 0 10px #FF8700, 0 0 20px #FF8700';

            setTimeout(() => {
                led.style.transition = 'background-color 4s ease, box-shadow 4s ease';
                led.style.backgroundColor = 'transparent';
                led.style.boxShadow = 'none';
            }, 50);
        }
    });
});
