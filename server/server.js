const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const http = require("http");
require("dotenv").config();
const session = require("express-session"); // ✅ add this

const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRouts");
const userRoutes = require("./routes/userRoutes");

require("./config/passport");

const app = express();
const fs = require("fs");

// ✅ MongoDB connect
connectDB();

// ✅ CORS fix (localhost + vercel)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://clutch-coins-front.vercel.app"
  ],
  credentials: true
}));

// ✅ Session middleware for passport
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Initialize passport
app.use(passport.initialize());
app.use(passport.session()); // ✅ add this

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// ✅ Port binding for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
