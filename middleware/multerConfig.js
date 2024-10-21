// middlewares/multerConfig.js
const multer = require('multer');

// Configure Multer to store files in memory (buffered upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;

// const multer = require('multer');

// // File filter to allow only specific types of files (optional)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg', 'application/pdf', 'text/plain'];
  
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type'), false);
//   }
// };

// const storage = multer.memoryStorage();
// const upload = multer({ storage, fileFilter }); // Use fileFilter if you want to restrict file types

// module.exports = upload;
