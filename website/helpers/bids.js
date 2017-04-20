module = module.exports = function (vsocketio) {
    var vsocketio = vsocketio;
    var highestBid = { bid: 0.00, clientid: null, socketid: null };

    return {
        NewBid: function (bid) {
            console.log("NewBid: " + JSON.stringify(bid))

            if (!bid.clientid && !bid.socketid)
                return false;

            if (parseInt(bid.bid) > parseInt(highestBid.bid)) {
                highestBid = bid;
                vsocketio.EmitNewBid(highestBid);
                return true;
            }
            else
                return false;
        },
        GetHighestBid: function () {
            return highestBid;
        },
        EndAuction: function () {
            vsocketio.EmitEndAuction(highestBid);
            this.ProcessTransaction(highestBid);
            highestBid = { bid: 0.00, clientid: null, socketid: null };
        },
        ProcessTransaction: function (bid) {
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            //run txn via tripos for amount
            var http = require("https");

            var options = {
                "method": "POST",
                "hostname": "triposcert.vantiv.com",
                "port": null,
                "path": "/api/v1/sale",
                "headers": {
                    "content-type": "application/json",
                    "tp-application-id": "8241",
                    "tp-application-name": "triPOS.vauction.Cloud",
                    "tp-application-version": "1.0.0",
                    "tp-authorization": "2.0",
                    "accept": "application/json",
                    "tp-express-acceptor-id": "3928907",
                    "tp-express-account-id": "1044148",
                    "tp-express-account-token": "CB09050E334215EC64619FC2FED4D0C70CF00F72917D0F6A69E3342FDA5B7DC69D8F0801",
                    "tp-request-id": uuid,
                    "cache-control": "no-cache"
                }
            };

            var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    console.log(body.toString());

                    //after txn complete if there is a socket for the winning bid
                    if (bid.socketid) {
                        vsocketio.GetSocket(bid.socketid).emit('txn complete', body.toString());
                    }
                });
            });

            req.write(JSON.stringify({ laneId: '9999', transactionAmount: bid.bid }));
            req.end();
        }
    };
};