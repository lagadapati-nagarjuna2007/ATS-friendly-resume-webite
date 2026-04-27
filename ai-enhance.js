// ============================================
// AI ENHANCE — calls /api/ai-enhance (server proxy)
// API key is stored in .env — never exposed here
// ============================================

// All AI calls go through your own backend now
const AI_PROXY_URL = '/api/ai-enhance';
const GROQ_MODEL = 'openai/gpt-oss-120b';

// ===== CALL SERVER PROXY (replaces direct Groq call) =====
async function callGroq(systemPrompt, userPrompt) {
    const response = await fetch(AI_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: GROQ_MODEL,
            systemPrompt,
            userPrompt
        })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
}

// ===== PARSE JSON SAFELY =====
function parseGroqJSON(text) {
    try {
        const clean = text.replace(/```json|```/g, '').trim();
        const start = clean.indexOf('{');
        const end = clean.lastIndexOf('}');
        if (start === -1 || end === -1) return null;
        return JSON.parse(clean.slice(start, end + 1));
    } catch (e) { return null; }
}

const AI_SYSTEM_PROMPT = `You are an expert ATS resume consultant who writes in a NATURAL, HUMANIZED tone. Your job is to analyze resume content and provide specific improvements that sound like a real person wrote them — not a robot.

CRITICAL WRITING STYLE RULES:
1. Write in a natural, conversational-professional tone — avoid stiff, robotic, or overly formal language
2. Vary sentence structure — mix short and long sentences, avoid starting every sentence the same way
3. Use authentic, specific language — avoid generic buzzwords like "dynamic", "synergy", "leverage"
4. Sound like a confident professional describing their own work, not a template
5. Avoid cliché phrases like "results-driven professional" or "proven track record" — use fresh, specific wording
6. Each piece of text should feel unique and personal to the candidate, not cookie-cutter

CRITICAL FORMATTING RULES — follow these strictly for every response:
1. Every description, objective, summary, or responsibility section must be COMPLETE — never truncate or cut mid-sentence
2. Career Objective: exactly 2-3 complete sentences, fully written out
3. Professional Summary: exactly 3-4 complete sentences, fully written out
4. Each bullet point: 1 complete sentence starting with an action verb — never cut off
5. All text must be 100% complete with no "..." or trailing off
6. Never use placeholder text or incomplete thoughts

Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

// ===== MODAL UI =====
function createAIModal() {
    if (document.getElementById('ai-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'ai-modal';
    modal.innerHTML = `
        <div class="ai-modal-backdrop" onclick="closeAIModal()"></div>
        <div class="ai-modal-box">
            <div class="ai-modal-header">
                <div class="ai-modal-title">
                    <div class="ai-sparkle-icon">✦</div>
                    <span id="ai-modal-section-name">AI Resume Enhancer</span>
                    <span class="ai-powered-badge">Groq · Llama 3.3 70B</span>
                </div>
                <button class="ai-modal-close" onclick="closeAIModal()">✕</button>
            </div>
            <div class="ai-modal-body" id="ai-modal-body">
                <div class="ai-loading" id="ai-loading">
                    <div class="ai-spinner"></div>
                    <p id="ai-loading-text">Analyzing your content...</p>
                    <small>Groq AI is reviewing for ATS issues</small>
                </div>
                <div class="ai-result" id="ai-result" style="display:none"></div>
            </div>
            <div class="ai-modal-footer" id="ai-modal-footer" style="display:none">
                <button class="btn btn-secondary btn-sm" onclick="closeAIModal()">Close</button>
                <button class="btn btn-primary btn-sm" id="ai-apply-btn" onclick="applyAIChanges()">✓ Apply All Changes</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function openAIModal(sectionName, loadingText) {
    createAIModal();
    document.getElementById('ai-modal-section-name').textContent = sectionName;
    document.getElementById('ai-loading-text').textContent = loadingText || 'Analyzing your content...';
    document.getElementById('ai-loading').style.display = 'flex';
    document.getElementById('ai-result').style.display = 'none';
    document.getElementById('ai-modal-footer').style.display = 'none';
    document.getElementById('ai-modal').classList.add('open');
    window._pendingAIChanges = null;
}

function closeAIModal() {
    const modal = document.getElementById('ai-modal');
    if (modal) modal.classList.remove('open');
    window._pendingAIChanges = null;
}

