# Project Report: Personal Portfolio Website

**Project Title:** Codeforces-Themed Personal Portfolio Website  
**Developer:** Himanshu Kumar  
**Date:** July 2026  
**Technology:** Next.js 16, TypeScript, SQLite, NextAuth.js v5  

---

## 1. Introduction

### 1.1 Purpose
This project is a full-stack personal portfolio website designed to showcase professional skills, projects, work experience, and education. It features an admin dashboard for dynamic content management and a public-facing portfolio with a unique Codeforces-inspired design aesthetic.

### 1.2 Scope
The application covers:
- Responsive public portfolio with 5 main pages
- Admin dashboard with full CRUD capabilities for all content
- Secure authentication with JWT-based sessions
- Contact form with message management
- SQLite database for persistent storage
- Server-side rendering for SEO optimization

### 1.3 Design Philosophy
The UI draws inspiration from Codeforces — the competitive programming platform — emphasizing:
- Information-dense, tabular layouts
- Functional color-coding (rating system)
- Professional, utilitarian aesthetic
- Clean typography with monospace accents

---

## 2. System Architecture

### 2.1 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Client Browser                 │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ React Client │  │ Server-Rendered Pages    │ │
│  │  Components  │  │ (SSR/SSG via Next.js)    │ │
│  └──────────────┘  └──────────────────────────┘ │
└────────────────────────┬────────────────────────┘
                         │ HTTP/HTTPS
┌────────────────────────▼────────────────────────┐
│              Next.js Application Server          │
│  ┌────────────┐ ┌────────────┐ ┌──────────────┐ │
│  │  App Router│ │  Server    │ │  Middleware   │ │
│  │  (Pages)   │ │  Actions   │ │  (Auth Gate)  │ │
│  └────────────┘ └──────┬─────┘ └──────────────┘ │
│                        │                         │
│  ┌─────────────────────▼───────────────────────┐ │
│  │            Drizzle ORM (Type-safe)          │ │
│  └─────────────────────┬───────────────────────┘ │
│                        │                         │
│  ┌─────────────────────▼───────────────────────┐ │
│  │         SQLite Database (portfolio.db)       │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js | 16.2.10 | Full-stack React framework |
| Language | TypeScript | 5.x | Type safety |
| UI Library | React | 19.2.4 | Component-based UI |
| Database | SQLite | via better-sqlite3 13.x | Data persistence |
| ORM | Drizzle ORM | 0.45.x | Type-safe database queries |
| Authentication | NextAuth.js | 5.0.0-beta | User authentication |
| Password Hashing | bcryptjs | 3.x | Secure password storage |
| Styling | Vanilla CSS | - | Custom design system |
| Bundler | Turbopack | Built-in | Fast compilation |

### 2.3 Design Patterns

- **Server Components**: All public pages use React Server Components for optimal performance and SEO
- **Client Components**: Interactive features (forms, modals, sidebar) use client-side React
- **Server Actions**: All database mutations use Next.js Server Actions (no separate API layer)
- **Singleton Pattern**: Database connection uses global singleton to prevent connection leaks
- **Middleware Pattern**: Edge-compatible auth middleware for route protection

---

## 3. Database Design

### 3.1 Schema Overview

The database consists of 7 tables:

1. **users** — Admin authentication (single user)
2. **profile** — Personal information and social links
3. **skills** — Technical skills with proficiency ratings
4. **projects** — Portfolio project showcases
5. **experience** — Professional work history
6. **education** — Academic background
7. **contact_messages** — Public contact form submissions

### 3.2 Key Design Decisions

- **SQLite**: Chosen for zero-configuration, file-based storage ideal for a personal portfolio
- **WAL Mode**: Enabled for better concurrent read performance during build and runtime
- **Busy Timeout**: Set to 5 seconds to handle concurrent access during SSG builds
- **Text Dates**: Dates stored as TEXT for SQLite compatibility and human readability
- **Comma-Separated Tech Stack**: Simple text field rather than a junction table for simplicity

> Full schema documentation: See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)

---

## 4. Feature Implementation

### 4.1 Public Portfolio

#### Home Page (`/`)
- Server-side rendered profile card with CF-style handle and rating
- Stats grid showing project count, skills, positions, and rating
- Featured projects table (CF problem-set style)
- Recent experience section
- Sidebar with user info, top skills, and quick links

#### Projects Page (`/projects`)
- Full project listing in CF-style table
- Tech stack shown as tags
- Status badges (completed, in-progress, archived)
- Live demo and source code links

