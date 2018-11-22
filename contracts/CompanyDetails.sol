pragma solidity ^0.4.24;
contract CompanyDetails {

    struct Company {
        address companyWallet;
        uint companyID;
        string name;
        string creditRating;
        string companyType;
    }

    string[] errorMsg;
    uint numCompanies;
    
    mapping(uint => Company) companies;
    string[] companyNames;

    event CompanyID(uint companyID, string companyName);

    constructor(){
        errorMsg = [
            "Company ID doesn't exist",
            "Company name already exists"
        ];
        numCompanies = 0;
    }

    function addCompany(address companyWallet, string name, string creditRating, string companyType) public returns (uint companyId) {
        for(uint i = 0; i<companyNames.length; i++){
            require(!equalTo(name, companyNames[i]), errorMsg[1]);
        }
        uint companyID = ++numCompanies;
        companies[companyID] = Company(companyWallet, companyID, name, creditRating, companyType);
        companyNames.push(name);
        emit CompanyID(companyID, name);
        return companyID;
    }

    function getCompany(uint id) public view returns (address companyWallet, uint companyID, string name, string creditRating, string companyType) {
        require(id > 0 && id <= numCompanies, errorMsg[0]);
        return(companies[id].companyWallet, companies[id].companyID, companies[id].name, companies[id].creditRating, companies[id].companyType);
    }

    function updateCompany(uint id, address companyWallet, string name, string creditRating, string companyType) public returns (bool) {
        require(id > 0 && id <= numCompanies, errorMsg[0]); //check if company ID exists
        for(uint i = 0; i<companyNames.length; i++){
            require(!equalTo(name, companyNames[i]), errorMsg[1]); //Checks if company name already exists
        }
        companies[id] = Company(companyWallet, id, name, creditRating, companyType);
        return true;
    }

    function getNumCompanies() public view returns (uint){
        return numCompanies;
    }
    
    function equalTo(string _a, string _b) private pure returns (bool){
        return keccak256(_a) == keccak256(_b);
    }
}