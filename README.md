# ✦ MyAI — Personal Assistant
> Your own ChatGPT-like assistant powered by Google Gemini (FREE)

---

## 🚀 Run Locally

### 1. Install
```bash
npm install
```

### 2. Get your FREE Gemini API key
👉 https://aistudio.google.com/apikey
- Sign in with Google
- Click "Create API Key"
- Copy the key

### 3. Add API key
```bash
cp .env.example .env
```
Open `.env` and paste your key:
```
REACT_APP_GEMINI_API_KEY=AIzaSy-your-key-here
```

### 4. Start
```bash
npm start
```
Open → http://localhost:3000

---

## 🌐 Deploy to Web (Free — Vercel)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "My AI Assistant"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/my-ai-assistant.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to → https://vercel.com
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import your `my-ai-assistant` repo
5. Go to **Settings → Environment Variables**
6. Add: `REACT_APP_GEMINI_API_KEY` = your Gemini key
7. Click **Deploy** ✅

Your chatbot will be live at: `https://my-ai-assistant-xxx.vercel.app`

---

## ✨ Features
- 🤖 4 AI Personas — General, Coder, Writer, Tutor
- 💾 Chat history saved in browser (localStorage)
- 📝 Markdown + code block rendering
- 📋 Copy message button
- 💬 Suggestion chips on empty state
- 📱 Fully mobile responsive
- ♻️ Clear/reset conversation

## 📁 Project Structure
```
src/
├── components/
│   ├── ChatWindow.jsx     ← Main chat area
│   ├── MessageBubble.jsx  ← Messages + markdown
│   ├── ChatInput.jsx      ← Input bar
│   └── Sidebar.jsx        ← History + personas
├── hooks/
│   └── useChat.js         ← All logic + localStorage
├── utils/
│   └── gemini.js          ← Gemini API call
├── App.jsx + App.css
└── index.js
```
