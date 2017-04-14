$(function () {
    var socket = io();
    $('form').submit(function () {
        //console.log(socket.id);
        var bid = {
            bid: parseFloat($('#bid-text').val()),
            clientid: null,
            socketid: socket.id
        };

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/api/bid/",
            "method": "PUT",
            "headers": {
                "content-type": "application/json",
                "cache-control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify(bid)
        }

        $.ajax(settings).done(function (response) {
            console.log(response);
        });

        $('#bid-text').val('');
        return false;
    });
    socket.on('new bid', function (msg) {
        console.log(msg);
        $('#bid-price').text("$" + msg.bid);
    });
    socket.on('connect', function () {
        console.log("Web Socket Connected - socketid: " + socket.id);
    });
});