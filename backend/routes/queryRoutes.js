const express = require('express');
const router = express.Router();
const { queryPdf } = require('../controllers/queryController');

router.post('/', queryPdf);

module.exports = router;
