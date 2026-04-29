// ============================================
// RESUME BUILDER - ATS UPGRADED CORE LOGIC
// ============================================

let currentStep = 1;
const totalSteps = 8;

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const ACTION_VERBS = ['built','developed','implemented','designed','created','optimized','deployed','integrated','automated','reduced','improved','managed','led','coordinated','delivered','launched','achieved','established','analyzed','maintained','collaborated','contributed','engineered','architected','configured','migrated','refactored','tested','documented','streamlined','enhanced','accelerated','increased','decreased','solved','resolved','supported','mentored','trained','presented'];

// ===== POPULATE YEAR DROPDOWNS =====
function populateYearDropdowns() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear + 2; y >= currentYear - 20; y--) years.push(y);

    document.querySelectorAll('.edu-year-from, .edu-year-to, .exp-year-from, .exp-year-to').forEach(sel => {
        const isTo = sel.classList.contains('edu-year-to') || sel.classList.contains('exp-year-to');
        const placeholder = isTo ? 'To Year' : 'From Year';
        sel.innerHTML = `<option value="">${placeholder}</option>`;
        if (isTo) sel.innerHTML += `<option value="Present">Present</option>`;
        years.forEach(y => sel.innerHTML += `<option value="${y}">${y}</option>`);
    });

    document.querySelectorAll('.proj-month-from, .proj-month-to').forEach(sel => {
        const isTo = sel.classList.contains('proj-month-to');
        sel.innerHTML = `<option value="">${isTo ? 'End' : 'Start'}</option>`;
        if (isTo) sel.innerHTML += `<option value="Present">Present</option>`;
        MONTHS.forEach(m => sel.innerHTML += `<option value="${m}">${m}</option>`);
        const currentYear2 = new Date().getFullYear();
        for (let y = currentYear2 - 1; y <= currentYear2 + 1; y++) {
            MONTHS.forEach(m => {
                // already added months; add year options inline — handled below
            });
        }
    });
}

// Month-Year dropdowns for projects
function populateMonthYearDropdown(sel, placeholder, includePresent) {
    const currentYear = new Date().getFullYear();
    sel.innerHTML = `<option value="">${placeholder}</option>`;
    if (includePresent) sel.innerHTML += `<option value="Present">Present</option>`;
    for (let y = currentYear + 1; y >= currentYear - 10; y--) {
        MONTHS.forEach(m => {
            sel.innerHTML += `<option value="${m} ${y}">${m} ${y}</option>`;
        });
    }
}

function initAllDateDropdowns() {
    // Education year dropdowns
    document.querySelectorAll('.edu-year-from').forEach(sel => {
        const currentYear = new Date().getFullYear();
        sel.innerHTML = '<option value="">From Year</option>';
        for (let y = currentYear + 2; y >= currentYear - 20; y--) sel.innerHTML += `<option value="${y}">${y}</option>`;
    });
    document.querySelectorAll('.edu-year-to').forEach(sel => {
        const currentYear = new Date().getFullYear();
        sel.innerHTML = '<option value="">To Year</option><option value="Present">Present</option>';
        for (let y = currentYear + 4; y >= currentYear - 20; y--) sel.innerHTML += `<option value="${y}">${y}</option>`;
    });

    // Experience dropdowns
    document.querySelectorAll('.exp-month-from, .exp-month-to').forEach(sel => {
        const isTo = sel.classList.contains('exp-month-to');
        sel.innerHTML = `<option value="">${isTo ? 'End Month' : 'Start Month'}</option>`;
        if (isTo) sel.innerHTML += `<option value="Present">Present</option>`;
        MONTHS.forEach(m => sel.innerHTML += `<option value="${m}">${m}</option>`);
    });
    document.querySelectorAll('.exp-year-from').forEach(sel => {
        const currentYear = new Date().getFullYear();
        sel.innerHTML = '<option value="">Start Year</option>';
        for (let y = currentYear + 1; y >= currentYear - 20; y--) sel.innerHTML += `<option value="${y}">${y}</option>`;
    });
    document.querySelectorAll('.exp-year-to').forEach(sel => {
        const currentYear = new Date().getFullYear();
        sel.innerHTML = '<option value="">End Year</option><option value="Present">Present</option>';
        for (let y = currentYear + 2; y >= currentYear - 20; y--) sel.innerHTML += `<option value="${y}">${y}</option>`;
    });

    // Project dropdowns
    document.querySelectorAll('.proj-month-from').forEach(sel => {
        populateMonthYearDropdown(sel, 'Start (Month Year)', false);
    });
    document.querySelectorAll('.proj-month-to').forEach(sel => {
        populateMonthYearDropdown(sel, 'End (Month Year)', true);
    });
}

// ===== STEP NAVIGATION =====
function goToStep(step) {
    if (step < 1 || step > totalSteps) return;
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
    document.querySelector(`.step-tab[data-step="${step}"]`).classList.add('active');
    for (let i = 1; i < step; i++) {
        document.querySelector(`.step-tab[data-step="${i}"]`).classList.add('completed');
    }
    currentStep = step;
    updateProgress();
    updateResumePreview();
    if (step === 8) updateATSScore();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    const pct = (currentStep / totalSteps) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';
}

document.querySelectorAll('.step-tab').forEach(tab => {
    tab.addEventListener('click', () => goToStep(parseInt(tab.dataset.step)));
});

// ===== REPEATER: ADD / REMOVE =====
function removeItem(btn) {
    const item = btn.closest('.repeater-item');
    const parent = item.parentElement;
    if (parent.children.length > 1) { item.remove(); renumberItems(parent); }
}

