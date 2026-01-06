const PdfDocument = require('../models/PdfDocument');
const pdf = require('pdf-parse');
const fs = require('fs');

const uploadPdf = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);

        // Calculate chunks (sentences)
        const chunks = data.text.split(/[.!?]+/).filter(chunk => chunk.trim().length > 0);
        const chunkCount = chunks.length;

        const newPdf = new PdfDocument({
            filename: req.file.originalname,
            text: data.text
        });

        await newPdf.save();

        // Clean up uploaded file from temp storage if needed, or keep it. 
        // Multer with 'dest' keeps it. 

        res.status(200).json({
            message: 'File uploaded and processed successfully',
            chunkCount: chunkCount,
            textPreview: data.text.substring(0, 100)
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing PDF');
    }
};

module.exports = { uploadPdf };
