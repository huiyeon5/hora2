// Import the page's CSS. Webpack will know what to do with it.
// import '../styles/app.css'
import '../styles/dashboard.css'
// Import libraries we need.
const Web3 = require('web3')
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import fiatConversionArtifact from '../../build/contracts/FiatConversion.json'
import invoiceArtifact from '../../build/contracts/Invoice.json'
import companyArtifact from '../../build/contracts/CompanyDetails.json'
import factorArtifact from '../../build/contracts/InvoiceFactoring.json'
// MetaCoin is our usable abstraction, which we'll use through the code below.
const FiatConversion = contract(fiatConversionArtifact)
const Invoice = contract(invoiceArtifact)
const CompanyDetails = contract(companyArtifact)
const InvoiceFactoring = contract(factorArtifact)
// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let defaultAccount
let importerAccount
let exporterAccount
let shipperAccount
let investorAccount

let gasLimit = 3000000
const App = {
  init: function () {
    var web3 = new Web3()
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'))
    FiatConversion.setProvider(web3.currentProvider)
    Invoice.setProvider(web3.currentProvider)
    CompanyDetails.setProvider(web3.currentProvider)
    InvoiceFactoring.setProvider(web3.currentProvider)
    web3.eth.getAccounts(function (error, accs) {
      if (error != null) {
        return
      }

      if (accs.length === 0) {
        return
      }
      accounts = accs
      defaultAccount = accounts[0]
      console.log(defaultAccount)
      importerAccount = accounts[1]
      exporterAccount = accounts[2]
      shipperAccount = accounts[3]
      investorAccount = accounts[4]
    })
  },

  createInvoice: function () {
    let importer = document.getElementById('importerInvoice').value
    let exporter = document.getElementById('exporterInvoice').value
    let goods = document.getElementById('goodsInvoice').value
    let price = document.getElementById('priceInvoice').value
    let creditTerm = document.getElementById('creditTermInvoice').value
    let supplier = document.getElementById('supplierInvoice').value

    Invoice.deployed().then(function (instance) {
      return instance.createInvoice(new Date().toString(), importer, exporter, goods, price, creditTerm, supplier, { from:exporterAccount, gas: gasLimit })
    }).then(function (value) {
      alert('Invoice created')
    }).catch(function (error) {
      console.log(error)
    })
  },

  getInvoice: function (i) {
    return new Promise(function (resolve, reject) {
      Invoice.deployed().then(function (instance) {
        return instance.getInvoice.call(i)
      }).then(function (value) {
        resolve(value)
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  updateInvoice: function () {
    let invoiceID = document.getElementById('invoiceID').value
    let importer = document.getElementById('uimporter').value
    let exporter = document.getElementById('uexporter').value
    let goods = document.getElementById('ugoods').value
    let price = document.getElementById('uprice').value
    let creditTerm = document.getElementById('ucreditTerm').value

    Invoice.deployed().then(function (instance) {
      return instance.updateInvoice(invoiceID, importer, exporter, goods, price, creditTerm, { from: exporterAccount, gas: gasLimit })
    }).then(function (value) {
      alert('Invoice updated')
    }).catch(function (error) {
      console.log(error)
    })
  },

  addSupplierToInvoice: function () {
    let invoiceID = document.getElementById('invoiceID2').value
    let supplier = document.getElementById('supplier2').value

    Invoice.deployed().then(function (instance) {
      return instance.addSupplier(invoiceID, supplier, { from: exporterAccount , gas: gasLimit })
    }).then(function (value) {
      alert('Supplier Added')
    }).catch(function (error) {
      console.log(error)
    })
  },

  getSourceOfOrigin: function (i) {
    return new Promise(function (resolve, reject) {
      Invoice.deployed().then(function (instance) {
        return instance.getSourceOfOrigin.call(i)
      }).then(function (value) {
        resolve(value)
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  addCompany: function () {
    let companyWallet = document.getElementById('wallet').value
    let companyName = document.getElementById('companyName').value
    let creditRating = document.getElementById('creditRating').value
    let companyType = document.getElementById('companyType').value

    CompanyDetails.deployed().then(function (instance) {
      // Create new Company
      return instance.addCompany(companyWallet, companyName, creditRating, companyType, { from: defaultAccount, gas:gasLimit })
    }).then(function (value) {
      alert('Company created and added')
      console.log('Company ID returned: ' + value.logs[0].args.companyID['c'][0])
    }).catch(function (error) {
      alert('Company Already Exists!')
      console.log(error)
    })
  },

  getCompany: function (i) {
    return new Promise(function (resolve, reject) {
      CompanyDetails.deployed().then(function (instance) {
        return instance.getCompany.call(i)
      }).then(function (value) {
        resolve(value)
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  getNumCompanies: function () {
    return new Promise(function (resolve, reject) {
      CompanyDetails.deployed().then(function (instance) {
        return instance.getNumCompanies()
      }).then(function (value) {
        resolve(value)
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  getNumInvoices: function () {
    return new Promise(function (resolve, reject) {
      Invoice.deployed().then(function (instance) {
        return instance.getNumInvoices.call()
      }).then(function (value) {
        resolve(value)
      }).catch(function (error) {
        console.log('Ami here')
        reject(error)
      })
    })
  },

  updateCompany: function () {
    let updateID = document.getElementById('updateID').value
    let companyWallet = document.getElementById('newWallet').value
    let companyName = document.getElementById('newCompanyName').value
    let creditRating = document.getElementById('newCreditRating').value
    let companyType = document.getElementById('newCompanyType').value

    CompanyDetails.deployed().then(function (instance) {
      return instance.updateCompany(updateID, companyWallet, companyName, creditRating, companyType, {from: defaultAccount, gas:gasLimit});
    }).then(function (value) {
      console.log(JSON.stringify(value, null, 2));
      alert("company " + companyName + " updated")
    }).catch(function (error) {
      console.log(error)
    })
  },

  handleTransact: function () {
    let tValue = document.getElementById('tValue').value
    let sel = document.getElementById('currency')
    let currency = sel.options[sel.selectedIndex].text
    FiatConversion.deployed().then(function (instance) {
      console.log('test')
      console.log(tValue)
      console.log(currency)
      // return instance.conversionToUSD(tValue, currency, { from: defaultAccount, gas:gasLimit })
      console.log(defaultAccount)
      console.log(investorAccount)
      // return web3.eth.sendTransaction({ from: defaultAccount, to: investorAccount, value: 51 })
      return instance.transferEth(investorAccount, { from: defaultAccount, gas:gasLimit, value: web3.toWei(tValue, 'ether') })
    }).then(function (value) {
      console.log(value.logs)
    }).catch(function (errorr) {
      console.log(errorr)
    })
  },

  addEntry: function () {
    // AS OF NOW, NO INVOICEID INTEGRITY CHECK, THIS JUST TAKES WHATEVER AND ASSUMES AS IS
    let id = document.getElementById('invoiceid').value
    // let owner = document.getElementById('invoiceowner').value
    let minPrice = document.getElementById('minPrice').value
    return new Promise(function (resolve, reject) {
      InvoiceFactoring.deployed().then(function (instance) {
        return instance.addEntry(id, exporterAccount, minPrice, { from:exporterAccount, gas:gasLimit })
      }).then(function (value) {
        resolve(value)
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  getEntry: function (i) {
    return new Promise(function (resolve, reject) {
      InvoiceFactoring.deployed().then(function (instance) {
        return instance.getEntry(i, { from: exporterAccount, gas:gasLimit })
      }).then(function (value) {
        resolve(value)
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  startBidding: function () {
    let id = document.getElementById('id3').value
    // let addr = document.getElementById('calling_addr').value
    return new Promise(function (resolve, reject) {
      InvoiceFactoring.deployed().then(function (instance) {
        return instance.startBidding(id, { from:exporterAccount, gas:gasLimit })
      }).then(function (value) {
        resolve(value)
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  stopBidding: function () {
    let id = document.getElementById('id4').value
    let addr = document.getElementById('calling_addr2').value
    let accept = document.getElementById('accept').checked
    console.log(accept)

    return new Promise(function (resolve, reject) {
      InvoiceFactoring.deployed().then(function (instance) {
        return instance.stopBidding(id, accept, { from:addr, gas:gasLimit })
      }).then(function (value) {
        alert('bidding closed!')
        resolve(value)
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  getConversionRate: function () {
    const API_KEY = '13953646a2c6a4e74d9a9e75af22f41e'
    const endpoint = 'http://data.fixer.io/api/latest?access_key=13953646a2c6a4e74d9a9e75af22f41e&symbols=SGD,USD'

    fetch(endpoint).then(function (response) {
      return response.json()
    }).then(function(jsonResponse){
      console.log(jsonResponse);
      console.log(jsonResponse.rates)

      //call jonny's contract
      let transactionValue = document.getElementById('tValue').value //assume integer received
      let currency = document.getElementById('currency').value
      console.log("Currency: " + currency)
      let convertedToUSD;
      switch(currency){
        case "USD":
          convertedToUSD = transactionValue;
          break;
        case "EUR":
          convertedToUSD = transactionValue * jsonResponse.rates.USD;
          break;
        case "SGD":
          let USD_to_SGD_rate = jsonResponse.rates.SGD / jsonResponse.rates.USD;
          convertedToUSD = transactionValue/USD_to_SGD_rate;
          break;
        default:
          convertedToUSD = 0;
      }

      console.log("USD equivalent: " + convertedToUSD)

      FiatConversion.deployed().then(function(instance){
        convertedToUSD = parseInt(convertedToUSD);
        alert('Transfered!')
        return instance.transferToken(investorAccount, { from: defaultAccount, gas:gasLimit, value: web3.toWei(convertedToUSD, 'ether') });
      })
    })
  },

  placeBid: function() {
    let id = document.getElementById('id5').value
    let addr = document.getElementById('calling_addr3').value
    let amt = document.getElementById('bid').value

    InvoiceFactoring.deployed().then(
      function(instance){
        console.log('INVOICE ID: ' + id)
        return instance.placeBid(id,{from:investorAccount, gas:gasLimit, value: web3.utils.toWei(amt, 'ether') })
      }
    ).then(
      function(value){
        console.log("log: ")
        console.log(value.logs)
        alert('bid placed!')
      }
    ).catch(
      function(error){
        console.log(error)
      }
    )
  },




}

window.App = App
App.init()
