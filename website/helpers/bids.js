module = module.exports = function (vsocketio) {
    var vsocketio = vsocketio;
    var highestBid = { bid: 0.00, clientid: null, socketid: null };

    return {
        NewBid: function (bid) {
            console.log("NewBid: " + JSON.stringify(bid))
            
            if(!bid.clientid && !bid.socketid)
                return false;

            if(parseInt(bid.bid) > parseInt(highestBid.bid)) {
                highestBid = bid;
                vsocketio.EmitNewBid(highestBid);
                return true;
            }   
            else 
                return false;
        },
        GetHighestBid: function() {
            return highestBid;
        },
        EndAuction: function() {
            vsocketio.EmitEndAuction(highestBid);
            ProcessTransaction(highestBid.bid);
            highestBid = { bid: 0.00, clientid: null, socketid: null };
        },
        ProcessTransaction: function(amount) {
            //run txn via tripos for amount
        }
    };
};