# 🏨 HostelFlow - Hostel Issue Tracking System

A modern, full-stack web application for efficient hostel issue management. Built with React and Node.js, HostelFlow enables students to report issues, track their progress, and communicate with hostel administration in real-time.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.x-61dafb.svg)

## ✨ Features

### 🎯 Core Functionality
- **Issue Reporting** - Students can report hostel issues with descriptions, categories, and image attachments
- **Real-time Tracking** - Track issue status from reported → in-progress → resolved
- **Role-based Access** - Separate portals for students and administrators
- **Comment System** - Interactive discussion threads on each issue
- **Lost & Found** - Dedicated section for reporting lost and found items  

### 🎨 User Experience
- **Premium UI/UX** - Modern glassmorphism design with smooth animations
- **Dark Mode Support** - Eye-friendly dark theme
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **News & Announcements** - Keep students informed with important updates
- **Search & Filter** - Easily find issues by category, status, or keywords

### 👨‍💼 Admin Features
- **Issue Management Dashboard** - Overview of all reported issues with statistics
- **Staff Assignment** - Assign maintenance staff to specific issues
- **Status Updates** - Update issue progress and add administrative notes
- **User Management** - Manage student and staff registrations
- **Announcement Creation** - Post news and updates for all users

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
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📦 Installation

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

# Set up the database (run SQL schema)
psql -U your_username -d your_database -f schema.sql

# Start the development server
npm run dev
```

**Environment Variables (.env):**
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=hostel_management
JWT_SECRET=your_secret_key
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🚀 Usage

### For Students
1. **Register/Login** - Create an account using your hostel credentials
2. **Report Issues** - Submit new issues with descriptions and images
3. **Track Progress** - Monitor the status of your reported issues
4. **Engage** - Comment on issues and communicate with admins
5. **Lost & Found** - Report lost items or claim found items

### For Administrators
1. **Login** - Access the admin portal with your credentials
2. **Dashboard** - View all reported issues and statistics
3. **Manage Issues** - Assign staff, update status, and add notes
4. **Post Announcements** - Keep students informed
5. **User Management** - Create student and staff accounts

## 📁 Project Structure

```
hostel_issue_tracking_system/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Authentication & validation
│   │   ├── routes/         # API routes
│   │   ├── config/         # Database configuration
│   │   └── index.js        # Entry point
│   ├── uploads/            # User-uploaded files
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Auth)
│   │   ├── services/       # API services
│   │   ├── index.css       # Global styles
│   │   └── App.jsx         # Root component
│   ├── public/             # Static assets
│   └── package.json
│
└── README.md
```

## 🎨 Design Features

- **Glassmorphism UI** - Modern frosted glass effect
- **Smooth Animations** - Framer Motion powered transitions
- **Premium Gradients** - Eye-catching gradient backgrounds
- **Responsive Grid Layouts** - Adapts to any screen size
- **Interactive Feedback** - Hover effects and micro-interactions
- **Color-coded Status** - Visual distinction for issue states

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

## 👨‍💻 Author

**Aditya Jain**
- GitHub: [@adityajain-27](https://github.com/adityajain-27)

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Design inspiration from modern SaaS applications
- Built with ❤️ for improving hostel management

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

⭐ Star this repository if you find it helpful!
