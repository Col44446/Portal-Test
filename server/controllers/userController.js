const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const SECRET_KEY = "supersecretkey"; // ✅ .env me rakho

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Signup request: validate, send OTP
exports.signupRequest = async (req, res) => {
  try {
    const { name, email, dob, password, confirmPassword } = req.body;

    if (!name || !email || !dob || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await OTP.findOneAndDelete({ email }); // Remove old OTP
    const newOTP = new OTP({ email, otp, expiresAt });
    await newOTP.save();

    // Send email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your OTP for Signup",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("SignupRequest Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Verify OTP and create user
// Verify OTP and create user
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, name, dob, password } = req.body;
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // ❌ remove bcrypt.hash here
    const newUser = new User({ name, email, dob, password });
    await newUser.save();
    await OTP.deleteOne({ _id: otpRecord._id });

    const token = jwt.sign({ role: "user", email }, SECRET_KEY, { expiresIn: "1h" });

    res.json({
      success: true,
      token,
      message: "User created and logged in",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("VerifyOTP Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Login with email/password

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Google login users ke liye password check skip
    if (!user.password) {
      return res.status(401).json({ success: false, message: "Use Google login for this account" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // JWT token
    const token = jwt.sign(
      { role: user.role, email: user.email, id: user._id },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
