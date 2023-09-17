const express = require("express");
const { setup, getWallet } = require("./Wallet");
const { handleTransactions, fetchTransactions } = require("./Transactions");

const router = express.Router();

// Initialize a new wallet
router.post("/setup", setup);

// Handle credit/debit transactions on a wallet
router.post("/transact/:walletId", handleTransactions);

// Fetch transactions related to a specific wallet
// add the setup transaction
router.get("/transactions", fetchTransactions);

// Retrieve details of a specific wallet
router.get("/wallet/:id", getWallet);

module.exports = router;
