const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");
const controllerDs = require("../controllers/controllerdescargas");

/*****************Informes*****************/
router.get('/informes', isLoggedIn, controllerrender.renderinformes);
router.get('/exportarinformeconsolidado', isLoggedIn, controllerDs.getexportarinformeconsolidado);
router.get('/exportarinformedetalle', isLoggedIn, controllerDs.getexportarinformedetalle);
router.get('/descargapruebas/:id', isLoggedIn, controllerDs.getdescargapruebas);



module.exports = router;