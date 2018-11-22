pragma solidity ^0.4.24; //0.4.15? 0.4.17?

//import "truffle/Assert.sol";
//import "truffle/DeployedAddresses.sol";
import "./SafeMath.sol";
import "./FiatContract.sol";

contract FiatConversion{

  using SafeMath for uint256;
   
  // This event act as a receipt and is stored in a the corresponding block 
  event Receipt(address receiver, address sender, uint256 amount);
    
  constructor(){}

  // Main function for transfering tokens between addresses
  function transferToken(address receiver) public payable {
    require(address(this).balance >= msg.value);
    receiver.transfer(msg.value);
    emit Receipt(receiver, msg.sender, msg.value);
  } 

  // Returns address current balance 
  function currentBalance() view returns(uint sendersBalance){
        return this.balance;
  }  

  /****BENEATH HERE IS THE CODE FIRST IMPLEMENTED TO USE IN A PUBLIC ETHEREUM NETWORK WITH A TRUSTED ORACLE******
  ****************CAN ALSO BE IMPLEMENTED IN A PRIVATE NETWORK BY OPENING ADDITIONAL PORTS***********************

  function equal(string _a, string _b) public pure returns (bool) {
    bytes memory a = bytes(_a);
    bytes memory b = bytes(_b);
    return keccak256(a) == keccak256(b) ;
  }        
    
  uint256 finalValue = 0;
  uint256 transferAmount = 0;
  uint256 UsdEthCoin = 0;
  
  // FiatContract public price;
  function Example() {
    price = FiatContract(0x2CDe56E5c8235D6360CCbb0c57Ce248Ca9C80909);
  }

  //Converting chosen currency into ETH wei.
  function conversionToUSD(uint256 amount, string currency) payable returns (uint256){
    if(equal("USD", currency)) {
      //ethCoin returns $0.01 worth of ETH in USD 
      //ethCoin = price.USD(0);
      //ethCoin = SafeMath.mul(ethCoin, 100); // We want atleast one USD worth
      //return SafeMath.mul(ethCoin, amount);
      return amount;
    }

    if(equal("EUR", currency)) {
      
      //ethCoin returns €0.01 worth of ETH in EUR
      //ethCoin = price.EUR(0);
      //ethCoin = SafeMath.mul(ethCoin, 100); // We want atleast one EUR worth
      //return SafeMath.mul(ethCoin, amount);  

      // Get 1€ worth of ETH
      uint256 EurEthCoin = price.EUR(0);
      EurEthCoin = SafeMath.mul(EurEthCoin, 100); // We want atleast one EUR worth      

      // Get 1$ worth of ETH
      UsdEthCoin = price.USD(0);

      // since we're doing integer division we wont multiply UsdEthCoin yet.
      //UsdEthCoin = SafeMath.mul(UsdEthCoin, 100);

      uint256 EurToUsdRatio = SafeMath.div(EurEthCoin,UsdEthCoin);

      //UsdInEurValue should equal 1€/1$*amount of USD
      uint256 UsdInEurValue = SafeMath.mul(EurToUsdRatio, amount);


      //Please print to see if correct!
      finalValue = SafeMath.div(UsdInEurValue, 100);

      return finalValue;
      }

      if(equal("GBP", currency)) {

        //ethCoin returns £0.01 worth of ETH in GBP
        uint256 GbpEthCoin = price.GBP(0);
        GbpEthCoin = SafeMath.mul(GbpEthCoin, 100); // We want atleast one GBP worth

        // Get 1$ worth of ETH
        UsdEthCoin = price.USD(0);

        uint256 GbpToUsdRatio = SafeMath.div(GbpEthCoin,UsdEthCoin);

        //UsdInEurValue should equal 1€/1$*amount of USD
        uint256 UsdInGbpValue = SafeMath.mul(GbpToUsdRatio, amount);                

        //Please print to see if correct!
        finalValue = SafeMath.div(UsdInGbpValue, 100);

        return finalValue;        
      } 
      return amount;
    } 

  // This function would be used together with ConversionToUSD if we're using FiatContract oracle

  function transferEth(uint256 amount, string currency, address buyer) external payable returns (string) {
    require(address(this).balance >= amount);
    transferAmount = conversionToUSD(amount, currency);
    amount = SafeMath.mul(amount, 1 ether);
    buyer.transfer(amount);
    return "Congratz, you have now bought ETH!";
  } */

}