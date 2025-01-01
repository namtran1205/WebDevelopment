const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    // Set your upload directory
    cb(null, 'src/uploads/')
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)) // Rename the file
  },
})

const fileFilter = (req, file, cb) => {
  // Accept images and PDFs only
  const allowedTypes = [
    'image/jpeg', // JPEG images
    'image/png', // PNG images
    'application/pdf', // PDF files
  ]

  if (allowedTypes.includes(file.mimetype)) {
    // File type is valid, accept the file
    cb(null, true)
  } else {
    // File type is invalid, reject the file
    cb(new Error('Unsupported file format'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
})

module.exports = upload
