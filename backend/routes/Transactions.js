const express = require("express");
const mysql = require('mysql2/promise');
const config = require('../config/config.json');
const env = process.env.NODE_ENV || 'development';

module.exports = {

    async handleTransactions(req, res) {
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
          res.status(500).json({ error: "Transaction failed" + error });
        }
      
        await connection.end();
    },

    async fetchTransactions(req, res) {
        const connection = await mysql.createConnection({ host, user, password, database });
      
        try {
          const { walletId, skip = 0, limit = 10 } = req.query;
      
          const [transactions] = await connection.query(`SELECT * FROM Transactions WHERE wallet_id=? LIMIT ? OFFSET ?`, [walletId, parseInt(limit), parseInt(skip)]);
          res.json(transactions);
        } catch (error) {
          res.status(500).json({ error: "Failed to fetch transactions" });
        }
      
        await connection.end();
    }
}

