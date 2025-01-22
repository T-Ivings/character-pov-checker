const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const fileType = require('file-type');
const path = require('path'); // Ensure path is imported
const fs = require('fs');

// Define the allowed MIME types
const allowedMimes = [
  'application/epub+zip', // .epub
  'application/x-mobipocket-ebook', // .mobi
  'text/plain', // .txt
  'application/pdf', // .pdf
  'application/x-amz-windows-azw', // .azw
  'application/x-amz-windows-azw3', // .azw3
  'application/msword', // .doc
  'application/rtf', // .rtf
  'application/x-msdownload', // .lit
];

// Use memoryStorage to store the file in memory (required for file.type check)
const storage = multer.memoryStorage();

// File filter function to check MIME type
const fileFilter = async (req, file, cb) => {
  try {
    // Detect the MIME type from the file buffer
    console.log(file)
    const buffer = file.buffer;
    const detectedType = await fileType.fromBuffer(buffer);

    if (detectedType && allowedMimes.includes(detectedType.mime)) {
      return cb(null, true); // Accept the file if MIME type is valid
    } else {
      return cb(new Error('Invalid file type. Only EPUB, MOBI, PDF, TXT, AZW, AZW3, DOC, RTF, and LIT are allowed.'), false);
    }
  } catch (error) {
    console.error('Error in file filter:', error);
    return cb(new Error('Error checking file type'), false);
  }
};

// Set up multer with memoryStorage, file filter, and size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 35 * 1024 * 1024 }, // 35 MB size limit
});

const convertToPdf = (inputPath, outputPath, callback) => {
  const command = `ebook-convert "${inputPath}" "${outputPath}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error converting file: ${stderr}`);
      return callback(err);
    }
    console.log(`Conversion successful: ${stdout}`);
    callback(null, outputPath); // Return the converted file path
  });
};

const app = express();

// Enable CORS for handling cross-origin requests
app.use(cors());

app.post('/api/upload', upload.single('uploadedFile'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const inputPath = path.join(__dirname, 'uploads', `${Date.now()}-${file.originalname}`);
  const outputPath = path.join('uploads', `${path.parse(file.originalname).name}.pdf`);

  // Save the uploaded file to disk (since it's in memory, we write it to disk here)
  fs.writeFileSync(inputPath, file.buffer);

  convertToPdf(inputPath, outputPath, (err, convertedPath) => {
    if (err) {
      return res.status(500).json({ error: 'Error converting file to PDF' });
    }

    res.status(200).json({
      message: 'File converted to PDF successfully',
      filePath: convertedPath, // Path to the converted PDF
    });
  });
});

// Start the server on port 5001
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
