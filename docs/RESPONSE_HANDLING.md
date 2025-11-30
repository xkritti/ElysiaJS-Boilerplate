# Standardized Response & Error Handling

This project uses a global middleware to standardize all API responses. You don't need to manually wrap your responses in every controller.

## 1. Success Response (The Easy Way)

Just return your data object. The middleware will automatically wrap it.

```typescript
// Controller
.get('/users', () => {
  return [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];
})
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    { "id": 1, "name": "Alice" },
    { "id": 2, "name": "Bob" }
  ],
  "timestamp": "2023-11-30T10:00:00.000Z"
}
```

---

## 2. Custom Success Response

If you need to define a specific message or code, use the `createSuccessResponse` helper.

```typescript
import { createSuccessResponse } from '../utils/response.util';

.post('/users', () => {
  // ... logic
  return createSuccessResponse(
    { id: 3 },                  // Data
    201,                        // StatusCode
    'User created successfully' // Message
  );
})
```

---

## 3. Error Handling

Throw an `AppError` to return a controlled error response.

```typescript
import { AppError } from '../utils/response.util';

.get('/users/:id', ({ params }) => {
  const user = findUser(params.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return user;
})
```

**Response:**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found",
  "error": null,
  "timestamp": "2023-11-30T10:05:00.000Z"
}
```

---

## 4. Validation Errors

Elysia validation errors are automatically caught and formatted.

```typescript
.post('/login', ({ body }) => { ... }, {
  body: t.Object({
    email: t.String(),
    password: t.String()
  })
})
```

**Response (if invalid):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "error": { ...details... },
  "timestamp": "..."
}
```
