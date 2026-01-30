# 🏨 HostelFlow - Hostel Issue Tracking System

A modern, full-stack web application for efficient hostel issue management. Built with React and Node.js, HostelFlow enables students to report issues, track their progress, and communicate with hostel administration in real-time.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.x-61dafb.svg)

## 🌐 Live Demo

🚀 **[View Live Application](https://hostel-issue-tracking-system-djck49zsy.vercel.app/)** 

### Demo Credentials
Test the application with these accounts:

| Role | Email | Password |
|------|-------|----------|
| 👨‍💼 Admin | `admin@example.com` | `admin123` |
| 🎓 Student | `student@example.com` | `student123` |

> **Note:** Demo data is reset periodically. Feel free to create test issues and explore all features!

---

## ✨ Features

### 🎯 Core Functionality
- **Issue Reporting** - Students can report hostel issues with descriptions, categories, and image attachments
- **Real-time Tracking** - Track issue status from reported → in-progress → resolved
- **Role-based Access** - Separate portals for students and administrators
- **Comment System** - Interactive discussion threads on each issue
- **Lost & Found** - Dedicated section for reporting lost and found items  
- **💬 Real-time Chat** - Direct messaging between students and administrators
- **🔔 Live Notifications** - Instant alerts for issue updates and new messages

### 🎨 User Experience
- **Premium UI/UX** - Modern glassmorphism design with smooth animations
- **Dark Mode Support** - Eye-friendly dark theme
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **News & Announcements** - Keep students informed with important updates
- **Search & Filter** - Easily find issues by category, status, or keywords
- **Notification Bell** - Real-time notification badge with dropdown panel

### 👨‍💼 Admin Features
- **Issue Management Dashboard** - Overview of all reported issues with statistics
- **Staff Assignment** - Assign maintenance staff to specific issues
- **Status Updates** - Update issue progress and add administrative notes
- **User Management** - Manage student and staff registrations
- **Announcement Creation** - Post news and updates for all users
- **👥 Student Management** - View all registered students with search functionality
- **📋 Student Detail View** - See student profiles, hostel info, and complete issue history
- **💬 Direct Messaging** - Chat with individual students in real-time
- **🗑️ Unregister Students** - Soft-delete students while preserving historical data

### 🎓 Student Features  
- **Real-time Notifications** - Get instantly notified when issues are resolved or updated
- **Admin Chat** - Dedicated messaging page to communicate with administration
- **Message Alerts** - Receive notifications for new messages from admin

## 🛠️ Tech Stack

### Frontend
- **React** 18.x - Modern UI library
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **Lucide React** - Beautiful icon set
- **React Hot Toast** - Elegant notifications
- **Vite** - Lightning-fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **PostgreSQL** - Relational database (Neon for cloud hosting)
- **Socket.io** - Real-time bidirectional communication
- **JWT** - Authentication and WebSocket auth
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📦 Local Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/adityajain-27/hostel_issue_tracking_system.git
cd hostel_issue_tracking_system
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Set up the database
# 1. Create a database in PostgreSQL
# 2. Run the schema file
psql -U your_username -d your_database -f database/schema.sql
# 3. Run the new features migration (chat, notifications, student management)
psql -U your_username -d your_database -f database/schema_updates.sql
# 4. (Optional) Run the seed file for demo data
psql -U your_username -d your_database -f database/seed.sql

# Start the development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🚀 Deployment Guide for Hackathons

This project is optimized for deployment on **Neon (Database)**, **Render (Backend)**, and **Vercel (Frontend)**.

### 1. Database (Neon)
1. Create a free PostgreSQL project on [Neon.tech](https://neon.tech).
2. Copy the **Connection String**.
3. Use the **SQL Editor** in Neon to run:
   - First: `backend/database/schema.sql` (creates base tables)
   - Then: `backend/database/schema_updates.sql` (adds chat, notifications, student management)
4. (Optional) Run `backend/database/seed.sql` to populate demo data.

### 2. Backend (Render)
1. Create a new **Web Service** on [Render.com](https://render.com).
2. Connect your repository.
3. Set **Root Directory** to `backend`.
4. Add Environment Variables:
   - `DATABASE_URL`: (Paste Neon Connection String)
   - `JWT_SECRET`: (Your secret key)
   - `NODE_ENV`: `production`

### 3. Frontend (Vercel)
1. Import project into [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add Environment Variables:
   - `VITE_API_URL`: (Your Render Backend URL, e.g., `https://your-app.onrender.com/api`)
4. Deploy!

## 🔐 Environment Variables

### Backend (.env)
| Variable | Description | Local Example | Production Example |
|----------|-------------|---------------|-------------------|
| `PORT` | Server Port | `5000` | (Auto-set by Render) |
| `DB_HOST` | Database Host | `localhost` | (Not needed if using DATABASE_URL) |
| `DB_USER` | Database User | `postgres` | (Not needed if using DATABASE_URL) |
| `DB_PASSWORD` | Database Password | `password` | (Not needed if using DATABASE_URL) |
| `DB_NAME` | Database Name | `hostel_db` | (Not needed if using DATABASE_URL) |
| `DATABASE_URL` | Full Connection String | (Optional) | `postgres://user:pass@host.neon.tech/db` |
| `JWT_SECRET` | Secret for Tokens | `secret123` | `complex_production_secret` |

### Frontend
| Variable | Description | Local | Production (Vercel) |
|----------|-------------|-------|---------------------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` | `https://your-app.onrender.com/api` |

## 🚀 Usage

### For Students
1. **Register/Login** - Create an account using your hostel credentials
2. **Report Issues** - Submit new issues with descriptions and images
3. **Track Progress** - Monitor the status of your reported issues
4. **Engage** - Comment on issues and communicate with admins
5. **💬 Chat with Admin** - Send direct messages via the Messages page
6. **🔔 Notifications** - Get real-time alerts when issues are resolved or receive messages
7. **Lost & Found** - Report lost items or claim found items

### For Administrators
- **Default Admin Login**: `admin@hostel.com` / `admin123` (if seeded)
1. **Login** - Access the admin portal with your credentials
2. **Dashboard** - View all reported issues and statistics
3. **Manage Issues** - Assign staff, update status, and add notes (triggers student notifications)
4. **👥 Student Management** - View list of all registered students, search by name/hostel
5. **📋 Student Details** - View individual student profiles with issue history and chat
6. **💬 Direct Chat** - Message any student in real-time from their profile page
7. **🗑️ Unregister Students** - Deactivate student accounts (preserves issue history)
8. **🔔 Notifications** - Receive alerts when students send messages
9. **Post Announcements** - Keep students informed
10. **User Management** - Create student and staff accounts

## 📁 Project Structure

```
hostel_issue_tracking_system/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Authentication & validation
│   │   ├── routes/         # API routes
│   │   ├── index.js        # Entry point
│   ├── database/           # SQL schema and seed files
│   └── uploads/            # User-uploaded files
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Auth)
│   │   ├── services/       # API services
│   │   ├── index.css       # Global styles
│   │   └── App.jsx         # Root component
│   └── public/             # Static assets
└── README.md
```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based authorization
- Input validation and sanitization
- CORS configuration
- Secure file upload handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

**Aditya Jain**
- GitHub: [@adityajain-27](https://github.com/adityajain-27)
- Role: Backend Development, Database Design, Deployment

**[Collaborator Name]**
- GitHub: [@collaborator-username](https://github.com/collaborator-username)
- Role: Frontend Development, UI/UX Design

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Design inspiration from modern SaaS applications
- Built with ❤️ for improving hostel management

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

⭐ Star this repository if you find it helpful!
