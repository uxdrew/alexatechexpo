var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sequence = 1;
var clients = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

//io.on('connection', function(socket){
//  socket.on('chat message', function(msg){
//    io.emit('chat message', msg);
//  });
//});

io.on('connection', function(socket) {
    //socket.name = "blah";
    console.info('New client connected (id=' + socket.id + ').');
    clients.push(socket);

    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });

    // When socket disconnects, remove it from the list:
    socket.on('disconnect', function() {
        var index = clients.indexOf(socket);
        if (index != -1) {
            clients.splice(index, 1);
            console.info('Client gone (id=' + socket.id + ').');
        }
    });
});

// Every 1 second, sends a message to a random client:
setInterval(function() {
    var randomClient;
    if (clients.length > 0) {
        randomClient = Math.floor(Math.random() * clients.length);
        clients[randomClient].emit('foo', sequence++);
    }
}, 1000);

http.listen(3000, function(){
  console.log('listening on *:3000');
});