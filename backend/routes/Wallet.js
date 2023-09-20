const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async setup(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();

      const { name, balance } = req.body;

      // Validate inputs
      if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: "Name must be a non-empty string" });
      }

      // Validate and set default balance
      let validatedBalance = balance || 100;
      if (isNaN(validatedBalance) || validatedBalance < 0) {
        return res.status(400).json({ error: "Balance must be a non-negative number" });
      }

      const [rows] = await connection.query(
        "INSERT INTO Wallet (name, balance) VALUES (?, ?)",
        [name, validatedBalance]
      );

      const transactionId = uuidv4();
      const desc = "Opening Balance"
      const type = "CREDIT"
      await connection.query(
        'INSERT INTO Transactions (id, wallet_id, amount, description, type, balance_after_transaction) VALUES (?, ?, ?, ?, ?, ?)',
        [transactionId, rows.insertId, validatedBalance, desc, type, validatedBalance]
      );

      res.json({ id: rows.insertId, balance: validatedBalance, name });
    } catch (error) {
      console.error(`Failed to initialize wallet: ${error}`);
      res.status(500).json({ error: 'Failed to initialize wallet' });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },

  async getWallet(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();

      // Validate walletId
      const walletId = req.params.id;
      if (!walletId || isNaN(walletId) || parseInt(walletId, 10) <= 0) {
        return res.status(400).json({ error: "Invalid wallet ID. Must be a positive integer." });
      }

      const [rows] = await connection.query("SELECT * FROM Wallet WHERE id=?", [walletId]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Wallet not found" });
      }

      const wallet = rows[0];

      // Validate that the balance is a number and not negative (data integrity check)
      if (isNaN(wallet.balance) || wallet.balance < 0) {
        console.error(`Data integrity issue: Negative or NaN balance for wallet ID ${walletId}`);
        return res.status(500).json({ error: "Failed to fetch wallet details due to data integrity issues" });
      }

      res.json({ id: wallet.id, balance: parseFloat(wallet.balance), name: wallet.name, date: wallet.created_at });

    } catch (error) {
      console.error(`Failed to fetch wallet details: ${error}`);
      res.status(500).json({ error: 'Failed to fetch wallet details' });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
};
