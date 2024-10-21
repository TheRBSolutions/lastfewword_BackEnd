const { uploadFileToGCS } = require('../utils/googleCloudStorage');
const contentService = require('../services/contentService');
const Content = require("../models/Content");
const { sendSuccessResponse } = require('../utils/sendResponse');

// Get all images for logged-in user
const getAllImagesForUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { type } = req.query; // Optionally filter by type
        const filter = { userId };

        if (type) {
            filter.type = type; // E.g., 'image', 'video', 'audio', 'document'
        }

        const content = await Content.find(filter);
        return sendSuccessResponse(res, 200, content, 'Content retrieved successfully');
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving content", error: error.message });
    }
};

// const getAllImagesForUser = async (req, res) => {
//     try {
//         const userId = req.userId;
//         const images = await Content.find({ userId });

//         return sendSuccessResponse(res, 200, images, 'Images retrieved successfully');

//     } catch (error) {
//         return res.status(500).json({ message: "Error retrieving images", error: error.message });
//     }
// };

// Content upload function
const uploadContent = async (req, res, next) => {
    try {
        const { userId, type, ...otherFields } = req.body;

        if (!userId || !type) {
            return res.status(400).json({ message: 'userId and type are required' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const publicUrl = await uploadFileToGCS(req.file);

        const contentData = {
            userId,
            type,
            fileUrl: publicUrl,
            ...otherFields
        };

        const content = await contentService.createContent(contentData);

        return sendSuccessResponse(res, 201, content, 'Content uploaded successfully!');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllImagesForUser,
    uploadContent,
};
