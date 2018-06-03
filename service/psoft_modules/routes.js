/*
 ever3stmomo - 5/1/2018
 routes.js  - handles routing for psoft service
 */

var express = require('express');
var router = express.Router();

var auth = require('./authmodule');
var TFUtils = require('./utils');
var TFUsers = require('./users');
var TFMatch = require('./games');


/*
 * Routes that can be accessed by any one
 */
router.get('/ping',TFUtils.ping);

router.post('/login', auth.login);
router.post('/register', TFUsers.addUser);                      // Register new user

/*
 * Routes that can be accessed only by authenticated users
 */
router.get('/v1/auth/ping',TFUtils.ping);

//game/match route
router.get('/v1/match/next');

module.exports = router;