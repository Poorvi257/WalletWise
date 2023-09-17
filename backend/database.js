const mysql = require('mysql2/promise');
const config = require('./config/config.json');
const env = process.env.NODE_ENV || 'development';

const createWalletTable = require('./migrations/Wallet');
const createTransactionTable = require('./migrations/Transaction');

const initDb = async () => {
    const { host, user, password, database } = config[env];
    const connection = await mysql.createConnection({ host, user, password });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database};`);
   
    await createWalletTable(config[env]);
    await createTransactionTable(config[env]);
    await connection.end();
};

module.exports = initDb