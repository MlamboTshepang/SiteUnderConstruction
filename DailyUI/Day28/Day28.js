
    // 1. Gab the form and the button from the HTML so we can control them
    const form = document.getElementById('appointmentForm');
    const submitBtn = document.getElementById('submitBtn');

    // 2. Listen for the moment the user submits the form
    form.addEventListener('submit', function(event) {
    // 3. Stop the default behavior (prevent the page from refreshing)
    event.preventDefault();
    // 4. Change the button to show the user something is happening
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Processing...";
    submitBtn.style.opacity = "0.7"; // Dim it slightly
    submitBtn.disabled = true; // Prevent them from clicking it twice
    // 5. Simulate a network request (like saving to a database) using setTimeout
    // This waits 2 seconds (2000 milliseconds) before running the code inside
    setTimeout(() => {
    // Show a success message on the button
    submitBtn.innerText = "Appointment Confirmed! ✅";
    submitBtn.style.background = "rgba(40, 167, 69, 0.4)"; // Give it a glassy green tint
    submitBtn.style.borderColor = "rgba(40, 167, 69, 0.8)";
    // Optional: Grab the user's name to log it (proving we captured the data)
    const userName = document.getElementById('fullName').value;
    console.log(`New appointment booked for: ${userName}`);

    // Reset the form inputs so it's blank again
    form.reset();

    // After 3 more seconds, change the button back to normal
    setTimeout(() => {
    submitBtn.innerText = originalBtnText;
    submitBtn.classList.add('appointment-confirm');
    submitBtn.disabled = false;
}, 3000);
    submitBtn.classList.remove('appointment-confirm');
}, 2000); // 2000ms = 2 seconds
});
