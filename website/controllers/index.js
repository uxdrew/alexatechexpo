var express = require('express');
var router = express.Router();

router.use('/registerPasscode', require('./registerPasscode'));
router.use('/endAuction', require('./endAuction'));
router.use('/highestBid', require('./highestBid'));

module.exports = router;