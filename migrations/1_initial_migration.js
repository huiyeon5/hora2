var Migrations = artifacts.require('./Migrations.sol')
var CompanyDetails = artifacts.require('./CompanyDetails.sol')
var Invoice = artifacts.require('./Invoice.sol')
var FiatConversion = artifacts.require('./FiatConversion.sol')
var InvoiceFactoring = artifacts.require('./InvoiceFactoring.sol')

module.exports = function (deployer) {
  deployer.deploy(Migrations)
  deployer.deploy(CompanyDetails)
  deployer.deploy(FiatConversion)
  deployer.deploy(InvoiceFactoring)
  deployer.deploy(Invoice)
}
