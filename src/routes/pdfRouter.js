const express = require('express');
const router = express.Router();
const { gerarPdf } = require('../controllers/pdfController.js');
const { json } = require('../controllers/pdfController.js');

router.get('/', gerarPdf);
router.get('/link', json);

module.exports = router;