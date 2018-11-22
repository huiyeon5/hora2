var ConvertLib = artifacts.require('./ConvertLib.sol')
var MetaCoin = artifacts.require('./MetaCoin.sol')
var CompanyDetails = artifacts.require('./CompanyDetails.sol')
var Invoice = artifacts.require('./Invoice.sol')
var FiatConversion = artifacts.require('./FiatConversion.sol')
// var InvoiceFactoring = artifacts.require('./InvoiceFactoring.sol')

module.exports = function (deployer) {
  deployer.deploy(ConvertLib)
  deployer.deploy(CompanyDetails)
  deployer.deploy(Invoice)
  deployer.deploy(FiatConversion)
  // deployer.deploy(InvoiceFactoring)
  deployer.link(ConvertLib, MetaCoin)
  deployer.deploy(MetaCoin)
}
