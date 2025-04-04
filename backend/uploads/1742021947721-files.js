const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  filename: { type: "String", required: true },
  path: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  uploadedAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("File", fileSchema);
