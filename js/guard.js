/**
 * Navigation Guard for VidyaGuide AI
 * Protects pages from unauthorized access
 */
(function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isLoginPage = window.location.pathname.endsWith('login.html');

    if (!isLoggedIn && !isLoginPage) {
        // Redirect to login page if not logged in
        // Adjust path based on current location
        const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
        window.location.href = pathPrefix + 'login.html';
    } else if (isLoggedIn && isLoginPage) {
        // If already logged in and on login page, go to home
        window.location.href = 'index.html';
    }
})();
