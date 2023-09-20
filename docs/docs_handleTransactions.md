# API Documentation for `handleTransactions` Function

## Overview

The `handleTransactions` API function is an asynchronous endpoint responsible for handling credit and debit transactions on a specific wallet. It validates the input parameters, updates the wallet's balance, and records the transaction in a `Transactions` table.

## Endpoint

**HTTP Method:** POST

**Route:** `/transact/:walletId`

## Parameters

### Route Parameters

- **walletId** (`number`): The ID of the wallet on which the transaction is to be performed.

### Request Parameters

- **transactionId** (`number`): Transaction id.
- **amount** (`number`): The amount of the transaction.
- **description** (`string`, optional): A description or note for the transaction.
- **type** (`string`): Type of the transaction, either 'DEBIT' or 'CREDIT'.

### Request Headers

- `Content-Type: application/json`

## Request Format

The request should be a JSON object containing `amount`, `description`, and `type`.

```json
{
  "amount": 100,
  "description": "Sample transaction",
  "type": "DEBIT"
}
```

## Response Format

The response will be a JSON object.

### Successful Response

- **balance** (`number`): The updated balance of the wallet, rounded to 4 decimal places.
- **transactionId** (`string`): The generated transaction ID.
- **type** (`string`): The type of the transaction.

### Unsuccessful Response

- **error** (`string`): A descriptive error message.

## Successful Response Example

```json
{
  "balance": "900.0000",
  "transactionId": "123e4567-e89b-12d3-a456-426614174000",
  "type": "DEBIT"
}
```

## Unsuccessful Response Example

### Case: Invalid Input Parameters

```json
{
  "error": "Invalid input parameters"
}
```

### Case: Wallet Not Found

```json
{
  "error": "Wallet not found"
}
```

### Case: Insufficient Balance

```json
{
  "error": "Insufficient balance"
}
```

### Case: Transaction Failed (Server Error)

```json
{
  "error": "Transaction failed"
}
```

## Error Handling

- **HTTP 400**: Bad Request – Returned for invalid input parameters or insufficient balance.
- **HTTP 404**: Not Found – Returned when the specified wallet is not found.
- **HTTP 500**: Internal Server Error – Returned for server-side errors during the transaction.

## Additional Notes

1. **Input Validation**: The function validates that `walletId`, `amount`, and `type` are valid. It also checks if the `type` is either 'DEBIT' or 'CREDIT'.
2. **Connection Pool**: The function uses a connection pool for database interactions. Ensure the pool is initialized properly.
3. **Error Logging**: Errors are logged to the console but are not persisted for auditing.
4. **Resource Release**: Database connections are released back to the pool, ensuring efficient resource usage. Monitoring for potential resource leaks is advised.
5. **UUID for Transaction ID**: The function generates a UUID for each transaction, ensuring uniqueness.
6. **Precision**: The balance is kept up to 4 decimal places to ensure accuracy during calculations.
