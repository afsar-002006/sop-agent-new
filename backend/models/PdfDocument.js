const mongoose = require('mongoose');

const pdfSchema = mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PdfDocument', pdfSchema);
