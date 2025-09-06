const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  dob: { type: Date, default: null },
  password: { type: String }, // hashed, google ke liye optional
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, default: "user" },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Compare entered password with hashed one
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false; // ✅ google login wale case ke liye
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
