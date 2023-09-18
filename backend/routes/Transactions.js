const pool = require('../db')
const base64Url = require('base64-url');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async handleTransactions(req, res) {
        const connection = await pool.getConnection()
        try {
            const { walletId } = req.params;
            const { amount, description, type } = req.body;

            const [row, fields] = await connection.query(`SELECT * FROM Wallet WHERE id=?`, [walletId]);

            const result = row ? row[0] : {}
            if (!result.id) {
                return res.status(404).json({ error: 'Wallet not found' });
            }

            let newBalance = parseFloat(result.balance);

            if (type === "DEBIT") {
                newBalance -= parseFloat(amount)
            } else {
                newBalance += parseFloat(amount)
            }

            await connection.query('UPDATE Wallet SET balance = ? WHERE id = ?', [Number.parseFloat(newBalance).toFixed(4), result.id]);

            const id = uuidv4();
            let [resp] = await connection.query(
                'INSERT INTO Transactions (id, wallet_id, amount, description, type, balance_after_transaction) VALUES (?, ?, ?, ?, ?, ?)',
                [id, result.id, amount, description, type, Number.parseFloat(newBalance).toFixed(4)]
            );

            const transactionId = resp.insertId;
            res.json({ balance: Number.parseFloat(newBalance).toFixed(4), transactionId, type });

        } catch (error) {
            res.status(500).json({ error: 'Transaction failed. Error: ' + error });
        } finally {
            connection.release()
        }
    },
    
    async fetchAllTransactions(req, res) {
        const connection = await pool.getConnection();
        try {
          const {walletId} = req.params;

          const [rows] = await connection.query(`SELECT * FROM Transactions WHERE wallet_id=${walletId} ORDER BY created_at DESC`);
          
          if (rows.length === 0) {
            return res.status(404).json({ error: 'Wallet not found' });
          }

          res.json(rows);
          
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch wallet details' });
        } finally {
          connection.release();
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
