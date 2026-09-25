import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'feastiq.db');

export function getDatabase() {
  const db = new DatabaseSync(DB_PATH);
  
  // Enable WAL mode for high concurrency
  db.exec('PRAGMA journal_mode = WAL;');

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      role TEXT NOT NULL DEFAULT 'student',
      wallet_balance INTEGER DEFAULT 850,
      created_at TEXT NOT NULL
    );
  `);

  // Create orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      student_name TEXT,
      token TEXT NOT NULL,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL,
      eta TEXT,
      counter TEXT,
      payment_method TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Seed demo students if not present
  const seedUsers = [
    { student_id: 'STU001', name: 'Thanmai', email: 'thanmai@college.edu', role: 'student', wallet_balance: 850 },
    { student_id: 'STU002', name: 'Rahul', email: 'rahul@college.edu', role: 'student', wallet_balance: 620 },
    { student_id: 'STU003', name: 'Priya', email: 'priya@college.edu', role: 'student', wallet_balance: 940 },
    { student_id: '21CS042', name: 'Arjun Sharma', email: 'arjun.sharma@college.edu', role: 'student', wallet_balance: 850 }
  ];

  const checkUser = db.prepare('SELECT id FROM users WHERE student_id = ?');
  const insertUser = db.prepare(`
    INSERT INTO users (student_id, name, email, role, wallet_balance, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const u of seedUsers) {
    const existing = checkUser.get(u.student_id);
    if (!existing) {
      insertUser.run(u.student_id, u.name, u.email, u.role, u.wallet_balance, new Date().toISOString());
    }
  }

  // Seed initial sample orders linked to specific students
  const checkOrder = db.prepare('SELECT id FROM orders WHERE id = ?');
  const insertOrder = db.prepare(`
    INSERT INTO orders (id, student_id, student_name, token, items, total, status, eta, counter, payment_method, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialOrders = [
    {
      id: 'ORD-8921',
      student_id: 'STU001',
      student_name: 'Thanmai',
      token: 'TOKEN #F281',
      items: JSON.stringify([{ name: 'Biryani', quantity: 1, price: 140 }, { name: 'Thums Up', quantity: 1, price: 40 }]),
      total: 180,
      status: 'Ready',
      eta: '0 mins',
      counter: 'Counter 1 (Meals)',
      payment_method: 'UPI',
      created_at: '12:14 PM'
    },
    {
      id: 'ORD-8922',
      student_id: 'STU002',
      student_name: 'Rahul',
      token: 'TOKEN #F282',
      items: JSON.stringify([{ name: 'Shawarma', quantity: 2, price: 90 }, { name: 'Sprite', quantity: 1, price: 40 }]),
      total: 220,
      status: 'Preparing',
      eta: '4 mins',
      counter: 'Counter 2 (Snacks)',
      payment_method: 'Campus ID Card Wallet',
      created_at: '12:18 PM'
    },
    {
      id: 'ORD-8923',
      student_id: 'STU003',
      student_name: 'Priya',
      token: 'TOKEN #F283',
      items: JSON.stringify([{ name: 'Veg Noodles', quantity: 1, price: 80 }, { name: 'Manchuria', quantity: 1, price: 85 }]),
      total: 165,
      status: 'Accepted',
      eta: '7 mins',
      counter: 'Counter 2 (Snacks)',
      payment_method: 'UPI',
      created_at: '12:22 PM'
    }
  ];

  for (const ord of initialOrders) {
    const existing = checkOrder.get(ord.id);
    if (!existing) {
      insertOrder.run(
        ord.id,
        ord.student_id,
        ord.student_name,
        ord.token,
        ord.items,
        ord.total,
        ord.status,
        ord.eta,
        ord.counter,
        ord.payment_method,
        ord.created_at
      );
    }
  }

  return db;
}
