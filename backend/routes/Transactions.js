const pool = require('../db')
const base64Url = require('base64-url');

module.exports = {
    async handleTransactions(req, res) {
        let connection;
        try {
            connection = await pool.getConnection();

            // Validate parameters and request body
            const walletId = req.params.walletId;
            const { transactionId, amount, description, type } = req.body;

            if (!walletId || isNaN(walletId) || parseInt(walletId, 10) <= 0) {
                return res.status(400).json({ error: 'Invalid wallet ID. Must be a positive integer.' });
            }

            if (!transactionId || !amount || isNaN(amount) || amount <= 0 || !description || description.trim() === '' ||
                !type || !['DEBIT', 'CREDIT'].includes(type)) {
                return res.status(400).json({ error: 'Invalid input parameters. Amount must be positive, description cannot be empty, and transaction type must be either DEBIT or CREDIT.' });
            }

            const [rows] = await connection.query('SELECT * FROM Wallet WHERE id=?', [walletId]);
            const wallet = rows.length > 0 ? rows[0] : null;

            if (!wallet) {
                return res.status(404).json({ error: 'Wallet not found' });
            }

            if (isNaN(wallet.balance) || wallet.balance < 0) {
                console.error(`Data integrity issue: Negative or NaN balance for wallet ID ${walletId}`);
                return res.status(500).json({ error: 'Failed to process transaction due to data integrity issues' });
            }

            let newBalance = parseFloat(wallet.balance);
            const transactionAmount = parseFloat(amount);

            if (type === 'DEBIT') {
                if (newBalance < transactionAmount) {
                    return res.status(400).json({ error: 'Insufficient balance for this transaction!' });
                }
                newBalance -= transactionAmount;
            } else {
                newBalance += transactionAmount;
            }

            await connection.query('UPDATE Wallet SET balance=? WHERE id=?', [newBalance.toFixed(4), wallet.id]);

            await connection.query(
                'INSERT INTO Transactions (id, wallet_id, amount, description, type, balance_after_transaction) VALUES (?, ?, ?, ?, ?, ?)',
                [transactionId, wallet.id, transactionAmount, description, type, newBalance.toFixed(4)]
            );

            res.json({ balance: newBalance.toFixed(4), transactionId, type });

        } catch (error) {
            console.error(`Transaction failed: ${error}`);
            res.status(500).json({ error: 'Transaction failed' });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    async fetchAllTransactions(req, res) {
        let connection;
        try {
            connection = await pool.getConnection();

            // Validate walletId
            const walletId = req.params.walletId;
            if (!walletId || isNaN(walletId) || parseInt(walletId, 10) <= 0) {
                return res.status(400).json({ error: 'Invalid wallet ID. Must be a positive integer.' });
            }

            const [rows] = await connection.query('SELECT * FROM Transactions WHERE wallet_id=? ORDER BY created_at DESC', [walletId]);

            // Edge case: No transactions available for the wallet
            if (rows.length === 0) {
                return res.status(404).json({ error: 'No transactions found for this wallet' });
            }

            // Edge case: Validate that the timestamps and amounts are reasonable (data integrity check)
            const invalidData = rows.some(row => {
                return isNaN(new Date(row.created_at).getTime()) || isNaN(row.amount) || row.amount < 0;
            });

            if (invalidData) {
                console.error(`Data integrity issue: Invalid timestamp or negative amount for wallet ID ${walletId}`);
                return res.status(500).json({ error: 'Failed to fetch transactions due to data integrity issues' });
            }

            // Convert string timestamps from the database to JS Date objects
            rows.forEach((row) => {
                row.created_at = new Date(row.created_at);
            });

            res.json(rows);

        } catch (error) {
            console.error(`Failed to fetch transactions: ${error}`);
            res.status(500).json({ error: 'Failed to fetch transactions' });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    async fetchTransactions(req, res) {
        let connection;
        try {
            connection = await pool.getConnection();
            if (!connection){
                return res.status(404).json({ error: 'Failed to establish a database connection.' });
            } 

            const { walletId, page = 1, limit = 10, skip: currentOffset } = req.query;
            if (!walletId || isNaN(walletId)){
                return res.status(404).json({ error: 'Invalid Wallet ID' });
            }

            const intPage = Number(page), intLimit = Number(limit);
            if (intPage < 1 || intLimit < 1 || intLimit > 1000){
                return res.status(404).json({ error: 'Invalid page or limit.' });
            }

            const userOffset = currentOffset ? JSON.parse(base64Url.decode(currentOffset)) : undefined;
            const skip = userOffset?.nextContinuationToken || (intPage - 1) * intLimit;

            const [transactions] = await connection.query('SELECT * FROM Transactions WHERE wallet_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?', [walletId, intLimit + 1, skip]);

            let nextContinuationToken = null;

            if (transactions.length > intLimit) {
                nextContinuationToken = skip + intLimit;
                transactions.pop();
            }

            const prevContinuationToken = (skip - intLimit >= 0) ? skip - intLimit : null;

            const baseLink = `http://65.1.100.208:8000/transactions?walletId=${walletId}&limit=${intLimit}`;
            const selfLink = currentOffset ? `${baseLink}&skip=${currentOffset}` : `${baseLink}&page=${intPage}`;
            const nextLink = nextContinuationToken !== null ? `${baseLink}&skip=${base64Url.encode(JSON.stringify({ nextContinuationToken }))}` : undefined;
            const prevLink = prevContinuationToken !== null ? `${baseLink}&skip=${base64Url.encode(JSON.stringify({ nextContinuationToken: prevContinuationToken }))}` : undefined;

            res.json({
                links: { self: selfLink, next: nextLink, prev: prevLink },
                data: { transactions }
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An unknown error has occurred' });
        } finally {
            if (connection) connection.release();
        }
    }


}
