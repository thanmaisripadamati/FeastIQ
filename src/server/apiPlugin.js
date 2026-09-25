import { getDatabase } from '../db/database.js';

export function sqliteApiPlugin() {
  return {
    name: 'feastiq-sqlite-api',
    configureServer(server) {
      const db = getDatabase();

      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        // Helper to parse JSON body
        const getBody = () => new Promise((resolve) => {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              resolve(body ? JSON.parse(body) : {});
            } catch (e) {
              resolve({});
            }
          });
        });

        res.setHeader('Content-Type', 'application/json');

        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = urlObj.pathname;

        try {
          // 1. Student Login / Registration
          if (pathname === '/api/auth/student-login' && req.method === 'POST') {
            const body = await getBody();
            let rawId = (body.student_id || body.studentId || '').trim();
            let customName = (body.name || '').trim();
            let customEmail = (body.email || '').trim();

            if (!rawId) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Student ID or College Gmail is required' }));
            }

            let normalizedId = rawId;
            let email = customEmail;

            // If user entered email as login identifier
            if (rawId.includes('@')) {
              email = rawId.toLowerCase();
              normalizedId = email.split('@')[0].toUpperCase();
            } else {
              normalizedId = rawId.toUpperCase();
              if (!email) {
                email = `${normalizedId.toLowerCase()}@college.edu`;
              }
            }

            // Check if user already exists in SQLite
            const findStmt = db.prepare('SELECT * FROM users WHERE student_id = ? OR email = ?');
            const existing = findStmt.get(normalizedId, email);

            if (existing) {
              return res.end(JSON.stringify({
                success: true,
                user: {
                  id: String(existing.id),
                  student_id: existing.student_id,
                  studentId: existing.student_id,
                  name: existing.name,
                  email: existing.email,
                  role: existing.role,
                  walletBalance: existing.wallet_balance || 850,
                  createdAt: existing.created_at
                },
                isNew: false
              }));
            }

            // Determine display name for new student
            let derivedName = customName;
            if (!derivedName) {
              // Known seed mapping or derive from ID
              if (normalizedId === 'STU001') derivedName = 'Thanmai';
              else if (normalizedId === 'STU002') derivedName = 'Rahul';
              else if (normalizedId === 'STU003') derivedName = 'Priya';
              else if (normalizedId.startsWith('STU') && normalizedId.length > 3) {
                // e.g. STU004 -> Student 004
                const num = normalizedId.slice(3);
                derivedName = `Student ${num}`;
              } else {
                derivedName = `Student ${normalizedId}`;
              }
            }

            // Insert new student into SQLite
            const insertStmt = db.prepare(`
              INSERT INTO users (student_id, name, email, role, wallet_balance, created_at)
              VALUES (?, ?, ?, 'student', 850, ?)
            `);

            const createdAt = new Date().toISOString();
            const result = insertStmt.run(normalizedId, derivedName, email, createdAt);

            const newUser = {
              id: String(result.lastInsertRowid),
              student_id: normalizedId,
              studentId: normalizedId,
              name: derivedName,
              email: email,
              role: 'student',
              walletBalance: 850,
              createdAt: createdAt
            };

            return res.end(JSON.stringify({
              success: true,
              user: newUser,
              isNew: true
            }));
          }

          // 2. Get User Profile by ID
          if (pathname.startsWith('/api/users/') && req.method === 'GET') {
            const sid = pathname.replace('/api/users/', '').toUpperCase();
            const user = db.prepare('SELECT * FROM users WHERE student_id = ?').get(sid);
            if (!user) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'User not found' }));
            }
            return res.end(JSON.stringify({
              id: String(user.id),
              student_id: user.student_id,
              studentId: user.student_id,
              name: user.name,
              email: user.email,
              role: user.role,
              walletBalance: user.wallet_balance || 850,
              createdAt: user.created_at
            }));
          }

          // 3. Orders: GET
          if (pathname === '/api/orders' && req.method === 'GET') {
            const studentIdFilter = urlObj.searchParams.get('student_id') || urlObj.searchParams.get('studentId');
            let rows;
            if (studentIdFilter) {
              const stmt = db.prepare('SELECT * FROM orders WHERE student_id = ? ORDER BY rowid DESC');
              rows = stmt.all(studentIdFilter.toUpperCase());
            } else {
              const stmt = db.prepare('SELECT * FROM orders ORDER BY rowid DESC');
              rows = stmt.all();
            }

            const formatted = rows.map(r => ({
              id: r.id,
              student_id: r.student_id,
              studentId: r.student_id,
              studentName: r.student_name,
              token: r.token,
              items: typeof r.items === 'string' ? JSON.parse(r.items) : r.items,
              total: r.total,
              status: r.status,
              eta: r.eta,
              counter: r.counter,
              paymentMethod: r.payment_method,
              time: r.created_at
            }));

            return res.end(JSON.stringify(formatted));
          }

          // 4. Orders: POST
          if (pathname === '/api/orders' && req.method === 'POST') {
            const body = await getBody();
            const { id, student_id, studentId, studentName, token, items, total, status, eta, counter, paymentMethod } = body;

            const sid = (student_id || studentId || '').toUpperCase();
            const stmt = db.prepare(`
              INSERT INTO orders (id, student_id, student_name, token, items, total, status, eta, counter, payment_method, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const orderId = id || ('ord-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6));
            const orderToken = token || ('#F' + Math.floor(100 + Math.random() * 900));
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            stmt.run(
              orderId,
              sid,
              studentName || `Student ${sid}`,
              orderToken,
              JSON.stringify(items || []),
              Number(total) || 0,
              status || 'Order Placed',
              eta || '8 mins',
              counter || 'Counter 1 (Meals)',
              paymentMethod || 'UPI',
              timeStr
            );

            return res.end(JSON.stringify({ success: true, id: orderId, token: orderToken }));
          }

          // 5. Orders: Update status
          if (pathname.startsWith('/api/orders/') && pathname.endsWith('/status') && req.method === 'PATCH') {
            const orderId = pathname.split('/')[3];
            const body = await getBody();
            const { status, eta } = body;

            const stmt = db.prepare('UPDATE orders SET status = ?, eta = ? WHERE id = ?');
            stmt.run(status, eta || '', orderId);

            return res.end(JSON.stringify({ success: true, orderId, status }));
          }

          res.statusCode = 404;
          return res.end(JSON.stringify({ error: 'Endpoint not found' }));

        } catch (err) {
          console.error('[SQLite API Error]:', err);
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
  };
}
