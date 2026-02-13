const express = require("express");
const cors = require("cors");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const DATA_DIR = path.join(__dirname, "data");
const UPLOADS_DIR = path.join(__dirname, "uploads");
const DB_PATH = path.join(DATA_DIR, "thriftapp.db");

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      size TEXT,
      condition TEXT DEFAULT 'Good',
      description TEXT,
      imageUrl TEXT NOT NULL,
      imagePath TEXT NOT NULL,
      sellerEmail TEXT,
      listedAt TEXT NOT NULL,
      soldAt TEXT,
      status TEXT NOT NULL DEFAULT 'available'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS seller_accounts (
      id TEXT PRIMARY KEY,
      normalizedStoreName TEXT UNIQUE NOT NULL,
      storeName TEXT NOT NULL,
      sellerEmail TEXT NOT NULL,
      phone TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      passwordSalt TEXT NOT NULL,
      profileJson TEXT,
      createdAt TEXT NOT NULL
    )
  `);
});

const defaultCorsOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];
const envCorsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const corsAllowList = Array.from(new Set([...defaultCorsOrigins, ...envCorsOrigins]));

app.use(
  cors({
    origin(origin, callback) {
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      if (!origin || corsAllowList.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ext || ".jpg";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});

const mapProductRow = (row) => ({
  ...row,
  price: Number(row.price || 0),
});

const hashPassword = (plain) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(plain, salt, 10000, 64, "sha512").toString("hex");
  return { salt, hash };
};

const verifyPassword = (plain, salt, hash) => {
  const compareHash = crypto.pbkdf2Sync(plain, salt, 10000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(compareHash), Buffer.from(hash));
};

const normalizeStoreName = (name) => (name || "").trim().toLowerCase();

const runSql = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) return reject(err);
      resolve(this);
    });
  });

const getSql = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });

const allSql = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/products", async (_req, res) => {
  try {
    const rows = await allSql("SELECT * FROM products ORDER BY listedAt DESC");
    res.json(rows.map(mapProductRow));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

app.post("/api/seller-auth/register", async (req, res) => {
  try {
    const {
      storeName,
      sellerEmail,
      phone,
      password,
      address,
      shippingMethod,
      deliveryOption,
      accountHolder,
      accountNumber,
      ifsc,
      aadhaar,
      pan,
    } = req.body || {};

    if (!storeName || !sellerEmail || !phone || !password) {
      return res.status(400).json({ message: "storeName, sellerEmail, phone, and password are required" });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const normalizedStoreName = normalizeStoreName(storeName);
    const existing = await getSql(
      "SELECT id FROM seller_accounts WHERE normalizedStoreName = ?",
      [normalizedStoreName]
    );
    if (existing) {
      return res.status(409).json({ message: "Store name already registered. Please log in." });
    }

    const id = `SELL${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const createdAt = new Date().toISOString();
    const { salt, hash } = hashPassword(String(password));

    const profileJson = JSON.stringify({
      address: address || "",
      shippingMethod: shippingMethod || "",
      deliveryOption: deliveryOption || "",
      accountHolder: accountHolder || "",
      accountNumber: accountNumber || "",
      ifsc: ifsc || "",
      aadhaar: aadhaar || "",
      pan: pan || "",
    });

    await runSql(
      `
        INSERT INTO seller_accounts (
          id, normalizedStoreName, storeName, sellerEmail, phone, passwordHash, passwordSalt, profileJson, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [id, normalizedStoreName, storeName.trim(), sellerEmail.trim(), String(phone).trim(), hash, salt, profileJson, createdAt]
    );

    return res.status(201).json({
      seller: {
        id,
        sellerId: id,
        name: storeName.trim(),
        storeName: storeName.trim(),
        email: sellerEmail.trim(),
        phone: String(phone).trim(),
        isSeller: true,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register seller account" });
  }
});

app.post("/api/seller-auth/login", async (req, res) => {
  try {
    const { storeName, password } = req.body || {};
    if (!storeName || !password) {
      return res.status(400).json({ message: "storeName and password are required" });
    }

    const normalizedStoreName = normalizeStoreName(storeName);
    const row = await getSql(
      "SELECT * FROM seller_accounts WHERE normalizedStoreName = ?",
      [normalizedStoreName]
    );

    if (!row || !verifyPassword(String(password), row.passwordSalt, row.passwordHash)) {
      return res.status(401).json({ message: "Invalid store name or password" });
    }

    return res.json({
      seller: {
        id: row.id,
        sellerId: row.id,
        name: row.storeName,
        storeName: row.storeName,
        email: row.sellerEmail,
        phone: row.phone,
        isSeller: true,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login seller" });
  }
});

app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, size, condition, description, sellerEmail } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "name, category, and price are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image upload is required" });
    }

    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: "price must be a positive number" });
    }

    const id = `PROD${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const listedAt = new Date().toISOString();
    const imagePath = req.file.path;
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    await runSql(
      `
        INSERT INTO products (
          id, name, category, price, size, condition, description, imageUrl, imagePath, sellerEmail, listedAt, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        name,
        category,
        parsedPrice,
        size || "",
        condition || "Good",
        description || "",
        imageUrl,
        imagePath,
        sellerEmail || "",
        listedAt,
        "available",
      ]
    );

    const created = await getSql("SELECT * FROM products WHERE id = ?", [id]);
    res.status(201).json(mapProductRow(created));
  } catch (error) {
    res.status(500).json({ message: "Failed to create product" });
  }
});

app.patch("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const nextStatus = status === "sold" ? "sold" : "available";
    const soldAt = nextStatus === "sold" ? new Date().toISOString() : null;

    const result = await runSql(
      "UPDATE products SET status = ?, soldAt = ? WHERE id = ?",
      [nextStatus, soldAt, id]
    );

    if (!result.changes) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updated = await getSql("SELECT * FROM products WHERE id = ?", [id]);
    res.json(mapProductRow(updated));
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getSql("SELECT * FROM products WHERE id = ?", [id]);
    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    await runSql("DELETE FROM products WHERE id = ?", [id]);

    if (existing.imagePath && fs.existsSync(existing.imagePath)) {
      fs.unlinkSync(existing.imagePath);
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: "Unexpected server error" });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
