var express = require('express');
var router = express.Router();

router.use('/registerPasscode', require('./registerPasscode'));

module.exports = router;