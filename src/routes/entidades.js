const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");
const controllerEN = require("../controllers/controllerentidades");
const { } = require('../lib/permisos');


/*****************Protocolo*****************/
router.get('/protocolo', isLoggedIn, controllerrender.renderprotocolo);
router.get('/protocololist', isLoggedIn, controllerEN.getprotocololist);
//router.get('/protocolocreate', isLoggedIn, controllerrender.renderprotocolocreate);

//router.get('/protocoloedit/:id', isLoggedIn, controllerrender.renderprotocoloedit);
router.get('/protocolocreate', isLoggedIn, controllerrender.renderprotocolocreate);
router.get('/protocoloedit/:id', isLoggedIn, controllerrender.renderprotocoloedit);
router.get('/protocolodatos/:id', isLoggedIn, controllerEN.getprotocolodatos);
router.get('/examenes',isLoggedIn, controllerEN.getexamenes);
router.delete('/protocolodel',isLoggedIn, controllerEN.delprotocolo);
router.get('/examenes/:id',isLoggedIn, controllerEN.getexamenesid);
router.get('/empresas',isLoggedIn, controllerEN.getempresas);
router.get('/tipoexamen',isLoggedIn, controllerEN.getTipoExamenes);
router.post('/protocolo',isLoggedIn, controllerEN.postprotocolo);
router.get('/exportarprotocolo/:id',isLoggedIn, controllerEN.getexportarprotocolo);
/******************************************/

/*****************Paciente*****************/
router.get('/paciente', isLoggedIn, controllerrender.renderpaciente);
router.get('/listarCombosPac', isLoggedIn, controllerEN.getPacienteCombos);
router.get('/listardistrito',isLoggedIn,controllerEN.getDistrito);
router.get('/listarpais',isLoggedIn,controllerEN.getPais);
router.post('/paciente',isLoggedIn,controllerEN.postpaciente);
router.get('/listarpacientes',isLoggedIn,controllerEN.getpaciente)
router.delete('/deletePac',isLoggedIn,controllerEN.deletepaciente);

/******************************************/
/*****************Citas*****************/
router.get('/cita', isLoggedIn, controllerrender.rendercita);
router.get('/listarCombosCitas', isLoggedIn, controllerEN.getCitasCombos);
router.get('/listarprotocolo', isLoggedIn, controllerEN.getProtocoloCombos);
router.post('/cita',isLoggedIn,controllerEN.postcita)
router.get('/listarcitas', isLoggedIn, controllerEN.getListaCitas);
router.get('/citacreate', isLoggedIn, controllerrender.rendercitacreate);
router.get('/citaedit/:id', isLoggedIn, controllerrender.rendercitaedit);
router.delete('/citadel',isLoggedIn, controllerEN.delcita);

/*****************Médico*******************/
router.get('/medico', isLoggedIn, controllerrender.renderemedico);

/****************Cliente******************/

router.get('/cliente', isLoggedIn, controllerrender.rendercliente);


/******************************************/
/****************Examenes******************/
router.get('/examen', isLoggedIn, controllerrender.renderexamen);

/******************************************/
module.exports = router;