module.exports = function (alexaPasscodes, vsocketio) {
    var express = require('express');
    var router = express.Router();
    var alexaPasscodes = alexaPasscodes;
    var vsocketio = vsocketio;

    router.put('/', function (req, res) {
        console.log('linkaccounts POST hit: ' + JSON.stringify(req.body));

        var clientId = alexaPasscodes.GetAlexaClientId(req.body.passcode)
        if (clientId) {
            var socket = vsocketio.GetSocket(req.body.socketid);
            if(socket) {
                alexaPasscodes.LinkSocket(clientId, socket);
                res.send( { alexaClientId: clientId });
                return;
            }
            else {
                res.status(404).send({ message: "Socket not found" });
            }
        }
        else {
            res.status(404).send({ message: "Passcode not found" });
        }
    });

    return router;
};