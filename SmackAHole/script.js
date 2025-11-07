// Wait for the document to be fully loaded before running code
$(document).ready(function() {

    // --- Game Variables ---
    let score = 0;
    let gameInterval;
    let gameTimer;
    let moleTimeout;
    let countdownInterval;
    let timeRemaining = 0;

    // NEW: Difficulty and High Score variables
    let currentDifficulty = 'medium'; // Default difficulty
    let highScores = [];
    let currentPlayerName = '';

    // NEW: Constants for high scores and difficulty
    const HIGH_SCORES_KEY = 'whackAMoleHighScores';
    const MAX_HIGH_SCORES = 5;
    const difficultySettings = {
        easy: {
            duration: 30000,  // 30 seconds
            popRate: 1200,    // Slower
            stayTime: 1000
        },
        medium: {
            duration: 20000,  // 20 seconds
            popRate: 1000,    // Original
            stayTime: 800
        },
        hard: {
            duration: 15000,  // 15 seconds
            popRate: 700,     // Faster
            stayTime: 500     // Stays for less time
        }
    };

    // --- jQuery Selectors ---
    const $scoreDisplay = $('#score');
    const $startButton = $('#start-button');
    const $holes = $('.hole');
    const $timerDisplay = $('#time-left');
    const $usernameDisplay = $('#username');
    const $usernameInput = $('#usernameinput');
    const $difficultyButtons = $('.difficulty-btn'); 
    const $highScoreList = $('#high-score-list');  

    // --- Game Functions ---

    /**
     * Starts the game.
     */
    function startGame() {
        // 1. Set up game constants based on difficulty
        const settings = difficultySettings[currentDifficulty]; // Get settings
        const GAME_DURATION = settings.duration;
        const MOLE_POP_RATE = settings.popRate;
        const MOLE_STAY_TIME = settings.stayTime;
        const GAME_START_TIME = GAME_DURATION / 1000;

        // 2. Handle Username
        currentPlayerName = $usernameInput.val().trim();
        if (currentPlayerName === "") {
            currentPlayerName = "Player 1";
        }
        $usernameDisplay.text("Good Luck, " + currentPlayerName + "!");
        $usernameInput.hide(); // Hide input during game
        $difficultyButtons.prop('disabled', true); // Disable difficulty buttons

        // 3. Reset Game State
        console.log(`Game Starting on ${currentDifficulty}!`);
        score = 0;
        $scoreDisplay.text(score);

        // 4. Start Timers
        timeRemaining = GAME_START_TIME;
        $timerDisplay.text(timeRemaining);
        countdownInterval = setInterval(updateTimer, 1000);
        gameInterval = setInterval(() => popMole(MOLE_STAY_TIME), MOLE_POP_RATE); // Pass stay time
        gameTimer = setTimeout(endGame, GAME_DURATION);

        // 5. Toggle Button
        $startButton.text("End Game");
        $startButton.off('click').on('click', endGame);
    }

    /*** Ends the game.*/
    function endGame() {
        console.log("Game Over!");

        // Stop all timers
        clearInterval(gameInterval);
        clearTimeout(gameTimer);
        clearTimeout(moleTimeout);
        clearInterval(countdownInterval);

        $holes.removeClass('mole');

        // Check if game ended early
        if (timeRemaining > 0) {
            alert('Game ended early! Your score was: ' + score);
        } else {
            alert('Game Over! Your final score is: ' + score);
        }

        //Check and update high score
        checkAndAddHighScore(currentPlayerName, score);

        // Reset UI
        $timerDisplay.text(difficultySettings[currentDifficulty].duration / 1000); // Reset timer display
        $usernameInput.show();
        $usernameDisplay.text("");
        $difficultyButtons.prop('disabled', false); //  Re-enable difficulty buttons

        // Toggle Button Back
        $startButton.text("Start Game");
        $startButton.off('click').on('click', startGame);
    }

    /*** Makes a mole appear in a random hole.* UPDATED: Now accepts 'stayTime' as a parameter.*/
    function popMole(stayTime) {
        $holes.removeClass('mole');
        clearTimeout(moleTimeout);

        const randomIndex = Math.floor(Math.random() * $holes.length);
        const $randomHole = $holes.eq(randomIndex);
        $randomHole.addClass('mole');

        moleTimeout = setTimeout(() => {
            $randomHole.removeClass('mole');
        }, stayTime); // Use the passed-in stayTime
    }

    /*** Handles the "whack" (click) on a hole.*/
    function whackMole() {
        if ($(this).hasClass('mole')) {
            console.log("WHACK!");
            score++;
            $scoreDisplay.text(score);
            $(this).removeClass('mole');
            clearTimeout(moleTimeout);
        }
    }
    /*** Updates the visual timer display every second.*/
    function updateTimer() {
        timeRemaining--;
        $timerDisplay.text(timeRemaining);
    }

    // ---  High Score Functions ---
    /*** Loads high scores from localStorage.*/
    function loadHighScores() {
        const scores = localStorage.getItem(HIGH_SCORES_KEY);
        highScores = scores ? JSON.parse(scores) : [];
        console.log("Loaded scores:", highScores);
    }

    /*** Saves the high scores array to localStorage.*/
    function saveHighScores() {
        localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(highScores));
        console.log("Saved scores:", highScores);
    }

    /*** Updates the <ol> in the HTML with current high scores.*/
    function displayHighScores() {
        $highScoreList.empty(); // Clear the list

        if (highScores.length === 0) {
            $highScoreList.append('<li>No scores yet...</li>');
            return;
        }

        highScores.forEach(score => {
            $highScoreList.append(`<li>${score.name} - ${score.score}</li>`);
        });
    }
    /*** Checks if a new score is a high score and adds it.*/
    function checkAndAddHighScore(playerName, newScore) {
        if (newScore === 0) return; // Don't save zero scores

        // Check if it's a high score
        const isHighScore = highScores.length < MAX_HIGH_SCORES || newScore > highScores[highScores.length - 1].score;

        if (isHighScore) {
            const newScoreEntry = { name: playerName, score: newScore };
            highScores.push(newScoreEntry);

            // Sort scores descending
            highScores.sort((a, b) => b.score - a.score);

            // Trim the list
            highScores = highScores.slice(0, MAX_HIGH_SCORES);

            saveHighScores();
            displayHighScores();
            console.log("New high score added!");
        }
    }

    // --- Difficulty Button Click Handler ---
    $difficultyButtons.on('click', function() {
        // 'this' is the button that was clicked
        $difficultyButtons.removeClass('active'); // Remove from all
        $(this).addClass('active'); // Add to this one

        currentDifficulty = $(this).data('difficulty');

        // Update timer display to reflect new duration
        const startTime = difficultySettings[currentDifficulty].duration / 1000;
        $timerDisplay.text(startTime);
        console.log("Difficulty set to:", currentDifficulty);
    });

    // --- Event Listeners (Main) ---
    $startButton.on('click', startGame);
    $holes.on('click', whackMole);

    // --- Initial Setup (On Page Load) ---
    loadHighScores();
    displayHighScores();
    // Set initial timer display based on default difficulty
    $timerDisplay.text(difficultySettings[currentDifficulty].duration / 1000);
    $usernameDisplay.text("");
    $usernameInput.show();

});