/**
    Copyright 2016 Vantiv. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * App ID for the skill
 */
var APP_ID = 'amzn1.ask.skill.2767985b-1e37-48c0-a13e-f4aead039ec6';//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');


/*
 *This will get filled dynamically when items have bids placed on them
 *
 */
var bidItems = [];


/*
 * This will hold the current bidders name. When asked to authenticate, whatever number we enter will determine who the current bidder is
 *
 */
var currentBidder = "Tyler Blanton";
var currentID = 1240;
var populated = false;


/**
 * VauctionSkill is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var VauctionSkill = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
VauctionSkill.prototype = Object.create(AlexaSkill.prototype);
VauctionSkill.prototype.constructor = VauctionSkill;

/**
 * Overriden to show that a subclass can override this function to initialize session state.
 */
VauctionSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // Any session init logic would go here.
    if (!populated) {
        populateAuction();
        populated = true;
    }
};

/**
 * If the user launches without specifying an intent, route to the correct function.
 */
VauctionSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("VauctionSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);

    handleListLotsIntent(session, response);
};

/**
 * Overriden to show that a subclass can override this function to teardown session state.
 */
VauctionSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    //Any session cleanup logic would go here.
};

VauctionSkill.prototype.intentHandlers = {
    "GetPasscodeIntent": function (intent, session, response) {
        handleGetPasscodeIntent(session, response, intent)
    },

    "HighestBidIntent": function (intent, session, response) {
        handleHighestBidIntent(session, response, intent)
    },

    "ListLotsIntent": function (intent, session, response) {
        handleListLotsIntent(session, response);
    },

    "TimeLeftIntent": function (intent, session, response) {
        handleTimeLeftIntent(session, response, intent);
    },

    "BidIntent": function (intent, session, response) {
        handlePickAndBidIntent(session, response, intent);
    },

    "EndAuctionIntent": function (intent, session, response) {
        handleEndAuctionIntent(session, response, intent)
    },

    "RestartIntent": function (intent, session, response) {
        handleRestartIntent(session, response, intent);
    },

    "PayIntent": function (intent, session, response) {
        handlePayIntent(session, response, intent);
    },

    "WhoWonIntent": function (intent, session, response) {
        handleWhoWonIntent(session, response, intent);
    },

    "CompletionStatusIntent": function (intent, session, response) {
        handleCompletionStatusIntent(session, response, intent);
    },

    "CurrentProfileIntent": function (intent, session, response) {
        handleCurrentProfileIntent(session, response, intent);
    },

    "GetItemIDIntent": function (intent, session, response) {
        handleGetItemIDIntent(session, response, intent);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "";

        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        // For the repromptText, play the speechOutput again
        response.ask(speechOutput, repromptOutput);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

function handleGetPasscodeIntent(session, response) {
    var passcode = '';
    var http = require("http");

    var options = {
        "method": "PATCH",
        "hostname": "vauctiontechexpo-dev.us-east-1.elasticbeanstalk.com",
        "port": null,
        "path": "/api/passcode/alexaclientid",
        "headers": {
            "cache-control": "no-cache"
        }
    };
    console.log("calling alexatechexpo website");
    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            console.log('reached end' + body.toString());
            var body = Buffer.concat(chunks);
            var responsejson = JSON.parse(body)
            passcode = responsejson.passcode;
        });
    });

    req.end();

    var speechText = "Your passcode is: " + passcode;

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.tellWithCard(speechOutput, "Vauction Tech Expo Demo", speechText);
}

/**
 * "what's for sale?"
 */
function handleListLotsIntent(session, response) {
    var speechText = "The items today are: ";
    for (var i = 0; i < bidItems.length; i++) {
        speechText += bidItems[i].name
        if (i === bidItems.length - 2) {
            speechText += ". and ";
        }
        else {
            speechText += ". ";
        }
    }
    if (bidItems.length === 0) {
        speechText = "Sorry, there are no items for sale."
    }

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.tellWithCard(speechOutput, "Vauction", speechText);
}

/**
 * "bid ____ dollars on the ____"
 */
