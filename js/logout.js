/**
 * Logout Utility for VidyaGuide AI
 */
const logout = () => {
    localStorage.removeItem('isLoggedIn');
    // Clear current user if exists
    localStorage.removeItem('currentUser');

    // Redirect to login page
    const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
    window.location.href = pathPrefix + 'login.html';
};

// Global export
window.logout = logout;
