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

router.get('/permisos', isNotLoggedIn, controllerrender.renderroles);
router.post('/grupousuario', controllerCO.postgrupousuario);
router.get('/listaroles', controllerCO.getroles);
router.get('/accesos', controllerCO.getaccesos);

//usuarios
router.get('/usuarios', isNotLoggedIn, controllerrender.renderusuario);
    router.post('/usuario',controllerCO.postusuario);
router.get('/listarusuarios',controllerCO.getusuarios)
router.post('/editarPass',controllerCO.resetpass);
router.delete('/deleteUser',controllerCO.deleteusuarios);


module.exports = router;