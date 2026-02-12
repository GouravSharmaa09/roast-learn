# 🔥 Roast My Code

> **AI-powered code roaster** that brutally reviews your code in Hinglish — learn from your mistakes with roasts, quizzes, and streaks!

🌐 **Live:** [www.roast-my-code.in](https://www.roast-my-code.in)

---

## ✨ Features

- 🔥 **AI Code Roasting** — Get brutally honest Hinglish roasts on your code
- 📸 **Image-to-Code** — Upload code screenshots, AI extracts and roasts them
- 🧠 **Quiz Mode** — Test if you actually learned from the roast
- 📅 **Daily Challenges** — Fresh coding challenges every day
- 🔊 **Sound Effects** — Immersive audio feedback
- 📱 **PWA Support** — Install as app, works offline
- 📊 **Roast History** — Track all your past roasts
- 🏆 **Streak System** — Maintain daily coding streaks

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Lovable Cloud (Edge Functions) |
| AI Models | Google Gemini 2.5 Flash & Pro |
| SEO | react-helmet-async, JSON-LD Schema |
| PWA | vite-plugin-pwa |

## 📁 Project Structure

```
roast-my-code/
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   ├── landing/
│   │   │   └── Hero.tsx              # Landing page hero section
│   │   ├── layout/
│   │   │   └── Header.tsx            # App header/navbar
│   │   ├── roast/
│   │   │   ├── CodeEditor.tsx        # Code input editor
│   │   │   ├── CodeBlock.tsx         # Syntax highlighted code
│   │   │   ├── DailyChallenge.tsx    # Daily challenge widget
│   │   │   ├── ExplainBack.tsx       # Explain-back feature
│   │   │   ├── ImageUpload.tsx       # Screenshot upload
│   │   │   ├── InlineCodeEditor.tsx  # Inline code editor
│   │   │   ├── LoadingSkeleton.tsx   # Loading states
│   │   │   ├── MemoryHook.tsx        # Memory hook component
│   │   │   ├── QuizSection.tsx       # Quiz after roast
│   │   │   ├── ResultSection.tsx     # Roast results display
│   │   │   ├── RoastHistory.tsx      # History panel
│   │   │   ├── ShareCard.tsx         # Social share card
│   │   │   └── StreakBadge.tsx       # Streak display
│   │   ├── pwa/
│   │   │   ├── InstallPrompt.tsx     # PWA install prompt
│   │   │   └── OfflineIndicator.tsx  # Offline status
│   │   └── ui/                       # shadcn/ui components
│   ├── hooks/
│   │   ├── useDailyChallenge.ts      # Daily challenge logic
│   │   ├── useRoastHistory.ts        # History management
│   │   ├── useSoundEffects.ts        # Audio feedback
│   │   └── useStreak.ts             # Streak tracking
│   ├── pages/
│   │   ├── Index.tsx                 # Homepage
│   │   ├── RoastJavaScript.tsx       # JS roast page
│   │   ├── RoastPython.tsx           # Python roast page
│   │   ├── AICodeReview.tsx          # AI review page
│   │   ├── About.tsx                 # About page
│   │   └── NotFound.tsx              # 404 page
│   ├── types/
│   │   └── roast.ts                  # TypeScript types
│   └── App.tsx                       # App router & providers
├── supabase/
│   └── functions/
│       ├── roast-code/index.ts       # AI roasting logic
│       └── analyze-image/index.ts    # Image-to-code extraction
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm or bun

### Clone & Run

```sh
# Clone the repository
git clone https://github.com/Gourav-sharma21/roast-my-code.git

# Navigate to project
cd roast-my-code

# Install dependencies
npm install

# Start development server
npm run dev
```

App will be running at `http://localhost:5173`

## 🌐 SEO & Performance

- ✅ Meta tags, Open Graph & Twitter Cards on every page
- ✅ JSON-LD structured data (WebApplication + FAQ)
- ✅ `sitemap.xml` & `robots.txt`
- ✅ Canonical URLs
- ✅ Mobile-first responsive design
- ✅ PWA with offline support

## 📄 Pages

| Route | Description |
|-------|------------|
| `/` | Homepage with hero, editor & daily challenge |
| `/roast-javascript-code` | JavaScript-specific roasting |
| `/roast-python-code` | Python-specific roasting |
| `/ai-code-review` | General AI code review |
| `/about` | About the project |

## 👨‍💻 Author

**Gourav Sharma**

Built with 🔥 and mass code roasting energy.

---

© 2025 Roast My Code. All rights reserved.
