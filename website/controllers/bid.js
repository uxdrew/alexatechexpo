var express = require('express');
var router = express.Router();

//get the current highest bid
router.get('/', function(req, res) {
  console.log('bid GET hit');
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