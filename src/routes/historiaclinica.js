const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");
//const controllerHI = require("../controllers/controllerHistoriaclinica");
const { } = require('../lib/permisos');

router.get('/hc', isLoggedIn, controllerrender.renderpacientes);

module.exports = router;