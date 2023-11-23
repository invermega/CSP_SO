const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");

const controllerEn = require("../controllers/controllerentidades");

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
router.get('/listarCombosCitas', isLoggedIn, controllerEn.getCitasCombos);
router.get('/listarprotocolo', isLoggedIn, controllerEn.getProtocoloCombos);
router.post('/cita',isLoggedIn,controllerEn.postcita)
router.get('/listarcitas', isLoggedIn, controllerEn.getListaCitas);
router.get('/citacreate', isLoggedIn, controllerrender.rendercitacreate);
router.get('/citaedit/:id', isLoggedIn, controllerrender.rendercitaedit);
router.delete('/citadel',isLoggedIn, controllerEn.delcita);
router.post('/listarhrc', isLoggedIn, controllerEn.getListaHojaRutaC);
router.post('/listarhrd', isLoggedIn, controllerEn.getListaHojaRutaD);
router.post('/listarcinf', isLoggedIn, controllerEn.getListaConsetimientoInf);
router.get('/listarempresa', isLoggedIn, controllerEn.getempresaCita);

/*****************Médico*******************/
router.get('/medicocreate', isLoggedIn, controllerrender.rendermedicocreate);
router.get('/medico', isLoggedIn, controllerrender.renderemedico);
router.post('/medico',isLoggedIn,controllerEn.postmedico);
router.get('/listarmedicos',isLoggedIn,controllerEn.getmedicolist);
router.delete('/deleteMed',isLoggedIn,controllerEn.deletemedico);
router.get('/medicoedit/:id', isLoggedIn, controllerrender.rendermedicoedit);
router.get('/medicodatos/:id', isLoggedIn, controllerEn.getmedicodatos);

/****************Cliente******************/

router.get('/cliente', isLoggedIn, controllerrender.rendercliente);
router.post('/cliente',isLoggedIn,controllerEn.postcliente);
router.post('/cliente',isLoggedIn,controllerEn.postcliente);
router.get('/listarcliente',isLoggedIn,controllerEn.getcliente);
router.delete('/deleteCli',isLoggedIn,controllerEn.deletecliente);

/******************************************/
/****************Examenes******************/
router.get('/examen', isLoggedIn, controllerrender.renderexamen);
router.get('/examencreate', isLoggedIn, controllerrender.renderexamencreate);
router.get('/listarexamen', isLoggedIn, controllerEn.getListaExamenes);


/******************************************/
module.exports = router;