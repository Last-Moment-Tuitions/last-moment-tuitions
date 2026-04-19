# Last Moment Tuitions (LMT) Platform 🎓

A modern, high-performance educational platform built with **Next.js 14**, **Express.js**, and **MongoDB**. This monorepo houses both the frontend application and the backend API, designed for seamless serverless deployment.

---

## 🏗 Architecture

The project is split into two distinct workspaces:

1.  **`frontend/`** (Next.js 14 App Router)
    *   **User Facing**: Fast, SEO-optimized pages for students.
    *   **Admin Panel**: A rich CMS for managing content, templates, and analytics.
    *   **Tech**: Tailwind CSS, Lucide React, GrapesJS (Page Builder).
    *   **Port**: `3000`

2.  **`backend/`** (Express.js)
    *   **API Layer**: Handles all logic (`/api/*`), Database connections, and CRUD operations.
    *   **Database**: MongoDB (Page content, User data, Analytics).
    *   **Port**: `3005` (Proxied by Next.js in dev)

---

## 🚀 Getting Started

### Prerequisites
*   Node.js v18+
*   MongoDB (Local or Atlas)

### 1. Installation
Run from the root directory:
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in **root** (or `backend/`):
```env
MONGODB_URI=mongodb://localhost:27017/lmt_db
```

### 3. Development
Start both Frontend and Backend with one command:
```bash
npm run dev
```
*   **App**: [http://localhost:3000](http://localhost:3000)
*   **Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## ✨ Key Features

### 📂 File Manager System
We've replaced the traditional flat list of pages with a powerful **File Manager**:
*   **Folders**: Organize content into unlimited nested categories (e.g., `Engineering > Sem 1 > Maths`).
*   **Breadcrumbs**: Easy navigation through the hierarchy.
*   **Grid View**: Visual cards for folders and pages, distinct from a dry table.

### 🎨 Global Templates System
No more copy-pasting headers!
*   **Reference-Based Templates**: Create a Master Template (like `Global Header`).
*   **Live Updates**: Editing the Master Template instantly updates **every page** that uses it.
*   **Default Layout**: New pages are automatically seeded with a **Sticky Header** and **Footer** by default.

### 📝 Visual Page Builder
Integrated **GrapesJS** editor tailored for LMT:
*   **Drag & Drop**: Build complex layouts without code.
*   **Custom Blocks**: Pre-built sections (Hero, Features, Pricing) matching the brand design.
*   **Live Preview**: See exactly how your page will look before publishing.

### 📊 Built-in Analytics
*   **View Tracking**: Every page view is recorded.
*   **SEO Health**: Visual indicators (Green/Yellow/Red dots) show if a page is SEO-ready (Title, Description, etc.).
*   **Dashboard**: High-level stats on growth and performance.

---

## 📦 Deployment (Vercel)

The project is pre-configured for Vercel using `vercel.json`.
*   **Frontend**: Served as the main app.
*   **Backend**: Deployed as Serverless Functions handling `/api/*`.

**Build Command**:
```bash
npm run build
```

---

## 🛠 Tech Stack
*   **Framework**: Next.js 14 (React)
*   **Styling**: Tailwind CSS
*   **Backend**: Express.js
*   **Database**: MongoDB (Mongoose)
*   **Icons**: Lucide React
*   **Editor**: GrapesJS

---

## 📂 Directory Structure    
```
root/
├── frontend/             # Next.js App
│   ├── app/              # App Router (Pages & Admin)
│   ├── components/       # UI Components
│   └── public/           # Static Assets
├── backend/              # Express App
│   ├── api/              # API Routes
│   ├── models/           # Mongoose Models
│   └── db/               # Database Config
├── _legacy_backup/       # Reference Code
└── package.json          # Root Scripts
```
