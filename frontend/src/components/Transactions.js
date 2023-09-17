import React, { useState, useEffect } from 'react';
import { TextField, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { walletTransaction, getWallet } from '../server';

export const TransactionsForm = () => {

    const [amount, setAmount] = useState(0);
    const [desc, setDesc] = useState("");
    const [transactionType, setTransactionType] = useState("CREDIT");
    const [showTransact, setShowTransact] = useState(false);
    const walletId = localStorage.getItem("walletId");
    const [transaction, setTransaction] = useState({});
    const [submittedTransaction, setSubmittedTransaction] = useState({});

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
        if (inputValue !== '' && Number(inputValue) > 0) {
            setAmount(inputValue);
        }
    };

    // Handle change for the description input
    const handleDescChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue.trim() !== "") {
            setDesc(inputValue);
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
        let currentWalletState = await getWallet(walletId)
        if (amount !== '' && Number(amount) <= 0) {
            alert("Amount can't be 0 or negative");
            setAmount(0)
        }
        else if (desc.trim() === "") {
            alert("Description cannot be empty!");
        }
        else if (transactionType === "DEBIT" && currentWalletState.balance < amount) {
            alert("You dont have enough funds for this transaction!")
        }
        else {
            let resp = await walletTransaction(walletId, amount, desc, transactionType);
            setTransaction(resp);
            setShowTransact(true);
            setSubmittedTransaction({
                walletId,
                amount,
                transactionId: resp.transactionId,
                desc,
                balance: resp.balance,
                transactionType
            });
        }
        setAmount(0);
        setDesc("");
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
                    <li>{`WalletId: ${submittedTransaction.walletId}`}</li>
                    <li>{`Amount: ${submittedTransaction.amount}`}</li>
                    <li>{`transactionId: ${submittedTransaction.transactionId}`}</li>
                    <li>{`Description: ${submittedTransaction.desc}`}</li>
                    <li>{`Balance: ${submittedTransaction.balance}`}</li>
                    <li>{`Transaction Type: ${submittedTransaction.transactionType}`}</li>
                </ul>
            </>}
        </div>
    );
};