function handlePickAndBidIntent(session, response, intent) {
    var speechText = "";
    var itemSub = checkForItem(intent.slots.Item.value);     //func returns -1 if item not found, otherwise subscript of item in 'bidItems'
    if (itemSub === -1) {

        speechText = intent.slots.Item.value + " is not up for auction."
    }
    //string comparison
    else {
        if (parseInt(intent.slots.Bid.value) > parseInt(bidItems[itemSub].bid) && getTimeLeft(intent.slots.Item.value) > 0) {
            changeBid(intent.slots.Item.value, intent.slots.Bid.value);
            speechText += intent.slots.Bid.value + " dollar bid Placed. You are now the highest bidder. "
        }
        else {
            if (getTimeLeft(intent.slots.Item.value) <= 0) {
                speechText += "The bidding for the" + intent.slots.Item.value + " has ended. The winner is " + bidItems[itemSub].leader
            }
            else {
                speechText += "Sorry. That does not exceed the current highest bid.";

            }
        }
    }

    var speechOutput = {
        speech: '<speak>' + speechText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
    };
    response.tellWithCard(speechOutput, "Vauction", speechText);
}

/**
 * "bid ____ dollars on lot _ _ _ _"
 */
function handlePickAndBidWithIDIntent(session, response, intent) {
    var speechText = " ";
    var itemSub = checkForItemID(intent.slots.ID.value);     //func returns -1 if item not found, otherwise subscript of item in 'bidItems'
    if (itemSub === -1) {

        speechText = "There is no item at lot " + intent.slots.ID.value;
    }
    else {
        if (parseInt(intent.slots.Bid.value) > parseInt(bidItems[itemSub].bid)) {
            changeBidByID(intent.slots.ID.value, intent.slots.Bid.value);
            speechText += intent.slots.Bid.value + " dollar bid Placed. You are now the highest bidder. "
        }
        else {
            speechText += "Sorry. That does not exceed the current highest bid.";
        }
    }

    var speechOutput = {
        speech: '<speak>' + speechText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
    };
    response.tellWithCard(speechOutput, "Vauction", speechText);
}

/**
 * "how much time is left on the ____"
 */
function handleTimeLeftIntent(session, response, intent) {
    // var speechText = "There is one minute left.";
    var speechText = " ";
    var itemSub = checkForItem(intent.slots.Item.value)
    if (itemSub === -1) {
        speechText = intent.slots.Item.value + " is not in the current auction.";
    }
    else {
        var minsLeft = getTimeLeft(intent.slots.Item.value);
        var secondsLeft = ((minsLeft - Math.floor(minsLeft)) * 100 * 60) / 100
        if (minsLeft > 0 && secondsLeft > 0) {
            speechText = "There are " + Math.floor(minsLeft) + " minutes and " + Math.floor(secondsLeft) + " seconds left on the " + intent.slots.Item.value
        }
        else {
            speechText = "There is no time left in the auction for the " + intent.slots.Item.value;
        }
    }

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.tellWithCard(speechOutput, "Vauction", speechText);
}

/**
 * "who won the ____"
 */
function handleWhoWonIntent(session, response, intent) {
    var itemSub = checkForItem(intent.slots.Item.value);
    var speechText = " "
    if (itemSub === -1) {
        speechText = "That item does not exist within the current auction. "
    }
    else {
        if (getTimeLeft(intent.slots.Item.value) > 0) {
            speechText = "The bidding for the " + bidItems[itemSub].name + " has not ended yet. "
        }
        else {
            speechText = "The winner of the " + bidItems[itemSub].name + " is " + bidItems[itemSub].leader
        }
    }
    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.tellWithCard(speechOutput, "Vauction", speechText);
}

/**
 * "authenticate me with PIN _ _ _ _"
 * PIN must be four digits
 */
function handleAuthenticateIntent(session, response, intent) {
    var speechText = "";
    var found = false;
    for (var i = 0; i < bidders.length; i++) {
        if (intent.slots.authID.value === bidders[i].pin) {
            currentBidder = bidders[i].name
            speechText = "Okay. " + currentBidder + " is now the current bidder."
            found = true
        }
    }
    if (!found) {
        speechText = "There is no user with pin " + intent.slots.authID.value + ": " + currentBidder + " is still the current bidder"
    }
    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.tellWithCard(speechOutput, "Vauction", speechText);
}

/**
 * "what is the lot number of the ____"
 */
