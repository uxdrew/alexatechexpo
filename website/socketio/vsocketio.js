exports = module.exports = function(http, alexaPasscodes) {
    var io = require('socket.io')(http);

    var alexaPasscodes = alexaPasscodes;

    var clients = [];

    io.on('connection', function(socket) {
        //socket.name = "blah";
        console.info('New client connected (id=' + socket.id + ').');
        clients.push(socket);

        // socket.on('new bid', function(msg){
        //     io.emit('new bid', msg);
        // });

        // When socket disconnects, remove it from the list:
        socket.on('disconnect', function() {
            var index = clients.indexOf(socket);
            if (index != -1) {
                clients.splice(index, 1);
                console.info('Client gone (id=' + socket.id + ').');
            }
        });
    });

    return {
        GetSocket: function(socketId) {
            return clients.find(x => x.id === socketId);
        },
        EmitNewBid: function(bid) {
            io.emit('new bid', bid);
        },
        EmitEndAuction: function(bid) {
            io.emit('end auction', bid);
        }
    };
};

// Every 1 second, sends a message to a random client:
// setInterval(function() {
//     var randomClient;
//     if (clients.length > 0) {
//         randomClient = Math.floor(Math.random() * clients.length);
//         clients[randomClient].emit('foo', sequence++);
//     }
// }, 1000);