function renumberItems(container) {
    container.querySelectorAll('.repeater-item').forEach((item, i) => {
        item.dataset.index = i;
        const h4 = item.querySelector('.repeater-header h4');
        if (h4) {
            const base = h4.textContent.replace(/#\d+/, '').trim();
            h4.textContent = `${base} #${i + 1}`;
        }
    });
}

function createRepeaterItem(label, fields) {
    const div = document.createElement('div');
    div.className = 'repeater-item';
    div.innerHTML = `<div class="repeater-header"><h4>${label}</h4><button class="remove-btn" onclick="removeItem(this)" title="Remove">✕</button></div><div class="form-grid cols-2">${fields}</div>`;
    return div;
}

function addEducation() {
    const list = document.getElementById('education-list');
    const n = list.children.length + 1;
    const item = createRepeaterItem(`Education #${n}`, `
        <div class="form-group"><label>Degree / Class</label><input type="text" class="edu-degree" placeholder="Bachelor of Technology – Computer Science"></div>
        <div class="form-group"><label>University / School</label><input type="text" class="edu-university" placeholder="Your University Name"></div>
        <div class="form-group"><label>CGPA / Percentage</label><input type="text" class="edu-cgpa" placeholder="8.5 CGPA / 85%"></div>
        <div class="form-group"><label>Year Range</label><div class="date-range-row"><select class="edu-year-from"></select><span>–</span><select class="edu-year-to"></select></div></div>
        <div class="form-group full-width"><label>Relevant Courses</label><input type="text" class="edu-courses" placeholder="Data Structures, DBMS, OS"></div>
    `);
    list.appendChild(item);
    initAllDateDropdowns();
}

function addProject() {
    const list = document.getElementById('projects-list');
    const n = list.children.length + 1;
    const item = createRepeaterItem(`Project #${n}`, `
        <div class="form-group"><label>Project Title</label><input type="text" class="proj-title" placeholder="Project Title"></div>
        <div class="form-group"><label>Type</label><input type="text" class="proj-type" placeholder="Personal / Academic"></div>
        <div class="form-group"><label>Start</label><select class="proj-month-from"></select></div>
        <div class="form-group"><label>End</label><select class="proj-month-to"></select></div>
        <div class="form-group full-width"><label>Technologies Used</label><input type="text" class="proj-tech" placeholder="Technologies used"></div>
        <div class="form-group full-width"><label>Description (one per line)</label><textarea class="proj-desc" rows="3" placeholder="Built a REST API backend using Node.js&#10;Implemented authentication reducing login time by 40%"></textarea><span class="field-tip">Start each line with an action verb.</span></div>
    `);
    list.appendChild(item);
    initAllDateDropdowns();
}

function addExperience() {
    const list = document.getElementById('experience-list');
    const n = list.children.length + 1;
    const item = createRepeaterItem(`Experience #${n}`, `
        <div class="form-group"><label>Job Title</label><input type="text" class="exp-title" placeholder="Software Engineer Intern"></div>
        <div class="form-group"><label>Company Name</label><input type="text" class="exp-company" placeholder="Company Name"></div>
        <div class="form-group"><label>Start Month &amp; Year</label><div class="date-range-row"><select class="exp-month-from"></select><select class="exp-year-from"></select></div></div>
        <div class="form-group"><label>End Month &amp; Year</label><div class="date-range-row"><select class="exp-month-to"></select><select class="exp-year-to"></select></div></div>
        <div class="form-group"><label>Location</label><input type="text" class="exp-location" placeholder="City / Remote"></div>
        <div class="form-group full-width"><label>Responsibilities (one per line)</label><textarea class="exp-desc" rows="3" placeholder="Developed RESTful APIs reducing response time by 30%&#10;Implemented test suite increasing code coverage to 85%"></textarea><span class="field-tip">Start with an action verb. Quantify results.</span></div>
    `);
    list.appendChild(item);
    initAllDateDropdowns();
}

function addCertification() {
    const list = document.getElementById('certifications-list');
    const n = list.children.length + 1;
    const item = createRepeaterItem(`Certification #${n}`, `
        <div class="form-group"><label>Certification Name</label><input type="text" class="cert-name" placeholder="Course name"></div>
        <div class="form-group"><label>Platform</label><input type="text" class="cert-platform" placeholder="Coursera, NPTEL, Udemy"></div>
        <div class="form-group"><label>Year</label><input type="text" class="cert-year" placeholder="2024"></div>
    `);
    list.appendChild(item);
}

function addAchievement() {
    const list = document.getElementById('achievements-list');
    const n = list.children.length + 1;
    const div = document.createElement('div');
    div.className = 'repeater-item';
    div.innerHTML = `<div class="repeater-header"><h4>Achievement #${n}</h4><button class="remove-btn" onclick="removeItem(this)" title="Remove">✕</button></div><div class="form-grid"><div class="form-group full-width"><label>Description</label><input type="text" class="ach-desc" placeholder="Achievement description"></div></div>`;
    list.appendChild(div);
}

function addComputerSkill() {
    const list = document.getElementById('computer-skills-list');
    const n = list.children.length + 1;
    const div = document.createElement('div');
    div.className = 'repeater-item';
    div.innerHTML = `<div class="repeater-header"><h4>Skill #${n}</h4><button class="remove-btn" onclick="removeItem(this)" title="Remove">✕</button></div><div class="form-grid"><div class="form-group full-width"><label>Skill Description</label><input type="text" class="comp-skill" placeholder="Microsoft Office Suite (Word, Excel, PowerPoint)"></div></div>`;
    list.appendChild(div);
}

function addProfQual() {
    const list = document.getElementById('profqual-list');
    const n = list.children.length + 1;
    const item = createRepeaterItem(`Qualification #${n}`, `
        <div class="form-group"><label>Class/Degree</label><input type="text" class="pq-degree" placeholder="Degree"></div>
        <div class="form-group"><label>Board/University</label><input type="text" class="pq-board" placeholder="Board"></div>
        <div class="form-group"><label>Year</label><input type="text" class="pq-year" placeholder="Year"></div>
        <div class="form-group"><label>Division / Percentage</label><input type="text" class="pq-division" placeholder="First / 85%"></div>
    `);
    list.appendChild(item);
}

// ===== PREVIEW TOGGLE =====
function togglePreview() {
    const panel = document.getElementById('preview-panel');
    const formPanel = document.getElementById('form-panel');
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
        updateResumePreview();
        if (window.innerWidth >= 1200) formPanel.classList.remove('full-width');
    } else {
        if (window.innerWidth >= 1200) formPanel.classList.add('full-width');
    }
}

