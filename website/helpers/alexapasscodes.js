module = module.exports = (function () {
    var dict = {};
    //dict['testKey'] = 'testValue';

    return {
        AddAlexaPasscode: function (alexaClientId, passcode) {
            dict[alexaClientId] = { passcode: passcode, socket: null };
            console.log('alexapasscodes: ' + Object.keys(dict).length);
        },

        GetAlexaClientId: function (passcode) {
            return Object.keys(dict).find(x => dict[x].passcode === passcode);
        },
        GetSocketId: function(alexaClientId) {
            return dict[alexaClientId].socket.id;
        },
        LinkSocket: function(alexaClientId, socket) {
            dict[alexaClientId].socket = socket;
            console.log('socketid linked - socketid: ' + socket.id + ', clientid: ' + alexaClientId);
        }
    };
})();