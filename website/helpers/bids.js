module = module.exports = function (vsocketio) {
    var vsocketio = vsocketio;
    var highestBid = { bid: 0.0, clientid: null, socketid: null };

    return {
        NewBid: function (bid) {
            console.log("NewBid: " + JSON.stringify(bid))
            
            if(!bid.clientid && !bid.socketid)
                return false;

            if(bid.bid > highestBid.bid) {
                highestBid = bid;
                vsocketio.EmitNewBid(highestBid);
                return true;
            }   
            else 
                return false;
        },
        GetHighestBid: function() {
            return highestBid;
        }
    };
};