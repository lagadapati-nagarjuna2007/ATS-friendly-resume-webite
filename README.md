# 🎯 ResumeForge — ATS-Friendly Resume Builder for Students

> Build a professional, ATS-optimized resume in minutes — no design skills needed.

🌐 **Live Demo:** [https://ats-friendly-resume-webite.onrender.com](https://ats-friendly-resume-webite.onrender.com)

---

## 📌 What is ResumeForge?

Many students struggle to build resumes that pass **Applicant Tracking Systems (ATS)** — the software companies use to filter resumes before a human ever sees them.

**ResumeForge** solves this by giving students a guided, step-by-step resume builder that:
- Scores **90%+ on ATS systems** automatically
- Uses **AI (Groq Llama / GPT-OSS 120B)** to enhance your content
- Generates a **pure-text PDF** that ATS parsers can read perfectly
- Requires **zero design or technical skills**

---

## ✨ Features

- ✅ Step-by-step guided resume form
- ✅ AI-powered content enhancement (rewrites bullets, objectives, summaries)
- ✅ Live ATS score checker with real-time feedback
- ✅ Job keyword matcher — paste a job description, see missing keywords
- ✅ Pure text PDF download (not an image — ATS readable)
- ✅ 3 ATS-safe templates (Classic, Modern, Minimal)
- ✅ Action verb suggestions for every bullet point
- ✅ Standard section names ATS systems expect
- ✅ Auto file naming: `FirstName_LastName_Resume.pdf`

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| AI | Groq API (GPT-OSS 120B / Llama 3.3 70B) |
| PDF Generation | jsPDF |
| Hosting | Render |

---

## 🚀 Getting Started — Run Locally

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org) (v18 or above)
- A free [Groq API Key](https://console.groq.com)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/lagadapati-nagarjuna2007/ATS-friendly-resume-webite.git
cd ATS-friendly-resume-webite
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

---

### Step 3 — Create `.env` File

Create a file named `.env` in the project root:

```
GROQ_API_KEY=your_groq_api_key_here
```

> 🔑 Get your free Groq API key at [console.groq.com](https://console.groq.com) — no credit card required.

---

### Step 4 — Start the Server

```bash
node server.js
```

You will see:
```
✅ ResumeForge running at http://localhost:3000
```

---

### Step 5 — Open in Browser

```
http://localhost:3000
```

Go to the builder:
```
http://localhost:3000/builder.html
```

---

## 🗂️ Project Structure

```
ATS-friendly-resume-webite/
├── server.js          ← Express backend (AI proxy, static file server)
├── ai-enhance.js      ← AI enhancement logic (calls Groq via server)
├── builder.js         ← Resume builder logic (form, preview, PDF)
├── landing.js         ← Landing page animations and interactions
├── index.html         ← Landing page
├── builder.html       ← Resume builder page
├── package.json       ← Project dependencies
└── .env               ← Your Groq API key (never pushed to GitHub)
```

---

## 🤖 How the AI Works

1. You fill in your resume details in the builder
2. You click **"AI Enhance"** on any section
3. The frontend sends your content to `/api/ai-enhance` on the backend
4. The backend (server.js) forwards the request to **Groq API** using your key stored in `.env`
5. Groq's model rewrites your content with ATS-optimized language
6. The enhanced content appears in a modal — you review and apply it

> ⚠️ Your Groq API key is **never exposed to the browser** — it stays safely in `.env` on the server.

---

## 📄 How to Build Your Resume

1. **Open** `http://localhost:3000/builder.html`
2. **Fill** your personal info, education, skills, projects, and experience
3. **Click AI Enhance** on each section to improve your content
4. **Check** your live ATS score in the score panel (aim for 90+)
5. **Paste** a job description in the keyword matcher to find missing keywords
6. **Download** your PDF — it's named `FirstName_LastName_Resume.pdf` automatically

---

## ☁️ Deployment (Render)

This project is deployed on [Render](https://render.com).

### Deploy Your Own Instance

1. Fork this repository
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your forked repo
4. Set the following:

| Field | Value |
|---|---|
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Instance Type | Free |

5. Add environment variable:

| Key | Value |
|---|---|
| `GROQ_API_KEY` | your groq api key |

6. Click **Create Web Service** — your app will be live in 2-3 minutes!

> 💡 **Tip:** Use [UptimeRobot](https://uptimerobot.com) (free) to ping your site every 5 minutes and prevent Render's free tier cold starts.

---

## ⚠️ Important Notes

- Never push your `.env` file to GitHub — add it to `.gitignore`
- Render free tier sleeps after 15 minutes of inactivity — first load may take ~30 seconds
- Groq free tier has rate limits — suitable for personal and student use

---

## 🙌 Contributing

Pull requests are welcome! If you find a bug or want to add a feature:

1. Fork the repo
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Lagadapati Nagarjuna**
- GitHub: [@lagadapati-nagarjuna2007](https://github.com/lagadapati-nagarjuna2007)

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **If this project helped you, please give it a star on GitHub!**