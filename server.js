const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const authRoutes = require('./auth');
const checkoutRoutes = require('./checkout');

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(checkoutRoutes);

const upload = multer({ dest: 'uploads/' });

app.post('/api/form/submit', upload.single('pdf'), async (req, res) => {
  const pdf = req.file;
  const dataBuffer = await fs.promises.readFile(pdf.path);
  const pdfData = await pdfParse(dataBuffer);
  const text = pdfData.text;

  res.json({ summary: "This is where your AI summary would be returned." });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
