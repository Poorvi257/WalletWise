import React from 'react';
import LandingPage from './LandingPage';
import { TransactionsForm } from './Transactions';


const Main = () => {

    const walletId = localStorage.getItem("walletId");

    return (
        <>
            {walletId ? <TransactionsForm /> : <LandingPage />}
        </>
    );
};

export default Main;

