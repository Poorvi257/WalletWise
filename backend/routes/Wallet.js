const express = require("express");
const mysql = require('mysql2/promise');
const config = require('../config/config.json');
const env = process.env.NODE_ENV || 'development';
const { host, user, password, database } = config[env];

const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  async setup(req, res) {
    const connection = await pool.getConnection();
    try {
      const { name, balance } = req.body;
      const [rows] = await connection.query('INSERT INTO Wallet (name, balance) VALUES (?, ?)', [name, balance]);
      res.json({ id: rows.insertId, balance, name });
    } catch (error) {
      res.status(500).json({ error: 'Failed to initialize wallet' });
    } finally {
      connection.release();
    }
  },

  async getWallet(req, res) {
    const connection = await pool.getConnection();
    try {
      const walletId = req.params.id;
      const [rows] = await connection.query(`SELECT * FROM Wallet WHERE id=${walletId}`);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      const wallet = rows[0];
      res.json({ id: wallet.id, balance: wallet.balance, name: wallet.name });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch wallet details' });
    } finally {
      connection.release();
    }
  }
};
