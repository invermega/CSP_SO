const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");

router.get('/',isNotLoggedIn, controllerrender.getbienvenida);

module.exports = router;


