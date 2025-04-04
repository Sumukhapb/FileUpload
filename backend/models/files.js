const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  filename: { type: "String", required: true },
  path: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  uploadedAt: { type: Date, default: Date.now() },
  shareableLink: { type: String, unique: true },
  permission: { type: String, enum: ["view", "download"], default: "view" },
  expiresAt: { type: Date, default: null },
});

fileSchema.index({ expiresAt: 1 }, { expiresAfterSecond: 0 });

module.exports = mongoose.model("File", fileSchema);
