// models/Content.js
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'auth',
    },
    type: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true, // URL of the file stored in GCS
    },
    // Other optional fields
    title: String,
    description: String,
    // duration: Number,  // optional field for audio/video duration (in seconds)
    // fileSize: Number,  // optional field for file size (in bytes)
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Content', contentSchema);

// const { model, Schema } = require("mongoose");

// const ContentSchema = new Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: 'auth',
//         required: true
//     },
//     type: {
//         type: String,
//         enum: ['image', 'video', 'file', 'voice', 'text'],
//         required: true
//     },
//     url: {
//         type: String,
//         required: true
//     },
//     scheduledDate: {
//         type: Date
//     },
//     deletedAfterSent: {
//         type: Boolean,
//         default: false
//     },
// }, { timestamps: true });

// module.exports = model('Content', ContentSchema);