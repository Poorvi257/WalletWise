import React, { useState, useEffect } from 'react';
import { TextField, Button, ToggleButton, ToggleButtonGroup, Avatar, Box, Typography, Container } from '@mui/material';
import { walletTransaction, getWallet } from '../server';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";

export const TransactionsForm = () => {

    const [amount, setAmount] = useState("");
    const [desc, setDesc] = useState("");
    const [transactionType, setTransactionType] = useState("CREDIT");
    const [showTransact, setShowTransact] = useState(false);
    const walletId = localStorage.getItem("walletId");
    const [transaction, setTransaction] = useState({});
    const [submittedTransaction, setSubmittedTransaction] = useState({});
    const transactionId = uuidv4();

    useEffect(() => {
        async function fetchData() {
            const response = await getWallet(walletId);
            setTransaction(response);
        }
        fetchData();
    }, [walletId]);

    // Handle change for the amount input
    const handleAmountChange = (e) => {
        const inputValue = e.target.value;
        setAmount(inputValue);
    };

    // Handle change for the description input
    const handleDescChange = (e) => {
        const inputValue = e.target.value;
        setDesc(inputValue);
    };

    // Handle change for the transaction type toggle
    const handleTypeChange = (e, newType) => {
        if (newType !== null) {
            setTransactionType(newType);
        }
    };

    // Handle the submit action
    const handleSubmit = async () => {
        if (amount !== '' && Number(amount) <= 0) {
            alert("Amount can't be 0 or negative");
            setAmount("")
        }
        else if (amount === '') {
            alert("Amount can't be 0 or negative");
            setAmount("")
        }
        else if (desc.trim() === "") {
            alert("Description cannot be empty!");
        }
        else if (transactionType === "DEBIT" && transaction.balance < amount) {
            alert("You dont have enough funds for this transaction!")
        }
        else {
            let resp = await walletTransaction(walletId, transactionId, amount, desc, transactionType);
            setTransaction(resp);
            setShowTransact(true);
            setSubmittedTransaction({
                walletId,
                amount,
                transactionId,
                desc,
                balance: resp.balance,
                transactionType
            });
        }
        setAmount("");
        setDesc("");
    };

    return (
        <Container>
            <Box style={{ minHeight: '100vh', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar>{transaction.name ? transaction.name[0].toUpperCase() : ''}</Avatar>
                        <Typography variant="h5" style={{ marginLeft: '1rem' }}>{transaction.name}</Typography>
                    </div>
                    <div>
                        <Button variant="contained"
                            color="primary">
                            <Link to="/wallet-transactions" style={{ textDecoration: 'none', color: 'inherit' }}> Wallet Transactions</Link>
                        </Button>
                    </div>
                </div>
                <div style={{ paddingTop: "6vh" }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        {transaction ? `Total Balance: $${transaction.balance || 0}` : 'Loading...'}
                    </Typography>

                    <TextField
                        sx={{ marginBottom: '1rem' }}
                        label="Transaction Amount"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={amount}
                        onChange={handleAmountChange}
                    />
                    <TextField
                        sx={{ marginBottom: '1rem' }}
                        label="Description"
                        variant="outlined"
                        fullWidth
                        value={desc}
                        onChange={handleDescChange}
                        inputProps={{ maxLength: 50 }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <ToggleButtonGroup
                            value={transactionType}
                            exclusive
                            onChange={handleTypeChange}
                            sx={{ marginBottom: '1rem' }}
                        >
                            <ToggleButton value="CREDIT">Credit</ToggleButton>
                            <ToggleButton value="DEBIT">Debit</ToggleButton>
                        </ToggleButtonGroup>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </div>
                    {showTransact && (
                        <Box sx={{ marginTop: '2rem' }}>
                            <ul>
                                <li>{`WalletId: ${submittedTransaction.walletId}`}</li>
                                <li>{`Amount: ${submittedTransaction.amount}`}</li>
                                <li>{`TransactionId: ${submittedTransaction.transactionId}`}</li>
                                <li>{`Description: ${submittedTransaction.desc}`}</li>
                                <li>{`Balance: ${submittedTransaction.balance}`}</li>
                                <li>{`Transaction Type: ${submittedTransaction.transactionType}`}</li>
                            </ul>
                        </Box>
                    )}
                </div>
            </Box>
        </Container>
    );
};