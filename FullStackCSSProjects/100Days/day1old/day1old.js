document.addEventListener('DOMContentLoaded', () => {
    const myButton = document.querySelector('#btn');
    function showToast() {
        alert("yo");
        myButton.classList.add('glass-button');
    }
    myButton.addEventListener('click', showToast);
});