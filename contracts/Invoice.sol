pragma solidity ^0.4.24;


contract Invoice {

    //structure of a single invoice
    struct InvoiceDetails{
        string date;
        string importer;
        string exporter;
        string goods;
        uint256 price;
        uint256 creditTerm;
        uint[] supplierList;
        bool created;
        uint[] originList;
    }
    
    //contract mappings
    mapping(uint => InvoiceDetails) invoices;
    uint invoiceNumber;

    //events
    event InvoiceCreated(uint invoiceID, string date, string importer, string exporter, string goods, uint price);


    function createInvoice(string date, string importer, string exporter, string goods, uint price, uint creditTerm, uint supplierID) public returns (bool){
        uint invoiceID = ++invoiceNumber;  
        if(exists(invoiceID)) {
            return false;
        }

        invoices[invoiceID] = InvoiceDetails(date, importer, exporter, goods, price, creditTerm, new uint[](0), true, new uint[](0));
        invoices[invoiceID].supplierList.push(supplierID);

        emit InvoiceCreated(invoiceID, date, importer, exporter, goods, price);
        return true;
    }


    function getInvoice(uint invoiceID) public view returns (string, string, string, string, uint, uint, uint[]) {
        if (exists(invoiceID)) {
            return (invoices[invoiceID].date,invoices[invoiceID].importer,invoices[invoiceID].exporter,invoices[invoiceID].goods,invoices[invoiceID].price,invoices[invoiceID].creditTerm,invoices[invoiceID].supplierList);
        }
    }

    function updateInvoice(uint invoiceID, string importer, string exporter, string goods, uint price, uint creditTerm) public returns (bool){
        if(!exists(invoiceID)) {
            return false;
        }
        invoices[invoiceID].importer = importer;
        invoices[invoiceID].exporter = exporter;
        invoices[invoiceID].goods = goods;
        invoices[invoiceID].price = price;
        invoices[invoiceID].creditTerm = creditTerm;
        return true;
    }


    function addSupplier(uint invoiceID, uint supplierID) public returns (bool) {
        if(!exists(invoiceID)) {
            return false;
        }

        for (uint i = 0; i < invoices[invoiceID].supplierList.length; i++) {
            if (invoices[invoiceID].supplierList[i] == supplierID) {
                return false;
            }
        }
        invoices[invoiceID].supplierList.push(supplierID);
        return true;
    }

    // function removeSupplier(uint invoiceID, uint supplierID) public returns (bool) {
    //     if(!exists(invoiceID)) {
    //         return false;
    //     }
    //     for (uint i = 0; i < invoices[invoiceID].supplierList.length; i++) {
    //         if (invoices[invoiceID].supplierList[i] == supplierID) {
    //             delete invoices[invoiceID].supplierList[i];

    //             return true;
    //         }
    //     }
    //     return false;
    // }

    function getSuppliers(uint invoiceID) public view returns (uint[]) {
        if(!exists(invoiceID)) {
            return new uint[] (0);
        }
        return invoices[invoiceID].supplierList;
    }

    function getSourceOfOrigin(uint invoiceID) public view returns (uint[]) {
        uint[] supplierListOfCurrentInvoice = invoices[invoiceID].supplierList;
        
        for (uint i = 0; i < supplierListOfCurrentInvoice.length; i++) {
            uint supplierID = supplierListOfCurrentInvoice[i];
            
            if(supplierID != 0){
                invoices[invoiceID].originList.push(supplierID);
                uint[] memory tempArr = getSourceOfOrigin(supplierID);
                for(uint j = 0; j < tempArr.length; j++){
                    invoices[invoiceID].originList.push(tempArr[j]);
                }
            } 
        }
        return invoices[invoiceID].originList;
    }

    function getNumInvoices() public view returns (uint) {
        return invoiceNumber;
    }
 
    function exists(uint invoiceID) private view returns (bool) {
        if (invoices[invoiceID].created) {
            return true;
        }
        return false;
    }

}