var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  console.log('placeBid POST hit: ' + JSON.stringify(req.body));
  res.send(req.body);
})

//get the current highest bid
router.get('/', function(req, res) {
  res.send("bid GET hit. id: " + req.params.id);
})

//update the highest bid
router.put('/', function(req, res) {
  //if(req.body.bid > highestBid)
  //update highestBid
});

//end the auction
router.delete('/', function(req, res) {

});

module.exports = router;