const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Inisialisasi server
const app = express();
const PORT = process.env.PORT || 5000;
const DOMAIN = process.env.RAILWAY_STATIC_URL || `http://localhost:${PORT}`;
// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Buat akses gambar via URL

// Konfigurasi Multer (simpan di folder 'uploads')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama unik
  },
});

const upload = multer({ storage });

// Route upload gambar
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Debugging - Cek host di Railway logs
  console.log("Host:", req.get("host"));

  // Gunakan DOMAIN Railway atau custom
  const imageUrl = `${DOMAIN}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});



app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${DOMAIN}`);
});
