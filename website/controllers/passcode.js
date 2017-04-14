module.exports = function (alexaPasscodes) {
  var express = require('express');
  var router = express.Router();

  router.patch('/:clientid', function(req, res) {
    //generate 4 digit passcode
    var passcode = '';
    for(var i = 0; i < 4; i++) {
      passcode += Math.floor(Math.random() * (9 - 1 + 1)) + 1;
    }

    alexaPasscodes.AddAlexaPasscode(req.params.clientid, passcode);
    res.send({ passcode: passcode, clientid: req.params.clientid });
  });

  return router;
};