// Client-side service for FeastIQ SQLite Database operations

export async function authenticateStudentApi(studentId, name = '', email = '') {
  try {
    const res = await fetch('/api/auth/student-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, name, email })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        return data.user;
      }
    }
  } catch (err) {
    console.warn('[SQLite API Warning]: Using client fallback:', err);
  }

  // Graceful fallback for offline/preview environments
  const normalizedId = studentId.toUpperCase().trim();
  let derivedName = name.trim();
  if (!derivedName) {
    if (normalizedId === 'STU001') derivedName = 'Thanmai';
    else if (normalizedId === 'STU002') derivedName = 'Rahul';
    else if (normalizedId === 'STU003') derivedName = 'Priya';
    else if (normalizedId.startsWith('STU') && normalizedId.length > 3) {
      derivedName = `Student ${normalizedId.slice(3)}`;
    } else {
      derivedName = `Student ${normalizedId}`;
    }
  }

  return {
    id: `local-${normalizedId}`,
    student_id: normalizedId,
    studentId: normalizedId,
    name: derivedName,
    email: email || `${normalizedId.toLowerCase()}@college.edu`,
    role: 'student',
    walletBalance: 850,
    createdAt: new Date().toISOString()
  };
}

export async function fetchOrdersApi(studentId = null) {
  try {
    const url = studentId ? `/api/orders?student_id=${encodeURIComponent(studentId)}` : '/api/orders';
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[SQLite API Warning] fetchOrders fallback:', err);
  }
  return null;
}

export async function saveOrderApi(orderData) {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[SQLite API Warning] saveOrder fallback:', err);
  }
  return null;
}

export async function updateOrderStatusInDb(orderId, status, eta) {
  try {
    await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, eta })
    });
  } catch (err) {
    console.warn('[SQLite API Warning] updateOrderStatus fallback:', err);
  }
}
