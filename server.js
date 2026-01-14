const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname);
const uploadsDir = path.join(publicDir, 'uploads');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({ storage });

// Serve static site files (index.html, script.js, style.css, uploads/, etc.)
app.use(express.static(publicDir));

// API: list gallery images
app.get('/api/gallery', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.json([]);
    const images = files
      .filter(f => /\.(png|jpe?g|gif|webp)$/i.test(f))
      .map(f => `/uploads/${encodeURIComponent(f)}`);
    res.json(images);
  });
});

// Server-side admin password
const SERVER_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';

function checkAdminHeader(req) {
  const pass = req.headers['x-admin-password'];
  return pass && pass === SERVER_ADMIN_PASSWORD;
}

// API: upload images (multipart/form-data, field name 'images')
app.post('/api/upload', upload.array('images', 20), (req, res) => {
  if (!checkAdminHeader(req)) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const files = req.files || [];
  const urls = files.map(f => `/uploads/${encodeURIComponent(f.filename)}`);
  res.json({ success: true, urls });
});

// API: delete image by filename
app.delete('/api/gallery/:filename', (req, res) => {
  if (!checkAdminHeader(req)) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  fs.unlink(filePath, err => {
    if (err) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true });
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
