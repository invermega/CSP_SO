const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");
const controllerEn = require("../controllers/controllerdescargas");

/*****************Informes*****************/
router.get('/informes', isLoggedIn, controllerrender.renderinformes);
router.get('/exportarinforme', isLoggedIn, controllerEn.getexportarinforme);

module.exports = router;