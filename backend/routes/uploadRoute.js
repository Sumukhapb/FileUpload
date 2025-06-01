const express = require("express");
const multer = require("multer");
const path = require("path");
const File = require("../models/files");
const fs = require("fs");
const crypto = require("crypto");
const { title } = require("process");
const { v4: uuid4 } = require("uuid");
const ensureAuthentication = require("../middleware/authMiddleware");

const router = express.Router();
router.use(ensureAuthentication);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ".txt",
    ".js",
    ".html",
    ".css",
    ".py",
    ".java",
    ".cpp",
    ".md",
    ".pdf",
    ".docx",
    ".xlsx",
    ".json",
    ".csv",
    ".png",
    ".jpg",
    ".jpeg",
    ".zip",
    ".rar",
    ".7z",
  ];

  const extname = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(extname)) {
    cb(null, true);
  } else {
    req.fileValidationError = "This file type is not supported.";
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ error: "File not found" });

    const filePath = path.join(__dirname, "..", file.path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); //just deleting from storage

    await file.deleteOne();
    // res.json({ message: "File deleted successfully" }); //delete from db
    res.redirect("/files/myfiles");
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
    return res.redirect("/auth/login");
  }
  res.render("upload", { title: "Upload File", user: req.user, message: null });
});

router.post("/upload", upload.single("file"), async (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).render("upload", {
      title: "Upload File",
      user: req.user,
      message: req.fileValidationError,
    });
  }
  if (!req.file) {
    return res.status(400).render("upload", {
      title: "Upload File",
      user: req.user,
      message: "No file selected. Please choose a file to upload.",
    });
  }

  try {
    const newFile = new File({
      filename: req.file.filename,
      path: `uploads/${req.file.filename}`,
      uploadedBy: req.user._id,
      shareableLink: uuid4(),
    });
    await newFile.save();
    res.redirect("/files/myfiles");
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).render("upload", {
      title: "Upload File",
      user: req.user,
      message: "Failed to upload file. Please try again later.",
    });
  }
});

router.get("/myfiles", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }

  const files = await File.find({ uploadedBy: req.user._id });
  res.render("files", {
    title: "My Files",
    user: req.user,
    files,
    showLink: false,
  });
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
    // const filePath = file.path;
    const fileType = path.extname(file.filename).toLowerCase();
    const fileExtension = fileType.substring(1);

    if (file.permission === "view") {
      if ([".jpg", ".png", ".jpeg"].includes(fileType)) {
        return res.sendFile(filePath);
      } else if (
        [
          ".txt",
          ".js",
          ".css",
          ".html",
          ".py",
          ".java",
          ".cpp",
          ".csv",
        ].includes(fileType)
      ) {
        try {
          const fileContent = fs.readFileSync(filePath, "utf8");
          return res.render("shared", {
            title: "Shared File",
            file,
            fileContent,
            fileExtension
          });
        } catch (err) {
          return res.render("shared", {
            title: "Shared File",
            file,
            fileContent: null,
            fileExtension,
            message: "File not found in storage!",
          });
        }
      } else if ([".pdf", ".docx", ".xlsx"].includes(fileType)) {
        return res.sendFile(filePath);
      } else if ([".zip", ".rar", ".7z"].includes(fileType)) {
        return res.render("shared", {
          title: "Shared File",
          message: "Preview not Available for this file type",
          file,
          fileContent: null,
          fileExtension,
        });
      } else {
        return res.render("shared", {
          title: "Shared File",
          file,
          fileContent: null,
          fileExtension,
          message: "Preview not Available",
        });
      }
    } else {
      return res.download(filePath);
    }
  } catch (error) {
    console.error("Error in /shared/:link route:", error);
    res.status(500).json({ error: "Internal Server Error!!" });
  }
});

router.get("/open-shared", (req, res) => {
  const input = req.query.link;
  if (!input) return res.redirect("/dashboard");

  let shareId;

  try {
    if (input.startsWith("http")) {
      const url = new URL(input);
      const parts = url.pathname.split("/");
      shareId = parts[parts.length - 1];
    } else {
      shareId = input.trim();
    }

    res.redirect(`/files/shared/${shareId}`);
  } catch (err) {
    res.status(400).send("Invalid link format.");
  }
});

router.get("/access-shared", (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  res.render("access", { title: "Access Shared File", user: req.user });
});

module.exports = router;