function showPreviewFinal() {
    const panel = document.getElementById('preview-panel');
    if (!panel.classList.contains('open')) togglePreview();
    updateResumePreview();
}

// ===== COLLECT FORM DATA =====
function getEduYear(item) {
    const from = item.querySelector('.edu-year-from')?.value || '';
    const to = item.querySelector('.edu-year-to')?.value || '';
    if (from && to) return `${from} – ${to}`;
    if (from) return from;
    if (to) return to;
    return (item.querySelector('.edu-year')?.value || '').trim();
}

function getProjDuration(item) {
    const from = item.querySelector('.proj-month-from')?.value || '';
    const to = item.querySelector('.proj-month-to')?.value || '';
    if (from && to) return `${from} – ${to}`;
    if (from) return from;
    if (to) return to;
    return (item.querySelector('.proj-duration')?.value || '').trim();
}

function getExpDuration(item) {
    const mf = item.querySelector('.exp-month-from')?.value || '';
    const yf = item.querySelector('.exp-year-from')?.value || '';
    const mt = item.querySelector('.exp-month-to')?.value || '';
    const yt = item.querySelector('.exp-year-to')?.value || '';
    const from = [mf, yf].filter(Boolean).join(' ');
    const to = mt === 'Present' ? 'Present' : [mt, yt].filter(Boolean).join(' ');
    if (from && to) return `${from} – ${to}`;
    if (from) return from;
    return (item.querySelector('.exp-duration')?.value || '').trim();
}

function collectData() {
    const val = id => (document.getElementById(id)?.value || '').trim();
    const data = {
        fullName: val('fullName'),
        email: val('email'),
        phone: val('phone'),
        linkedin: val('linkedin'),
        github: val('github'),
        city: val('city'),
        nationality: val('nationality'),
        languages: val('languages'),
        hobbies: val('hobbies'),
        objective: val('objective'),
        summary: val('summary'),
        skillLanguages: val('skillLanguages'),
        skillWeb: val('skillWeb'),
        skillDB: val('skillDB'),
        skillTools: val('skillTools'),
        skillConcepts: val('skillConcepts'),
        education: [],
        intermediate: { class: '', board: '', school: '', percentage: '', year: '' },
        tenth: { class: '', board: '', school: '', percentage: '', year: '' },
        polytechnic: { course: '', board: '', college: '', percentage: '', year: '' },
        projects: [],
        experience: [],
        certifications: [],
        achievements: [],
        computerSkills: [],
        profQualifications: []
    };

    document.querySelectorAll('#education-list .repeater-item').forEach(item => {
        const degree = item.querySelector('.edu-degree')?.value?.trim() || '';
        const university = item.querySelector('.edu-university')?.value?.trim() || '';
        const cgpa = item.querySelector('.edu-cgpa')?.value?.trim() || '';
        const year = getEduYear(item);
        const courses = item.querySelector('.edu-courses')?.value?.trim() || '';
        if (degree || university) data.education.push({ degree, university, cgpa, year, courses });
    });

    // Intermediate
    data.intermediate = {
        class: val('inter-class'),
        board: val('inter-board'),
        school: val('inter-school'),
        percentage: val('inter-percentage'),
        year: val('inter-year')
    };

    // 10th Class
    data.tenth = {
        class: val('tenth-class'),
        board: val('tenth-board'),
        school: val('tenth-school'),
        percentage: val('tenth-percentage'),
        year: val('tenth-year')
    };

    // Polytechnic
    data.polytechnic = {
        course: val('poly-course'),
        board: val('poly-board'),
        college: val('poly-college'),
        percentage: val('poly-percentage'),
        year: val('poly-year')
    };

    document.querySelectorAll('#projects-list .repeater-item').forEach(item => {
        const title = item.querySelector('.proj-title')?.value?.trim() || '';
        const type = item.querySelector('.proj-type')?.value?.trim() || '';
        const duration = getProjDuration(item);
        const tech = item.querySelector('.proj-tech')?.value?.trim() || '';
        const desc = item.querySelector('.proj-desc')?.value?.trim() || '';
        if (title) data.projects.push({ title, type, duration, tech, desc: desc.split('\n').filter(l => l.trim()) });
    });

    document.querySelectorAll('#experience-list .repeater-item').forEach(item => {
        const title = item.querySelector('.exp-title')?.value?.trim() || '';
        const company = item.querySelector('.exp-company')?.value?.trim() || '';
        const duration = getExpDuration(item);
        const location = item.querySelector('.exp-location')?.value?.trim() || '';
        const desc = item.querySelector('.exp-desc')?.value?.trim() || '';
        if (title || company) data.experience.push({ title, company, duration, location, desc: desc.split('\n').filter(l => l.trim()) });
    });

    document.querySelectorAll('#certifications-list .repeater-item').forEach(item => {
        const name = item.querySelector('.cert-name')?.value?.trim() || '';
        const platform = item.querySelector('.cert-platform')?.value?.trim() || '';
        const year = item.querySelector('.cert-year')?.value?.trim() || '';
        if (name) data.certifications.push({ name, platform, year });
    });

    document.querySelectorAll('#achievements-list .repeater-item').forEach(item => {
        const desc = item.querySelector('.ach-desc')?.value?.trim() || '';
        if (desc) data.achievements.push(desc);
    });

    document.querySelectorAll('#computer-skills-list .repeater-item').forEach(item => {
        const skill = item.querySelector('.comp-skill')?.value?.trim() || '';
        if (skill) data.computerSkills.push(skill);
    });

    document.querySelectorAll('#profqual-list .repeater-item').forEach(item => {
        const degree = item.querySelector('.pq-degree')?.value?.trim() || '';
        const board = item.querySelector('.pq-board')?.value?.trim() || '';
        const year = item.querySelector('.pq-year')?.value?.trim() || '';
        const division = item.querySelector('.pq-division')?.value?.trim() || '';
        if (degree) data.profQualifications.push({ degree, board, year, division });
    });

    return data;
}

