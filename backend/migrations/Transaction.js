const pool = require('../db')

async function createTransactionTable() {
  const connection = await pool.getConnection();
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Transactions (
        id VARCHAR(50) PRIMARY KEY,
        wallet_id INT NOT NULL,
        amount DECIMAL(10, 4) NOT NULL,
        description VARCHAR(255) NULL,
        type ENUM('CREDIT', 'DEBIT') NOT NULL,
        balance_after_transaction DECIMAL(10, 4) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (wallet_id) REFERENCES Wallet(id)
      );
    `;

    await connection.query(createTableQuery);
    console.log('Transaction table created successfully.');
  } catch (err) {
    console.error('An error occurred while creating the table:', err);
  } finally {
      await connection.release();
  }
}

module.exports = createTransactionTable;
