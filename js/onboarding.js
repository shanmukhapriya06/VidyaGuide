/**
 * Simplified Onboarding Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const onboardingForm = document.getElementById('onboarding-form');

    if (onboardingForm) {
        onboardingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusElement = document.querySelector('input[name="status"]:checked');
            if (statusElement) {
                // Save profile basics
                const profileData = {
                    status: statusElement.value,
                    primaryGoal: document.getElementById('onboarding-goal').value,
                    onboardingCompleted: true,
                    updatedAt: new Date().toISOString()
                };
                Storage.save('userProfile', profileData);
            }

            // Redirect to Dashboard
            window.location.href = 'dashboard.html';
        });
    }
});
