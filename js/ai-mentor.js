/**
 * AI Mentor Logic using Gemini API
 */

// WARNING: In a real app, API keys should NOT be hardcoded on the client side.
// This is for demonstration/hacker-friendly purposes only.
// GROQ API Configuration
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const GEMINI_APP_VERSION = "2.0.0"; // Major version jump for Groq switch

console.log(`VidyaGuide AI Mentor v${GEMINI_APP_VERSION} (powered by Groq) initialized.`);
console.log("Tip: If error persists, try checking available models at https://aistudio.google.com/");

document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Load student profile for personalization
    const profile = Storage.load('userProfile') || {};

    // Add Welcome message logic if needed

    const appendMessage = (role, text) => {
        const isAI = role === 'ai';
        const msgDiv = document.createElement('div');
        msgDiv.className = `d-flex mb-4 ${isAI ? '' : 'justify-content-end'}`;

        let formattedText = text.replace(/\n/g, '<br>');

        // Highlight Score if found
        if (isAI && formattedText.includes('RESUME STRENGTH SCORE:')) {
            formattedText = formattedText.replace(
                /RESUME STRENGTH SCORE: (\d+)\/100/,
                '<div class="alert alert-primary py-2 px-3 mb-3 border-0 rounded-3 d-inline-block fw-bold"><i class="bi bi-star-fill me-2 text-warning"></i>ATS Match Score: $1/100</div><br>'
            );
        }

        msgDiv.innerHTML = `
            ${isAI ? `
            <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px; flex-shrink: 0;">
                <i class="bi bi-robot"></i>
            </div>` : ''}
            <div class="message-bubble ${isAI ? 'bg-white shadow-sm' : 'bg-primary text-white shadow-sm'} p-3 rounded-4" style="max-width: 80%;">
                <div class="mb-0">${formattedText}</div>
            </div>
            ${!isAI ? `
            <div class="avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center ms-3" style="width: 40px; height: 40px; flex-shrink: 0;">
                <i class="bi bi-person-fill"></i>
            </div>` : ''}
        `;

        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    const generateAIResponse = async (userPrompt) => {
        if (!GROQ_API_KEY || GROQ_API_KEY.startsWith("YOUR_")) {
            return "AI Error: Groq API key is missing or invalid in `js/ai-mentor.js`.";
        }

        const systemContext = `
            You are an expert AI Career Mentor for VidyaGuide. 
            User Profile:
            - Name: ${profile.name || 'Student'}
            - Education: ${profile.educationLevel || 'Not specified'}
            - Branch: ${profile.course || 'Not specified'}
            - Skills: ${profile.skills || 'Not specified'}
            - Goals: ${profile.careerGoal || 'Not specified'}
            - Primary Interest: ${profile.primaryGoal || 'Career Advice'}

            Guidelines:
            1. Provide practical, actionable advice.
            2. Suggest specific skills, tools, or courses.
            3. Be encouraging and professional.
            4. Keep responses concise but comprehensive.
            5. Use formatting like bullet points for clarity.
        `;

        try {
            const response = await fetch(GROQ_API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: GROQ_MODEL,
                    messages: [
                        { role: "system", content: systemContext },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Groq API Error:", errorData);
                return `Groq Error (${response.status}): ${errorData.error ? errorData.error.message : 'Unknown error'}`;
            }

            const data = await response.json();
            if (data.choices && data.choices[0].message.content) {
                return data.choices[0].message.content;
            } else {
                throw new Error("Empty response from Groq");
            }
        } catch (error) {
            console.error("AI Mentor Fetch Error:", error);
            return "Connection Error: Please check your internet and Groq API status.";
        }
    };

    const handleSend = async () => {
        const prompt = userInput.value.trim();
        if (!prompt) return;

        appendMessage('user', prompt);
        userInput.value = '';

        // Typing indicator
        const loadingMsg = "Typing...";
        appendMessage('ai', loadingMsg);
        const lastMsg = chatWindow.lastElementChild.querySelector('p');

        const aiResponse = await generateAIResponse(prompt);
        lastMsg.innerHTML = aiResponse.replace(/\n/g, '<br>'); // Use innerHTML for formatting
    };

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Global function for Sidebar actions
    window.suggestAction = async (action) => {
        console.log("Action suggested:", action); // Debug log
        let prompt = "";
        switch (action) {
            case 'career-roadmap':
                prompt = `Based on my background in ${profile.course || 'my field'} and goal to be a ${profile.careerGoal || 'professional'}, create a detailed step-by-step career roadmap from Beginner to Advanced levels.`;
                break;
            case 'skills-assessment':
                prompt = `Based on my branch (${profile.course || 'N/A'}) and skills (${profile.skills || 'N/A'}), conduct a quick personality and skills assessment.`;
                break;
            case 'skill-gap':
                prompt = `Analyze my current skills for a ${profile.careerGoal || 'role in my field'} and identify critical gaps.`;
                break;
            case 'course-recs':
                prompt = `Recommend 3 specific online courses for someone in ${profile.course || 'my field'} interested in ${profile.careerGoal || 'career growth'}.`;
                break;
            case 'interview-prep':
                prompt = `Give me 5 common interview questions and expert answers for a ${profile.careerGoal || profile.course || 'job in my field'} position.`;
                break;
            case 'resume-review':
                const resumeData = Storage.load('resumeData') || {};
                const resumeText = `
Name: ${resumeData.name || profile.name || 'Not provided'}
Education: ${resumeData.education || 'Not provided'}
Skills: ${resumeData.skills || 'Not provided'}
Summary/Goal: ${resumeData.goal || profile.careerGoal || 'Not provided'}
Interests: ${resumeData.interests || 'Not provided'}
                `.trim();

                const jobRole = profile.careerGoal || "a professional in my field";

                prompt = `
Act as a professional resume reviewer. 

CRITICAL: Start your response with exactly this line: "RESUME STRENGTH SCORE: [Score]/100" (replace [Score] with your assessment).

Your goal is to help a student reach their career milestone: "${jobRole}".
Analyze the student's Career Goal and the provided resume. 

Provide the following 3-part response:

1. **Optimized Resume (ATS-friendly rewrite)**
   - Rewrite the existing resume content to be professional and clear.
   - Strengthen bullet points using strong action verbs (e.g., "Developed", "Engineered", "Coordinated").
   - Highlight measurable outcomes or potential impacts where possible.
   - Optimize keywords for ATS systems relevant to "${jobRole}".

2. **Suggestions for Improvement**
   - Specific bullet point improvements based on current content.
   - Missing keywords that are essential for "${jobRole}".
   - Clarity & formatting tips for a cleaner look.

3. **Career Goal Skill Roadmap (To reach "${jobRole}")**
   - **Skills you already have**: List relevant skills identified from the resume.
   - **Skills you need to learn**: 
     - Required technical skills
     - Important soft skills
     - Tools / technologies to learn
   - **Skill Gaps**: Specific gaps between the current resume and the career goal.
   - **Priority Learning Order**: A simple step-by-step path (Beginner → Advanced).

Maintain the original meaning of the student's experience. Do not invent fake certifications or jobs. Keep the tone simple, professional, and student-friendly.

Resume Content:
${resumeText}
                `.trim();
                break;
        }
        if (prompt) {
            userInput.value = prompt;
            handleSend();
        }
    };
});
