# ThriftApp API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "isSeller": false,
    "role": "buyer"
  }
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isSeller": false,
    "role": "buyer"
  }
}
```

### Get Current User
```http
GET /api/auth/me
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isSeller": false,
    "role": "buyer"
  }
}
```

---

## Product Endpoints

### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` (optional): Filter by category (Tops, Bottoms, Dresses, etc.)
- `status` (optional): Filter by status (available, sold, pending)
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `search` (optional): Search query
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 50)
- `sort` (optional): Sort order (default: -createdAt)

**Example:**
```http
GET /api/products?category=Tops&status=available&minPrice=100&maxPrice=1000&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "page": 1,
  "pages": 8,
  "products": [...]
}
```

### Get Single Product
```http
GET /api/products/:id
```

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Vintage Denim Jacket",
    "description": "Classic blue denim jacket...",
    "category": "Outerwear",
    "price": 599,
    "size": "M",
    "condition": "Good",
    "status": "available",
    "seller": {
      "_id": "...",
      "name": "Seller Name",
      "email": "seller@example.com"
    },
    "images": [...],
    "tags": ["vintage", "denim"],
    "views": 42,
    "likes": 5
  }
}
```

### Create Product
```http
POST /api/products
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Vintage Denim Jacket",
  "description": "Classic blue denim jacket in excellent condition",
  "category": "Outerwear",
  "price": 599,
  "originalPrice": 1200,
  "size": "M",
  "condition": "Good",
  "brand": "Levi's",
  "color": "Blue",
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "publicId": "image_id"
    }
  ],
  "tags": ["vintage", "denim", "jacket"]
}
```

### Update Product
```http
PUT /api/products/:id
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:** (same as create, all fields optional)

### Delete Product
```http
DELETE /api/products/:id
```
**Headers:** `Authorization: Bearer <token>`

### Get My Products (Seller)
```http
GET /api/products/seller/my-products
```
**Headers:** `Authorization: Bearer <token>`

---

## User Endpoints

### Get Profile
```http
GET /api/users/profile
```
**Headers:** `Authorization: Bearer <token>`

### Update Profile
```http
PUT /api/users/profile
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "9876543210",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  }
}
```

### Update Seller Details
```http
PUT /api/users/seller-details
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "storeName": "My Thrift Store",
  "gstNumber": "GST123456",
  "bankAccount": "1234567890"
}
```

---

## Order Endpoints

### Get All Orders
```http
GET /api/orders
```
**Headers:** `Authorization: Bearer <token>`

### Get Single Order
```http
GET /api/orders/:id
```
**Headers:** `Authorization: Bearer <token>`

### Create Order
```http
POST /api/orders
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "phone": "1234567890"
  },
  "paymentMethod": "upi"
}
```

### Update Order Status
```http
PUT /api/orders/:id/status
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "orderStatus": "confirmed",
  "paymentStatus": "completed"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "msg": "Validation error message",
      "param": "fieldName",
      "location": "body"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

API requests are rate-limited to 100 requests per 15 minutes per IP address.

---

## Notes for Production Scaling

1. **Database Indexing**: Ensure MongoDB indexes on frequently queried fields (category, status, price, seller)
2. **Caching**: Implement Redis caching for product listings and user sessions
3. **Image Storage**: Use Cloudinary or AWS S3 for image uploads
4. **CDN**: Serve static assets through a CDN
5. **Load Balancing**: Use nginx or AWS ELB for load balancing
6. **Monitoring**: Implement logging with Winston and monitoring with PM2
7. **Security**: 
   - Use HTTPS in production
   - Implement rate limiting per user (not just IP)
   - Add request validation middleware
   - Use helmet.js for security headers
8. **API Versioning**: Consider versioning API routes (e.g., `/api/v1/products`)
9. **Pagination**: Always use pagination for list endpoints
10. **Error Handling**: Implement comprehensive error handling and logging