function renderAIResult(analysis) {
    const resultEl = document.getElementById('ai-result');
    const footerEl = document.getElementById('ai-modal-footer');
    document.getElementById('ai-loading').style.display = 'none';
    resultEl.style.display = 'block';
    footerEl.style.display = 'flex';

    if (analysis.status === 'good') {
        resultEl.innerHTML = `
            <div class="ai-all-good">
                <div class="ai-good-icon">✅</div>
                <h3>All Good!</h3>
                <p>${analysis.message || 'This section is ATS-friendly and looks great!'}</p>
            </div>`;
        document.getElementById('ai-apply-btn').style.display = 'none';
    } else {
        let html = '';
        if (analysis.issues && analysis.issues.length) {
            html += `<div class="ai-issues-box">
                <h4 class="ai-box-title warn">⚠ Issues Found</h4>
                <ul class="ai-issues-list">
                    ${analysis.issues.map(i => `<li>${i}</li>`).join('')}
                </ul>
            </div>`;
        }
        if (analysis.changes && analysis.changes.length) {
            html += `<div class="ai-changes-box">
                <h4 class="ai-box-title success">✦ AI Enhancements Ready</h4>
                <div class="ai-change-list">
                    ${analysis.changes.map(c => `
                        <div class="ai-change-item">
                            <div class="ai-change-field-name">📝 ${c.field}</div>
                            <div class="ai-change-before">
                                <span class="ai-label before-label">Before</span>
                                <span class="ai-change-text">${c.before ? c.before.replace(/\n/g, '<br>') : '<em class="ai-empty">Empty</em>'}</span>
                            </div>
                            <div class="ai-change-arrow">↓ AI Enhanced</div>
                            <div class="ai-change-after">
                                <span class="ai-label after-label">After</span>
                                <span class="ai-change-text">${c.after ? c.after.replace(/\n/g, '<br>') : ''}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
            document.getElementById('ai-apply-btn').style.display = 'inline-flex';
        } else {
            document.getElementById('ai-apply-btn').style.display = 'none';
        }
        resultEl.innerHTML = html;
    }
}

function showAIError(msg) {
    document.getElementById('ai-loading').style.display = 'none';
    document.getElementById('ai-result').style.display = 'block';
    document.getElementById('ai-result').innerHTML = `
        <div class="ai-error-box">
            <div class="ai-error-icon">⚠</div>
            <h4>Something went wrong</h4>
            <p>${msg}</p>
            <p class="ai-error-hint">Make sure <code>GROQ_API_KEY</code> is set in your <code>.env</code> file and the server is running.<br>Get a free key at <a href="https://console.groq.com" target="_blank">console.groq.com</a></p>
        </div>`;
    document.getElementById('ai-modal-footer').style.display = 'flex';
    document.getElementById('ai-apply-btn').style.display = 'none';
}

// ===== APPLY CHANGES =====
function applyAIChanges() {
    const changes = window._pendingAIChanges;
    if (!changes || !changes.length) { closeAIModal(); return; }
    let applied = 0;
    changes.forEach(c => {
        let el = null;
        if (c.id) el = document.getElementById(c.id);
        else if (c.selector) el = document.querySelector(c.selector);
        if (el && c.after) {
            el.value = c.after;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            applied++;
        }
    });
    closeAIModal();
    if (typeof updateResumePreview === 'function') updateResumePreview();
    showToast(`✦ ${applied} AI enhancement${applied !== 1 ? 's' : ''} applied successfully!`);
}

function showToast(msg) {
    let t = document.getElementById('ai-toast');
    if (!t) { t = document.createElement('div'); t.id = 'ai-toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

function setBtnLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
        btn.dataset.orig = btn.innerHTML;
        btn.innerHTML = '<span class="ai-btn-spinner"></span> Analyzing...';
        btn.disabled = true;
    } else {
        btn.innerHTML = btn.dataset.orig || '✦ AI Enhance';
        btn.disabled = false;
    }
}

// checkKey() no longer needed (key is on server), kept as no-op for compatibility
function checkKey() { return true; }

