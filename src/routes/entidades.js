const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");
const controllerEN = require("../controllers/controllerentidades");
const { } = require('../lib/permisos');

router.get('/protocolo', isLoggedIn, controllerrender.renderprotocolo);
router.get('/examenes',isLoggedIn, controllerEN.getexamenes);
router.get('/empresas',isLoggedIn, controllerEN.getempresas);
router.get('/tipoexamen',isLoggedIn, controllerEN.getTipoExamenes);

/*****************Paciente*****************/
router.get('/paciente', isLoggedIn, controllerrender.renderepaciente);
router.get('/listarCombosPac', isLoggedIn, controllerEN.getPacienteCombos);
router.get('/listardistrito',isLoggedIn,controllerEN.getDistrito);
router.get('/listarpais',isLoggedIn,controllerEN.getPais);
router.post('/paciente',isLoggedIn,controllerEN.postpaciente);
router.get('/listarpacientes',isLoggedIn,controllerEN.getpaciente)


/******************************************/

module.exports = router;