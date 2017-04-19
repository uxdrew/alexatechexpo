$(function () {
    var socket = io();
    var clientid;
    var lastbid = null;
    $('#bid-form').submit(function () {
        //console.log(socket.id);
        var bid = {
            bid: parseFloat($('#bid-text').val()),
            clientid: null,
            socketid: socket.id
        };

        var settings = {
            "async": true,
            "crossDomain": false,
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

    $('linkform').submit(function () {
        //make api call to /api/linkaccounts

        //depending on successful pairing or not, 
        //show returned clientid and hide form
        //or do nothing
    });
    socket.on('new bid', function (msg) {
        console.log(msg);
        lastbid = msg;
        $('#bid-price').text("$" + msg.bid);

        //check if either the socketid matches this session or that the clientid matches
        if ((msg.socketid && msg.socketid == socket.id) || (msg.clientid && msg.clientid == clientid)) {
            //make request to tripos with winning amount

            //the bid is mine, i'm winning!!

            document.body.style.backgroundColor = "#324D5C";
            $('#text-how').text('');
            $('#text-helper').text('You are now the highest bidder!');
            $('#btn-hide').hide();
            //page changes here
            //have view receipt button
            //opens modal, displays tripos raw response (for starters), and link to express dashboard
        }
        else {
            //bid isn't mine, i'm losing :(
            //page changes here
            document.body.style.backgroundColor = "#DE5B49";
            $('#text-how').text('');
            $('#text-helper').text('You are not the highest bidder!');

        }
    });

    //auction has closed event here
    //page changes to show auction has ended
    socket.on('end auction', function (msg) {
        console.log(msg);
        if (lastbid.socketid == socket.id) {
            //i won!
            //page changes here
            document.body.style.backgroundColor = "#46B29D";
        }
        else {
            //i lost!
            //page changes here
            document.body.style.backgroundColor = "#DE5B49";
        }
    });

    socket.on('connect', function () {
        console.log("Web Socket Connected - socketid: " + socket.id);
    });

    $('#passcode-form').submit(function () {
        var data = { passcode: $('#txtPasscode').val(), socketid: socket.id };

        var settings = {
            "async": true,
            "crossDomain": false,
            "url": "/api/linkaccounts/",
            "method": "PUT",
            "headers": {
                "content-type": "application/json",
                "cache-control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify(data)
        }

        $.ajax(settings).done(function (response) {
            console.log(response);
            clientid = response.alexaClientId;
            $('#client-id').text("client id: " + clientid);
            $('#passcode-form').hide();
            $('#is-paired').attr('class', 'pair-yes')
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
        });

        return false;
    });
});