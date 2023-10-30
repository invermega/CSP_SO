const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");
const controllerCO = require("../controllers/controllerconfiguracion");

//Login
router.get('/iniciarsesion', isNotLoggedIn, controllerrender.renderIniciarSesion);
router.post('/iniciarsesion', isNotLoggedIn, controllerCO.postiniciarSesion);
router.get('/salir', isLoggedIn, controllerCO.CerrarSesion);

//Permisos
router.get('/permisos', isLoggedIn, controllerrender.renderroles);
router.post('/grupousuario',isLoggedIn, controllerCO.postgrupousuario);
router.get('/listaroles',isLoggedIn, controllerCO.getroles);
router.get('/accesos',isLoggedIn, controllerCO.getaccesos);
router.post('/accesos',isLoggedIn, controllerCO.postaccesos);
router.delete('/accesos',isLoggedIn, controllerCO.delaccesos);

//usuarios
router.get('/usuarios', isLoggedIn, controllerrender.renderusuario);
router.post('/usuario',isLoggedIn,controllerCO.postusuario);
router.get('/listarusuarios',isLoggedIn,controllerCO.getusuarios)
router.post('/editarPass',isLoggedIn,controllerCO.resetpass);
router.delete('/deleteUser',isLoggedIn,controllerCO.deleteusuarios);
router.post('/usuario',isLoggedIn,controllerCO.postusuario);
router.get('/listarusuarios',isLoggedIn,controllerCO.getusuarios)
router.post('/editarPass',isLoggedIn,controllerCO.resetpass);
router.delete('/deleteUser',isLoggedIn,controllerCO.deleteusuarios);


module.exports = router;