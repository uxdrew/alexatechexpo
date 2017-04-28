module = module.exports = (function () {
    var dict = {};

    return {
        AddAlexaPasscode: function (alexaClientId, passcode) {
            dict[alexaClientId] = { passcode: passcode, socket: null };
            console.log('alexapasscodes: ' + Object.keys(dict).length);
        },

        GetAlexaClientId: function (passcode) {
            return Object.keys(dict).find(x => dict[x].passcode === passcode);
        },
        GetSocketId: function (alexaClientId) {
            if (dict[alexaClientId] && dict[alexaClientId].socket) {
                return dict[alexaClientId].socket.id;
            }
            return null;
        },
        LinkSocket: function (alexaClientId, socket) {
            dict[alexaClientId].socket = socket;
            console.log('socketid linked - socketid: ' + socket.id + ', clientid: ' + alexaClientId);
        }
    };
})();