# 🤖 Prajukti — Personal AI Agent Dashboard

> **Build Your Own AI Workforce — No Code Required.**

[![Track](https://img.shields.io/badge/Track-PS--A01-1a2744?style=flat-square)](/)
[![Institution](https://img.shields.io/badge/Institution-Girijananda%20Chowdhury%20University-blue?style=flat-square)](/)
[![Team](https://img.shields.io/badge/Team-Lagzilla-blueviolet?style=flat-square)](/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📌 Overview

**Prajukti** is a no-code, visual web platform where anyone can create, configure, and deploy personal AI agents — without writing a single line of code.

Think of it as **"Figma for AI Agents."**

Users can drag-and-drop to build agents, assign them roles and tools, chain them into collaborative workflows, and monitor their actions in real time — all from a clean visual dashboard.

---

## 🚩 Problem Statement

Today's AI agents are powerful but accessible mostly through coding, APIs, and complex frameworks. Students, small business owners, and everyday users lack a simple, intuitive way to create and manage AI agents.

There is **no visual platform** where non-technical users can:
- Create AI agents
- Assign them roles and tools
- Connect them into multi-step workflows
- Monitor their actions in real time

---

## 💡 Proposed Solution

A **web-based AI Agent Dashboard** that democratizes agentic AI:

- 🖱️ Drag & drop to create and configure agents
- 🔗 Chain agents into collaborative pipelines
- 🧠 Monitor real-time agent thinking via WebSockets
- 💬 Assign goals in plain English — no code needed

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Visual Agent Builder** | Drag-and-drop interface to define agent name, role, personality & tools |
| **Tool Library** | Web Search, Email Drafter, Summarizer, Calculator, To-Do Manager, API integrations |
| **Multi-Agent Pipeline** | Chain agents into visual workflows; each agent passes output to the next |
| **Real-Time Activity Log** | Live feed of agent thoughts & actions, color-coded per agent via WebSocket |
| **Task Input Interface** | Assign goals in plain English and watch agents collaborate to complete them |
| **Agent Memory Panel** | Agents store context & user preferences — persistent memory across sessions |

---

## 🏗️ Architecture

```
Frontend (Vue.js 3)
      │
      ▼
FastAPI Backend
      │
      ▼
Agent Orchestrator (LangChain + LangGraph)
      │
   ┌──┴──────────────┐
   ▼                  ▼
Tool APIs          Supabase DB
(Web Search,       (PostgreSQL +
 Email, etc.)       Auth + Storage)
      │
      ▼
Redis Cache (Upstash)
```

---

## 🗄️ Entity Relationship Diagram

```
USER ──(1:M)──► AGENT ──(M:N)──► TOOL
                  │
               (1:1)
                  │
               MEMORY ──(1:M)──► ACTIVITY_LOG
                  │
               (M:N)
                  │
               TASK
```

**Entities:**
- **User** — `user_id`, `name`, `email`, `preferences`
- **Agent** — `agent_id`, `name`, `role`, `personality`, `status`, `user_id`
- **Tool** — `tool_id`, `name`, `description`, `API_endpoint`
- **Task** — `task_id`, `goal`, `user_id`, `status`
- **Memory** — `memory_id`, `context`, `user_id`, `updated_at`
- **ActivityLog** — `log_id`, `agent_id`, `action`, `thought`, `output`, `timestamp`

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vue.js 3 + Vite + TailwindCSS |
| **Backend** | Python (FastAPI) — async, high performance |
| **AI / LLM Integration** | OpenAI API / HuggingFace + Gemini |
| **Agent Framework** | LangChain + LangGraph |
| **Real-Time Communication** | WebSockets (FastAPI + Vue Socket Client) |
| **Database** | Supabase (PostgreSQL + Auth + Storage) |
| **Cache** | Redis via Upstash (Free Tier) |
| **Authentication** | Supabase Auth (Email/Password + OAuth) |
| **Backend Hosting** | Render |
| **Frontend Hosting** | Netlify |
| **Version Control** | GitHub |

---

## 🌏 Use Cases — Impact in Northeast India

| Domain | Use Case | Impact |
|---|---|---|
| 🌾 **Agriculture** | Weather updates, crop advice, flood alerts | Better crop planning, reduced losses |
| 🏥 **Healthcare** | Appointment scheduling, medication reminders | Improved rural healthcare access |
| 📚 **Education** | Study plan generation, textbook summarization | Better learning support for students |
| 🏛️ **Government** | Form filling, application tracking, complaint drafting | Faster, simpler public services |
| 🏪 **Small Business** | Inventory monitoring, sales reports, customer communication | Automation for SMEs without tech staff |
| 🌊 **Disaster Monitoring** | Real-time flood & landslide alerts | Community safety & preparedness |

---

## ⚠️ Challenges & Solutions

| Challenge | Solution |
|---|---|
| Low internet connectivity | Offline mode via local LLMs, cached task execution, lightweight UI |
| Low digital literacy | Voice input, local language interface, guided onboarding |
| Data privacy concerns | Local memory storage, privacy mode, transparent activity logs |
| High API costs | Open-source LLM support, cached responses, tiered usage model |
| Trust in AI | Explainable decision logs, human approval before critical actions, undo functionality |

---

## 💼 Business Model

### Revenue Streams
- **Freemium SaaS** — Basic features free; premium tools & agents paid
- **Subscription Plans** — Monthly/yearly plans for advanced features
- **AI Agent Marketplace** — Commission from selling pre-built agent templates
- **Enterprise Solutions** — Custom AI agent systems for businesses & organizations
- **API Access** — Paid access for developers to integrate the platform

### Market Strategy
- 🎓 Partnerships with universities and tech communities
- 🏆 Demonstrations at hackathons and tech events
- 📱 Social media and digital marketing
- 🧩 Template-based onboarding (tourism, study assistant, disaster monitoring)

---

## 🚀 Future Prospects

### Scaling
- Support large numbers of AI agents and users simultaneously
- Integrate with more external tools and APIs
- Deploy on cloud infrastructure for better performance

### Product Extensions
- 📱 Mobile applications for easier agent access
- 📊 Advanced analytics and monitoring tools
- 🏪 AI Agent Marketplace for sharing/selling agent templates
- 🏭 Industry-specific templates (tourism, education, disaster management)

### Social / Economic Impact
- Improve access to AI technology for students, startups, and small businesses
- Support automation and productivity across sectors
- Encourage digital innovation and skill development in Northeast India
- Create opportunities for new AI-based services and entrepreneurship

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Supabase account
- OpenAI / Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/prajukti.git
cd prajukti

# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup
cd ../backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
REDIS_URL=your_upstash_redis_url
```

Create a `.env` file in the frontend directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8000
```

---

## 👥 Team Lagzilla

| Role | Name |
|---|---|
| **Team Leader** | Khushi Agarwal |
| **Member** | Rishav Kumar Singh |
| **Member** | Adit Agarwal |


**Institution:** Girijananda Chowdhury University
**Hackathon:** GCU Hackathon — Track PS-A01

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Built with ❤️ by Team Lagzilla @ GCU Hackathon 2026</strong>
</div>
