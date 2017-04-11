var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  //to txn to triPOS or mercury cert
  console.log('endauction POST hit');
  res.send("endauction POST hit");
})

router.get('/:id', function(req, res) {
  res.send("endauction GET hit");
})

module.exports = router;