
function showToast(type) {
    const container = document.getElementById('toast-container');
    const success = document.getElementById('successful');
    const failure = document.getElementById('failure');
    // 1. Create the element
    const toast = document.createElement('div');
    toast.classList.add('toast', type);

    // 2. Set the message based on the type
    if (type === 'success') {
        toast.innerText = "✓ Action completed successfully!";
        success.classList.add('toast-success');
        setTimeout(() => {
            success.classList.remove('toast-success');
        }, 3000);
    } else {
        toast.innerText = "✕ Action failed. Please try again.";
        failure.classList.add('toast-error');
        setTimeout(() => {
            success.classList.remove('toast-error');
        },3000);
    }

    // 3. Append to container
    container.appendChild(toast);

    // 4. Remove from DOM after 3 seconds (matching CSS animation)
    setTimeout(() => {
        toast.remove();
    }, 3000);
}