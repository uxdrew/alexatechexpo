$(function () {
    var socket = io();
    var clientid;
    var lastbid = null;
    $('#bid-form').submit(function () {
        //console.log(socket.id);
        var bid = {
            bid: parseFloat($('#bid-text').val().replace(/,/g, "")),
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
        $('#bid-history').show();
        $('#bid-history').ready(function () {
            $("ol").prepend($('<li>').text("$" + msg.bid));
            $('#bid-history > ol > li').slice(5).remove();
        });

        //check if either the socketid matches this session or that the clientid matches
        if ((msg.socketid && msg.socketid == socket.id) || (msg.clientid && msg.clientid == clientid)) {
            //make request to tripos with winning amount

            //the bid is mine, i'm winning!!

            document.body.style.backgroundColor = "#324D5C";
            $('#text-how').text('');
            $('#text-helper').text('highest bidder! :)');
            $('#btn-bid').hide();
            var snd = new Audio("sounds/powerUp.wav"); // buffers automatically when created
            snd.play();
            //page changes here
            //have view receipt button
            //opens modal, displays tripos raw response (for starters), and link to express dashboard
        }
        else {
            //bid isn't mine, i'm losing :(
            //page changes here
            document.body.style.backgroundColor = "#b1483a";
            $('#text-how').text('');
            $('#text-helper').text('bid again! :o');
            $('#btn-bid').show();
            var snd = new Audio("sounds/wahWah.wav"); // buffers automatically when created
            snd.play();
            snd.playbackRate = 2.5;
        }
    });

    //auction has closed event here
    //page changes to show auction has ended
    socket.on('end auction', function (msg) {
        console.log(msg);

        $('#bid-row').hide();
        $('#done-row').show();
        $("#wrapper").toggleClass("toggled");

        //check if we won
        if (msg.socketid == socket.id) {
            //i won!
            //page changes here
            $('#won-div').show();
            $('#lost-div').hide();
            document.body.style.backgroundColor = "#46B29D";
            $('#text-helper').text('winner!');
            // $('#won-detail').text("We have charged $" + msg.bid + " using triPOS to the card on file");
        }
        else {
            //i lost!
            //page changes here
            document.body.style.backgroundColor = "#DE5B49";
            $('#text-helper').text('game over! :(');
        }
    });

    socket.on('connect', function () {
        console.log("Web Socket Connected - socketid: " + socket.id);
    });

    socket.on('txn complete', function (msg) {
        var response = JSON.parse(msg);
        console.log('txn complete: ' + msg);

        //put msg response in the receipt area
        $('#receipt-btn').removeClass('disabled');
        $('#progress-bar').hide();
        $('#won-detail').text("Your credit card was processed.");
        var snd = new Audio("sounds/winner.wav"); // buffers automatically when created
        snd.play();

        //set modal form values
        $('#receipt-date').text(new Date().toLocaleString());
        $('#receipt-merchantid').text(response.merchantId);
        $('#receipt-amount').text('$' + response.subTotalAmount);
        $('#receipt-cardbrand').text(response.cardLogo);
        $('#receipt-cardnum').text(response.accountNumber);
        $('#receipt-statuscode').text(response.statusCode);
        $('#receipt-authcode').text(response.approvalNumber);
        $('#receipt-txnid').text(response.transactionId);
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
            var tempClientId = clientid;
            if (clientid.length > 30) tempClientId = clientid.substring(0, 30);
            $('#client-id').text("client id: " + tempClientId + "...");
            $('#passcode-form').hide();
            $('#is-paired').attr('class', 'pair-yes')
            $('#sticky').show();
            var snd = new Audio("sounds/wooHoo.wav"); // buffers automatically when created
            snd.play();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
        });

        return false;
    });


    $('#end-auction').click(function () {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/api/bid/",
            "method": "DELETE",
            "headers": {
                "cache-control": "no-cache"
            }
        }

        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    });
});