#### Skills Page (`/skills`)
- Skills grouped by category (Language, Framework, Tool)
- CF-rating colored proficiency bars
- Numeric rating conversion (0-100% → 0-3000)
- Color legend panel

#### Experience Page (`/experience`)
- Timeline view with visual indicators
- Table view for compact display
- Education section with GPA/scores
- Date formatting utilities

#### Contact Page (`/contact`)
- Client-side form with validation
- Server Action for form submission
- Success/error feedback states
- Contact information sidebar
- Availability status panel

### 4.2 Admin Dashboard

#### Authentication
- Credentials-based login (username/password)
- JWT session strategy (stateless, no server-side session storage)
- Edge-compatible middleware for route protection
- Automatic redirect: unauthenticated → login, authenticated → dashboard

#### Dashboard (`/admin/dashboard`)
- Stats cards: projects, skills, experience, messages
- Unread message notifications
- Recent messages table
- Profile summary
- Quick action buttons

#### Profile Management (`/admin/profile`)
- Edit all profile fields via form
- Rank selection dropdown
- Social link inputs

#### CRUD Operations
- **Projects**: Add/Edit/Delete with modal forms, tech stack input, status and featured toggles
- **Skills**: Add/Edit/Delete with category selector, proficiency slider
- **Experience**: Add/Edit/Delete with date pickers, location

#### Messages (`/admin/messages`)
- View all contact submissions
- Mark as read/unread
- Delete messages
- Message detail expansion

### 4.3 Design System

The CSS design system (`globals.css`, 1400+ lines) implements:

- **CSS Custom Properties**: 50+ design tokens for colors, spacing, typography
- **CF Rating Colors**: Full color scale from newbie (gray) to legendary grandmaster (red)
- **Component Styles**: Panel, table, form, button, badge, timeline, modal classes
- **Responsive Breakpoints**: 900px (tablet), 600px (mobile)
- **Print Styles**: Clean print output with hidden navigation/buttons
- **Scrollbar Styling**: Custom scrollbar for webkit browsers

---

## 5. Security Considerations

| Feature | Implementation |
|---|---|
| Password Storage | bcrypt with 12 salt rounds |
| Session Management | JWT tokens (HttpOnly cookies) |
| Route Protection | Middleware-level auth checks |
| CSRF Protection | Built-in via Next.js Server Actions |
| Admin Authorization | Server-side session verification on all mutations |
| Input Handling | Server-side form data extraction and validation |

---

## 6. Performance Optimizations

- **Static Generation**: Public pages pre-rendered at build time (SSG)
- **Server Components**: No client-side JavaScript for static content
- **WAL Mode**: SQLite write-ahead logging for concurrent reads
- **Singleton DB**: Single database connection per process
- **Edge Middleware**: Lightweight auth checks at the edge
- **Font Optimization**: Google Fonts loaded with `display=swap`

---

## 7. Testing & Verification

### Build Verification
```bash
npm run build    # ✅ Successful production build
npm run lint     # ✅ No ESLint errors
```

### Route Verification
All 15 routes compile and render:
- 5 static public pages (SSG)
- 7 dynamic admin pages (SSR)
- 1 API route (NextAuth)
- 1 middleware (auth)
- 1 404 page

### Functional Testing
- ✅ Public page rendering with seeded data
- ✅ Admin login/logout flow
- ✅ CRUD operations via admin panels
- ✅ Contact form submission
- ✅ Responsive layout verification
- ✅ Route protection (unauthenticated redirect)

---

## 8. Deployment Guide

### Environment Variables
```env
NEXTAUTH_SECRET=<random-32-character-string>
NEXTAUTH_URL=https://your-domain.com
```

### Build & Deploy
```bash
npm install
npm run db:seed     # First time only
npm run build
npm start           # Runs on port 3000
```

### Vercel Deployment
> Note: SQLite is file-based and works locally. For production deployment on serverless platforms (Vercel), consider migrating to PostgreSQL (Neon/Supabase) or Turso (LibSQL).

---

## 9. Future Enhancements

- [ ] Blog/Articles section with markdown support
- [ ] Dark mode toggle
- [ ] Image upload for projects (file or S3)
- [ ] Email notifications for contact form
- [ ] Analytics dashboard with visitor stats
- [ ] Export portfolio as PDF
- [ ] Achievements/certifications section
- [ ] Competitive programming stats integration (Codeforces API)

---

## 10. Conclusion

This project delivers a complete, production-ready portfolio website with a distinctive Codeforces-inspired design. The full-stack architecture with Next.js provides excellent performance through server-side rendering, while the admin dashboard enables dynamic content management without code changes. The modular codebase is well-structured for future extensions and customization.