// ===== ATS SCORE ENGINE =====
function computeATSScore(d) {
    let score = 0;
    const details = {};

    // 1. PDF text quality: always 20 (jsPDF)
    score += 20;

    // 2. Core sections present (20pts)
    let sectionScore = 0;
    if (d.fullName && d.email) sectionScore += 4;
    if (d.education.length > 0) sectionScore += 4;
    const hasSkills = d.skillLanguages || d.skillWeb || d.skillDB || d.skillTools || d.skillConcepts;
    if (hasSkills) sectionScore += 4;
    if (d.objective || d.summary) sectionScore += 4;
    if (d.projects.length > 0 || d.experience.length > 0) sectionScore += 4;
    score += sectionScore;
    details.sections = sectionScore;

    // 3. Date formatting (15pts) — check structured dropdowns were used
    let dateScore = 0;
    let dateCount = 0, dateValid = 0;
    d.education.forEach(e => { dateCount++; if (e.year && e.year.includes('–')) dateValid++; });
    d.experience.forEach(e => { dateCount++; if (e.duration && (e.duration.includes('–') || e.duration.includes('Present'))) dateValid++; });
    d.projects.forEach(p => { dateCount++; if (p.duration && (p.duration.includes('–') || p.duration.includes('Present'))) dateValid++; });
    if (dateCount === 0) dateScore = 10;
    else dateScore = Math.round((dateValid / dateCount) * 15);
    score += dateScore;
    details.dates = dateScore;

    // 4. Action verbs (15pts)
    let verbScore = 0;
    let bulletCount = 0, verbCount = 0;
    const allBullets = [
        ...d.projects.flatMap(p => p.desc),
        ...d.experience.flatMap(e => e.desc)
    ];
    allBullets.forEach(b => {
        bulletCount++;
        const firstWord = b.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g,'');
        if (ACTION_VERBS.includes(firstWord)) verbCount++;
    });
    if (bulletCount === 0) verbScore = 8;
    else verbScore = Math.min(15, Math.round((verbCount / bulletCount) * 15));
    score += verbScore;
    details.verbs = verbScore;

    // 5. Keyword match from job description (20pts)
    const jdText = (document.getElementById('job-description')?.value || '').toLowerCase();
    let keywordScore = 10; // base
    if (jdText.length > 50) {
        const resumeText = buildResumeText(d).toLowerCase();
        const jdWords = extractKeywords(jdText);
        if (jdWords.length > 0) {
            const matched = jdWords.filter(k => resumeText.includes(k)).length;
            keywordScore = Math.round((matched / jdWords.length) * 20);
        }
    }
    score += keywordScore;
    details.keywords = keywordScore;

    // 6. Contact completeness (10pts)
    let contactScore = 0;
    if (d.fullName) contactScore += 2;
    if (d.email) contactScore += 3;
    if (d.phone) contactScore += 2;
    if (d.linkedin) contactScore += 2;
    if (d.city) contactScore += 1;
    score += contactScore;
    details.contact = contactScore;

    return { score: Math.min(100, score), details };
}

function buildResumeText(d) {
    return [
        d.fullName, d.email, d.phone, d.city,
        d.objective, d.summary,
        d.skillLanguages, d.skillWeb, d.skillDB, d.skillTools, d.skillConcepts,
        ...d.education.map(e => `${e.degree} ${e.university} ${e.courses}`),
        d.intermediate ? `${d.intermediate.class} ${d.intermediate.board} ${d.intermediate.school}` : '',
        d.tenth ? `${d.tenth.class} ${d.tenth.board} ${d.tenth.school}` : '',
        d.polytechnic ? `${d.polytechnic.course} ${d.polytechnic.board} ${d.polytechnic.college}` : '',
        ...d.projects.map(p => `${p.title} ${p.type} ${p.tech} ${p.desc.join(' ')}`),
        ...d.experience.map(e => `${e.title} ${e.company} ${e.desc.join(' ')}`),
        ...d.certifications.map(c => `${c.name} ${c.platform}`),
        ...d.achievements,
        ...d.computerSkills
    ].join(' ');
}

