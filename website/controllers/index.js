module.exports = function (alexaPasscodes, vsocketio) {
    var express = require('express');
    var router = express.Router();

    router.use('/passcode', require('./passcode')(alexaPasscodes));
    router.use('/linkaccounts', require('./linkaccounts')(alexaPasscodes, vsocketio));
    router.use('/bid', require('./bid'));

    return router;
};