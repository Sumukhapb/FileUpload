const express = require("express");
const multer = require("multer");
const path = require("path");
const File = require("../models/files");
const fs = require("fs");
const crypto = require("crypto");
const { title } = require("process");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.delete("/delete/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ error: "File not found" });

    const filePath = path.join(__dirname, "..", file.path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); //just deleting from storage

    await file.deleteOne();
    res.json({ message: "File deleted successfully" }); //delete from db
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
});

router.put("/rename/:id", async (req, res) => {
  try {
    const { newFileName } = req.body;
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ error: "File not found!" });

    const oldPath = path.join(
      __dirname,
      "..",
      file.path.startsWith("uploads") ? file.path : `uploads/${file.filename}`
    );
    const newPath = path.join(__dirname, "..", "uploads", newFileName);

    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      file.filename = newFileName;
      file.path = `uploads/${newFileName}`;
      await file.save();
      return res.json({ message: "File renamed successfully!", file });
    } else {
      return res.status(404).json({ error: "File not found in storage!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!!" });
  }
});

router.get("/upload", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  res.render("upload", { title: "Upload File", user: req.user });
});

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized Access!" });
  }

  try {
    if (!req.file) {
      console.log("No file recived");
      return res.status(400).json({ message: "No file Recived" });
    }
    console.log("File Details:", req.file);

    const newFile = new File({
      filename: req.file.filename,
      path: req.file.path,
      uploadedBy: req.user._id,
    });
    await newFile.save();
    res.redirect("/files/myfiles");
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ error: "Failed to Upload File!!" });
  }
});

router.get("/myfiles", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const files = await File.find({ uploadedBy: req.user._id });
  res.render("files", { title: "My Files", user: req.user, files });
});

router.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  res.download(filePath);
});

router.post("/share/:id", async (req, res) => {
  try {
    // const { permission } = req.body;
    // console.log(`Recived request to share file ID: ${req.params.id}`);
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File Not Found!!" });
    }

    file.shareableLink = crypto.randomBytes(8).toString("hex");
    file.permission = "view";
    file.expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // console.log(
    //   `Genetrated link: ${file.shareableLink}, Expires At: ${file.expireAt}`
    // );
    await file.save();

    res.json({
      message: "File is now shareable",
      link: `http://localhost:8000/files/shared/${file.shareableLink}`,
      expireAt: file.expireAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/shared/:link", async (req, res) => {
  try {
    const file = await File.findOne({ shareableLink: req.params.link });

    if (!file) return res.status(404).json({ message: "File not found!!" });

    if (file.expiresAt && file.expiresAt < new Date()) {
      return res.status(410).json({ message: "This link has expired!!" });
    }
    const filePath = path.join(__dirname, "..", file.path);
    const fileType = path.extname(file.filename).toLowerCase();

    if (file.permission === "view") {
      if ([".jpg", ".png"].includes(fileType)) {
        return res.sendFile(filePath);
      } else if ([".txt", ".js", ".css", ".html"].includes(fileType)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        return res.render("shared", {
          title: "Shared File",
          fileContent,
          file,
        });
      } else {
        return res.render("shared", {
          title: "Shared File",
          message: "Preview not Available",
        });
      }
    } else {
      return res.download(filePath);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!!" });
  }
});

module.exports = router;
