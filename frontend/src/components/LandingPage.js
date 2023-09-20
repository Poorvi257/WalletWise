import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
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
        if (!formData.name || formData.name.trim() === '') {
            alert('Username cannot be empty.');
            return;
        }

        if (formData.balance !== undefined && (isNaN(formData.balance) || formData.balance < 0)) {
            alert('Balance must be a non-negative number.');
            return;
        }

        try {
            let response = await initializeWallet(formData.name, formData.balance);

            // Check if response object contains status and error message
            if (response.status && response.status === 400) {
                alert(`Failed to initialize wallet: ${response.error}`);
                return;
            }

            localStorage.setItem("walletId", response.data.id);
            alert("Wallet created!");
            setIsSubmitted(true);
        } catch (error) {
            alert(`An error occurred: ${error.message}`);
        }
    };

    if (isSubmitted) {
        return <TransactionsForm />;
    }

    return (
        <Container>
            <Box style={{
                minHeight: '100vh',
            }}>
                <Typography style={{ paddingTop: "7vh" }} variant="h4" gutterBottom>
                    Create Wallet
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

                    <Box style={{ marginTop: '20px' }}>  {/* Added space between the text field and the submit button */}
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default LandingPage;
