const express = require('express');
const router = express.Router();
//const { PermisoAsistencia,PermisoPersonal,PermisoMarcacion} = require('../lib/permisos');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const controllersql = require("../controllers/controllersql");
//const controllermysql = require("../controllers/controllermysql");
const controllerrender = require("../controllers/controllerrender");



router.get('/configuracion', isNotLoggedIn, controllerrender.getconfiguracion);








module.exports = router;