var express = require('express');
var app = express();
var path = require('path') // trying to figure out how to serve static files in express 
var http = require('http').Server(app);
var alexaPasscodes = require('./helpers/alexapasscodes.js');
var vsocketio = require('./socketio/vsocketio.js')(http, alexaPasscodes);
var bodyParser = require('body-parser');
var bids = require('./helpers/bids.js')(vsocketio, alexaPasscodes);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public'))); // trying to figure out how to serve static files in express

var port = process.env.PORT || 8080; 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', require('./controllers')(alexaPasscodes, vsocketio, bids));

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', 
  { 
    title: '(v)auction : Voice First Auction Demo', 
    textJumbotronHeader: '(v)auction',
    textDescription: '',
    labelCurrentBid: 'Current Bid',
    labelBidPrice: '$' + bids.GetHighestBid().bid,
    btnLabelBid: 'Place Bid'
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});