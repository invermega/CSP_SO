const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");
//const controllerHI = require("../controllers/controllerHistoriaclinica");
const controllerEn = require("../controllers/controllerentidades");

const { } = require('../lib/permisos');

router.get('/protocolo', isLoggedIn, controllerrender.renderprotocolo);


/*****************Paciente*****************/
router.get('/paciente', isLoggedIn, controllerrender.renderepaciente);
router.get('/listarCombosPac', isLoggedIn, controllerEn.getPacienteCombos);
router.get('/listardistrito',isLoggedIn,controllerEn.getDistrito);
router.get('/listarpais',isLoggedIn,controllerEn.getPais);

/******************************************/

module.exports = router;