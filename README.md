# 🚑 LifeLink — Smart Emergency Medical Response Platform

> Every Second Matters. One-tap emergency response with AI triage, live ambulance tracking, and digital medical ID cards.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **One-Tap SOS** — Hold-to-activate emergency button with GPS auto-location and severity selection
- **AI Triage Chat** — Symptom-based severity assessment with smart routing
- **Live Ambulance Tracking** — Real-time map with ETA countdown and driver info
- **Smart Hospital Matching** — Algorithm matches nearest hospital by specialty, availability, and traffic
- **Digital Medical QR Card** — Scannable QR code with blood type, allergies, medications, emergency contacts
- **4 Role-Based Dashboards** — Patient, Driver, Hospital Staff, Admin
- **Real-time Notifications** — Emergency alerts, ambulance updates, hospital status
- **Command Palette Search** — ⌘K instant navigation across all features
- **Dark Mode** — System-aware theme switching
- **Fully Responsive** — Mobile-first design optimized for emergency use cases

## 🏥 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Patient | `patient@lifelink.com` | `Demo@12345` |
| Driver | `driver@lifelink.com` | `Demo@12345` |
| Hospital | `hospital@lifelink.com` | `Demo@12345` |
| Admin | `admin@lifelink.com` | `Demo@12345` |

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animations | Framer Motion |
| Charts | Recharts |
| State | Zustand (persisted) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| QR Codes | qrcode.react |
| Database | Prisma ORM (SQLite) |
| Auth | NextAuth.js v4 |

## 📦 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/lifelink.git
cd lifelink

# Install dependencies
bun install

# Run database migrations (optional - mock data works without DB)
bun run db:push

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using npm/yarn instead of bun

```bash
npm install        # or: yarn install
npm run dev        # or: yarn dev
```

### Testing QR Codes with Mobile Devices

To test the QR scanning feature from a real phone (across any network), you need to expose your local server to the internet using ngrok:

1. Install [ngrok](https://ngrok.com/) and authenticate with your account token (`ngrok config add-authtoken <token>`).
2. Run `ngrok http 3000` in a new terminal window.
3. Copy the provided public Forwarding URL (e.g., `https://abc-123.ngrok-free.app`).
4. Add it to your `.env` file: `NEXT_PUBLIC_BASE_URL=https://abc-123.ngrok-free.app`
5. Restart your Next.js development server.

Now anyone, regardless of their mobile network or Wi-Fi, can scan the QR cards!

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Login & Signup pages
│   ├── (dashboard)/       # Patient dashboard pages
│   ├── (admin)/           # Admin dashboard pages
│   ├── (hospital)/        # Hospital staff pages
│   ├── (driver)/          # Driver pages
│   └── globals.css        # Global styles & utilities
├── components/
│   ├── landing/           # Landing page sections
│   ├── layout/            # Sidebar, Topbar, DashboardLayout
│   ├── pages/             # All page components (23 pages)
│   ├── dashboard/         # Dashboard widgets & panels
│   ├── sos/               # SOS button & components
│   ├── ai/                # AI triage chat
│   ├── charts/            # Recharts visualizations
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── mock-data.ts       # Mock data (hospitals, users, emergencies)
│   ├── constants.ts       # Navigation, permissions, utilities
│   ├── validations.ts     # Zod schemas
│   └── utils.ts           # Utility functions
├── store/
│   └── index.ts           # Zustand stores (auth, navigation, emergency, UI)
└── types/
    └── index.ts           # TypeScript interfaces
```

## 🎨 Design System

- **Color**: Emergency red as primary, emerald for success, amber for warnings
- **Components**: 60+ components built on shadcn/ui
- **Animations**: Framer Motion with scroll-triggered entrances, stagger effects
- **Dark Mode**: Full support via next-themes
- **Responsive**: Mobile-first with breakpoints at sm/md/lg/xl

## 📄 Pages (23 total)

### Public
- Landing Page, Login, Signup, Emergency Profile (QR scan)

### Patient (9)
- Dashboard, SOS, Ambulance Tracking, Hospitals, Medical Records, QR Card, Notifications, Feedback, Profile

### Admin (5)
- Dashboard (analytics), Users, Hospitals, Ambulances, Emergencies

### Hospital (3)
- Dashboard (bed occupancy), Bed Management, Patient Intake

### Driver (2)
- Dashboard (assignments), Navigation (turn-by-turn)

## 🚀 Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server on port 3000 |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push Prisma schema to database |

## 📝 License

[MIT](./LICENSE) — Feel free to use this project for your own emergency response platform.
