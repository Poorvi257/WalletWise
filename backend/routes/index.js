const express = require("express");
const { setup, getWallet } = require("./Wallet");
const { handleTransactions, fetchTransactions, fetchAllTransactions } = require("./Transactions");

const router = express.Router();

// Initialize a new wallet
router.post("/setup", setup);

// Handle credit/debit transactions on a wallet
router.post("/transact/:walletId", handleTransactions);

// Fetch transactions related to a specific wallet
router.get("/transactions", fetchTransactions);

// Fetch all transactions related to a specific wallet
router.get("/allTransactions/:walletId", fetchAllTransactions);

// Retrieve details of a specific wallet
router.get("/wallet/:id", getWallet);

module.exports = router;
