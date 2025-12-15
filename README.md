# Last Moment Tuitions (LMT) Platform

This repository contains the source code for the Last Moment Tuitions platform, architected as a **Monorepo** containing both the Frontend (Next.js) and Backend (Express.js).

## 🏗 Project Structure

The project is organized into workspaces:

- **`frontend/`**: The modern User Interface built with **Next.js 14+ (App Router)**.
  - Handles all public pages, the Admin Dashboard, and dynamic content rendering.
  - Uses **Tailwind CSS** for styling.
- **`backend/`**: The API layer built with **Express.js**.
  - Handles database operations (MongoDB) and serves API endpoints.
  - Designed to be deployed as a Vercel Serverless Function.
- **`_legacy_backup/`**: Contains the original Vite+React source code (for reference).

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas)

### 1. Installation

Install dependencies for both frontend and backend from the root directory:

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the **root** or `backend/` directory to configure your database connection:

```env
# backend/.env
MONGODB_URI=mongodb://localhost:27017/lmt_db
# Or your MongoDB Atlas connection string
```

### 3. Running the Application

We use `concurrently` to run both the Next.js frontend and Express backend with a single command:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001/api/hello](http://localhost:3001/api/hello) (Proxied via Next.js to `/api/*`)

## 🛠 Features

### Admin CMS & Page Builder
The platform includes a built-in Content Management System (CMS) to manage pages dynamically.

- **Access**: Navigate to `/admin/pages/create`
- **Functionality**:
  - create new pages with custom Slugs (e.g., `/summer-sale`).
  - Use the **Page Builder** to add dynamic blocks:
    - **Hero Block**: Banner with headline, subtext, and call-to-action.
    - **Text Block**: Rich text content sections.
  - Pages are automatically rendered at their slug URL (ISR enabled).

### Dynamic Routing
The application uses Next.js Catch-all routes (`[...slug]`) to fetch and render pages created via the CMS from MongoDB.

## 📦 Deployment

The project is configured for seamless deployment on **Vercel**.

- **`vercel.json`**: Configures routing so that all `/api/*` requests are handled by the Backend, and all other requests are handled by the Frontend.
- **Build Command**: `npm run build` (Next.js handles the build).

## 📝 Scripts

- `npm run dev`: Starts both frontend and backend in development mode.
- `npm run build`: Builds the frontend application for production.
