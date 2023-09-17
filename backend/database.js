const pool = require('./db')
const config = require('./config/config.json');
const env = process.env.NODE_ENV || 'development';

const createWalletTable = require('./migrations/Wallet');
const createTransactionTable = require('./migrations/Transaction');

const initDb = async () => {
    const connection = await pool.getConnection()
    const { database } = config[env];

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database};`);
    await createWalletTable();
    await createTransactionTable();

    await connection.release();
};

module.exports = initDb