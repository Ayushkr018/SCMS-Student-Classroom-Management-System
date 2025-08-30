/**
 * File Upload Middleware Configuration
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('./errorHandler'); // Adjusted path

// Ensure upload directories exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/temp/';
    
    // Determine upload path based on field name
    switch (file.fieldname) {
      case 'files': // Generic field for assignment submissions
      case 'assignment':
        uploadPath = 'uploads/assignments/';
        break;
      case 'submission':
        uploadPath = 'uploads/submissions/';
        break;
      case 'profileImage':
        uploadPath = 'uploads/profiles/';
        break;
      case 'document':
        uploadPath = 'uploads/documents/';
        break;
      default:
        uploadPath = 'uploads/temp/';
    }
    
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Define allowed file types by category
  const allowedTypes = {
    images: /\.(jpg|jpeg|png|gif|webp)$/i,
    documents: /\.(pdf|doc|docx|txt|rtf)$/i,
    archives: /\.(zip|rar|7z)$/i,
    media: /\.(mp4|avi|mov|wmv|mp3|wav)$/i
  };

  const fileExt = path.extname(file.originalname).toLowerCase();
  
  // Check file type based on field name
  let isAllowed = false;
  
  switch (file.fieldname) {
    case 'profileImage':
      isAllowed = allowedTypes.images.test(fileExt);
      break;
    case 'files': // Generic field for assignment submissions
    case 'assignment':
    case 'submission':
      isAllowed = allowedTypes.documents.test(fileExt) || 
                 allowedTypes.archives.test(fileExt) ||
                  allowedTypes.images.test(fileExt); // Also allow images for submissions
      break;
    case 'document':
      isAllowed = allowedTypes.documents.test(fileExt) || 
                 allowedTypes.images.test(fileExt) ||
                 allowedTypes.media.test(fileExt);
      break;
    default:
      isAllowed = Object.values(allowedTypes).some(regex => regex.test(fileExt));
  }

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new AppError(`File type ${fileExt} not allowed for ${file.fieldname}`, 400), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  }
});

// Export the configured multer instance directly for use in routes
module.exports = upload;
