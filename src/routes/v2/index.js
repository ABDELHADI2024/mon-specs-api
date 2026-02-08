const express = require("express");
const router = express.Router();

const brandController = require('../../controllers/v2/brandController');
const specController = require('../../controllers/v2/specController');
const searchController = require('../../controllers/v2/searchController');
const miscController = require('../../controllers/v2/miscController');

// Routes organisées
router.get("/brands", brandController.index);
router.get("/brands/:slug", brandController.show);
router.get("/search", searchController.index);
router.get("/latest", miscController.index);
router.get("/top-by-interest", miscController.topInterest);
router.get("/top-by-fans", miscController.topFans);

// Route pour les caractéristiques d'un téléphone (C'est celle qu'on utilise)
// On ajoute 'specs' dans l'URL pour que ce soit clair : /v2/specs/nom-du-phone
router.get("/specs/:slug", specController.index);

module.exports = router;
