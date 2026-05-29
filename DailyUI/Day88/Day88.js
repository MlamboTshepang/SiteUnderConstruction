document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input, select');

    inputs.forEach(input => {
    input.addEventListener('focus', () => {
    const parent = input.closest('.relative');
    if(parent) {
    parent.classList.add('ring-2', 'ring-primary-container/10');
}
});

    input.addEventListener('blur', () => {
    const parent = input.closest('.relative');
    if(parent) {
    parent.classList.remove('ring-2', 'ring-primary-container/10');
}
});
});

    // Form submission logic simulation
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> PROCESSING...';
    btn.disabled = true;

    setTimeout(() => {
    btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> ENROLLED';
    btn.classList.replace('bg-secondary', 'bg-primary-container');
    btn.style.boxShadow = 'none';
}, 1500);
});
});
