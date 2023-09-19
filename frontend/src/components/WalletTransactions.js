import React, { useEffect, useState, useCallback } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const apiBaseUrl = 'http://localhost:8000';

export default function WalletTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [links, setLinks] = useState({ next: null, prev: null });
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'asc' });
    const walletId = localStorage.getItem("walletId");

    const fetchTransactions = useCallback(async (link) => {
        try {
            const res = await fetch(link || `${apiBaseUrl}/transactions?walletId=${walletId}&limit=10`);
            const data = await res.json();
            setTransactions(data.data.transactions);
            setLinks(data.links);
        } catch (error) {
            console.error("An error occurred while fetching data: ", error);
        }
    }, [walletId]);

    const exportCSV = async () => {
        const headers = ['Amount', 'Description', 'Type', 'Balance After Transaction', 'Date'];
        
        try {
          const res = await fetch(`http://localhost:8000/allTransactions/${walletId}`);
          const data = await res.json();
          const allTransactions = data  // Assuming the transactions are in data.data.transactions
      
          const rows = allTransactions.map(tx => [
            tx.amount,
            tx.description,
            tx.type,
            tx.balance_after_transaction,
            new Date(tx.created_at).toLocaleString()
          ]);
      
          const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
          ].join('\n');
      
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'transactions.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
        } catch (error) {
          console.error("An error occurred while fetching and exporting data:", error);
        }
      };
      

    const sortedTransactions = [...transactions].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Convert to numbers if the key is 'amount' or 'balance_after_transaction'
        if (['amount', 'balance_after_transaction'].includes(sortConfig.key)) {
            aValue = parseFloat(aValue);
            bValue = parseFloat(bValue);
        }
        
        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            if (prevConfig.key === key) {
                return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
        <Link to="/">Back</Link>
        <Paper style={{ flex: 1, overflowY: 'auto' }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Amount
                                <TableSortLabel active={sortConfig.key === 'amount'} direction={sortConfig.direction} onClick={() => handleSort('amount')} />
                            </TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Balance After Transaction</TableCell>
                            <TableCell>
                                Date
                                <TableSortLabel active={sortConfig.key === 'created_at'} direction={sortConfig.direction} onClick={() => handleSort('created_at')} />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedTransactions.map((tx, index) => (
                            <TableRow key={index}>
                                <TableCell>{tx.amount}</TableCell>
                                <TableCell>{tx.description}</TableCell>
                                <TableCell>{tx.type}</TableCell>
                                <TableCell>{tx.balance_after_transaction}</TableCell>
                                <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ display: "flex", paddingBottom: "1vh" }}>
                <Button disabled={!links.prev} onClick={() => fetchTransactions(links.prev)}>
                    <i className="fa-solid fa-chevron-left"></i>
                </Button>
                <Button disabled={!links.next} onClick={() => fetchTransactions(links.next)}>
                    <i className="fa-solid fa-chevron-right"></i>
                </Button>
                <Button style={{ marginLeft: 'auto' }} onClick={exportCSV}>
                    Export CSV
                </Button>
            </div>
        </Paper>
        </div>
    );
}
