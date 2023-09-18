import React from 'react';
import { Container } from '@mui/material';
import Main from './components/Main';
import WalletTransactions from './components/WalletTransactions'; // Make sure the path is correct
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/wallet-transactions" element={<WalletTransactions />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
};

export default App;
