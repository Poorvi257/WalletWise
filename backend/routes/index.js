const express = require("express");
const mysql = require('mysql2/promise');
const config = require('../config/config.json');
const { performTransaction } = require("../helpers/transcationHelper");

const router = express.Router();
const env = process.env.NODE_ENV || 'development';
const { host, user, password, database } = config[env];

// Initialize a new wallet
router.post("/setup", async (req, res) => {
  const connection = await mysql.createConnection({ host, user, password, database });
  
  try {
    const { name, balance } = req.body;
    const [rows] = await connection.query(`INSERT INTO Wallet (name, balance) VALUES (?, ?)`, [name, balance]);
    
    res.json({ id: rows.insertId, balance, name });
  } catch (error) {
    res.status(500).json({ error: "Failed to initialize wallet" });
  }
  await connection.end();
});

// Handle credit/debit transactions on a wallet
router.post("/transact/:walletId", async (req, res) => {
  const connection = await mysql.createConnection({ host, user, password, database });
  
  try {
    const { walletId } = req.params;
    const { amount, description } = req.body;

    const [row, fields] = await connection.query(`SELECT * FROM Wallet WHERE id=?`, [walletId]);
    const result = row ? row[0] : {}
    if (!result.id) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    let newBalance = parseFloat(result.balance)
    let type = amount >= 0 ? "CREDIT" : "DEBIT"
    newBalance += amount

    await connection.query('UPDATE Wallet SET balance = ? WHERE id = ?', [Number.parseFloat(newBalance).toFixed(4), result.id]);
    let [resp] = await connection.query(
      'INSERT INTO Transactions (wallet_id, amount, description, type, balance_after_transaction) VALUES (?, ?, ?, ?, ?)',
      [result.id, amount, description, type, Number.parseFloat(newBalance).toFixed(4)]
    );
    
    const transactionId = resp.insertId;
    res.json({ balance: Number.parseFloat(newBalance).toFixed(4), transactionId, type });
  } catch (error) {
    res.status(500).json({ error: "Transaction failed"+error });
  }
  
  await connection.end();
});

// Fetch transactions related to a specific wallet
// add the setup transaction
router.get("/transactions", async (req, res) => {
  const connection = await mysql.createConnection({ host, user, password, database });
  
  try {
    const { walletId, skip = 0, limit = 10 } = req.query;

    const [transactions] = await connection.query(`SELECT * FROM Transactions WHERE wallet_id=? LIMIT ? OFFSET ?`, [walletId, parseInt(limit), parseInt(skip)]);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
  
  await connection.end();
});

// Retrieve details of a specific wallet
router.get("/wallet/:id", async (req, res) => {
  const connection = await mysql.createConnection({ host, user, password, database });
  
  try {
    const walletId = req.params.id;

    const [rows] = await connection.query(`SELECT * FROM Wallet WHERE id=?`, [walletId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    const wallet = rows[0];
    res.json({ id: wallet.id, balance: wallet.balance, name: wallet.name });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wallet details" });
  }
  
  await connection.end();
});

module.exports = router;
