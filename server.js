// ============================================================
// server.js — ResumeForge Backend
// Only job: proxy AI requests to Groq so key stays in .env
// Run with: node server.js
// ============================================================

require('dotenv').config();
const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json());

// Serve all your frontend files (builder.html, index.html, etc.)
app.use(express.static(path.join(__dirname)));

// ── AI PROXY ROUTE ──────────────────────────────────────────
// Frontend calls POST /api/ai-enhance
// Server calls Groq with the key from .env
// Key is NEVER sent to the browser
app.post('/api/ai-enhance', async (req, res) => {
    const { model, systemPrompt, userPrompt } = req.body;

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    // Guard: key must be set in .env
    if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
        return res.status(500).json({
            error: 'GROQ_API_KEY not set in .env file. Get your free key at https://console.groq.com'
        });
    }

    if (!systemPrompt || !userPrompt) {
        return res.status(400).json({ error: 'Missing systemPrompt or userPrompt.' });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: model || 'llama-3.3-70b-versatile',
                max_tokens: 1500,
                temperature: 0.3,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user',   content: userPrompt   }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('[Groq Error]', data.error);
            return res.status(502).json({ error: data.error.message || 'Groq API error' });
        }

        const result = data.choices?.[0]?.message?.content;
        if (!result) {
            return res.status(502).json({ error: 'Empty response from Groq API' });
        }

        return res.json({ result });

    } catch (err) {
        console.error('[Server Error]', err.message);
        return res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// ── START ───────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ ResumeForge running at http://localhost:${PORT}`);
    console.log(`   Open http://localhost:${PORT}/builder.html to start`);
});