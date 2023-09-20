# Wallet API Documentation

Welcome to the Wallet API Documentation. This document serves as a central point linking to detailed API documentation for each endpoint provided by the Wallet API.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
   - [Setup Wallet](#setup-wallet)
   - [Fetch All Transactions for a Wallet](#fetch-all-transactions-for-a-wallet)
   - [Fetch Transactions with Pagination](#fetch-transactions-with-pagination)
   - [Get Wallet Details](#get-wallet-details)
   - [Handle Transactions](#handle-transactions)

## Overview

The Wallet API is designed to provide functionalities related to managing a digital wallet, including but not limited to creating wallets, fetching transaction details, and handling credit/debit transactions.

## Getting Started

This API is built using Node.js and assumes that you have a basic understanding of RESTful API principles. The base URL for all endpoints is either set through an environment variable `API_URL` or defaults to `http://localhost:8000`.

## Authentication

Currently, the API does not require any form of authentication. Future versions may include token-based or OAuth2 authentication.

## API Endpoints

Detailed documentation for each endpoint can be found in the respective markdown files linked below.

### Setup Wallet

Creates a new wallet in the system.

- [Detailed Documentation](docs_setup.md)

### Fetch All Transactions for a Wallet

Retrieves all transactions associated with a specific wallet.

- [Detailed Documentation](docs_fetchAllTransactions.md)

### Fetch Transactions with Pagination

Fetches transactions related to a specific wallet with pagination support.

- [Detailed Documentation](docs_fetchTransactions.md)

### Get Wallet Details

Fetches details of a specific wallet.

- [Detailed Documentation](docs_getwallet.md)

### Handle Transactions

Handles credit or debit transactions on a specific wallet.

- [Detailed Documentation](docs_handleTransactions.md)

Feel free to explore each endpoint's documentation for examples, request/response formats, and other specific details. Thank you for using the Wallet API!
