const { Router } = require("express");
const { uploadContent, getAllImagesForUser } = require("../../controllers/contentController");
const upload = require('../../middleware/multerConfig');
const { authMiddleware } = require("../../services/auth");

const router = Router();

// api/content/upload
router.post('/upload', authMiddleware, upload.single('file'), uploadContent);
router.get("/files", authMiddleware, getAllImagesForUser);

module.exports = router;
