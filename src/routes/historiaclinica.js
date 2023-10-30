const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");
const controllerHI = require("../controllers/controllerHistoriaclinica");

/*****************Pacientes citados*****************/
router.get('/pacientescitados', isLoggedIn, controllerrender.renderpacientescitados);
router.get('/pacientescitadoslist', isLoggedIn, controllerHI.getpacientescitados);
router.get('/cmbexamen', isLoggedIn, controllerHI.getcmbexamen);
/***************************************************/

/*****************Menú examenes genéricos*****************/
router.get('/pacienteexamen/:id/', isLoggedIn, controllerHI.getpacienteexamen);
router.get('/arbolpruebas/:id/:opcion', isLoggedIn, controllerHI.getarbolpruebas);
/*********************************************************/

/*****************Signos vitales*****************/
router.get('/signosvitales/:soexa/:id', isLoggedIn, controllerrender.rendersignosvitales);
router.get('/pbsignosvitales', isLoggedIn, controllerrender.rendersignosvitalesprueba);

/************************************************/
/*****************CIE 1O*****************/
router.get('/cie10', isLoggedIn, controllerHI.getcie10);
router.get('/cie10list', isLoggedIn, controllerHI.getcie10list);

/************************************************/
/*****************Documentos adicionales*****************/
router.post('/subirdocumento', isLoggedIn, controllerHI.postdocumento);
router.delete('/eliminardocumento', isLoggedIn, controllerHI.deldocumento);

/************************************************/
module.exports = router;