import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import issueRoutes from "../routes/issueRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import announcementRoutes from "../routes/announcementRoutes.js";
import lostFoundRoutes from "../routes/lostFoundRoutes.js";
import commentRoutes from "../routes/commentRoutes.js";
import studentRoutes from "../routes/studentRoutes.js";
import messageRoutes from "../routes/messageRoutes.js";
import notificationRoutes from "../routes/notificationRoutes.js";

dotenv.config();

//express app initialization
const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Make io accessible to routes
app.set('io', io);

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: "*", // Allow all origins for hackathon
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Socket.io authentication and connection handling
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        socket.userRole = decoded.role;
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user-specific room for targeted notifications
    socket.join(`user_${socket.userId}`);

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
    });
});

// API Routes
app.use("/api/issues", issueRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/lost-found", lostFoundRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

app.get('/', (req, res) => {
    res.send('Hostel Management API is running...');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
    console.log('Socket.io initialized for real-time communication');
});

// freezing the backend apis for frontend development and integration