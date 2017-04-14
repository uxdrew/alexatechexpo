module.exports = function (bids) {
  var express = require('express');
  var router = express.Router();

  //get the current highest bid
  router.get('/', function (req, res) {
    console.log('bid GET hit');
    res.send(bids.GetHighestBid());
  })

  //update the highest bid
  router.put('/', function (req, res) {
    if (bids.NewBid(req.body))
      res.send({ result: true, status: "Bid accepted." });
    else
      res.send({ result: false, status: "Bid too low." });
  });

  //end the auction
  router.delete('/', function (req, res) {

  });

  return router;
};