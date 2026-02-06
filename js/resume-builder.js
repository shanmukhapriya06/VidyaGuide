/**
 * Resume Builder Logic for VidyaGuide AI
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const resumeForm = document.getElementById('resume-form');
    const previewArea = document.getElementById('resume-preview');
    const btnT1 = document.getElementById('btn-template-1');
    const btnT2 = document.getElementById('btn-template-2');

    const btnT3 = document.getElementById('btn-template-3');

    // Form Field Elements
    const nameInput = document.getElementById('res-name');
    const emailInput = document.getElementById('res-email');
    const phoneInput = document.getElementById('res-phone');
    const locationInput = document.getElementById('res-location');
    const socialInput = document.getElementById('res-social');
    const eduInput = document.getElementById('res-edu');
    const cgpaInput = document.getElementById('res-cgpa');
    const skillsInput = document.getElementById('res-skills');
    const projectsInput = document.getElementById('res-projects');
    const interestsInput = document.getElementById('res-interests');
    const goalInput = document.getElementById('res-goal');

    let activeTemplate = 1;

    // Load custom fonts for templates
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // 1. Initial Load: Auto-fill fields from Student Profile or Saved Resume
    const init = () => {
        // Step A: Load the general user profile (from onboarding/profile page)
        const profile = Storage.load('userProfile');

        // If a profile exists, we use it as a starting point for the resume
        if (profile && !Array.isArray(profile)) {
            nameInput.value = profile.name || '';
            emailInput.value = profile.email || '';
            phoneInput.value = profile.phone || '';
            locationInput.value = profile.location || '';

            // Combine course and education level for a cleaner look
            const educationDisp = `${profile.course || ''}, ${profile.educationLevel || ''}`.trim().replace(/^,/, '');
            eduInput.value = educationDisp;
            if (profile.cgpa) cgpaInput.value = profile.cgpa;

            skillsInput.value = profile.skills || '';
            interestsInput.value = profile.interests || '';
            goalInput.value = profile.careerGoal || '';
        }

        // Step B: Check for existing resume-specific data
        const savedResume = Storage.load('resumeData');
        if (savedResume && !Array.isArray(savedResume)) {
            if (savedResume.name) nameInput.value = savedResume.name;
            if (savedResume.email) emailInput.value = savedResume.email;
            if (savedResume.phone) phoneInput.value = savedResume.phone;
            if (savedResume.location) locationInput.value = savedResume.location;
            if (savedResume.social) socialInput.value = savedResume.social;
            if (savedResume.education) eduInput.value = savedResume.education;
            if (savedResume.cgpa) cgpaInput.value = savedResume.cgpa;
            if (savedResume.skills) skillsInput.value = savedResume.skills;
            if (savedResume.projects) projectsInput.value = savedResume.projects;
            if (savedResume.interests) interestsInput.value = savedResume.interests;
            if (savedResume.goal) goalInput.value = savedResume.goal;
            if (savedResume.template) activeTemplate = savedResume.template;
        }

        updateTemplateSelection();
        updatePreview();
    };

    // Helper to format contact line
    const getContactLine = (separator = '•', showIcons = false) => {
        const parts = [];
        if (emailInput.value) {
            const content = showIcons ? `<i class="bi bi-envelope-fill me-1"></i>${emailInput.value}` : emailInput.value;
            parts.push(content);
        }
        if (phoneInput.value) {
            const content = showIcons ? `<i class="bi bi-telephone-fill me-1"></i>${phoneInput.value}` : phoneInput.value;
            parts.push(content);
        }
        if (locationInput.value) {
            const content = showIcons ? `<i class="bi bi-geo-alt-fill me-1"></i>${locationInput.value}` : locationInput.value;
            parts.push(content);
        }
        if (socialInput.value) {
            const content = showIcons ? `<i class="bi bi-link-45deg me-1"></i>${socialInput.value}` : socialInput.value;
            parts.push(content);
        }

        if (showIcons) {
            return parts.join(`<span class="mx-2 opacity-50 text-muted">${separator}</span>`);
        }
        return parts.join(` <span class="mx-1 text-muted">${separator}</span> `);
    };

    // 2. Update Preview HTML
    const updatePreview = () => {
        const name = (nameInput && nameInput.value) || 'Your Name';
        const contact = getContactLine();
        const contactWithIcons = getContactLine('|', true);
        const goal = (goalInput && goalInput.value) || 'Describe your career goals here...';
        const skills = (skillsInput && skillsInput.value) || 'Skill 1, Skill 2';
        const edu = (eduInput && eduInput.value) || 'Education Details';
        const cgpa = (cgpaInput && cgpaInput.value) || '';
        const projects = (projectsInput && projectsInput.value) || 'Project Name: Description...';
        const interests = (interestsInput && interestsInput.value) || 'Interest 1, Interest 2';

        if (activeTemplate === 1) {
            // CLASSIC: Executive Minimalist, Sans-serif
            previewArea.className = 'resume-template-1 bg-white p-5 mx-auto shadow';
            previewArea.style.fontFamily = "Arial, Helvetica, sans-serif";
            previewArea.style.color = "#000";
            previewArea.style.textAlign = "left";

            previewArea.innerHTML = `
                <div class="text-center mb-3">
                    <h1 class="fw-bold mb-1 text-uppercase" style="font-size: 2.2rem; line-height: 1;">${name}</h1>
                    <div class="small fw-normal text-muted" style="font-size: 0.9rem;">${contactWithIcons}</div>
                </div>
                
                <hr class="mt-0 mb-4 border-dark border-2 opacity-100">
                
                <div class="mb-4">
                    <h6 class="fw-bold mb-1">SUMMARY</h6>
                    <hr class="mt-0 mb-2 border-secondary opacity-25">
                    <p class="mb-0" style="font-size: 0.95rem; line-height: 1.5;">${goal}</p>
                </div>

                <div class="mb-4">
                    <h6 class="fw-bold mb-1">SKILLS</h6>
                    <hr class="mt-0 mb-2 border-secondary opacity-25">
                    <p class="mb-0" style="font-size: 0.95rem;">${skills}</p>
                </div>

                <div class="mb-4">
                    <h6 class="fw-bold mb-1">PROJECTS</h6>
                    <hr class="mt-0 mb-2 border-secondary opacity-25">
                    <div style="font-size: 0.95rem;">
                        ${projects.split('\n').filter(p => p.trim()).map(p => {
                const [pName, ...pDesc] = p.split(':');
                return `<div class="mb-2"><strong>${pName.trim()}</strong><p class="mb-0 text-muted small">${pDesc.join(':').trim()}</p></div>`;
            }).join('')}
                    </div>
                </div>

                <div class="mb-4">
                    <h6 class="fw-bold mb-1">EDUCATION</h6>
                    <hr class="mt-0 mb-2 border-secondary opacity-25">
                    <div style="font-size: 0.95rem;">
                        <p class="mb-0" style="white-space: pre-line;">${edu}</p>
                        ${cgpa ? `<p class="mb-0 mt-1 small"><strong>CGPA/Percentage:</strong> ${cgpa}</p>` : ''}
                    </div>
                </div>

                <div class="mb-0">
                    <h6 class="fw-bold mb-1">INTERESTS & ACTIVITIES</h6>
                    <hr class="mt-0 mb-2 border-secondary opacity-25">
                    <p class="mb-0" style="font-size: 0.95rem;">${interests}</p>
                </div>
            `;
        } else if (activeTemplate === 2) {
            // MODERN: Tech-focused, Poppins, Vertical Accent Bar
            const ACCENT_COLOR = "#2563eb"; // Standard Blue
            previewArea.className = 'resume-template-2 bg-white p-5 mx-auto shadow position-relative';
            previewArea.style.fontFamily = "'Poppins', sans-serif";
            previewArea.style.color = "#1f2937";
            previewArea.style.borderLeft = `4px solid ${ACCENT_COLOR}`;
            previewArea.style.textAlign = "left";

            previewArea.innerHTML = `
                <div class="mb-5">
                    <h1 class="fw-bold text-uppercase mb-2" style="font-size: 2.8rem; letter-spacing: 1px;">${name}</h1>
                    <div class="d-flex align-items-center small fw-medium text-dark opacity-75">
                        ${contactWithIcons}
                    </div>
                </div>

                <div class="mb-4">
                    <h6 class="fw-bold text-uppercase mb-1" style="color: ${ACCENT_COLOR}; letter-spacing: 1px;">Summary</h6>
                    <hr class="mt-0 mb-3 opacity-25">
                    <p style="font-size: 0.9rem; line-height: 1.6; color: #374151;">${goal}</p>
                </div>

                <div class="mb-4">
                    <h6 class="fw-bold text-uppercase mb-1" style="color: ${ACCENT_COLOR}; letter-spacing: 1px;">Skills</h6>
                    <hr class="mt-0 mb-3 opacity-25">
                    <p style="font-size: 0.9rem; color: #374151;">${skills}</p>
                </div>

                <div class="mb-4">
                    <h6 class="fw-bold text-uppercase mb-1" style="color: ${ACCENT_COLOR}; letter-spacing: 1px;">Education</h6>
                    <hr class="mt-0 mb-3 opacity-25">
                    <div style="font-size: 0.9rem; color: #374151;">
                        <p class="mb-0" style="white-space: pre-line;">${edu}</p>
                        ${cgpa ? `<p class="mb-0 mt-1 small"><strong>Score:</strong> ${cgpa}</p>` : ''}
                    </div>
                </div>

                <div class="mb-0">
                    <h6 class="fw-bold text-uppercase mb-1" style="color: ${ACCENT_COLOR}; letter-spacing: 1px;">Interests</h6>
                    <hr class="mt-0 mb-3 opacity-25">
                    <p style="font-size: 0.9rem; color: #374151;">${interests}</p>
                </div>
            `;
        } else {
            // PROFESSIONAL: Corporate, Light Grays, Thin Borders
            previewArea.className = 'resume-template-3 bg-white p-5 mx-auto shadow';
            previewArea.style.fontFamily = "'Inter', sans-serif";
            previewArea.style.color = "#1e293b";
            previewArea.innerHTML = `
                <div class="border-bottom border-secondary-subtle pb-4 mb-4">
                    <h1 class="fw-bold text-uppercase mb-2" style="letter-spacing: 2px;">${name}</h1>
                    <div class="small fw-semibold text-muted text-uppercase" style="letter-spacing: 1px;">${getContactLine('|')}</div>
                </div>
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-2">
                        <div class="bg-secondary-subtle p-1 px-2 rounded-1 me-2 small fw-bold">01</div>
                        <h6 class="fw-bold text-uppercase mb-0 small" style="letter-spacing: 1px;">Career objective</h6>
                    </div>
                    <p class="ps-4 ms-2 text-muted" style="font-size: 0.9rem; line-height: 1.8; border-start: 1px solid #e2e8f0;">${goal}</p>
                </div>
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-2">
                        <div class="bg-secondary-subtle p-1 px-2 rounded-1 me-2 small fw-bold">02</div>
                        <h6 class="fw-bold text-uppercase mb-0 small" style="letter-spacing: 1px;">Technical & Soft Skills</h6>
                    </div>
                    <p class="ps-4 ms-2 text-muted" style="font-size: 0.9rem;">${skills}</p>
                </div>
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-2">
                        <div class="bg-secondary-subtle p-1 px-2 rounded-1 me-2 small fw-bold">03</div>
                        <h6 class="fw-bold text-uppercase mb-0 small" style="letter-spacing: 1px;">Academic Summary</h6>
                    </div>
                    <div class="ps-4 ms-2 text-muted" style="font-size: 0.9rem;">
                        <p class="mb-0" style="white-space: pre-line;">${edu}</p>
                        ${cgpa ? `<p class="mb-0 mt-1 small"><strong>Result:</strong> ${cgpa}</p>` : ''}
                    </div>
                </div>
                <div class="mb-0">
                    <div class="d-flex align-items-center mb-2">
                        <div class="bg-secondary-subtle p-1 px-2 rounded-1 me-2 small fw-bold">04</div>
                        <h6 class="fw-bold text-uppercase mb-0 small" style="letter-spacing: 1px;">Additional Activities</h6>
                    </div>
                    <p class="ps-4 ms-2 text-muted" style="font-size: 0.9rem;">${interests}</p>
                </div>
            `;
        }

        // Auto-save work
        saveData();
    };

    // 3. Save Data to LocalStorage
    const saveData = () => {
        const resumeData = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            location: locationInput.value,
            social: socialInput.value,
            education: eduInput.value,
            cgpa: cgpaInput.value,
            skills: skillsInput.value,
            projects: projectsInput.value,
            interests: interestsInput.value,
            goal: goalInput.value,
            template: activeTemplate
        };
        Storage.save('resumeData', resumeData);
    };

    // 4. Handle Template Selection
    const updateTemplateSelection = () => {
        btnT1.classList.toggle('active', activeTemplate === 1);
        btnT2.classList.toggle('active', activeTemplate === 2);
        btnT3.classList.toggle('active', activeTemplate === 3);
    };

    btnT1.addEventListener('click', () => {
        activeTemplate = 1;
        updateTemplateSelection();
        updatePreview();
    });

    btnT2.addEventListener('click', () => {
        activeTemplate = 2;
        updateTemplateSelection();
        updatePreview();
    });

    btnT3.addEventListener('click', () => {
        activeTemplate = 3;
        updateTemplateSelection();
        updatePreview();
    });

    // 5. Live Preview Updates
    [nameInput, emailInput, phoneInput, locationInput, socialInput, eduInput, cgpaInput, skillsInput, projectsInput, interestsInput, goalInput].forEach(el => {
        if (el) el.addEventListener('input', updatePreview);
    });

    // --- RESUME ANALYZER LOGIC (Integrated & Automatic) ---
    const analyzerInput = document.getElementById('resume-text-analyzer');
    const analyzerPlaceholder = document.getElementById('analyzer-placeholder');
    const analyzerLoading = document.getElementById('analyzer-loading');
    const analyzerContentArea = document.getElementById('analyzer-content-area');
    const reAnalyzeBtn = document.getElementById('re-analyze-btn');
    const analyzerTabBtn = document.getElementById('analyzer-tab');

    // AI Config
    const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

    const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    const GROQ_MODEL = "llama-3.3-70b-versatile";

    /**
     * Extracts plain text from the builder inputs for AI audit
     */
    const getResumeTextForAudit = () => {
        const name = (nameInput && nameInput.value) || '';
        const edu = (eduInput && eduInput.value) || '';
        const skills = (skillsInput && skillsInput.value) || '';
        const goal = (goalInput && goalInput.value) || '';
        const interests = (interestsInput && interestsInput.value) || '';

        if (!name && !edu && !skills && !goal) return "";

        return `NAME: ${name}\n\nSUMMARY/GOAL: ${goal}\n\nEDUCATION: ${edu}\n\nSKILLS: ${skills}\n\nINTERESTS: ${interests}`;
    };

    /**
     * Automatic Sync & Analysis Trigger
     */
    const triggerAutomaticAudit = async (force = false) => {
        if (!analyzerInput || !analyzerPlaceholder || !analyzerContentArea) return;

        const textToAnalyze = getResumeTextForAudit();

        if (!textToAnalyze) {
            analyzerInput.value = "";
            showPlaceholder("Build your resume first to analyze it. Use the 'Resume Builder' tab to get started.");
            return;
        }

        // Sync the text area preview
        analyzerInput.value = textToAnalyze;

        // Check cache
        const lastResult = Storage.load('lastResumeAnalysis');
        if (!force && lastResult && lastResult.originalText === textToAnalyze) {
            displayAnalyzerResults(lastResult);
            return;
        }

        // --- Execute AI Audit ---
        showLoading(true);

        try {
            const profile = Storage.load('userProfile') || {};
            const careerGoal = (goalInput && goalInput.value) || profile.careerGoal || "a professional role";

            const result = await analyzeWithGroq(textToAnalyze, careerGoal);
            result.originalText = textToAnalyze;

            // Save & Show
            Storage.save('lastResumeAnalysis', result);
            displayAnalyzerResults(result);
        } catch (err) {
            console.error("AI Audit Error:", err);
            handleAuditError();
        } finally {
            showLoading(false);
        }
    };

    async function analyzeWithGroq(text, goal) {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    {
                        role: "system",
                        content: `You are an expert Resume Auditor. Analyze this resume against the goal: "${goal}". Provide feedback in JSON format ONLY: {"score":0-100, "verdict":"Short summary of status", "strengths":["bullet"], "improvements":["bullet"], "missingKeywords":["tag"]}`
                    },
                    { role: "user", content: text }
                ],
                temperature: 0.2,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) throw new Error("Groq API Request Failed");
        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    }

    function showLoading(isLoading) {
        if (isLoading) {
            analyzerLoading.classList.remove('d-none');
            analyzerPlaceholder.classList.add('d-none');
            analyzerContentArea.classList.add('d-none');
        } else {
            analyzerLoading.classList.add('d-none');
        }
    }

    function showPlaceholder(message) {
        analyzerPlaceholder.innerHTML = `
            <i class="bi bi-clipboard-data text-muted" style="font-size: 3rem;"></i>
            <h5 class="mt-3 text-muted">Awaiting Content</h5>
            <p class="small text-muted px-5">${message}</p>
        `;
        analyzerPlaceholder.classList.remove('d-none');
        analyzerContentArea.classList.add('d-none');
    }

    function handleAuditError() {
        analyzerPlaceholder.innerHTML = `
            <div class="text-danger my-5 text-center w-100">
                <i class="bi bi-exclamation-triangle display-4"></i>
                <h5 class="mt-3 fw-bold">AI Audit Failed</h5>
                <p class="small">We couldn't connect to the AI Mentor. Please check your internet and try again.</p>
                <button class="btn btn-sm btn-outline-danger mt-2" onclick="location.reload()">Refresh Page</button>
            </div>
        `;
        analyzerPlaceholder.classList.remove('d-none');
        analyzerContentArea.classList.add('d-none');
    }

    function displayAnalyzerResults(data) {
        analyzerPlaceholder.classList.add('d-none');
        analyzerContentArea.classList.remove('d-none');

        // Score & Verdict
        const score = data.score || 0;
        const scoreEl = document.getElementById('analyzer-score');
        scoreEl.innerText = score;
        document.getElementById('analyzer-progress-bar').style.width = `${score}%`;
        document.getElementById('analyzer-verdict').innerText = data.verdict || "Analysis Complete.";

        // Style score by value
        scoreEl.className = `display-3 fw-bold ${score > 80 ? 'text-success' : score > 50 ? 'text-warning' : 'text-danger'}`;

        // Lists
        document.getElementById('analyzer-strengths').innerHTML = (data.strengths || []).map(s => `<li>${s}</li>`).join('');
        document.getElementById('analyzer-improvements').innerHTML = (data.improvements || []).map(i => `<li>${i}</li>`).join('');

        // Keywords/Tags
        document.getElementById('analyzer-keywords').innerHTML = (data.missingKeywords || []).map(k =>
            `<span class="badge bg-light text-dark border p-2 small">${k}</span>`
        ).join('');
    }

    // Tab Switch Event
    if (analyzerTabBtn) {
        analyzerTabBtn.addEventListener('shown.bs.tab', () => triggerAutomaticAudit());
    }

    if (reAnalyzeBtn) {
        reAnalyzeBtn.addEventListener('click', () => triggerAutomaticAudit(true));
    }

    init();

    // 6. Export to PDF (requires html2pdf.js in HTML)
    window.downloadResume = () => {
        const element = document.getElementById('preview-area');
        const name = nameInput.value || 'Career_Resume';
        const fileName = `${name.replace(/\s+/g, '_')}_Resume.pdf`;

        const opt = {
            margin: 0,
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // New Promise-based usage:
        html2pdf().set(opt).from(element).save();
    };
});
