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

            if (!walletId || isNaN(walletId) || !amount || isNaN(amount) || !type || !['DEBIT', 'CREDIT'].includes(type)) {
                return res.status(400).json({ error: 'Invalid input parameters' });
            }

            const [rows] = await connection.query('SELECT * FROM Wallet WHERE id=?', [walletId]);
            const wallet = rows.length > 0 ? rows[0] : null;

            if (!wallet) {
                return res.status(404).json({ error: 'Wallet not found' });
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
            if (!walletId || isNaN(walletId)) {
                return res.status(400).json({ error: 'Invalid wallet ID' });
            }

            const [rows] = await connection.query('SELECT * FROM Transactions WHERE wallet_id=? ORDER BY created_at DESC', [walletId]);

            if (rows.length === 0) {
                return res.status(404).json({ error: 'No transactions found for this wallet' });
            }

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
            if (!connection) throw new HTTPError("Failed to establish a database connection.");

            const { walletId, page = 1, limit = 10, offset: currentOffset } = req.query;
            if (!walletId) throw new HTTPError('Wallet ID must be provided.');

            const intPage = Number(page), intLimit = Number(limit);
            if (intPage < 1 || intLimit < 1 || intLimit > 1000) throw new HTTPError('Invalid page or limit.');

            const userOffset = currentOffset ? JSON.parse(base64Url.decode(currentOffset)) : undefined;
            const offset = userOffset?.nextContinuationToken || (intPage - 1) * intLimit;

            const [transactions] = await connection.query('SELECT * FROM Transactions WHERE wallet_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?', [walletId, intLimit + 1, offset]);

            let nextContinuationToken = null;

            if (transactions.length > intLimit) {
                nextContinuationToken = offset + intLimit;
                transactions.pop();
            }

            const prevContinuationToken = (offset - intLimit >= 0) ? offset - intLimit : null;

            const baseLink = `http://localhost:8000/transactions?walletId=${walletId}&limit=${intLimit}`;
            const selfLink = currentOffset ? `${baseLink}&offset=${currentOffset}` : `${baseLink}&page=${intPage}`;
            const nextLink = nextContinuationToken !== null ? `${baseLink}&offset=${base64Url.encode(JSON.stringify({ nextContinuationToken }))}` : undefined;
            const prevLink = prevContinuationToken !== null ? `${baseLink}&offset=${base64Url.encode(JSON.stringify({ nextContinuationToken: prevContinuationToken }))}` : undefined;

            res.json({
                links: { self: selfLink, next: nextLink, prev: prevLink },
                data: { transactions }
            });

        } catch (err) {
            console.error(err);
            const status = err instanceof HTTPError ? 400 : 500;
            res.status(status).json({ message: err.message || "An unknown error has occurred" });
        } finally {
            if (connection) connection.release();
        }
    }


}
