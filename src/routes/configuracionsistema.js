const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");
const controllersql = require("../controllers/controllersql");
const { } = require('../lib/permisos');

router.get('/iniciarsesion', isNotLoggedIn, controllerrender.getIniciarSesion);
router.post('/iniciarsesion', isNotLoggedIn, controllersql.postiniciarSesion);
router.get('/salir', isLoggedIn, controllersql.CerrarSesion);


module.exports = router;