// ============================================
// STEP 1 — Personal Information
// ============================================
async function aiEnhancePersonal(btn) {
    setBtnLoading(btn, true);
    openAIModal('Personal Information', 'Checking contact details for ATS issues...');
    const fields = {
        fullName: document.getElementById('fullName')?.value?.trim() || '',
        email: document.getElementById('email')?.value?.trim() || '',
        phone: document.getElementById('phone')?.value?.trim() || '',
        linkedin: document.getElementById('linkedin')?.value?.trim() || '',
        github: document.getElementById('github')?.value?.trim() || '',
        city: document.getElementById('city')?.value?.trim() || '',
        languages: document.getElementById('languages')?.value?.trim() || '',
        hobbies: document.getElementById('hobbies')?.value?.trim() || '',
    };
    const prompt = `Analyze this resume personal information for ATS issues and fix them.

Data: ${JSON.stringify(fields)}

Check:
1. fullName: must have first and last name, properly capitalized
2. email: valid format, professional
3. phone: format as +91-XXXXX-XXXXX or (XXX) XXX-XXXX
4. linkedin: must start with https://linkedin.com/in/ — fix if missing https or wrong format
5. github: must start with https://github.com/ — fix if missing https or wrong format  
6. city: should be "City, State" format, properly capitalized
7. languages: comma-separated, each language capitalized
8. hobbies: professional, comma-separated, properly capitalized

Respond ONLY with this exact JSON:
{
  "status": "good",
  "message": "short encouraging message",
  "issues": [],
  "changes": []
}

OR if issues found:
{
  "status": "issues",
  "message": "",
  "issues": ["specific issue 1", "specific issue 2"],
  "changes": [
    { "field": "Human readable field name", "id": "html_id", "before": "original value", "after": "fixed value" }
  ]
}

Valid HTML ids: fullName, email, phone, linkedin, github, city, languages, hobbies
Only add to changes[] if field truly needs fixing. Never invent data.`;

    try {
        const raw = await callGroq(AI_SYSTEM_PROMPT, prompt);
        const analysis = parseGroqJSON(raw);
        if (!analysis) { showAIError('Could not parse AI response. Please try again.'); return; }
        window._pendingAIChanges = analysis.changes || [];
        renderAIResult(analysis);
    } catch (e) { showAIError(e.message); }
    finally { setBtnLoading(btn, false); }
}

// ============================================
// STEP 2 — Career Objective & Summary
// ============================================
async function aiEnhanceObjective(btn) {
    setBtnLoading(btn, true);
    openAIModal('Career Objective & Summary', 'Enhancing for ATS keyword density...');
    const objective = document.getElementById('objective')?.value?.trim() || '';
    const summary = document.getElementById('summary')?.value?.trim() || '';
    const name = document.getElementById('fullName')?.value?.trim() || '';
    const skills = document.getElementById('skillLanguages')?.value?.trim() || '';

    const prompt = `Analyze and enhance this career objective and professional summary for maximum ATS score while keeping a NATURAL, HUMANIZED tone.

Name: ${name}
Known skills: ${skills}
Career Objective: "${objective}"
Professional Summary: "${summary}"

WRITING STYLE — THIS IS CRITICAL:
- Write like a real person, NOT a template or AI. The text should sound authentic and personal
- AVOID generic clichés: "results-driven", "highly motivated", "proven track record", "dynamic professional", "leveraging expertise"
- Instead use natural phrases: "I enjoy building...", "With X years of experience in...", "I focus on...", "My background in X has given me..."
- Vary sentence starters — do NOT begin every sentence with the same structure
- Be specific: mention actual technologies, real project types, and concrete goals
- Sound confident but genuine, like someone talking about their career in a professional setting

STRICT LENGTH AND COMPLETENESS RULES:
- Career Objective: Write EXACTLY 2-3 complete sentences. Every sentence must be fully written — no cutting off
- Professional Summary: Write EXACTLY 3-4 complete sentences. Every sentence must be fully written — no cutting off
- Each sentence must be complete with a subject, verb, and object
- Must mention specific job role, 2-3 technical skills by name, and measurable experience
- Active voice only, no vague phrases like "hardworking" or "team player"
- If empty or generic placeholder, write a strong professional version using available info
- NEVER produce incomplete or truncated text

Respond ONLY with JSON:
{
  "status": "good" or "issues",
  "message": "if good, short encouragement",
  "issues": ["ATS issue 1", "ATS issue 2"],
  "changes": [
    { "field": "Career Objective", "id": "objective", "before": "original", "after": "COMPLETE 2-3 sentence enhanced version — natural tone, fully written, no truncation" },
    { "field": "Professional Summary", "id": "summary", "before": "original", "after": "COMPLETE 3-4 sentence enhanced version — natural tone, fully written, no truncation" }
  ]
}
Only include a field in changes if it needs improvement.`;

    try {
        const raw = await callGroq(AI_SYSTEM_PROMPT, prompt);
        const analysis = parseGroqJSON(raw);
        if (!analysis) { showAIError('Could not parse AI response. Please try again.'); return; }
        window._pendingAIChanges = analysis.changes || [];
        renderAIResult(analysis);
    } catch (e) { showAIError(e.message); }
    finally { setBtnLoading(btn, false); }
}

