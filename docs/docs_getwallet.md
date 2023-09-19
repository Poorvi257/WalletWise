# API Documentation for `getWallet` Function

## Overview

The `getWallet` API function is an asynchronous endpoint designed to fetch details of a wallet stored in a database. It requires a `walletId` as a route parameter and returns the wallet's ID, balance, and name upon successful retrieval.

## Endpoint

**HTTP Method:** GET

**Route:** `/api/transact/:walletId`

## Parameters

### Route Parameters

- **walletId** (`number`): The ID of the wallet whose details are to be fetched.

### Request Headers

- `Content-Type: application/json`

## Request Format

No request body is needed for this function. The `walletId` is specified in the URL.

Example URL: `/api/transact/1`

## Response Format

The response will be a JSON object.

### Successful Response

- **id** (`number`): The ID of the fetched wallet.
- **name** (`string`): The name of the fetched wallet.
- **balance** (`number`): The current balance of the fetched wallet.

### Unsuccessful Response

- **error** (`string`): A descriptive error message.

## Successful Response Example

```json
{
  "id": 1,
  "name": "Sample Wallet",
  "balance": 1000
}
```

## Unsuccessful Response Example

### Case: Invalid Wallet ID

```json
{
  "error": "Invalid wallet ID"
}
```

### Case: Wallet Not Found

```json
{
  "error": "Wallet not found"
}
```

### Case: Server Error

```json
{
  "error": "Failed to fetch wallet details"
}
```

## Error Handling

- **HTTP 400**: Bad Request – This status is returned when the `walletId` is either missing or not a valid number.
- **HTTP 404**: Not Found – This status is returned when the specified wallet could not be found in the database.
- **HTTP 500**: Internal Server Error – This status is returned when a server-side issue prevents the wallet details from being fetched.

## Additional Notes

1. **Input Validation**: The function performs input validation to ensure that `walletId` is a valid number.
2. **Connection Pool**: The function uses a connection pooling mechanism for database interaction. Ensure the pool is properly initialized before invoking this function.
3. **Error Logging**: Errors are logged to the console but are not persisted for auditing purposes.
4. **Resource Release**: Database connections are released back to the pool, ensuring efficient resource utilization. Keep an eye out for potential resource leaks.
5. **Data Conversion**: The balance is explicitly converted to a floating-point number before being returned. This ensures the client receives the balance in a consistent format.
