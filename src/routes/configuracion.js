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




module.exports = router;