const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './app/scripts/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: 'index.html' },
      { from: './app/adminindex.html', to: 'adminindex.html' },
      { from: './app/jonny.html', to: 'jonny.html' },
      { from: './app/invoice.html', to: 'invoice.html' },
      { from: './app/company.html', to: 'company.html' },
      { from: './app/addcompany.html', to: 'addcompany.html' },
      { from: './app/factor.html', to: 'factor.html' },
      { from: './app/login.html', to: 'login.html' },
      { from: './app/investor.html', to: 'investor.html' },
      { from: './app/invoicecreate.html', to: 'invoicecreate.html' },
      { from: './app/getinvoice.html', to: 'getinvoice.html' },
      { from: './app/invoicedetails.html', to: 'invoicedetails.html' },
      { from: './app/topup.html', to: 'topup.html' },
      { from: './app/placebid.html', to: 'placebid.html' }
    ])
  ],
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.s?css$/, use: [ 'style-loader', 'css-loader', 'sass-loader' ] },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
          plugins: ['transform-react-jsx', 'transform-object-rest-spread', 'transform-runtime']
        }
      }
    ]
  }
}
