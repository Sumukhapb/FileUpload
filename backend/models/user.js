const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilPic: String,
  password: {
    type: String,
  },
  provider: {
    type: String,
    enum: ["google", "local"],
    default: "google",
  },
});

// Hash password before saving (for local users)
UserSchema.pre("save", async function (next) {
  if (this.provider !== "local") return next();
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("user", UserSchema);
