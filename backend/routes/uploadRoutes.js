const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadPdf } = require('../controllers/uploadController');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('pdf'), uploadPdf);

module.exports = router;
