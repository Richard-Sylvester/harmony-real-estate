const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// 1. Give Cloudinary your keys
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Tell Multer to send files to a specific folder in your Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'harmony_properties', 
        // 1. Broaden the allowed formats to include modern web and phone types
        allowedFormats: ['jpeg', 'png', 'jpg', 'webp', 'heic', 'heif'],
        
        // 2. Force Cloudinary to convert everything to standard JPG or WebP 
        // so your frontend doesn't struggle to render weird file types later!
        format: async (req, file) => 'jpg', 

        // Add this transformation array!
        // The 'strip' flag guarantees all metadata/EXIF/GPS is wiped out
        transformation: [{ flags: "strip" }]
    }
});

// 3. Add a generous file size limit (e.g., 10MB) just to protect your server from massive raw files
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 Megabytes
});

// 3. The Route: Catch the file, upload it, and send the URL back to React
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded or file format not supported.");
        }
        res.send(req.file.path); 
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).send("Server error during upload.");
    }
});

module.exports = router;