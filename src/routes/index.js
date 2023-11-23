const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");

router.get('/',isLoggedIn, controllerrender.renderbienvenida);

module.exports = router;