function extractKeywords(text) {
    const stopWords = new Set(['the','and','or','a','an','in','on','at','to','for','of','with','by','from','as','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','this','that','these','those','it','its','we','you','he','she','they','their','our','your','which','who','whom','what','when','where','how','if','while','but','so','yet','both','either','not','no','nor','just','than','then','more','most','some','any','all','each','every','other','such','into','through','during','before','after','above','below','between','out','about','up','down','off','over','under','again','further','once','here','there','why','because','although','though','however','therefore','thus','hence','consequently','furthermore','moreover','additionally','also','too','very','much','many','few','little','own','same','different','similar','including','included','except','without','within','along','following','across','behind','beyond','plus','except','up','out','around','upon','together','throughout','alongside','among','beside','against','towards','toward']);
    const words = text.match(/\b[a-z][a-z.+#]{2,}\b/g) || [];
    const freq = {};
    words.forEach(w => { if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1; });
    return Object.entries(freq).filter(([, v]) => v >= 2).sort((a,b) => b[1]-a[1]).slice(0,40).map(([k]) => k);
}

function updateATSScore() {
    const d = collectData();
    const { score, details } = computeATSScore(d);

    // Update ring
    const ring = document.getElementById('ats-ring-fill');
    const circumference = 213.6;
    if (ring) {
        const offset = circumference - (score / 100) * circumference;
        ring.style.strokeDashoffset = offset;
        ring.style.stroke = score >= 85 ? '#059669' : score >= 70 ? '#d97706' : '#dc2626';
    }

    const numEl = document.getElementById('ats-score-num');
    if (numEl) numEl.textContent = score;

    const labelEl = document.getElementById('ats-score-label');
    if (labelEl) {
        if (score >= 90) { labelEl.textContent = '🎉 Excellent — ATS Ready!'; labelEl.style.color = '#059669'; }
        else if (score >= 75) { labelEl.textContent = '✅ Good — Almost There'; labelEl.style.color = '#d97706'; }
        else { labelEl.textContent = '⚠ Needs Improvement'; labelEl.style.color = '#dc2626'; }
    }

    // Factor breakdown
    function setFactor(id, val, max, label) {
        const el = document.getElementById(id);
        if (!el) return;
        const pct = Math.round((val / max) * 100);
        el.textContent = `${val}/${max}`;
        el.className = 'ats-factor-val ' + (pct >= 75 ? 'pass' : pct >= 40 ? 'warn' : 'fail');
    }

    setFactor('af-sections', details.sections, 20);
    setFactor('af-dates', details.dates, 15);
    setFactor('af-verbs', details.verbs, 15);
    setFactor('af-keywords', details.keywords, 20);
    setFactor('af-contact', details.contact, 10);

    // Update navbar pill
    const pillScore = document.getElementById('ats-pill-score');
    if (pillScore) {
        pillScore.textContent = score;
        pillScore.className = 'ats-pill-score ' + (score >= 85 ? 'good' : score >= 70 ? 'warn' : 'poor');
    }

    return score;
}

// ===== KEYWORD ANALYZER =====
function analyzeKeywords() {
    const d = collectData();
    const jdText = (document.getElementById('job-description')?.value || '').toLowerCase();
    if (!jdText.trim()) { alert('Please paste a job description first.'); return; }

    const resumeText = buildResumeText(d).toLowerCase();
    const keywords = extractKeywords(jdText);

    const found = keywords.filter(k => resumeText.includes(k));
    const missing = keywords.filter(k => !resumeText.includes(k));

    const resultsDiv = document.getElementById('keyword-results');
    const foundList = document.getElementById('kw-found-list');
    const missingList = document.getElementById('kw-missing-list');

    foundList.innerHTML = found.map(k => `<span class="kw-tag found">${k}</span>`).join('') || '<span style="font-size:13px;color:var(--text-muted)">None found yet</span>';
    missingList.innerHTML = missing.slice(0,25).map(k => `<span class="kw-tag missing">${k}</span>`).join('') || '<span style="font-size:13px;color:var(--text-muted)">All keywords found!</span>';

    resultsDiv.style.display = 'grid';
    updateATSScore();
}

// ===== RENDER RESUME PREVIEW =====
function updateResumePreview() {
    const d = collectData();
    const page = document.getElementById('resume-page');

    if (!d.fullName && !d.email) {
        page.innerHTML = `<div class="resume-placeholder"><svg width="64" height="64" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.5"/><path d="M14 2v6h6" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="17" x2="13" y2="17" stroke="currentColor" stroke-width="1.5"/></svg><h3>Your Resume Preview</h3><p>Start filling the form to see your resume here</p></div>`;
        return;
    }

    let contactParts = [];
    if (d.email) contactParts.push(d.email);
    if (d.phone) contactParts.push(d.phone);
    if (d.linkedin) contactParts.push(`LinkedIn: ${d.linkedin}`);
    if (d.github) contactParts.push(`GitHub: ${d.github}`);

    let html = `<h1 class="r-name">${d.fullName || 'Your Full Name'}</h1>`;
    if (contactParts.length) html += `<p class="r-contact">${contactParts.join(' | ')}</p>`;
    if (d.city) html += `<p class="r-city">${d.city}</p>`;
    html += `<hr class="r-divider">`;

    if (d.objective) { html += `<h2 class="r-section-title">Career Objective</h2><p class="r-objective">${d.objective}</p>`; }
    if (d.summary) { html += `<h2 class="r-section-title">Professional Summary</h2><p class="r-summary-text">${d.summary}</p>`; }

    if (d.education.length || (d.intermediate && d.intermediate.board) || (d.tenth && d.tenth.board) || (d.polytechnic && d.polytechnic.board)) {
        html += `<h2 class="r-section-title">Education</h2>`;
        d.education.forEach(e => {
            html += `<div class="r-edu-item"><div class="r-edu-row"><span class="r-edu-degree">${e.degree}${e.university ? ' — ' + e.university : ''}</span><span class="r-edu-year">${e.year}</span></div><div class="r-edu-details">${e.cgpa ? 'CGPA/Percentage: ' + e.cgpa : ''}${e.courses ? (e.cgpa ? ' | ' : '') + 'Relevant Courses: ' + e.courses : ''}</div></div>`;
        });

        // Intermediate
        if (d.intermediate && d.intermediate.board) {
            html += `<div class="r-edu-item"><div class="r-edu-row"><span class="r-edu-degree">${d.intermediate.class || 'Intermediate'}${d.intermediate.school ? ' — ' + d.intermediate.school : ''}</span><span class="r-edu-year">${d.intermediate.year || ''}</span></div><div class="r-edu-details">${d.intermediate.board ? 'Board: ' + d.intermediate.board : ''}${d.intermediate.percentage ? ' | Percentage: ' + d.intermediate.percentage : ''}</div></div>`;
        }

        // Polytechnic
        if (d.polytechnic && d.polytechnic.board) {
            html += `<div class="r-edu-item"><div class="r-edu-row"><span class="r-edu-degree">${d.polytechnic.course || 'Polytechnic / Diploma'}${d.polytechnic.college ? ' — ' + d.polytechnic.college : ''}</span><span class="r-edu-year">${d.polytechnic.year || ''}</span></div><div class="r-edu-details">${d.polytechnic.board ? 'Board: ' + d.polytechnic.board : ''}${d.polytechnic.percentage ? ' | Percentage: ' + d.polytechnic.percentage : ''}</div></div>`;
        }

        // 10th Class
        if (d.tenth && d.tenth.board) {
            html += `<div class="r-edu-item"><div class="r-edu-row"><span class="r-edu-degree">${d.tenth.class || 'SSC (10th Class)'}${d.tenth.school ? ' — ' + d.tenth.school : ''}</span><span class="r-edu-year">${d.tenth.year || ''}</span></div><div class="r-edu-details">${d.tenth.board ? 'Board: ' + d.tenth.board : ''}${d.tenth.percentage ? ' | Percentage: ' + d.tenth.percentage : ''}</div></div>`;
        }
    }

    const skills = [
        { label: 'Languages', val: d.skillLanguages },
        { label: 'Web / Backend', val: d.skillWeb },
        { label: 'Databases', val: d.skillDB },
        { label: 'Tools & Platforms', val: d.skillTools },
        { label: 'Concepts', val: d.skillConcepts }
    ].filter(s => s.val);

    if (skills.length) {
        html += `<h2 class="r-section-title">Technical Skills</h2>`;
        skills.forEach(s => { html += `<div class="r-skill-row"><span class="r-skill-label">${s.label}:</span> ${s.val}</div>`; });
    }

    if (d.computerSkills.length && d.computerSkills.some(s => s)) {
        html += `<h2 class="r-section-title">Computer Skills</h2><ul class="r-bullet-list">`;
        d.computerSkills.forEach(s => { if (s) html += `<li>${s}</li>`; });
        html += `</ul>`;
    }

    if (d.projects.length) {
        html += `<h2 class="r-section-title">Projects</h2>`;
        d.projects.forEach(p => {
            html += `<div class="r-proj-item"><div class="r-proj-header"><span><span class="r-proj-title">${p.title}</span>${p.type ? `<span class="r-proj-type"> | ${p.type}</span>` : ''}</span><span class="r-proj-duration">${p.duration}</span></div>`;
            if (p.tech) html += `<div class="r-proj-tech">Technologies: ${p.tech}</div>`;
            if (p.desc.length) html += `<ul class="r-bullet-list">${p.desc.map(l => `<li>${l}</li>`).join('')}</ul>`;
            html += `</div>`;
        });
    }

    if (d.experience.length) {
        html += `<h2 class="r-section-title">Work Experience</h2>`;
        d.experience.forEach(e => {
            html += `<div class="r-exp-item"><div class="r-exp-header"><span><span class="r-exp-title">${e.title}</span>${e.company ? `<span class="r-exp-company"> | ${e.company}</span>` : ''}</span><span class="r-exp-duration">${e.duration}</span></div>`;
            if (e.location) html += `<div class="r-exp-location">${e.location}</div>`;
            if (e.desc.length) html += `<ul class="r-bullet-list">${e.desc.map(l => `<li>${l}</li>`).join('')}</ul>`;
            html += `</div>`;
        });
    }

    if (d.profQualifications.length && d.profQualifications.some(q => q.degree)) {
        html += `<h2 class="r-section-title">Professional Qualifications</h2>`;
        d.profQualifications.forEach(q => {
            if (q.degree) html += `<div class="r-cert-item">${q.degree}${q.board ? ' — ' + q.board : ''}${q.year ? ' | ' + q.year : ''}${q.division ? ' | ' + q.division : ''}</div>`;
        });
    }

    if (d.certifications.length) {
        html += `<h2 class="r-section-title">Certifications</h2>`;
        d.certifications.forEach(c => { html += `<div class="r-cert-item">${c.name}${c.platform ? ' — ' + c.platform : ''}${c.year ? ' (' + c.year + ')' : ''}</div>`; });
    }

    if (d.achievements.length) {
        html += `<h2 class="r-section-title">Achievements & Activities</h2>`;
        d.achievements.forEach(a => { html += `<div class="r-ach-item">${a}</div>`; });
    }

    if (d.languages || d.hobbies) {
        html += `<h2 class="r-section-title">Personal Details</h2>`;
        if (d.languages) html += `<div class="r-skill-row"><span class="r-skill-label">Languages Known:</span> ${d.languages}</div>`;
        if (d.hobbies) html += `<div class="r-skill-row"><span class="r-skill-label">Hobbies:</span> ${d.hobbies}</div>`;
        if (d.nationality) html += `<div class="r-skill-row"><span class="r-skill-label">Nationality:</span> ${d.nationality}</div>`;
    }

    html += `<h2 class="r-section-title">Declaration</h2><p class="r-objective">I hereby declare that all the information provided above is true and correct to the best of my knowledge.</p>`;

    page.innerHTML = html;

    // Update ATS score in navbar whenever preview updates
    const d2 = collectData();
    const { score } = computeATSScore(d2);
    const pillScore = document.getElementById('ats-pill-score');
    if (pillScore) {
        pillScore.textContent = score;
        pillScore.className = 'ats-pill-score ' + (score >= 85 ? 'good' : score >= 70 ? 'warn' : 'poor');
    }
}

// ===== PDF DOWNLOAD — ATS PURE TEXT =====
function downloadPDF() {
    const d = collectData();
    if (!d.fullName) { alert('Please enter your full name before downloading.'); return; }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    const PW = 210, PH = 297, ML = 18, MR = 18, MT = 15, MB = 15, CW = PW - ML - MR;
    let y = MT;

    function needPage(h) { if (y + (h || 6) > PH - MB) { doc.addPage(); y = MT; } }

    function sectionTitle(title) {
        needPage(14);
        y += 3;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(26, 82, 118);
        doc.setCharSpace(0);
        doc.text(title.toUpperCase(), ML, y, { charSpace: 0 });
        y += 1.5;
        doc.setDrawColor(41, 128, 185);
        doc.setLineWidth(0.5);
        doc.line(ML, y, PW - MR, y);
        y += 5;
    }

    function writeText(text, size, style, color, indent) {
        indent = indent || 0;
        size = size || 10;
        doc.setFont('helvetica', style || 'normal');
        doc.setFontSize(size);
        doc.setTextColor(...(color || [51, 51, 51]));
        doc.setCharSpace(0);
        var lines = safeWrapText(text, CW - indent);
        lines.forEach(function(line) {
            needPage(4);
            doc.text(line.toString(), ML + indent, y, { charSpace: 0, isInputRtl: false });
            y += size * 0.40 + 0.8;
        });
    }

    function safeWrapText(text, maxWidth) {
        // Manual word-wrapping to avoid jsPDF splitTextToSize letter-spacing bugs
        var words = text.split(/\s+/);
        var lines = [];
        var currentLine = '';
        words.forEach(function(word) {
            var testLine = currentLine ? currentLine + ' ' + word : word;
            var testWidth = doc.getTextWidth(testLine);
            if (testWidth > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        if (currentLine) lines.push(currentLine);
        return lines;
    }

    function bulletPoint(text, size) {
        size = size || 9.5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(size);
        doc.setTextColor(51, 51, 51);
        doc.setCharSpace(0);
        var indent = 6;
        var lineH = size * 0.40 + 0.7;
        var lines = safeWrapText(text, CW - indent);
        // Check if entire bullet fits on page, else go to new page
        needPage(lineH * lines.length + 1);
        doc.text('\u2022', ML + 1.5, y, { charSpace: 0 });
        lines.forEach(function(line, i) {
            if (i > 0) {
                // On continuation lines check page again
                if (y + lineH > PH - MB) { doc.addPage(); y = MT; doc.text('\u2022', ML + 1.5, y, { charSpace: 0 }); }
            }
            doc.text(line.toString(), ML + indent, y, { charSpace: 0, isInputRtl: false });
            y += lineH;
        });
        y += 0.5; // small gap after each bullet
    }

    function leftRight(left, right, size, lStyle) {
        size = size || 10;
        needPage(5);
        doc.setFont('helvetica', lStyle || 'bold');
        doc.setFontSize(size);
        doc.setTextColor(30, 30, 30);
        doc.setCharSpace(0);
        var leftLines = safeWrapText(left, CW * 0.72);
        doc.text(leftLines[0].toString(), ML, y, { charSpace: 0, isInputRtl: false });
        if (right) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(size - 1);
            doc.setTextColor(85, 85, 85);
            doc.setCharSpace(0);
            doc.text(right, PW - MR, y, { align: 'right', charSpace: 0 });
        }
        y += size * 0.40 + 1.2;
        for (var i = 1; i < leftLines.length; i++) {
            doc.setFont('helvetica', lStyle || 'bold'); doc.setFontSize(size); doc.setTextColor(30, 30, 30);
            doc.setCharSpace(0);
            needPage(5); doc.text(leftLines[i].toString(), ML, y, { charSpace: 0, isInputRtl: false }); y += size * 0.40 + 1.2;
        }
    }

    // NAME
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(17, 17, 17);
    doc.setCharSpace(0);
    doc.text(d.fullName, PW / 2, y, { align: 'center', charSpace: 0 });
    y += 8;

    // CONTACT
    var contact = [];
    if (d.email) contact.push(d.email);
    if (d.phone) contact.push(d.phone);
    if (d.city) contact.push(d.city);
    if (contact.length) {
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(85, 85, 85);
        doc.setCharSpace(0);
        var cStr = contact.join('  |  ');
        safeWrapText(cStr, CW).forEach(function(line) { doc.text(line.toString(), PW / 2, y, { align: 'center', charSpace: 0 }); y += 4; });
    }

    // LINKS
    var links = [];
    if (d.linkedin) links.push('LinkedIn: ' + d.linkedin);
    if (d.github) links.push('GitHub: ' + d.github);
    if (links.length) {
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(85, 85, 85);
        doc.setCharSpace(0);
        safeWrapText(links.join('  |  '), CW).forEach(function(line) { doc.text(line.toString(), PW / 2, y, { align: 'center', charSpace: 0 }); y += 4; });
    }

    doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.3); doc.line(ML, y, PW - MR, y); y += 3;

    if (d.objective) { sectionTitle('Career Objective'); writeText(d.objective); y += 1; }
    if (d.summary) { sectionTitle('Professional Summary'); writeText(d.summary); y += 1; }

    if (d.education.length || (d.intermediate && d.intermediate.board) || (d.tenth && d.tenth.board) || (d.polytechnic && d.polytechnic.board)) {
        sectionTitle('Education');
        d.education.forEach(function(e) {
            var left = e.degree; if (e.university) left += '  —  ' + e.university;
            leftRight(left, e.year);
            if (e.cgpa || e.courses) { var det = ''; if (e.cgpa) det += 'CGPA/Percentage: ' + e.cgpa; if (e.courses) det += (e.cgpa ? '  |  ' : '') + 'Relevant Courses: ' + e.courses; writeText(det, 9, 'normal', [100, 100, 100]); }
            y += 1;
        });

        // Intermediate
        if (d.intermediate && d.intermediate.board) {
            var interLeft = (d.intermediate.class || 'Intermediate');
            if (d.intermediate.school) interLeft += '  —  ' + d.intermediate.school;
            leftRight(interLeft, d.intermediate.year || '');
            var interDet = 'Board: ' + d.intermediate.board;
            if (d.intermediate.percentage) interDet += '  |  Percentage: ' + d.intermediate.percentage;
            writeText(interDet, 9, 'normal', [100, 100, 100]);
            y += 1;
        }

        // Polytechnic
        if (d.polytechnic && d.polytechnic.board) {
            var polyLeft = (d.polytechnic.course || 'Polytechnic / Diploma');
            if (d.polytechnic.college) polyLeft += '  —  ' + d.polytechnic.college;
            leftRight(polyLeft, d.polytechnic.year || '');
            var polyDet = 'Board: ' + d.polytechnic.board;
            if (d.polytechnic.percentage) polyDet += '  |  Percentage: ' + d.polytechnic.percentage;
            writeText(polyDet, 9, 'normal', [100, 100, 100]);
            y += 1;
        }

        // 10th Class
        if (d.tenth && d.tenth.board) {
            var tenthLeft = (d.tenth.class || 'SSC (10th Class)');
            if (d.tenth.school) tenthLeft += '  —  ' + d.tenth.school;
            leftRight(tenthLeft, d.tenth.year || '');
            var tenthDet = 'Board: ' + d.tenth.board;
            if (d.tenth.percentage) tenthDet += '  |  Percentage: ' + d.tenth.percentage;
            writeText(tenthDet, 9, 'normal', [100, 100, 100]);
            y += 1;
        }
    }

    var skillsList = [
        { label: 'Languages', val: d.skillLanguages },
        { label: 'Web / Backend', val: d.skillWeb },
        { label: 'Databases', val: d.skillDB },
        { label: 'Tools & Platforms', val: d.skillTools },
        { label: 'Concepts', val: d.skillConcepts }
    ].filter(function(s) { return s.val; });

    if (skillsList.length) {
        sectionTitle('Technical Skills');
        skillsList.forEach(function(s) {
            needPage(5);
            doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(26, 82, 118);
            doc.setCharSpace(0);
            var labelStr = s.label + ':  ';
            doc.text(labelStr, ML, y, { charSpace: 0 });
            var lw = doc.getTextWidth(labelStr);
            doc.setFont('helvetica', 'normal'); doc.setTextColor(51, 51, 51);
            doc.setCharSpace(0);
            var valLines = safeWrapText(s.val, CW - lw);
            doc.text(valLines[0].toString(), ML + lw, y, { charSpace: 0 });
            y += 4.5;
            for (var i = 1; i < valLines.length; i++) { needPage(4); doc.text(valLines[i].toString(), ML + lw, y, { charSpace: 0 }); y += 4.5; }
        });
    }

    if (d.computerSkills.length && d.computerSkills.some(function(s) { return s; })) {
        sectionTitle('Computer Skills');
        d.computerSkills.forEach(function(s) { if (s) bulletPoint(s); });
    }

    if (d.projects.length) {
        sectionTitle('Projects');
        d.projects.forEach(function(p) {
            var left = p.title; if (p.type) left += '  |  ' + p.type;
            leftRight(left, p.duration);
            if (p.tech) writeText('Technologies: ' + p.tech, 9, 'italic', [100, 100, 100]);
            p.desc.forEach(function(line) { bulletPoint(line); });
            y += 1.5;
        });
    }

    if (d.experience.length) {
        sectionTitle('Work Experience');
        d.experience.forEach(function(e) {
            var left = e.title; if (e.company) left += '  |  ' + e.company;
            leftRight(left, e.duration);
            if (e.location) writeText(e.location, 9, 'italic', [100, 100, 100]);
            e.desc.forEach(function(line) { bulletPoint(line); });
            y += 1.5;
        });
    }

    if (d.profQualifications.length && d.profQualifications.some(function(q) { return q.degree; })) {
        sectionTitle('Professional Qualifications');
        d.profQualifications.forEach(function(q) {
            if (q.degree) { var text = q.degree; if (q.board) text += ' — ' + q.board; if (q.year) text += ' | ' + q.year; if (q.division) text += ' | ' + q.division; bulletPoint(text); }
        });
    }

    if (d.certifications.length) {
        sectionTitle('Certifications');
        d.certifications.forEach(function(c) { var text = c.name; if (c.platform) text += ' — ' + c.platform; if (c.year) text += ' (' + c.year + ')'; bulletPoint(text); });
    }

    if (d.achievements.length) {
        sectionTitle('Achievements & Activities');
        d.achievements.forEach(function(a) { bulletPoint(a); });
    }

    if (d.languages || d.hobbies || d.nationality) {
        sectionTitle('Personal Details');
        if (d.languages) { needPage(5); doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(26,82,118); doc.setCharSpace(0); doc.text('Languages Known:  ', ML, y, { charSpace: 0 }); var lw = doc.getTextWidth('Languages Known:  '); doc.setFont('helvetica','normal'); doc.setTextColor(51,51,51); doc.setCharSpace(0); doc.text(d.languages, ML+lw, y, { charSpace: 0 }); y+=4.5; }
        if (d.hobbies) { needPage(5); doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(26,82,118); doc.setCharSpace(0); doc.text('Hobbies:  ', ML, y, { charSpace: 0 }); var lw2 = doc.getTextWidth('Hobbies:  '); doc.setFont('helvetica','normal'); doc.setTextColor(51,51,51); doc.setCharSpace(0); doc.text(d.hobbies, ML+lw2, y, { charSpace: 0 }); y+=4.5; }
        if (d.nationality) { needPage(5); doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(26,82,118); doc.setCharSpace(0); doc.text('Nationality:  ', ML, y, { charSpace: 0 }); var lw3 = doc.getTextWidth('Nationality:  '); doc.setFont('helvetica','normal'); doc.setTextColor(51,51,51); doc.setCharSpace(0); doc.text(d.nationality, ML+lw3, y, { charSpace: 0 }); y+=4.5; }
    }

    sectionTitle('Declaration');
    writeText('I hereby declare that all the information provided above is true and correct to the best of my knowledge.', 9.5);
    y += 8;
    needPage(10);
    doc.setFont('helvetica','normal'); doc.setFontSize(9.5); doc.setTextColor(51,51,51);
    doc.setCharSpace(0);
    doc.text('Date: _______________', ML, y, { charSpace: 0 });
    doc.text('Signature: _______________', PW - MR, y, { align: 'right', charSpace: 0 });

    var filename = d.fullName ? d.fullName.replace(/\s+/g, '_') + '_Resume.pdf' : 'Resume.pdf';
    doc.save(filename);
}

// ===== CHARACTER COUNTER =====
function setupCharCounters() {
    [['objective','objective-count'],['summary','summary-count']].forEach(([fieldId, countId]) => {
        const field = document.getElementById(fieldId);
        const counter = document.getElementById(countId);
        if (field && counter) {
            field.addEventListener('input', () => {
                counter.textContent = `${field.value.length} / 500 characters`;
            });
        }
    });
}

// ===== AUTO UPDATE PREVIEW =====
document.addEventListener('input', function() {
    const panel = document.getElementById('preview-panel');
    if (panel.classList.contains('open')) {
        clearTimeout(window._previewTimer);
        window._previewTimer = setTimeout(updateResumePreview, 300);
    }
    clearTimeout(window._atsTimer);
    window._atsTimer = setTimeout(() => {
        const d = collectData();
        const { score } = computeATSScore(d);
        const pillScore = document.getElementById('ats-pill-score');
        if (pillScore) {
            pillScore.textContent = score;
            pillScore.className = 'ats-pill-score ' + (score >= 85 ? 'good' : score >= 70 ? 'warn' : 'poor');
        }
        if (currentStep === 8) updateATSScore();
    }, 400);
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    initAllDateDropdowns();
    setupCharCounters();
    if (window.innerWidth >= 1200) togglePreview();
});