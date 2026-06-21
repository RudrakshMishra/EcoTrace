# 🌿 EcoTrace — Personal Carbon Footprint Tracker

> **"Every gram counts. Start now."**
> A hackathon-winning web app that helps individuals understand, track, and reduce their carbon footprint through simple daily actions and personalized insights.

---

## 📌 Problem Statement

Climate change is driven significantly by individual behavior — yet most people have no idea how much CO₂ their daily choices emit. Existing carbon calculators are one-time tools with no engagement loop. **EcoTrace** solves this by turning carbon awareness into a daily habit with beautiful UX, real-time feedback, and personalized action plans.

---

## 💡 Solution Overview

EcoTrace is a **single-page web application** that:

1. **Calculates** your baseline carbon footprint through a smart onboarding quiz
2. **Visualizes** your footprint with an emotionally resonant animated Carbon Orb
3. **Tracks** daily actions (positive and negative) that impact your CO₂ output
4. **Provides** personalized, category-specific tips to reduce emissions
5. **Motivates** through streaks, goals, and a community leaderboard

---

## 🎯 Key Features

### 🔮 Carbon Orb (Signature Feature)
- A real-time animated orb that pulses and changes color based on your CO₂ score
- 🟢 Green → Under 2 tons/year (great!)
- 🟡 Amber → 2–5 tons/year (average)
- 🔴 Red → Above 5 tons/year (needs action)

### 📋 Smart Onboarding Quiz
- 4-step quiz covering: Transport, Diet, Home Energy, Shopping & Flights
- Calculates personalized annual CO₂ estimate
- Dramatic score reveal with animation

### 📊 Interactive Dashboard
- Donut chart breakdown by category (Transport, Diet, Home, Travel, Shopping)
- Weekly trend line chart
- Global average comparison badge

### 📅 Daily Action Tracker
- Toggle daily green actions (cycling, plant-based meals, recycling, etc.)
- Log carbon-heavy actions (driving, flying, red meat, shopping)
- Live orb updates after each log
- 🔥 Streak counter to build habits

### 💬 Personalized Insights
- AI-style tips based on your highest CO₂ category
- Each tip shows exact CO₂ saved per year
- "Try This" button adds tips to your personal action plan

### 🌳 Offset & Goal Calculator
- Calculate how many trees to plant or solar panels to fund
- Set monthly reduction goals with progress tracking
- Confetti celebration when goals are hit

### 🏆 Community Leaderboard
- Weekly top green users
- Your rank highlighted
- Shareable score snippet

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, animations, grid/flexbox) |
| Logic | Vanilla JavaScript (ES6+) |
| Charts | Chart.js (via CDN) |
| Storage | localStorage (no backend needed) |
| Fonts | Google Fonts (Space Grotesk, Inter, JetBrains Mono) |
| Deployment | Any static host (GitHub Pages, Netlify, Vercel) |

**No frameworks. No build tools. No backend. Fully offline-capable.**

---

## 🎨 Design System

### Color Palette

| Name | Hex | Usage |
|---|---|---|
| Forest Night | `#0A0F0D` | App background |
| Dark Moss | `#111A14` | Surface layer |
| Elevated Card | `#162019` | Card backgrounds |
| Neon Lime | `#39FF14` | Primary accent, CTAs |
| Mint Teal | `#00E5A0` | Secondary accent |
| Amber Sun | `#FFB830` | Warning states |
| Soft Cream | `#E8F5E2` | Primary text |
| Muted Sage | `#6B8F71` | Secondary text |

### Typography

| Role | Font | Usage |
|---|---|---|
| Display | Space Grotesk Bold | Hero headlines, section titles |
| Body | Inter Regular/Medium | Paragraphs, UI labels |
| Data | JetBrains Mono | CO₂ numbers, stats, code |

---

## 📐 App Architecture

```
EcoTrace/
│
├── index.html              # Single file — entire app
│   ├── <head>              # Fonts, Chart.js CDN, meta
│   ├── <style>             # All CSS embedded
│   └── <body>
│       ├── #hero           # Landing section
│       ├── #quiz           # 4-step onboarding
│       ├── #dashboard      # Orb + charts + stats
│       ├── #tracker        # Daily action logger
│       ├── #insights       # Personalized tips
│       ├── #offset         # Goal + offset calculator
│       ├── #leaderboard    # Community rankings
│       └── <script>        # All JS embedded
│
└── README.md               # This file
```

---

## 🧮 Carbon Calculation Logic

### Category Weights (kg CO₂ per year)

**Transport**
- Car (petrol, avg 10k km/yr): ~2,400 kg
- Car (diesel): ~2,200 kg
- Car (electric): ~700 kg
- Bus: ~500 kg
- Train: ~150 kg
- Bike/Walk: 0 kg

