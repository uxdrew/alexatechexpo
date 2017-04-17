$(function () {
    var socket = io();
    var lastbid = null;
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

    $('linkform').submit(function() {
        //make api call to /api/linkaccounts

        //depending on successful pairing or not, 
        //show returned clientid and hide form
        //or do nothing
    });
    socket.on('new bid', function (msg) {
        console.log(msg);
        lastbid = msg;
        $('#bid-price').text("$" + msg.bid);

        if(msg.socketid == socket.id) {
            //make request to tripos with winning amount

            //the bid is mine, i'm winning!!
            //page changes here
            //have view receipt button
            //opens modal, displays tripos raw response (for starters), and link to express dashboard
        }
        else {
            //bid isn't mine, i'm losing :(
            //page changes here
        }
    });

    //auction has closed event here
    //page changes to show auction has ended
    socket.on('end auction', function (msg) {
        console.log(msg);
        if(lastbid.socketid == socket.id) {
            //i won!
            //page changes here
        }
        else {
            //i lost!
            //page changes here
        }
    });

    socket.on('connect', function () {
        console.log("Web Socket Connected - socketid: " + socket.id);
    });
});