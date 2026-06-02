document.addEventListener("DOMContentLoaded", function () {
        // 1. Set the date we're counting down to
        const targetDate = new Date("Jan 1, 2027 00:00:00").getTime();

        // 2. Update the countdown every 1 second (1000 milliseconds)
        const timerInterval = setInterval(function() {

        // Get today's date and time
        const now = new Date().getTime();

        // Find the distance between now and the target date
        const distance = targetDate - now;

        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // 4. Output the result in the HTML elements
        // We use toString().padStart(2, '0') to ensure numbers always have two digits (e.g., "05" instead of "5")
        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

        // 5. If the countdown is finished, write some text and stop the timer
        if (distance < 0) {
        clearInterval(timerInterval); // Stops the interval from running
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";

        // Optional: Change the header text to show it's done
        document.querySelector("h1").innerText = "We Have Launched!";
    }
    }, 1000);
});