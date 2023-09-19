# API Documentation for `fetchAllTransactions` Function

## Overview

The `fetchAllTransactions` API function is an asynchronous endpoint designed to fetch all transactions related to a specific wallet. The function takes a `walletId` as a route parameter and returns an array of transaction objects upon successful operation.

## Endpoint

**HTTP Method:** GET

**Route:** `/allTransactions/:walletId`

## Parameters

### Route Parameters

- **walletId** (`number`): The ID of the wallet for which transactions are to be fetched.

### Request Headers

- `Content-Type: application/json`

## Request Format

No request body is required for this endpoint. The `walletId` is specified as a route parameter.

Example URL: `/api/allTransactions/1`

## Response Format

The response will be a JSON array containing objects that represent individual transactions.

### Transaction Object Fields

- **id** (`number`): Transaction ID.
- **wallet_id** (`number`): ID of the associated wallet.
- **amount** (`number`): Amount of the transaction.
- **type** (`string`): Type of the transaction (e.g., "credit" or "debit").
- **created_at** (`string`): Timestamp of the transaction.

### Successful Response

A JSON array containing transaction objects.

### Unsuccessful Response

- **error** (`string`): A descriptive error message.

## Successful Response Example

```json
[
  {
    "id": 1,
    "wallet_id": 1,
    "amount": 100,
    "type": "credit",
    "created_at": "2023-09-18T12:34:56Z"
  },
  {
    "id": 2,
    "wallet_id": 1,
    "amount": 50,
    "type": "debit",
    "created_at": "2023-09-18T12:40:00Z"
  }
]
```

## Unsuccessful Response Example

### Case: Invalid Wallet ID

```json
{
  "error": "Invalid wallet ID"
}
```

### Case: No Transactions Found

```json
{
  "error": "No transactions found for this wallet"
}
```

### Case: Server Error

```json
{
  "error": "Failed to fetch transactions"
}
```

## Error Handling

- **HTTP 400**: Bad Request – Returned when the `walletId` is either missing or not a valid number.
- **HTTP 404**: Not Found – Returned when no transactions are found for the specified wallet.
- **HTTP 500**: Internal Server Error – Returned for server-side errors.

## Additional Notes

1. **Input Validation**: The function validates that `walletId` is a valid number.
2. **Connection Pool**: A connection pooling mechanism is employed for database interactions. Ensure that the pool is initialized properly.
3. **Error Logging**: Errors are logged to the console but are not persisted for auditing.
4. **Resource Release**: Database connections are released back to the pool to optimize resource usage. Monitoring for resource leaks is advised.
5. **Data Ordering**: Transactions are ordered by their creation time in descending order. This might be useful for applications requiring the most recent transactions first.
