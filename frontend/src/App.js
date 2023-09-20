import React from 'react';
import Main from './components/Main';
import WalletTransactions from './components/WalletTransactions'; // Make sure the path is correct
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div style={{backgroundColor: '#f3f4f6'}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/wallet-transactions" element={<WalletTransactions />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
