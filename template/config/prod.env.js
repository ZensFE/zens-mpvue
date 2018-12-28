module.exports = {
    NODE_ENV: process.argv.indexOf('test') > -1 ? '"development"' : (process.argv.indexOf('pre') > -1 ? '"preview"' : '"production"')
}
