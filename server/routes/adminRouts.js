const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminControler");
// 🔹 JWT middleware import
const { logout } = require("../controllers/logoutController"); // ⬅️ import

// Admin login route
router.post("/login", loginAdmin);
router.post("/logout", logout);
module.exports = router;