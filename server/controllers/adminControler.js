const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "123456";
const SECRET_KEY = "supersecretkey"; // .env me store karna better hoga

// Admin login
exports.loginAdmin = (req, res) => {
    const { email, password } = req.body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ role: "admin", email }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({
            success: true,
            role: "admin",
            token,
            message: "Login successful",
            user: {
                _id: "admin123", // unique id
                name: "Admin",
                email: ADMIN_EMAIL,
            },
        });

    } else {
        return res.status(401).json({
            success: false,
            role: "user",
            message: "Invalid credentials"
        });
    }
};

