var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: process.argv.indexOf('test') > -1 ? '"development"' : (process.argv.indexOf('pre') > -1 ? '"preview"' : '"production"')
})
