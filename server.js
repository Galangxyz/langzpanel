const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 🔥 FIX UNTUK MULTIPART FORM
app.use("/uploads", express.static("uploads"));

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route Upload
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const domain = process.env.RAILWAY_PUBLIC_DOMAIN || `https://langzpanel.railway.app`;
  const imageUrl = `${domain}/uploads/${req.file.filename}`;

  res.json({ imageUrl });
});

// Jalankan server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${process.env.RAILWAY_PUBLIC_DOMAIN || `http://localhost:${PORT}`}`);
});
