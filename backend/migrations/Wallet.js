const pool = require('../db');

async function createWalletTable(config) {
  const connection = await pool.getConnection()
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Wallet (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(64) NULL,
        balance DECIMAL(15, 4) NOT NULL DEFAULT 20.0000,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;

    await connection.query(createTableQuery);
  } catch (err) {
    console.error('An error occurred while creating the table:', err);
  } finally {
      await connection.release();
  }
}

module.exports = createWalletTable;
