module.exports = function (alexaPasscodes, vsocketio) {
    var express = require('express');
    var router = express.Router();

    router.use('/passcode', require('./passcode')(alexaPasscodes));
    router.use('/linkaccounts', require('./linkaccounts')(alexaPasscodes, vsocketio));
    router.use('/endAuction', require('./endauction'));
    router.use('/highestBid', require('./highestbid'));
    router.use('/placeBid', require('./placebid'));

    return router;
};