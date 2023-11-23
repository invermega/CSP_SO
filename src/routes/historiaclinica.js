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

/*****************CIE 1O*****************/
router.get('/cie10', isLoggedIn, controllerHI.getcie10);
router.get('/cie10list', isLoggedIn, controllerHI.getcie10list);
/************************************************/

/*****************Documentos adicionales*****************/
router.post('/subirdocumento', isLoggedIn, controllerHI.postdocumento);
router.delete('/eliminardocumento', isLoggedIn, controllerHI.deldocumento);
/************************************************/

/*************Menú de examenes y pruebas*************/
router.get('/menuexamenes/:soexa/:id', isLoggedIn, controllerrender.rendermenuexamenes);
/************************************************/

/*****************Pruebas*****************/
router.get('/pbsignosvitales', isLoggedIn, controllerrender.rendersignosvitalesprueba);
router.post('/pbsignosvitales', isLoggedIn, controllerHI.postsignosvitales);
router.get('/resultsignosvitales', isLoggedIn, controllerHI.getresultsignosvitales);

router.get('/pblaboratorio', isLoggedIn, controllerrender.renderlaboratorioprueba); 
router.get('/pruebascards', isLoggedIn, controllerHI.getpruebascards); 
router.get('/parametros', isLoggedIn, controllerHI.getparametros); 
router.post('/pblaboratorio', isLoggedIn, controllerHI.postlaboratorio);
router.get('/resultlaboratorio', isLoggedIn, controllerHI.getresultlaboratorio);
/****************Espirometria*****************/
router.get('/pbespirometria', isLoggedIn, controllerrender.renderespirometriaprueba);
router.get('/resultespirometria', isLoggedIn, controllerHI.getresultespirometria);
router.post('/pbespirometria', isLoggedIn, controllerHI.postespirometria);
/*********************************************/
/****************Cuestionario Espirometria*****************/
router.get('/pbcuestionarioespirometria', isLoggedIn, controllerrender.rendercuestionarioespirometriaprueba);
router.get('/resultcuestionarioespirometria', isLoggedIn, controllerHI.getresultcuestionarioespirometria);
router.post('/pbcuestionarioespiromeria', isLoggedIn, controllerHI.postcuestionarioespiromeria);
/*********************************************/
/****************Psicologia*****************/
router.get('/pbpsicologia', isLoggedIn, controllerrender.renderpsicologiaprueba);
router.get('/resultpsicologia', isLoggedIn, controllerHI.getresultpsicologia);
/*********************************************/
/****************Ficha medico ocupacional 312*****************/
router.get('/pbfichamedicoocupacional312', isLoggedIn, controllerrender.renderfichamedicoocupacional312prueba);
/************************************************/
/*****************Ficha Musculo Esqueletica*****************/
router.get('/pbfichamusculoesqueletica', isLoggedIn, controllerrender.renderfichamusculoesqueleticaprueba);
router.post('/pbfichamusculoesqueletica', isLoggedIn, controllerHI.postfichamusculoesqueletica);
router.get('/resultfichamusculoesqueletica', isLoggedIn, controllerHI.getresultfichamusculoesqueletica);




module.exports = router;
