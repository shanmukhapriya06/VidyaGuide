// Profile logic for VidyaGuide AI
document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');

    // Form fields
    const nameInput = document.getElementById('profile-name');
    const eduLevelInput = document.getElementById('profile-edu-level');
    const courseInput = document.getElementById('profile-course');
    const skillsInput = document.getElementById('profile-skills');
    const interestsInput = document.getElementById('profile-interests');
    const goalInput = document.getElementById('profile-goal');

    // Load existing profile from localStorage
    const loadProfile = () => {
        const profile = Storage.load('userProfile');
        if (profile && !Array.isArray(profile)) {
            if (nameInput) nameInput.value = profile.name || '';
            if (eduLevelInput) eduLevelInput.value = profile.educationLevel || '';
            if (courseInput) courseInput.value = profile.course || '';
            if (skillsInput) skillsInput.value = profile.skills || '';
            if (interestsInput) interestsInput.value = profile.interests || '';
            if (goalInput) goalInput.value = profile.careerGoal || '';
        }
    };

    // Save profile and redirect
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic Validation Check (Required fields are already handled by browser 'required' attribute)
            const profileData = {
                name: nameInput.value.trim(),
                educationLevel: eduLevelInput.value,
                course: courseInput.value.trim(),
                skills: skillsInput.value.trim(),
                interests: interestsInput.value.trim(),
                careerGoal: goalInput.value.trim(),
                updatedAt: new Date().toISOString()
            };

            // Save to localStorage
            Storage.save('userProfile', profileData);

            // Notify user and redirect
            // Using a simple alert for now as per "simple, clean" constraint
            alert('Profile updated! Redirecting to your Dashboard...');
            window.location.href = 'dashboard.html';
        });
    }

    loadProfile();
});