function handleGetItemIDIntent(session, response, intent) {
    var itemSub = checkForItem(intent.slots.Item.value);
    var speechText = itemSub;
    if (itemSub === -1) {
        speechText = intent.slots.Item.value + " is not up for auction.";
    }
    else {
        speechText = "The auction ID of the " + intent.slots.Item.value + " is " + bidItems[itemSub].auctionID;
    }
    var speechOutput = {
        speech: '<speak>' + speechText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
    };
    response.tellWithCard(speechOutput, "Vauction", speechText);
}

/**
 * "restart the auction"
 */
function handleRestartIntent(session, response, intent) {
    bidItems.length = 0;
    populateAuction()
    var speechText = "Auction reset.";

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.tellWithCard(speechOutput, "Vauction", speechText);
}

/**
 * "pay for the ____"
 */
function handlePayIntent(session, response, intent) {
    var itemSub = checkForItem(intent.slots.Item.value)
    var speechText = " "
    if (itemSub === -1) {
        speechText = "That item is not in the current auction"
    }
    else if (getTimeLeft(intent.slots.Item.value) > 0) {
        speechText = "The auction for that item has not ended yet. "
    }
    else if (bidItems[itemSub].leader === "no one") {
        speechText = "Invalid. No bids were placed on the " + intent.slots.Item.value;
    }
    else if (bidItems[itemSub].leader !== currentBidder) {
        speechText = "This profile is not authorized to make payments on behalf of " + bidItems[itemSub].leader
    }
    else {
        speechText = bidItems[itemSub].bid + " dollars paid successfully. Payment powered by Vantive";  //misspelled deliberately so she says it correctly
        bidItems.splice(itemSub, 1);
    }

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.tellWithCard(speechOutput, "Vauction", speechText);
}

/**
 * "what is the highest bid on the ____"
 */
function handleHighestBidIntent(session, response, intent) {
    var itemSub = checkForItem(intent.slots.Item.value);
    var speechText = " "
    if (itemSub === -1) {
        speechText = "That item is not in the current auction."
    }
    else {
        var winningBidder;
        if (bidItems[itemSub].leader == currentBidder) winningBidder = "You hold";
        else
            winningBidder = bidItems[itemSub].leader + " holds";

        if (bidItems[itemSub].leader === "no one" || bidItems[itemSub].bid === "0") {
            speechText = "No bids have been placed on the " + intent.slots.Item.value + " yet. Starting bid is " + bidItems[itemSub].bid + " dollars."
        }
        else {
            speechText = winningBidder + " the highest bid for the " + intent.slots.Item.value + " at " + bidItems[itemSub].bid + " dollars."
        }
    }

    var speechOutput = {
        speech: '<speak>' + speechText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
    };
    response.tellWithCard(speechOutput, "Vauction", speechText);
}

/**
 * "End the auction for the ____"
 */
function handleEndAuctionIntent(session, response, intent) {
    var itemSub = checkForItem(intent.slots.Item.value)
    var speechText = " ";
    if (itemSub === -1) {
        speechText = "That item is not in the current auction."
    }
    else {
        bidItems[itemSub].startTime = 0;
        bidItems[itemSub].endTime = 0;
        speechText = "The auction for the " + intent.slots.Item.value + " has ended. "
    }

    var speechOutput = {
        speech: '<speak>' + speechText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
    };
    response.tellWithCard(speechOutput, "Vauction", speechText);
}

/**
 * "who is the current bidder?"
 */
function handleCurrentProfileIntent(session, response, intent) {
    var speechText = "The current profile belongs to " + currentBidder

    var speechOutput = {
        speech: '<speak>' + speechText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
    };
    response.tellWithCard(speechOutput, "Vauction", speechText);
}

/**
 * "what is the status of the ____"
 */
function handleCompletionStatusIntent(session, response, intent) {
    var itemSub = checkForItem(intent.slots.Item.value);
    var speechText = " ";
    if (itemSub === -1) {
        speechText = "That item is not in the current auction."
    }
    else {
        var winningBidder = bidItems[itemSub].leader;
        if (winningBidder == currentBidder) winningBidder = "you";

        if (getTimeLeft(intent.slots.Item.value) <= 0) {
            speechText = "The auction for the " + intent.slots.Item.value + " has closed. "
            if (bidItems[itemSub].bid < 0) {
                speechText += "There were no bids for this item. "
            }
            else {
                speechText += "The winning bid was " + bidItems[itemSub].bid + " dollars by " + winningBidder + ". Congratulations!";
            }
        }
        else {
            speechText = "The bidding for the " + intent.slots.Item.value + " is still open. Current Highest bid is " + bidItems[itemSub].bid + " dollars by " + winningBidder;
        }
    }

    var speechOutput = {
        speech: '<speak>' + speechText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
    };
    response.tellWithCard(speechOutput, "Vauction", speechText);
}

