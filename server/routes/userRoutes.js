// routes/userRoutes.js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { signupRequest, verifyOTP, login } = require("../controllers/userController");
const { logout } = require("../controllers/logoutController");

const SECRET_KEY = process.env.SESSION_SECRET || "supersecretkey";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

router.post("/signup/request", signupRequest);
router.post("/signup/verify", verifyOTP);
router.post("/login", login);
router.post("/logout", logout);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
  (req, res) => {
    // Generate JWT with consistent payload
    const token = jwt.sign(
      { id: req.user.user._id, email: req.user.user.email, role: req.user.user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Redirect to frontend login page with token
    res.redirect(`${FRONTEND_URL}/login?token=${token}`);
  }
);

module.exports = router;