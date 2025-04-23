// routes/nasaRoutes.js
const express = require('express');
const { getNasaApod } = require('../controllers/nasaController'); 

const router = express.Router();

// GET /api/nasa/apod
// Opcionalmente acepta un query param: ?date=YYYY-MM-DD
router.get('/apod', getNasaApod);

module.exports = router;