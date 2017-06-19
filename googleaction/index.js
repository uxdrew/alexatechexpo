'use strict';

const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;

// handle the initialTrigger
function mainIntent(app) {
    let inputPrompt = app.buildInputPrompt(false, 'Hi, I\'m Vauction. A sentient, killer, voice auction assistant. How can I assist you?');
    app.ask(inputPrompt);
}

exports.vauction = (req, res) => {
    console.log('Incoming post request...');
    const app = new ActionsSdkApp({ request: req, response: res });

    // Create functions to handle requests here
    let actionMap = new Map();
    actionMap.set(app.StandardIntents.MAIN, mainIntent);
    //actionMap.set(app.StandardIntents.TEXT, respond);

    //add more intents to the map


    app.handleRequest(actionMap);
}