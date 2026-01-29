# 🚀 HostelFlow - Hackathon Deployment Guide

This guide will help you deploy your full-stack application (PostgreSQL + Express + React) for your hackathon presentation.

## 📋 Prerequisites
- **GitHub Account** (Push your code!)
- **Neon Account** (Free Database)
- **Render Account** (Free Backend)
- **Vercel Account** (Free Frontend)

---

## Part 1: The Database (Neon) 🗄️

1.  **Create a Database**
    *   Log in to [Neon.tech](https://neon.tech)
    *   Create a new project (e.g., `hostelflow-db`)
    *   **COPY** the connection string from the Dashboard. It looks like:
        ```
        postgres://neondb_owner:...........@ep-cool-cloud.aws.neon.tech/neondb?sslmode=require
        ```

2.  **Set Up Tables (Schema)**
    *   Go to the **SQL Editor** tab in Neon.
    *   Open the file `backend/database/schema.sql` in your local project.
    *   Copy **ALL** the code and paste it into the Neon SQL Editor.
    *   Click **Run**. (Currently creates `users`, `issues`, etc.)

3.  **Add Demo Data (Seed)**
    *   Clear the editor.
    *   Open `backend/database/seed.sql` locally.
    *   Copy & Paste into Neon SQL Editor -> **Run**.
    *   *Now you have a working admin account: `admin@hostel.com` / `admin123`*

---

## Part 2: The Backend (Render) ⚙️

1.  **Push Code to GitHub**
    *   Make sure your latest code is on GitHub.

2.  **Create Service**
    *   Log in to [Render.com](https://render.com)
    *   Click **New +** -> **Web Service**
    *   Connect your GitHub repo.

3.  **Configure Settings**
    *   **Name:** `hostelflow-api` (or unique name)
    *   **Root Directory:** `backend`  <-- IMPORTANT
    *   **Runtime:** Node
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start` (or `node index.js`)

4.  **Environment Variables** (Scroll down to "Environment Variables")
    *   Add the following keys and values:

    | Key | Value |
    | :--- | :--- |
    | `DATABASE_URL` | *(Paste your Neon Connection String from Part 1)* |
    | `JWT_SECRET` | `hackathon-secret-key-123` (or anything secure) |
    | `NODE_ENV` | `production` |

5.  **Deploy**
    *   Click **Create Web Service**.
    *   Wait for it to say "Live".
    *   **COPY** your new backend URL from the top left (e.g., `https://hostelflow-api.onrender.com`).

---

## Part 3: The Frontend (Vercel) 🎨

1.  **Deploy Project**
    *   Log in to [Vercel.com](https://vercel.com)
    *   Click **Add New...** -> **Project**
    *   Import your GitHub repo.

2.  **Configure Settings**
    *   **Framework Preset:** Vite (should Auto-detect)
    *   **Root Directory:** Click "Edit" and select `frontend`.

3.  **Environment Variables**
    *   Expand "Environment Variables".
    *   Add this **CRITICAL** variable so your frontend talks to your deployed backend:

    | Key | Value |
    | :--- | :--- |
    | `VITE_API_URL` | *(Paste your Render Backend URL from Part 2)* |
    
    *Example Value:* `https://hostelflow-api.onrender.com/api`  
    *(Note: Add `/api` at the end if your backend routes are prefixed with /api)*

4.  **Deploy**
    *   Click **Deploy**.
    *   Wait a moment... and you are LIVE! 🚀

---

## 🛑 Troubleshooting

-   **Database Errors?** Check your `DATABASE_URL` in Render. It must start with `postgres://`.
-   **Login Fails?** Check if you ran the `seed.sql` in Neon.
-   **Frontend blank?** Check the Browser Console (F12). If you see CORS errors, you might need to update your Backend `cors` config to accept the Vercel domain (or just `*` for hackathons).