// ============================================
// STEP 3 — Education
// ============================================
async function aiEnhanceEducation(btn) {
    setBtnLoading(btn, true);
    openAIModal('Education', 'Checking degree names for ATS parsing...');
    const items = [];
    document.querySelectorAll('#education-list .repeater-item').forEach((item, i) => {
        items.push({
            index: i,
            degree: item.querySelector('.edu-degree')?.value?.trim() || '',
            university: item.querySelector('.edu-university')?.value?.trim() || '',
            cgpa: item.querySelector('.edu-cgpa')?.value?.trim() || '',
            courses: item.querySelector('.edu-courses')?.value?.trim() || '',
        });
    });

    const prompt = `Analyze education entries for ATS optimization.

Entries: ${JSON.stringify(items)}

ATS rules:
- Spell out degrees fully: "Bachelor of Technology in Computer Science" NOT "B.Tech CSE"
- "Master of Science" NOT "M.Sc", "Master of Business Administration" NOT "MBA"  
- "Bachelor of Commerce" NOT "B.Com", "Bachelor of Science" NOT "B.Sc"
- CGPA: "8.5/10" or "85%" — clear format required
- Full university official names, properly capitalized
- Courses: full names comma-separated

CSS selectors (N = index+1):
- "#education-list .repeater-item:nth-child(N) .edu-degree"
- "#education-list .repeater-item:nth-child(N) .edu-university"  
- "#education-list .repeater-item:nth-child(N) .edu-cgpa"
- "#education-list .repeater-item:nth-child(N) .edu-courses"

Respond ONLY with JSON:
{
  "status": "good" or "issues",
  "message": "if good",
  "issues": ["issues"],
  "changes": [
    { "field": "Education #1 — Degree", "selector": "CSS_SELECTOR_HERE", "before": "old", "after": "improved" }
  ]
}`;

    try {
        const raw = await callGroq(AI_SYSTEM_PROMPT, prompt);
        const analysis = parseGroqJSON(raw);
        if (!analysis) { showAIError('Could not parse AI response. Please try again.'); return; }
        window._pendingAIChanges = analysis.changes || [];
        renderAIResult(analysis);
    } catch (e) { showAIError(e.message); }
    finally { setBtnLoading(btn, false); }
}

// ============================================
// STEP 4 — Technical Skills
// ============================================
async function aiEnhanceSkills(btn) {
    setBtnLoading(btn, true);
    openAIModal('Technical Skills', 'Optimizing skill keywords for ATS...');
    const skills = {
        skillLanguages: document.getElementById('skillLanguages')?.value?.trim() || '',
        skillWeb: document.getElementById('skillWeb')?.value?.trim() || '',
        skillDB: document.getElementById('skillDB')?.value?.trim() || '',
        skillTools: document.getElementById('skillTools')?.value?.trim() || '',
        skillConcepts: document.getElementById('skillConcepts')?.value?.trim() || '',
    };

    const prompt = `Analyze technical skills section for ATS keyword optimization.

Skills: ${JSON.stringify(skills)}

ATS rules:
- Official capitalization: "JavaScript" not "JS" or "javascript", "Python" not "python"
- "Node.js" not "nodejs" or "node", "React.js" not "reactjs"
- "MongoDB" not "mongodb", "MySQL" not "mysql", "PostgreSQL" not "postgresql"
- "GitHub" not "github", "VS Code" not "vscode"
- Expand acronyms: "Object-Oriented Programming (OOP)" not just "OOP"
- "Data Structures and Algorithms (DSA)", "RESTful APIs" not just "REST"
- Comma-space separated, no duplicates across fields

Respond ONLY with JSON:
{
  "status": "good" or "issues",
  "message": "if good",
  "issues": ["ATS issues"],
  "changes": [
    { "field": "Programming Languages", "id": "skillLanguages", "before": "old", "after": "corrected" },
    { "field": "Web / Backend", "id": "skillWeb", "before": "old", "after": "corrected" },
    { "field": "Databases", "id": "skillDB", "before": "old", "after": "corrected" },
    { "field": "Tools & Platforms", "id": "skillTools", "before": "old", "after": "corrected" },
    { "field": "Concepts", "id": "skillConcepts", "before": "old", "after": "corrected" }
  ]
}
Only include fields that need fixing.`;

    try {
        const raw = await callGroq(AI_SYSTEM_PROMPT, prompt);
        const analysis = parseGroqJSON(raw);
        if (!analysis) { showAIError('Could not parse AI response. Please try again.'); return; }
        window._pendingAIChanges = analysis.changes || [];
        renderAIResult(analysis);
    } catch (e) { showAIError(e.message); }
    finally { setBtnLoading(btn, false); }
}

