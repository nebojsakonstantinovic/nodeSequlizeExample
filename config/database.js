const Sequelize = require('sequelize');
const secret = require('./secret');

module.exports = new Sequelize(secret.dataBaseName, secret.userName, secret.pass, {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})