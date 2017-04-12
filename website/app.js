var app = require('express')();
var path = require('path') // trying to figure out how to serve static files in express 
var http = require('http').Server(app);
var alexaPasscodes = require('./helpers/alexapasscodes.js');
var vsocketio = require('./socketio/vsocketio.js')(http, alexaPasscodes);
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public'))); // trying to figure out how to serve static files in express

var port = process.env.PORT || 8080; 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.use('/api', require('./controllers')(alexaPasscodes, vsocketio));

http.listen(port, function(){
  console.log('listening on *:' + port);
});