const pool = require('../db')
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async setup(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();

      // Validate inputs
      if (!req.body.name || !req.body.balance) {
        return res.status(400).json({ error: 'Name and balance are required' });
      }

      const { name, balance } = req.body;

      // Ensure balance is a number
      if (isNaN(balance)) {
        return res.status(400).json({ error: 'Balance must be a number' });
      }

      const [rows] = await connection.query('INSERT INTO Wallet (name, balance) VALUES (?, ?)', [name, balance]);

      // Return the generated id
      res.json({ id: rows.insertId, balance, name });

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
    const connection = await pool.getConnection();
    try {
      const walletId = req.params.id;
      
      const [rows] = await connection.query('SELECT * FROM Wallet WHERE id=?', [walletId]);
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      
      const wallet = rows[0];
      res.json({ id: wallet.id, balance: parseFloat(wallet.balance), name: wallet.name });
      
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch wallet details' });
    } finally {
      connection.release();
    }
  }
};
