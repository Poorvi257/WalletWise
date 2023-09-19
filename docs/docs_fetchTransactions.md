# API Documentation for `fetchTransactions` Function

## Overview

The `fetchTransactions` API function is an asynchronous endpoint designed to fetch a paginated list of transactions related to a specific wallet. The function uses query parameters for pagination and supports continuation tokens for efficient data retrieval.

## Endpoint

**HTTP Method:** GET

**Route:** `/api/transactions`

## Parameters

### Query Parameters

- **walletId** (`number`): The ID of the wallet for which transactions are to be fetched.
- **page** (`number`, optional): The page number for pagination, starting from 1. Defaults to 1.
- **limit** (`number`, optional): The maximum number of transactions to fetch per page. Defaults to 10. Max limit is 1000.
- **offset** (`string`, optional): A Base64 URL-encoded continuation token for offset-based pagination.

### Request Headers

- `Content-Type: application/json`

## Request Format

No request body is needed. The query parameters should be included in the URL.

Example URL: `/api/transactions?walletId=1&page=1&limit=10`

## Response Format

The response will be a JSON object.

### Successful Response

- **links** (`object`): Contains URLs for the current, next, and previous pages.
  - **self** (`string`): URL for the current page.
  - **next** (`string`, optional): URL for the next page.
  - **prev** (`string`, optional): URL for the previous page.
- **data** (`object`): Contains an array of transactions.
  - **transactions** (`array`): List of transaction objects.

### Unsuccessful Response

- **message** (`string`): A descriptive error message.

## Successful Response Example

```json
{
  "links": {
    "self": "http://localhost:8000/transactions?walletId=1&limit=10&page=1",
    "next": "http://localhost:8000/transactions?walletId=1&limit=10&offset=eyJ..."
  },
  "data": {
    "transactions": [
      {
        "id": 1,
        "wallet_id": 1,
        "amount": 100,
        "description": "Sample",
        "type": "DEBIT",
        "created_at": "2023-09-18T12:34:56Z"
      }
    ]
  }
}
```

## Unsuccessful Response Example

### Case: Invalid Wallet ID or Pagination Parameters

```json
{
  "message": "Invalid Wallet ID"
}
```

### Case: Server Error

```json
{
  "message": "An unknown error has occurred"
}
```

## Error Handling

- **HTTP 400**: Bad Request – Returned for invalid wallet ID or pagination parameters.
- **HTTP 500**: Internal Server Error – Returned for server-side errors.

## Additional Notes

1. **Input Validation**: The function validates that `walletId`, `page`, and `limit` are valid numbers within appropriate ranges.
2. **Connection Pool**: A connection pooling mechanism is used for database interactions. Ensure the pool is initialized properly.
3. **Error Logging**: Errors are logged to the console but are not persisted for auditing.
4. **Resource Release**: Database connections are released back to the pool to optimize resource usage.
5. **Continuation Tokens**: The function uses Base64 URL-encoded continuation tokens for efficient pagination. This is useful for large data sets.
6. **Environment Variable for Base URL**: The function uses `process.env.BASE_URL` to form URLs in the `links` object. Make sure this environment variable is set appropriately in production environments.
