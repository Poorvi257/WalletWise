import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { initializeWallet } from './server';

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    balance: 0,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async() => {
    console.log('Form Data:', formData);
    const response = await initializeWallet(formData.name, formData.balance)
    localStorage.setItem("walletId", response.id)
  };

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

export default App;

