/**
 * Simplified Authentication Logic
 * Just sets isLoggedIn and redirects.
 */
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    const handleAuth = (e) => {
        e.preventDefault();
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    };

    if (signupForm) signupForm.addEventListener('submit', handleAuth);
    if (loginForm) loginForm.addEventListener('submit', handleAuth);
});
