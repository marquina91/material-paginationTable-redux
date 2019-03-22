require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  staging: {
    isProduction: true
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'http://localhost',
  secureHost: process.env.SECURE_HOST || 'https://localhost',
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL || 'http://localhost:3009',
  project: process.env.BASE_URL || 'material-paginationTable-redux',
  projectName: 'material-paginationTable-redux',
  app: {
    title: 'material-paginationTable-redux',
    description: 'material-paginationTable-redux'
  },
}, environment);

