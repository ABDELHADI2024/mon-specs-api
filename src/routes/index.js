const express = require("express");
const router = express.Router();
const searchRoutes = require("./search");
const scrapeRoutes = require("./scrape");
const phoneRoutes = require("./phone");
const v2Routes = require("./v2/index"); // On importe la version 2 que nous avons améliorée

const indexController = require('../controllers/index')

router.get("/", indexController.index);
router.use("/brands", phoneRoutes);
router.use("/search", searchRoutes);
router.use("/scrape", scrapeRoutes);

// LA LIGNE MAGIQUE : On active enfin le dossier v2
router.use("/v2", v2Routes);

module.exports = router;
