const mysql = require('mysql2/promise');
const config = require('./config/config.json');
const env = process.env.NODE_ENV || 'development';
const { host, user, password, database } = config[env];

const pool = mysql.createPool({
    host,
    user,
    password,
    database,
    waitForConnections: true,
    queueLimit: 0,
    connectionLimit: 10
})

module.exports = pool