// Dashboard/Progress Tracker logic for VidyaGuide AI
document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('course-list');
    const addCourseForm = document.getElementById('add-course-form');

    // Load courses from localStorage
    const loadCourses = () => {
        const courses = Storage.load('courses');
        renderCourses(courses);
    };

    // Render courses to the UI
    const renderCourses = (courses) => {
        courseList.innerHTML = '';
        if (courses.length === 0) {
            courseList.innerHTML = '<div class="col-12 text-center text-muted"><p>No courses added yet. Start by adding one!</p></div>';
            return;
        }

        courses.forEach((course, index) => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${course.name}</h5>
                        <p class="card-text text-muted small">${course.platform}</p>
                        <div class="progress mb-3" style="height: 10px;">
                            <div class="progress-bar bg-success" role="progressbar" style="width: ${course.progress}%"></div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-primary">${course.progress}% Complete</span>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteCourse(${index})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            courseList.appendChild(card);
        });
    };

    // Add new course
    if (addCourseForm) {
        addCourseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const courses = Storage.load('courses');
            const newCourse = {
                name: document.getElementById('course-name').value,
                platform: document.getElementById('course-platform').value,
                progress: document.getElementById('course-progress').value
            };
            courses.push(newCourse);
            Storage.save('courses', courses);

            // Reset form and close modal (if using Bootstrap modal)
            addCourseForm.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addCourseModal'));
            if (modal) modal.hide();

            loadCourses();
        });
    }

    // Delete course (global for simplicity in this demo)
    window.deleteCourse = (index) => {
        const courses = Storage.load('courses');
        courses.splice(index, 1);
        Storage.save('courses', courses);
        loadCourses();
    };

    loadCourses();
});