/*
 * Create the handler that responds to the Alexa Request.
 */
exports.handler = function (event, context) {
    // Create an instance of the Vauction Skill.
    var skill = new VauctionSkill();
    skill.execute(event, context);
};

/**
 * look up item in auction by item's name
 */
function checkForItem(item) {
    for (var i = 0; i < bidItems.length; i++) {
        if (bidItems[i].name === item) {
            return i;
        }
    }
    return -1;
}

/**
 * look up item in auction by auctionID
 */
function checkForItemID(id) {
    for (var i = 0; i < bidItems.length; i++) {
        if (bidItems[i].auctionID === parseInt(id)) {
            return i;
        }
    }
    return -1;
}

/**
 * update bid on item by items name
 */
function changeBid(item, newBid) {
    for (var i = 0; i < bidItems.length; i++) {
        if (bidItems[i].name === item) {
            bidItems[i].bid = newBid
            bidItems[i].leader = currentBidder
        }
    }
}

/**
 * update bid on item by the item's auctionID
 */
function changeBidByID(id, newBid) {
    for (var i = 0; i < bidItems.length; i++) {
        if (bidItems[i].auctionID === parseInt(id)) {
            bidItems[i].bid = newBid
            bidItems[i].leader = currentBidder
        }
    }
}

/**
 * return time left in item's auction in minutes (xx.xxxxxx)
 */
function getTimeLeft(item) {
    var itemSub = checkForItem(item);
    var d = new Date();
    var m = d.getTime()
    var timeLeft = bidItems[itemSub].endTime - m
    timeLeft = timeLeft / 60000

    return timeLeft;
}

/*
 * get unique ID for each new item.
 *
 */
function generateAuctionID() {
    currentID += Math.random() * 100
    return Math.floor(currentID);
}

/*
 * populates list of items
 * called once when auction starts, and again if user asks to restart the auction
 */
function populateAuction() {
    var d = Date.now()
    var dEnd = d + 600000   //ten minutes from start time
    // dEnd = d + 15000 //uncomment if you want items to last for 15 seconds
    bidItems.push({
        name: "vantive calculator",
        bid: "6",
        leader: "no one",
        startTime: d,
        endTime: dEnd,
        auctionID: 1240
    })
    bidItems.push({
        name: "vantive mousepad",
        bid: "3",
        leader: "no one",
        startTime: d,
        endTime: dEnd,
        auctionID: 1244
    })
    bidItems.push({
        name: "vantive gives tee shirt",
        bid: "10",
        leader: "no one",
        startTime: d,
        endTime: dEnd,
        auctionID: 1248
    })
    bidItems.push({
        name: "vantive hat",
        bid: "8",
        leader: "no one",
        startTime: d,
        endTime: dEnd,
        auctionID: 1252
    })
    bidItems.push({
        name: "vantive hoodie",
        bid: "32",
        leader: "no one",
        startTime: d,
        endTime: dEnd,
        auctionID: 1256
    })
}

/*
 *  List of people who can be authenticated and sign in to the auction
 */
var bidders = [
    {
        userName: "dourada",
        name: "Dan Ourada",
        id: "1",
        cellPhone: "111-111-1111",
        emailAddress: "dan.ourada@vantiv.com",
        token: "5499990123456781",
        pin: "1234"
    },
    {
        userName: "apaulson",
        name: "Alec Paulson",
        id: "2",
        cellPhone: "111-111-1111",
        emailAddress: "alec.paulson@vantiv.com",
        token: "5499990123456781",
        pin: "4321"
    },
    {
        userName: "tblanton",
        name: "Tyler Blanton",
        id: "3",
        cellPhone: "999-9999",
        emailAddress: "tyler.blanton@vantiv.com",
        token: "5499990123456781",
        pin: "6789"
    },
    {
        userName: "aramikrishnan",
        name: "Anuradha Ramikrishnan",
        id: "4",
        cellPhone: "888-8888",
        emailAddress: "anuradha.ramikrishnan@vantiv.com",
        token: "5499990123456781",
        pin: "9876"
    }]

//MARK: To do
/*
put item images in cards



*/