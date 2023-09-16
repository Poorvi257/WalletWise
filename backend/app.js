const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise');
const config = require('./config/config.json');

const app = express();

const createWalletTable = require('./migrations/Wallet');
const createTransactionTable = require('./migrations/Transaction');

app.use(bodyParser.json())  // Corrected
app.use(bodyParser.urlencoded({ extended: true }))  // Corrected

const PORT = 8000
const env = process.env.NODE_ENV || 'development';

app.listen(PORT, async () => {
    console.log(`Listening at ${PORT}`)
    try {
        await initDb();
        console.log('Database initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
})

const initDb = async () => {
    const { host, user, password, database } = config[env];
    const connection = await mysql.createConnection({ host, user, password });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database};`);
   
    await createWalletTable(config[env]);
    await createTransactionTable(config[env]);
    await connection.end();
};
