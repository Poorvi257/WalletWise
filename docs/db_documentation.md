### Database and Query Design Documentation for Wallet and Transactions Tables

#### Overview
This documentation provides an in-depth explanation of the design and structure of two relational database tables: `Wallet` and `Transactions`. These tables are designed to facilitate a financial application aimed at managing wallet transactions.

---

#### Table Structure and Relationships

- **Wallet Table**: Serves as the core table for storing wallet information. Each wallet is identified by a unique `id`.

  - `id`: Integer, auto-incremented, Primary Key.
  - `name`: String, Optional name for the wallet.
  - `balance`: Decimal, Wallet balance with 4 decimal places, defaults to 20.0000.
  - `createdAt`: Timestamp, automatically set to the current time when a record is created.

- **Transactions Table**: Stores transaction details made from each wallet, linked to the `Wallet` table via `wallet_id`.

  - `id`: String (VARCHAR 50), Primary Key, unique identifier for each transaction.
  - `wallet_id`: Integer, Foreign Key referencing `Wallet.id`.
  - `amount`: Decimal, Amount of the transaction with 4 decimal places.
  - `description`: String, Optional transaction description.
  - `type`: ENUM, Transaction type categorized as either 'CREDIT' or 'DEBIT'.
  - `balance_after_transaction`: Decimal, Balance after the transaction is made, 4 decimal places.
  - `created_at`: Timestamp, automatically set to the current time when a record is created.

#### Key Design Decisions

- **Data Types**: 
  - Used Decimal type for financial data to prevent floating-point inaccuracies.
  - Used VARCHAR for string-based fields with varying lengths to optimize storage.

- **Constraints and Defaults**: 
  - Enforced NOT NULL constraints on crucial fields like `amount`, `balance`, `created_at` to maintain data integrity.
  - Used DEFAULT values where applicable to simplify data entry.

- **Enumerated Types (ENUM)**:
  - Utilized ENUM for `type` to ensure that only 'CREDIT' or 'DEBIT' can be stored, thereby ensuring data consistency.

- **Normalization**:
  - The schema is designed to minimize redundancy, e.g., `balance_after_transaction` in `Transactions` instead of repeatedly updating `balance` in `Wallet`.

- **Timestamps**:
  - Included a `created_at` timestamp in both tables for auditing and tracking.

- **Foreign Key Relationships**:
  - Established a foreign key (`wallet_id`) from `Transactions` to `Wallet` to create a one-to-many relationship.

---

### Query Design

1. **handleTransactions**: Manages both credit and debit transactions.
    - Validates input parameters like `walletId`, `amount`, `description`, and `type`.
    - Fetches current wallet details.
    - Calculates the new balance and updates it in the `Wallet` table.
    - Inserts a new transaction record in the `Transactions` table.
    - Example query: `UPDATE Wallet SET balance=? WHERE id=?`
  
2. **fetchAllTransactions**: Fetches all transactions for a given `walletId`.
    - Validates `walletId`.
    - Selects all transactions in descending order by `created_at`.
    - Example query: `SELECT * FROM Transactions WHERE wallet_id=? ORDER BY created_at DESC`

3. **fetchTransactions**: Paginated fetching of transactions.
    - Implements pagination via `page`, `limit`, and `skip` query parameters.
    - Selects transactions based on limit and offset.
    - Example query: `SELECT * FROM Transactions WHERE wallet_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`

4. **setup**: Initializes a new wallet.
    - Validates `name` and `balance`.
    - Inserts a new wallet in the `Wallet` table.
    - Inserts an opening balance in the `Transactions` table.
    - Example query: `INSERT INTO Wallet (name, balance) VALUES (?, ?)`
  
5. **getWallet**: Fetches wallet details by `id`.
    - Validates `walletId`.
    - Fetches wallet information.
    - Example query: `SELECT * FROM Wallet WHERE id=?`