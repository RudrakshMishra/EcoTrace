<div align="center">
  <img src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1200&h=400" alt="EcoTrace Banner" style="border-radius: 20px; margin-bottom: 20px;"/>

  # 🌿 EcoTrace

  **Personal Carbon Footprint Tracker & Climate Action Platform**

  *Every gram counts. Start now.*

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
  [![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)](https://deepmind.google/technologies/gemini/)

</div>

---

## 📌 The Mission

Climate change is driven significantly by individual behavior — yet most people have no idea how much CO₂ their daily choices emit. Existing calculators are one-time tools with no engagement loop. 

**EcoTrace** solves this by turning carbon awareness into a daily habit with beautiful UX, real-time feedback, and personalized AI-driven action plans. We make sustainability trackable, understandable, and deeply rewarding.

---

## 📸 Platform Visuals

<div align="center">
  <table>
    <tr>
      <td align="center"><b>The Dashboard Command Center</b><br><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400" alt="Dashboard Preview" style="border-radius: 10px;" /></td>
      <td align="center"><b>CarbonLens Analytics</b><br><img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400" alt="Analytics Preview" style="border-radius: 10px;" /></td>
    </tr>
    <tr>
      <td align="center"><b>AI Carbon Coach</b><br><img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600&h=400" alt="AI Preview" style="border-radius: 10px;" /></td>
      <td align="center"><b>Gamification & Badges</b><br><img src="https://images.unsplash.com/photo-1533227268428-f9ed0900f4bf?auto=format&fit=crop&q=80&w=600&h=400" alt="Gamification Preview" style="border-radius: 10px;" /></td>
    </tr>
  </table>
  <p><i>* Actual application utilizes a striking dark-mode Neon Lime (#39FF14) and Forest Green aesthetic.</i></p>
</div>

---

## 🎯 Core Features

### 🔮 Carbon Orb (Signature Visual)
A real-time animated orb that pulses and changes color based on your CO₂ score:
- 🟢 **Green** → Under 2 tons/year (Excellent)
- 🟡 **Amber** → 2–5 tons/year (Average)
- 🔴 **Red** → Above 5 tons/year (Needs action)

### 📊 The Dashboard & Daily Tracker
- **Smart Onboarding:** A comprehensive 4-step quiz calculating your baseline footprint.
- **Full-Page Grid:** A dense, command-center style dashboard showing your category breakdown (Diet, Transport, Shopping, Home).
- **Daily Action Logger:** Toggle daily green actions (cycling, plant-based meals) or log heavy actions (driving, flights) with instant impact calculation.

### 🤖 Google Gemini AI Coach
- Integrated chat interface directly on your dashboard.
- Analyzes your unique footprint profile to suggest actionable reduction strategies.
- Powered by the blazing fast `gemini-1.5-flash-latest` model.

### 🗺️ CarbonLens Matrix
- Global Country & State Comparisons with interactive sorting and visualizations.
- Macro-level trends visualized via Chart.js to put your micro-level footprint into perspective.

### 🔥 Gamification & Engagement
- **Streak System:** Builds habits by tracking consecutive days with net-negative logs.
- **Badge Unlocks:** Earn badges like "Vegan Week", "Flight-Free", and "Goal Crusher".
- **Goal Setter:** Set dynamic monthly reduction goals and celebrate with interactive confetti when achieved!

---

## 🛠️ Modern Tech Stack

EcoTrace has evolved from a simple static site into a full-scale enterprise-grade application.

### 🎨 Frontend (Client)
- **Framework:** Next.js 15 (App Router, Turbopack)
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Animations:** Framer Motion
- **Data Viz:** Chart.js + `react-chartjs-2`
- **Icons:** Lucide React

### ⚙️ Backend (Server)
- **Framework:** NestJS 10 (TypeScript)
- **Database:** PostgreSQL (via SQLite for dev) + Prisma ORM
- **AI Integration:** Google Generative AI SDK (`@google/generative-ai`)
- **Architecture:** Modular REST API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A [Google Gemini API Key](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/RudrakshMishra/EcoTrace.git
cd EcoTrace
```

### 2. Setup the Backend
```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY!

# Generate Prisma Client & push schema
npx prisma generate
npx prisma db push

# Seed the database with Badges and initial data
npx ts-node prisma/seed.ts

# Start the NestJS server (runs on http://localhost:3001)
npm run start:dev
```

### 3. Setup the Frontend
```bash
# Open a new terminal
cd ../frontend

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

Your app will be running at `http://localhost:3000`.

---

## 📐 Architecture & Deployment

The application is fully prepared for cloud deployment:
- **Frontend:** Fully compatible with Netlify, Vercel, or GitHub Pages. The Next.js frontend has been optimized for **Static HTML Export** (`output: 'export'`) with a `netlify.toml` file included out-of-the-box for zero-config Netlify hosting.
- **Backend:** Ready for deployment on Render, Railway, or Fly.io.

---

## 👨‍💻 Built For

Developed as an innovative, production-ready solution to gamify climate action. 
**Save the planet. One log at a time.**

---

<div align="center">
  <p><i>"The greatest threat to our planet is the belief that someone else will save it." — Robert Swan</i></p>
  <b>EcoTrace puts the power back in your hands. 🌍</b>
</div>
