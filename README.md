# ThriftApp

Thrift marketplace app with:
- React frontend
- Express backend
- SQLite persistent storage for products
- Disk-based image uploads served as public URLs

## Persistent Image Storage

Images are uploaded to `server/uploads/` and product metadata is stored in `server/data/thriftapp.db`.
Because products are fetched from the backend API, all users now see the same products and pictures.

## Run Locally

1. Install dependencies:
```bash
npm install
```

2. Start backend API:
```bash
npm run server
```

3. In another terminal, start frontend:
```bash
npm start
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:5000`

## Environment Variables

`server/.env` supports:
- `PORT` (default: `5000`)
- `CORS_ORIGIN` (default: `http://localhost:3000`)

Optional frontend API override:
- `REACT_APP_API_BASE_URL` (default: `http://localhost:5000`)

## API Endpoints

- `GET /api/health`
- `GET /api/products`
- `POST /api/products` (multipart form-data, image field name: `image`)
- `PATCH /api/products/:id` (JSON: `{ "status": "sold" }`)
- `DELETE /api/products/:id`