// ============================================
// STEP 5 — Projects
// ============================================
async function aiEnhanceProjects(btn) {
    setBtnLoading(btn, true);
    openAIModal('Projects', 'Enhancing bullet points with action verbs...');
    const items = [];
    document.querySelectorAll('#projects-list .repeater-item').forEach((item, i) => {
        items.push({
            index: i,
            title: item.querySelector('.proj-title')?.value?.trim() || '',
            tech: item.querySelector('.proj-tech')?.value?.trim() || '',
            desc: item.querySelector('.proj-desc')?.value?.trim() || '',
        });
    });

    const prompt = `Analyze project descriptions for ATS bullet point optimization. Write in a NATURAL, HUMANIZED tone.

Projects: ${JSON.stringify(items)}

WRITING STYLE:
- Write bullets that sound like a real developer describing their work, not a template
- Vary the action verbs — don't repeat the same verb across bullets
- Be specific about what was built and why it matters
- Keep bullet text SHORT and CONCISE — maximum 15-18 words per bullet. This is critical for PDF rendering
- Avoid overly long compound sentences. One clear action + one clear result per bullet

STRICT RULES — every bullet must be 100% complete:
- Every single bullet MUST start with a strong action verb: Built, Developed, Implemented, Designed, Optimized, Deployed, Integrated, Automated, Engineered, Reduced, Improved, Created, Launched, Architected
- Every bullet must be ONE complete sentence — subject + action + result — NEVER cut off mid-sentence
- Quantify results with real numbers: "reduced load time by 40%" not "improved performance"
- Mention specific technologies in each bullet
- No weak starts: "Helped", "Assisted", "Was responsible for", "Worked on"
- No passive voice, no incomplete sentences, no "..." at the end
- Format: one complete bullet per line, each starts with action verb

CSS selectors (N = index+1):
- desc: "#projects-list .repeater-item:nth-child(N) .proj-desc"
- tech: "#projects-list .repeater-item:nth-child(N) .proj-tech"

Respond ONLY with JSON:
{
  "status": "good" or "issues",
  "message": "if good",
  "issues": ["issues"],
  "changes": [
    { "field": "Project #1 — Description", "selector": "CSS_SELECTOR", "before": "original", "after": "complete enhanced bullets, one per line, each fully written" }
  ]
}`;

    try {
        const raw = await callGroq(AI_SYSTEM_PROMPT, prompt);
        const analysis = parseGroqJSON(raw);
        if (!analysis) { showAIError('Could not parse AI response. Please try again.'); return; }
        window._pendingAIChanges = analysis.changes || [];
        renderAIResult(analysis);
    } catch (e) { showAIError(e.message); }
    finally { setBtnLoading(btn, false); }
}

