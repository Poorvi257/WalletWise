const mysql = require('mysql2/promise');
const pool = require('./db')
const config = require('./config/config.json');
const env = process.env.NODE_ENV || 'development';

const { host, user, password } = config[env];

const createWalletTable = require('./migrations/Wallet');
const createTransactionTable = require('./migrations/Transaction');

const initDb = async () => {
    const initialPool = mysql.createPool({
        host,
        user,
        password,
        waitForConnections: true,
        queueLimit: 0,
        connectionLimit: 10
      });
  
    const connection = await initialPool.getConnection();
    const { database } = config[env];

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database};`);
    await createWalletTable();
    await createTransactionTable();

    await connection.release();
};

module.exports = initDb