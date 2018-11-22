pragma solidity ^0.4.24;
import "./SafeMath.sol";

contract InvoiceFactoring{

   struct InvoiceFactoringDetails{
       address owner;
       address maxBidder;
       uint256 maxBidAmount;
       uint256 minPrice;
       bool isBidding;
       bool isCreated;
   }


    //consider using external way to enforce bidding window
    // struct DateRange{
    //     uint256 startDate;
    //     uint256 endDate;
    // }

    mapping(uint => InvoiceFactoringDetails) entries;


    string[] errMsg = [
                    "Unauthorised Transaction",                                 //errMsg[0]
                    "Transaction Failed"                                        //errMsg[4]
                ];

    event entryCreated(uint id, address addr);
    event biddingOpened(uint id, uint256 minPrice);
    event biddingClosed(uint id, uint256 maxPrice, bool accept);
    event newMaxBid(uint id);
    event failedBid(uint id);


    constructor() public {

    }


    //add an entry
    function addEntry(uint invoiceID, address owner, uint256 minPrice) public returns (bool){
        if(exists(invoiceID)){
            return false;
        }
        entries[invoiceID] = InvoiceFactoringDetails(owner,address(0),0, minPrice,false, true);
        emit entryCreated(invoiceID, owner);
        return true;
    }


    function getEntry(uint invoiceID) public view returns (address,address, uint256, uint256, bool){
        if(exists(invoiceID)){
            return(entries[invoiceID].owner, entries[invoiceID].maxBidder, entries[invoiceID].maxBidAmount, entries[invoiceID].minPrice,entries[invoiceID].isBidding);
        }
    }

    //open and close bidding
    function startBidding(uint invoiceID) public{

        if(exists(invoiceID)){
            if(msg.sender == entries[invoiceID].owner){
                entries[invoiceID].isBidding = true;
                emit biddingOpened(invoiceID, entries[invoiceID].minPrice);
            }
        }
    }

    function stopBidding(uint invoiceID, bool accept) public returns (bool){
        if(exists(invoiceID)){
            if(entries[invoiceID].isBidding == true){
                entries[invoiceID].isBidding = false;
                if(accept){
                    assert(entries[invoiceID].owner.send(entries[invoiceID].maxBidAmount));
                    entries[invoiceID].owner = entries[invoiceID].maxBidder;
                }
                else{
                    assert(entries[invoiceID].maxBidder.send(entries[invoiceID].maxBidAmount));
                }
                emit biddingClosed(invoiceID, entries[invoiceID].maxBidAmount, accept);
                return true;
            }
        }

        return false;
    }

    //place bid
    function placeBid(uint invoiceID) public payable returns (bool){
        require(msg.value > entries[invoiceID].minPrice, "Invalid transaction - cannot bid below minimum bid" );
        require(msg.sender !=  entries[invoiceID].owner , "Invalid transaction - already own invoice");
        if(exists(invoiceID)){
            if(entries[invoiceID].isBidding == true){
                if(entries[invoiceID].maxBidAmount > msg.value){
                    assert(msg.sender.send(msg.value));
                    emit failedBid(invoiceID);
                }else{
                    assert(entries[invoiceID].maxBidder.send(entries[invoiceID].maxBidAmount));
                //new maxBid
                    entries[invoiceID].maxBidAmount = msg.value;
                    entries[invoiceID].maxBidder = msg.sender;
                    emit newMaxBid(invoiceID);
                }
                return true;
            }
        }

        return false;


    }

    function exists(uint invoiceID) private view returns (bool){
        if(entries[invoiceID].isCreated == true){
            return true;
        }
        return false;
    }

}
