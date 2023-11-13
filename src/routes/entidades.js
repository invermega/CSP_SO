const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");

const controllerEn = require("../controllers/controllerEntidades");

const { } = require('../lib/permisos');


/*****************Protocolo*****************/
router.get('/protocolo', isLoggedIn, controllerrender.renderprotocolo);
router.get('/protocololist', isLoggedIn, controllerEn.getprotocololist);
//router.get('/protocolocreate', isLoggedIn, controllerrender.renderprotocolocreate);

//router.get('/protocoloedit/:id', isLoggedIn, controllerrender.renderprotocoloedit);
router.get('/protocolocreate', isLoggedIn, controllerrender.renderprotocolocreate);
router.get('/protocoloedit/:id', isLoggedIn, controllerrender.renderprotocoloedit);
router.get('/protocolodatos/:id', isLoggedIn, controllerEn.getprotocolodatos);
router.get('/examenes',isLoggedIn, controllerEn.getexamenes);
router.delete('/protocolodel',isLoggedIn, controllerEn.delprotocolo);
router.get('/examenes/:id',isLoggedIn, controllerEn.getexamenesid);
router.get('/empresas',isLoggedIn, controllerEn.getempresas);
router.get('/tipoexamen',isLoggedIn, controllerEn.getTipoExamenes);
router.post('/protocolo',isLoggedIn, controllerEn.postprotocolo);
router.get('/exportarprotocolo/:id',isLoggedIn, controllerEn.getexportarprotocolo);
/******************************************/

/*****************Paciente*****************/
router.get('/paciente', isLoggedIn, controllerrender.renderpaciente);
router.get('/listarCombosPac', isLoggedIn, controllerEn.getPacienteCombos);
router.get('/listardistrito',isLoggedIn,controllerEn.getDistrito);
router.get('/listarpais',isLoggedIn,controllerEn.getPais);
router.post('/paciente',isLoggedIn,controllerEn.postpaciente);
router.get('/listarpacientes',isLoggedIn,controllerEn.getpaciente)
router.delete('/deletePac',isLoggedIn,controllerEn.deletepaciente);

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
router.post('/listarhrc', isLoggedIn, controllerEN.getListaHojaRutaC);
router.post('/listarhrd', isLoggedIn, controllerEN.getListaHojaRutaD);
router.post('/listarcinf', isLoggedIn, controllerEN.getListaConsetimientoInf);
router.get('/listarempresa', isLoggedIn, controllerEN.getempresaCita);

/*****************Médico*******************/
router.get('/medico', isLoggedIn, controllerrender.renderemedico);
router.post('/medico',isLoggedIn,controllerEn.postmedico);
router.get('/listarmedicos',isLoggedIn,controllerEn.getmedico);
router.delete('/deleteMed',isLoggedIn,controllerCO.deletemedico);
router.delete('/deleteMed',controllerCO.deletemedico);

/****************Cliente******************/

router.get('/cliente', isLoggedIn, controllerrender.rendercliente);
router.post('/cliente',isLoggedIn,controllerEn.postcliente);
router.get('/listarcliente',isLoggedIn,controllerEn.getcliente);
router.delete('/deleteCli',isLoggedIn,controllerCO.deletecliente);
router.delete('/deleteCli',controllerCO.deletecliente);



/******************************************/
/****************Examenes******************/
router.get('/examen', isLoggedIn, controllerrender.renderexamen);
router.get('/examencreate', isLoggedIn, controllerrender.renderexamencreate);
router.get('/listarexamen', isLoggedIn, controllerEn.getListaExamenes);


/******************************************/
module.exports = router;