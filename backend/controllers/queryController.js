const PdfDocument = require('../models/PdfDocument');

const queryPdf = async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const documents = await PdfDocument.find({});

        let allResults = [];

        // rudimentary stop words list
        const stopWords = ['a', 'an', 'the', 'is', 'at', 'which', 'on', 'what', 'how', 'why', 'to', 'from', 'in', 'of'];
        const queryTerms = query.toLowerCase().split(' ').filter(word => !stopWords.includes(word) && word.length > 2);

        if (queryTerms.length === 0) {
            // Fallback if query was only stop words
            queryTerms.push(query.toLowerCase());
        }

        documents.forEach(doc => {
            // Split by sentence but keep logic simple
            const sentences = doc.text.split(/[.!?]+/);

            sentences.forEach(sentence => {
                let score = 0;
                const lowerSentence = sentence.toLowerCase();

                queryTerms.forEach(term => {
                    if (lowerSentence.includes(term)) {
                        score += 1;
                    }
                });

                if (score > 0) {
                    allResults.push({
                        filename: doc.filename,
                        content: sentence.trim(),
                        score: score
                    });
                }
            });
        });

        // Sort by score descending, then return top 5
        allResults.sort((a, b) => b.score - a.score);
        const topResults = allResults.slice(0, 5);

        res.json({ results: topResults });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during query' });
    }
};

module.exports = { queryPdf };
