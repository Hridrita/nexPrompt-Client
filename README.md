# NexPrompt — AI Prompt Sharing & Marketplace Platform

> NexPrompt is a full-stack web application that allows users to create, discover, share, bookmark, and manage AI prompts for various AI tools like ChatGPT, Gemini, Claude, Midjourney, and more. The platform fosters a community-driven ecosystem where users can exchange high-quality AI prompts securely and efficiently.
---

## 🌐 Live URL

**Frontend:** https://nexprompt-brown.vercel.app <br>
**Backend API:** https://nexprompt-server.vercel.app/api/prompts

---

## 🔐 Admin Credentials

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@gmail.com`  |
| Password | `123456789Aww`            |

---

## 📌 Project Purpose

NexPrompt enables users to publish, discover, and interact with AI prompts across various AI tools. The platform supports role-based access (User, Creator, Admin), a premium subscription system via Stripe, prompt moderation workflows, analytics dashboards, and a full review/bookmark/report ecosystem.

---

## ✨ Key Features

### 🔑 Authentication & Authorization
- Email/password registration and login
- Google OAuth social login
- JWT-based session management with Better Auth + JWT plugin
- Role-based access control: **User**, **Creator**, **Admin**
- Protected routes enforced on both frontend (middleware) and backend (verifyToken + verifyRole)

### 🏠 Home Page
- Animated hero/banner with search bar, trending tags, and CTA
- Featured Prompts section (6 prompts via MongoDB limit)
- Top Creators section (dynamic, sorted by approved prompt count)
- Customer Reviews section (aggregated from prompt reviews)
- "Why Choose Us" and additional marketing sections
- Framer Motion animations throughout

### 📋 All Prompts Page
- Paginated prompt listing (server-side, 12 per page)
- Search by title, tags, AI tool
- Filter by category, AI tool, difficulty level
- Sort by most popular (rating), most copied, latest
- All filtering/sorting implemented server-side

### 📄 Prompt Details Page (Private)
- Full prompt details: title, description, content, category, tags, AI tool, difficulty, creator info, copy count, reviews
- **Public prompts**: full content visible to logged-in users
- **Private/Premium prompts**: content blurred/locked for non-premium users; unlocked after Stripe payment
- Bookmark toggle with duplicate prevention
- Copy to clipboard with copy count increment
- Star rating + review submission
- Report prompt modal (reason + optional description)

### 💳 Payment Page (Private)
- Stripe one-time $5 payment to unlock Premium access
- Success page updates user plan in MongoDB and saves subscription record
- Redirects back to the originating page after payment

### 👤 User Dashboard
- **Add Prompt** — full form with image upload (ImgBB), visibility toggle (public/private), free user limited to 3 prompts
- **My Prompts** — table view with update, delete, view analytics actions
- **Saved Prompts** — bookmarked prompts with remove and view details
- **My Reviews** — all reviews submitted by the user
- **Profile** — name, email, photo, role, total prompts, subscription status; upgrade CTA for free users

### 🎨 Creator Dashboard
- Analytics cards: total prompts, total copies, total bookmarks
- Recharts: copies over time, prompt growth chart
- Add Prompt and My Prompts (same as User Dashboard)

### 🛠️ Admin Dashboard
- **All Users** — table with role change and delete actions
- **All Prompts** — approve, reject (with feedback), delete, feature/unfeature; paginated
- **All Payments** — subscription records with user details
- **Reported Prompts** — remove prompt, warn creator, dismiss report
- **Analytics** — total users, prompts, reviews, copies; charts over time (daily/weekly/monthly)

---

## 🧰 NPM Packages Used

### Frontend (Next.js)
| Package | Purpose |
|---|---|
| `next` | React framework with App Router |
| `react`, `react-dom` | UI library |
| `better-auth` | Authentication (email, Google, JWT plugin) |
| `framer-motion` | Animations (banner, cards, reviews) |
| `react-hook-form` | Form state management |
| `@hookform/resolvers` + `zod` | Schema-based form validation |
| `recharts` | Analytics charts (Creator & Admin dashboards) |
| `react-hot-toast` | Toast notifications |
| `@stripe/stripe-js` | Stripe frontend integration |
| `lucide-react` | Icon library |
| `@gravity-ui/icons` | Additional icon set |
| `tailwindcss` | Utility-first CSS framework |
| `clsx` | Conditional className utility |

### Backend (Express.js)
| Package | Purpose |
|---|---|
| `express` | HTTP server framework |
| `mongodb` | MongoDB native driver |
| `dotenv` | Environment variable loading |
| `cors` | Cross-Origin Resource Sharing |
| `jose-cjs` | JWT verification via JWKS endpoint |
| `stripe` | Stripe payment processing (used in Next.js API route) |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | Better Auth (JWT plugin, Google OAuth) |
| Payments | Stripe (one-time payment) |
| Image Upload | ImgBB API |
| Deployment | Vercel (frontend + backend) |
| Animation | Framer Motion |
| Charts | Recharts |

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Stripe account
- ImgBB API key

### Frontend
```bash
git clone https://github.com/Hridrita/nexPrompt-Client.git
cd nexprompt
npm install

npm run dev
```

### Backend
```bash
git clone https://github.com/Hridrita/nexPrompt-server.git
cd nexprompt-server
npm install

node index.js
```

---

## 📊 MongoDB Aggregation Usage

Aggregation is used in:
- **Top Creators** — aggregates total copies and bookmarks per creator across approved prompts
- **Admin Analytics** — aggregates review counts, copy counts, rating distributions across all prompts
- **Analytics Over Time** — groups users and prompts by day/week/month using `$group` with date operators

---

## 📄 Pagination

Implemented server-side pagination on:
1. **All Prompts page** — 12 prompts per page
2. **Admin → All Prompts** — 10 prompts per page with status filter

---

