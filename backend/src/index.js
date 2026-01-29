import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import issueRoutes from "../routes/issueRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import announcementRoutes from "../routes/announcementRoutes.js";
import lostFoundRoutes from "../routes/lostFoundRoutes.js";
import commentRoutes from "../routes/commentRoutes.js";
dotenv.config();
//express app initialization
const app = express();
const PORT = process.env.PORT || 3000

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.use("/api/issues", issueRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/lost-found", lostFoundRoutes);
app.use("/api/comments", commentRoutes);




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`)
})




// freezing the backend apis for frontend development and integration