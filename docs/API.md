# API Documentation

## 📡 Base URL

```
Development: http://localhost:3000/api
Production: https://carsiqai.vercel.app/api
```

## 🔐 Authentication

Most endpoints are public. Admin endpoints require authentication.

### Admin Authentication

```http
POST /api/admin/auth
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password"
}
```

**Response**:
```json
{
  "success": true,
  "token": "jwt_token_here"
}
```

Use the token in subsequent requests:
```http
Authorization: Bearer jwt_token_here
```

## 🚗 Car Information

### Get Car Details

```http
POST /api/car
Content-Type: application/json

{
  "make": "Toyota",
  "model": "Camry",
  "year": 2020
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "engine": "2.5L 4-Cylinder",
    "oilCapacity": "4.8L",
    "oilType": "0W-20",
    "filterNumber": "A210032"
  }
}
```

## 💬 Chat Interface

### Send Chat Message

```http
POST /api/chat
Content-Type: application/json

{
  "message": "What oil does Toyota Camry 2020 need?",
  "sessionId": "optional_session_id"
}
```

**Response**:
```json
{
  "success": true,
  "response": "🛢️ **Oil Recommendation**\n\n...",
  "carInfo": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2020
  },
  "sessionId": "session_id"
}
```

### Simple Chat (No AI)

```http
POST /api/chat-simple
Content-Type: application/json

{
  "message": "Toyota Camry 2020"
}
```

## 🛢️ Oil Recommendations

### Get Oil Recommendation

```http
POST /api/oil-recommendation
Content-Type: application/json

{
  "make": "Toyota",
  "model": "Camry",
  "year": 2020,
  "engine": "2.5L"
}
```

**Response**:
```json
{
  "success": true,
  "recommendation": {
    "viscosity": "0W-20",
    "type": "Full Synthetic",
    "capacity": "4.8L",
    "brands": ["Castrol EDGE", "Mobil 1", "Valvoline"],
    "filterNumber": "A210032",
    "confidence": "high"
  }
}
```

## 🔧 Oil Products

### List Oil Products

```http
GET /api/oil-products?page=1&limit=20&search=castrol
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "brand": "Castrol",
      "name": "EDGE 0W-20",
      "viscosity": "0W-20",
      "type": "Full Synthetic",
      "price": 45.99,
      "available": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Get Single Product

```http
GET /api/oil-products/[id]
```

### Create Product (Admin)

```http
POST /api/oil-products
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "brand": "Castrol",
  "name": "EDGE 0W-20",
  "viscosity": "0W-20",
  "type": "Full Synthetic",
  "price": 45.99
}
```

### Update Product (Admin)

```http
PUT /api/oil-products/[id]
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "price": 49.99,
  "available": true
}
```

### Delete Product (Admin)

```http
DELETE /api/oil-products/[id]
Authorization: Bearer jwt_token
```

### Get Recommendations

```http
POST /api/oil-products/recommendations
Content-Type: application/json

{
  "viscosity": "0W-20",
  "type": "Full Synthetic"
}
```

## ✏️ Corrections

### Submit Correction

```http
POST /api/corrections
Content-Type: application/json

{
  "carMake": "Toyota",
  "carModel": "Camry",
  "carYear": 2020,
  "fieldName": "oilCapacity",
  "currentValue": "4.5L",
  "suggestedValue": "4.8L",
  "reason": "According to owner's manual",
  "userEmail": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "correctionId": "correction_id",
  "status": "pending"
}
```

### List Corrections (Admin)

```http
GET /api/corrections?status=pending&page=1&limit=20
Authorization: Bearer jwt_token
```

### Update Correction Status (Admin)

```http
PUT /api/corrections/[id]
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "status": "approved",
  "adminNotes": "Verified with official documentation"
}
```

## 📊 Analytics

### Get Analytics (Admin)

```http
GET /api/admin/analytics?period=7d
Authorization: Bearer jwt_token
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalQueries": 1250,
    "uniqueUsers": 450,
    "popularCars": [
      { "make": "Toyota", "model": "Camry", "count": 150 },
      { "make": "Honda", "model": "Accord", "count": 120 }
    ],
    "popularQueries": [
      { "query": "oil recommendation", "count": 300 },
      { "query": "filter number", "count": 250 }
    ],
    "responseTime": {
      "average": 1.2,
      "p95": 2.5,
      "p99": 4.0
    }
  }
}
```

### Get Metrics

```http
GET /api/metrics?metric=queries&period=30d
```

## 🌱 Database Seeding

### Seed Database (Admin)

```http
POST /api/seed
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "tables": ["cars", "oil_products", "filters"]
}
```

## ⚙️ Setup Endpoints

### Update Database Schema

```http
POST /api/setup/update-db
Authorization: Bearer jwt_token
```

### Direct Database Update

```http
POST /api/setup/direct-update
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "query": "UPDATE cars SET oil_capacity = '4.8L' WHERE id = 1"
}
```

## 🚨 Error Responses

All endpoints follow this error format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_REQUEST` | 400 | Invalid request parameters |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

## 📝 Request/Response Examples

### Complete Chat Flow

```javascript
// 1. Send message
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Toyota Camry 2020 oil',
    sessionId: localStorage.getItem('sessionId')
  })
});

const data = await response.json();

// 2. Store session ID
localStorage.setItem('sessionId', data.sessionId);

// 3. Display response
console.log(data.response);
```

### Admin Product Management

```javascript
// 1. Login
const authResponse = await fetch('/api/admin/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'password'
  })
});

const { token } = await authResponse.json();

// 2. Create product
const productResponse = await fetch('/api/oil-products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    brand: 'Castrol',
    name: 'EDGE 0W-20',
    viscosity: '0W-20',
    type: 'Full Synthetic',
    price: 45.99
  })
});
```

## 🔄 Rate Limiting

- **Public endpoints**: 100 requests per minute per IP
- **Admin endpoints**: 1000 requests per minute per token
- **Chat endpoint**: 20 requests per minute per session

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## 🌐 CORS

CORS is enabled for:
- `https://carsiqai.vercel.app`
- `http://localhost:3000` (development)

## 📱 Mobile App Endpoints

Mobile apps use the same endpoints with additional headers:

```http
X-App-Platform: ios|android
X-App-Version: 1.0.0
```

## 🔍 Query Parameters

### Pagination

```
?page=1&limit=20
```

### Filtering

```
?status=active&type=synthetic
```

### Sorting

```
?sort=price&order=asc
```

### Search

```
?search=castrol&fields=brand,name
```

## 📚 Additional Resources

- [Postman Collection](./postman_collection.json)
- [OpenAPI Specification](./openapi.yaml)
- [GraphQL Schema](./schema.graphql) (coming soon)

---

**Last Updated**: January 2026  
**Version**: 1.0.0
