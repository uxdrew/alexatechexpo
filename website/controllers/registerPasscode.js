var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  console.log('registerPasscode POST hit: ' + JSON.stringify(req.body));
  res.send(req.body);
})

router.get('/:id', function(req, res) {
  res.send("registerPasscode GET hit. id: " + req.params.id);
})

module.exports = router;