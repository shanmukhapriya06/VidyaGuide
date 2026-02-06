// Dashboard Hub logic for VidyaGuide AI
document.addEventListener('DOMContentLoaded', () => {
    const welcomeMsg = document.getElementById('welcome-message');

    // Load profile to get student name
    const profile = Storage.load('userProfile');

    if (profile && profile.name) {
        welcomeMsg.textContent = `Welcome Back, ${profile.name}!`;
    } else {
        welcomeMsg.textContent = "Welcome back, Student!";
        // Optionally redirect to profile if not set
        // window.location.href = 'profile.html';
    }
});
