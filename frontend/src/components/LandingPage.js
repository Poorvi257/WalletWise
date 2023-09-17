import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { TransactionsForm } from './Transactions';
import { initializeWallet } from '../server';

const LandingPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        balance: 0,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        let response = await initializeWallet(formData.name, formData.balance)
        localStorage.setItem("walletId", response.id)
        alert("wallet created!")
        setIsSubmitted(true)
    };

    if (isSubmitted) {
        return <TransactionsForm />;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                User Form
            </Typography>

            <form>
                <TextField
                    label="Username"
                    name='name'
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                />

                <TextField
                    label="Initial Balance (optional)"
                    name='balance'
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                />

                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default LandingPage;

