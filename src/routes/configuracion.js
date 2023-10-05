const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");
const controllerCO = require("../controllers/controllerconfiguracion");
const { } = require('../lib/permisos');

router.get('/iniciarsesion', isNotLoggedIn, controllerrender.renderIniciarSesion);
router.post('/iniciarsesion', isNotLoggedIn, controllerCO.postiniciarSesion);
router.get('/salir', isLoggedIn, controllerCO.CerrarSesion);
router.get('/permisos', isLoggedIn, controllerrender.renderroles);
router.post('/grupousuario',isLoggedIn, controllerCO.postgrupousuario);
router.get('/listaroles',isLoggedIn, controllerCO.getroles);
router.get('/accesos',isLoggedIn, controllerCO.getaccesos);
router.post('/accesos',isLoggedIn, controllerCO.postaccesos);
router.delete('/accesos',isLoggedIn, controllerCO.delaccesos);

//usuarios
router.get('/usuarios', isLoggedIn, controllerrender.renderusuario);
router.post('/usuario',controllerCO.postusuario);
router.get('/listarusuarios',controllerCO.getusuarios)
router.post('/editarPass',controllerCO.resetpass);
router.delete('/deleteUser',controllerCO.deleteusuarios);


module.exports = router;