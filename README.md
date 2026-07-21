# Personal Portfolio Website — Codeforces-Themed

A full-stack personal portfolio website built with **Next.js 15**, featuring a Codeforces-inspired design aesthetic with an admin dashboard for dynamic content management.

## 🌐 Live Features

### Public Pages
- **Home** — Profile card with CF-style rating, rank, handle, stats, bio, and sidebar
- **Projects** — Tabular problem-set style listing with tech stack tags and status badges
- **Skills** — Grouped by category with CF-rating colored proficiency bars
- **Experience** — Timeline + table view for work history and education
- **Contact** — Form with server-side submission, availability panel

### Admin Dashboard (Protected)
- **Dashboard** — Overview stats, recent messages, profile summary, quick actions
- **Profile Management** — Edit name, title, bio, handle, rating, rank, links
- **Projects CRUD** — Add, edit, delete portfolio projects
- **Skills CRUD** — Manage skills with categories and proficiency levels
- **Experience CRUD** — Manage work experience entries
- **Messages Viewer** — Read, mark as read/unread, delete contact submissions

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | SQLite via better-sqlite3 |
| ORM | Drizzle ORM |
| Authentication | NextAuth.js v5 (Auth.js) |
| Styling | Vanilla CSS + CSS Custom Properties |
| Deployment | Vercel-ready |

## 🎨 Design Theme

Codeforces-inspired utilitarian aesthetic:
- **Rating-colored handles** (newbie → legendary grandmaster color scale)
- **Dense tabular layouts** — data-first, CF problem-set style
- **Flat design** — minimal shadows, sharp edges
- **Classic top navigation bar** with blue theme and orange accent border
- **Monospace fonts** for handles, ratings, and technical content
- **Sidebar panels** for quick info display

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/himanshuzen10x/personal-portfolio.git
cd personal-portfolio/portfolio-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values:
# NEXTAUTH_SECRET=your-secret-key
# NEXTAUTH_URL=http://localhost:3000

# Seed the database
npm run db:seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Admin Access

Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Default credentials:**
- Username: `admin`
- Password: `admin123`

> ⚠️ Change the admin password in production via the database.

## 📁 Project Structure

```
portfolio-app/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home page
│   │   ├── layout.tsx                  # Root layout with navbar
│   │   ├── globals.css                 # Codeforces design system
│   │   ├── projects/page.tsx           # Projects page
│   │   ├── skills/page.tsx             # Skills page
│   │   ├── experience/page.tsx         # Experience & Education
│   │   ├── contact/page.tsx            # Contact form
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Admin layout with sidebar
│   │   │   ├── login/page.tsx          # Admin login
│   │   │   ├── dashboard/page.tsx      # Dashboard overview
│   │   │   ├── profile/page.tsx        # Profile editor
│   │   │   ├── projects/page.tsx       # Projects CRUD
│   │   │   ├── skills/page.tsx         # Skills CRUD
│   │   │   ├── experience/page.tsx     # Experience CRUD
│   │   │   └── messages/page.tsx       # Messages viewer
│   │   └── api/auth/[...nextauth]/     # NextAuth API route
│   ├── components/
│   │   ├── Navbar.tsx                  # Top navigation bar
│   │   ├── AdminSidebar.tsx            # Admin sidebar navigation
│   │   ├── ProfileForm.tsx             # Profile edit form
│   │   ├── AdminProjectsClient.tsx     # Projects CRUD client
│   │   ├── AdminSkillsClient.tsx       # Skills CRUD client
│   │   ├── AdminExperienceClient.tsx   # Experience CRUD client
│   │   └── AdminMessagesClient.tsx     # Messages viewer client
│   ├── lib/
│   │   ├── actions.ts                  # Server actions (all CRUD)
│   │   ├── utils.ts                    # Utility functions
│   │   ├── auth/
│   │   │   ├── config.ts               # Edge-compatible auth config
│   │   │   └── index.ts                # Full auth with DB access
│   │   └── db/
│   │       ├── index.ts                # Database connection
│   │       ├── schema.ts              # Drizzle ORM schema
│   │       └── seed.ts                 # Database seeding script
│   └── middleware.ts                   # Route protection
├── portfolio.db                        # SQLite database file
├── package.json
├── tsconfig.json
├── DATABASE_SCHEMA.md                  # Database documentation
└── PROJECT_REPORT.md                   # Project report
```

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:seed` | Seed the database with sample data |

## 📊 Database

- **Engine**: SQLite (file-based, zero configuration)
- **ORM**: Drizzle ORM for type-safe queries
- **File**: `portfolio.db` in project root
- See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for full schema documentation

## 🔐 Authentication

- **Provider**: NextAuth.js v5 with Credentials provider
- **Strategy**: JWT-based sessions
- **Middleware**: Edge-compatible route protection for `/admin/*`
- **Password hashing**: bcryptjs with 12 salt rounds

## 📱 Responsive Design

- Desktop: Full sidebar + main content layout
- Tablet (≤900px): Stacked layout, horizontal admin nav
- Mobile (≤600px): Hamburger menu, compact tables, optimized cards

## 📄 License

This project is for personal/educational use.
