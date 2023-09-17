import React, { useState, useEffect } from 'react';
import { TextField, Button, ToggleButton, ToggleButtonGroup, formControlClasses } from '@mui/material';
import { walletTransaction, getWallet } from '../server';

export const TransactionsForm = () => {

    const [amount, setAmount] = useState(0);
    const [desc, setDesc] = useState("");
    const [transactionType, setTransactionType] = useState("CREDIT");
    const [showTransact, setShowTransact] = useState(false)
    const walletId = localStorage.getItem("walletId");
    const [transaction, setTransaction] = useState({});


    useEffect(() => {
        async function fetchData() {
            const response = await getWallet(walletId);
            setTransaction(response);
        }
        fetchData();
    }, [walletId]);

    // Handle change for the amount input
    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleDescChange = (e) => {
        if (e.target.value !== "" || e.target.value !== " ") {
            setDesc(e.target.value);
        }
    };
    // Handle change for the transaction type toggle
    const handleTypeChange = (e, newType) => {
        if (newType !== null) {
            setTransactionType(newType);
        }
    };

    // Handle the submit action
    const handleSubmit = async () => {
        let resp = await walletTransaction(walletId, amount, desc, transactionType)
        setTransaction(resp)
        setShowTransact(true)
        setAmount(0)
        setDesc("")
    };

    return (
        <div>
            <div>{transaction ? transaction.balance : 'Loading...'}</div>
            <TextField
                label="Transaction Amount"
                type="number"
                variant="outlined"
                value={amount}
                onChange={handleAmountChange}
            />
            <TextField
                label="Description"
                type="string"
                variant="outlined"
                value={desc}
                onChange={handleDescChange}
            />
            <ToggleButtonGroup
                value={transactionType}
                exclusive
                onChange={handleTypeChange}
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
            {showTransact && <>
                <ul>
                    <li>{`WalletId: ${walletId}`}</li>
                    <li>{`Amount: ${amount}`}</li>
                    <li>{`transactionId: ${transaction.transactionId}`}</li>
                    <li>{`Description: ${desc}`}</li>
                    <li>{`Balance: ${transaction.balance}`}</li>
                    <li>{`Transaction Type: ${transactionType}`}</li>
                </ul>
            </>}
        </div>
    );
};