// ============================================
// STEP 6 — Experience
// ============================================
async function aiEnhanceExperience(btn) {
    setBtnLoading(btn, true);
    openAIModal('Work Experience', 'Rewriting with ATS action verbs and metrics...');
    const items = [];
    document.querySelectorAll('#experience-list .repeater-item').forEach((item, i) => {
        items.push({
            index: i,
            title: item.querySelector('.exp-title')?.value?.trim() || '',
            company: item.querySelector('.exp-company')?.value?.trim() || '',
            desc: item.querySelector('.exp-desc')?.value?.trim() || '',
        });
    });

    const prompt = `Analyze work experience entries for ATS optimization. This is the most critical resume section. Write in a NATURAL, HUMANIZED tone.

Experience: ${JSON.stringify(items)}

WRITING STYLE:
- Write like a real professional describing their work achievements, not a template
- Vary the action verbs — never repeat the same verb in consecutive bullets
- Be specific and authentic — avoid corporate jargon and buzzwords
- Keep bullet text SHORT and CONCISE — maximum 15-18 words per bullet. This is critical for PDF rendering
- Avoid overly long compound sentences. One clear action + one clear result per bullet

STRICT RULES — every responsibility must be 100% complete:
- Every bullet MUST start with a past-tense action verb (past jobs) or present-tense (current): Developed, Built, Managed, Led, Designed, Optimized, Implemented, Delivered, Collaborated, Increased, Reduced, Automated, Engineered, Spearheaded
- Every bullet must be ONE complete sentence — action + task + result — NEVER truncate or cut off
- Quantify ALL results: exact numbers, percentages, team sizes, user counts, timeframes
- Mention specific technologies in every bullet
- Show real impact: "Served 150,000+ daily active users" not "built a website"  
- No passive voice, no vague language, no "responsible for", no incomplete sentences
- Each bullet is self-contained and fully meaningful — someone reading just that line understands the full achievement
- MAXIMUM 5-6 bullets per experience — each must be perfect and complete

CSS selectors (N = index+1):
- "#experience-list .repeater-item:nth-child(N) .exp-desc"
- "#experience-list .repeater-item:nth-child(N) .exp-title"

Respond ONLY with JSON:
{
  "status": "good" or "issues",
  "message": "if good",
  "issues": ["issues"],
  "changes": [
    { "field": "Experience #1 — Responsibilities", "selector": "CSS_SELECTOR", "before": "original", "after": "complete enhanced bullets, one per line, each fully written and complete" }
  ]
}`;

    try {
        const raw = await callGroq(AI_SYSTEM_PROMPT, prompt);
        const analysis = parseGroqJSON(raw);
        if (!analysis) { showAIError('Could not parse AI response. Please try again.'); return; }
        window._pendingAIChanges = analysis.changes || [];
        renderAIResult(analysis);
    } catch (e) { showAIError(e.message); }
    finally { setBtnLoading(btn, false); }
}

// ============================================
// STEP 7 — Certifications & Achievements
// ============================================
async function aiEnhanceExtras(btn) {
    setBtnLoading(btn, true);
    openAIModal('Certifications & Achievements', 'Checking ATS keyword signals...');
    const certs = [];
    document.querySelectorAll('#certifications-list .repeater-item').forEach((item, i) => {
        certs.push({ index: i, name: item.querySelector('.cert-name')?.value?.trim() || '', platform: item.querySelector('.cert-platform')?.value?.trim() || '', year: item.querySelector('.cert-year')?.value?.trim() || '' });
    });
    const achievements = [];
    document.querySelectorAll('#achievements-list .repeater-item').forEach((item, i) => {
        achievements.push({ index: i, desc: item.querySelector('.ach-desc')?.value?.trim() || '' });
    });

    const prompt = `Analyze certifications and achievements for ATS optimization.

Certifications: ${JSON.stringify(certs)}
Achievements: ${JSON.stringify(achievements)}

ATS rules:
- Cert names: exact official names — "AWS Certified Developer – Associate" not "AWS cert"
- Platform names properly capitalized: "Coursera", "Udemy", "NPTEL", "Google", "Microsoft", "Amazon Web Services"
- Year must be 4-digit
- Achievements: start with action verb, include specifics + scale: "Won 1st Place – XYZ Hackathon (Team of 4, 200+ participants), January 2024"
- No vague achievements like "participated in events"

CSS selectors (N = index+1):
- "#certifications-list .repeater-item:nth-child(N) .cert-name"
- "#certifications-list .repeater-item:nth-child(N) .cert-platform"
- "#certifications-list .repeater-item:nth-child(N) .cert-year"
- "#achievements-list .repeater-item:nth-child(N) .ach-desc"

Respond ONLY with JSON:
{
  "status": "good" or "issues",
  "message": "if good",
  "issues": ["issues"],
  "changes": [
    { "field": "Cert #1 — Name", "selector": "CSS_SELECTOR", "before": "original", "after": "corrected" }
  ]
}`;

    try {
        const raw = await callGroq(AI_SYSTEM_PROMPT, prompt);
        const analysis = parseGroqJSON(raw);
        if (!analysis) { showAIError('Could not parse AI response. Please try again.'); return; }
        window._pendingAIChanges = analysis.changes || [];
        renderAIResult(analysis);
    } catch (e) { showAIError(e.message); }
    finally { setBtnLoading(btn, false); }
}