**Diet**
- Meat daily: ~3,300 kg
- Meat occasionally: ~2,000 kg
- Pescatarian: ~1,400 kg
- Vegetarian: ~1,100 kg
- Vegan: ~700 kg

**Home Energy**
- Coal/Gas (house): ~3,000 kg
- Mixed (apartment): ~1,500 kg
- Renewable: ~300 kg

**Flights**
- 0 flights: 0 kg
- 1–2 flights: ~900 kg
- 3–5 flights: ~2,500 kg
- 5+ flights: ~5,000 kg

**Shopping**
- Daily: ~1,200 kg
- Weekly: ~800 kg
- Monthly: ~400 kg
- Rarely: ~100 kg

**Global Average for comparison: 4,700 kg/year**

---

## 📅 Daily Action CO₂ Impact

### ✅ Green Actions (savings per occurrence)

| Action | CO₂ Saved |
|---|---|
| Cycled instead of drove | −1.2 kg |
| Ate plant-based meal | −0.8 kg |
| Recycled waste | −0.3 kg |
| Lowered heating by 1°C | −0.5 kg |
| Short shower (<5 min) | −0.2 kg |
| Unplugged idle devices | −0.1 kg |
| Used public transport | −0.9 kg |
| Air-dried laundry | −0.3 kg |

### ❌ Carbon Actions (additions per occurrence)

| Action | CO₂ Added |
|---|---|
| Drove alone | +2.1 kg |
| Ate red meat | +3.3 kg |
| Long-haul flight | +90.0 kg |
| Bought new clothes | +6.0 kg |
| Ordered food delivery | +1.5 kg |
| Left electronics on standby | +0.4 kg |

---

## 🔥 Gamification & Engagement

- **Daily Streak**: Tracks consecutive days with net-negative carbon logs
- **Green Score**: Cumulative lifetime CO₂ saved in kg
- **Badges** (unlocked by milestones):
  - 🌱 First Log
  - ⚡ 7-Day Streak
  - 🌍 1 Ton Saved
  - ✈️ Flight-Free Month
  - 🥗 Vegan Week

- **Weekly Summary Toast**: "This week you saved 8.4 kg CO₂ — equivalent to planting 1 tree!"

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| < 480px | Single column, stacked cards, compact orb |
| 480–768px | Two-column grid for action cards |
| 768–1200px | Side-by-side dashboard panels |
| > 1200px | Full-width hero, three-column insights |

---

## ⚡ Performance

- Zero npm dependencies
- Single HTTP request for page load
- Chart.js loaded from CDN with `defer`
- Google Fonts loaded asynchronously
- localStorage used for instant persistence
- Animations use CSS transforms (GPU-accelerated)
- Target: < 1s First Contentful Paint

---

## 🚀 Deployment

### Option 1 — GitHub Pages
```bash
# Push index.html to a GitHub repo
# Go to Settings → Pages → Deploy from main branch
# Live at: https://yourusername.github.io/ecotrace
```

### Option 2 — Netlify (Drag & Drop)
```
1. Go to app.netlify.com
2. Drag your project folder
3. Live in 30 seconds
```

### Option 3 — Vercel
```bash
npx vercel --prod
```

---

## 🏆 Hackathon Judging Criteria Alignment

| Criterion | EcoTrace's Edge |
|---|---|
| **Innovation** | Carbon Orb as emotional feedback — no other tracker does this |
| **Design & UX** | Dark neon aesthetic, mobile-first, 60fps animations |
| **Real-world Impact** | Daily habit loop, not just a one-time calculator |
| **Technical Execution** | Charts, localStorage, responsive, animated, zero dependencies |
| **Presentation** | Clear problem → solution → demo flow |

---

## 🌱 Impact Potential

If 10,000 users reduce their footprint by just 10%:
- **Average footprint**: 4,700 kg CO₂/year
- **10% reduction**: 470 kg/user/year
- **Total impact**: **4,700 tons CO₂ saved per year**
- Equivalent to taking **~1,000 cars off the road**

---

## 🗺️ Future Roadmap

- [ ] AI-powered weekly carbon coaching (Claude API integration)
- [ ] Receipt scanner to auto-log purchases
- [ ] Smart home integration (electricity usage API)
- [ ] Carbon offset marketplace with verified partners
- [ ] Team/organization carbon dashboards
- [ ] Wearable integration for commute auto-detection
- [ ] Carbon footprint API for third-party apps

---

## 👨‍💻 Built For

**Hack 2 Skill — Virtual Prompt War Challenge**
Category: Climate Tech / Sustainability
Stack: Antigravity (Single-file HTML/CSS/JS)

---

## 📄 License

MIT License — free to use, modify, and build upon.

---

> *"The greatest threat to our planet is the belief that someone else will save it."*
> — Robert Swan
>
> **EcoTrace puts the power back in your hands. One day at a time. 🌍**
