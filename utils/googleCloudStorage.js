// utils/googleCloudStorage.js
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Path to your service account key file
const serviceKeyPath = path.join(__dirname, '../google-cloud-key.json');

// Instantiate a storage client with the service account
const storage = new Storage({ keyFilename: serviceKeyPath });

// Set the bucket name
const bucketName = 'lastfewwords-3ff3d.appspot.com'; // Replace this with your actual bucket name
const bucket = storage.bucket(bucketName);

// Function to upload a file to Google Cloud Storage
const uploadFileToGCS = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file uploaded');
    }

    // Create a file reference in the GCS bucket
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false, // You can set resumable: true if you need resumable uploads
    });

    blobStream.on('error', (err) => {
      reject(err);
    });

    blobStream.on('finish', () => {
      // File uploaded successfully, return the public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    // Stream the file buffer to GCS
    blobStream.end(file.buffer);
  });
};

module.exports = { uploadFileToGCS };
