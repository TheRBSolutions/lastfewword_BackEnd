// services/contentService.js
const Content = require('../models/Content'); // Assuming you have a Content model

// Create new content record in the database
const createContent = async (contentData) => {
  const content = new Content(contentData);
  return content.save();
};

module.exports = {
  createContent,
};
