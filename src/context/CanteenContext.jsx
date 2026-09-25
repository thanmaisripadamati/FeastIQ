import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_ORDERS, 
  EVENT_PREDICTED_ITEMS, 
  DEMO_USERS, 
  PAST_EVENTS_HISTORY,
  HOURLY_NORMAL_DEMAND 
} from '../data/mockData';
import { 
  authenticateStudentApi, 
  fetchOrdersApi, 
  saveOrderApi, 
  updateOrderStatusInDb 
} from '../services/dbClient';

const CanteenContext = createContext(null);

export function CanteenProvider({ children }) {
  // Current user state (strictly student or admin)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('feastiq_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.student;
  });

  // Current active view
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'menu' | 'cart' | 'orders' | 'recommendations' | 'profile' | 'admin' | 'access-denied'
  const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard' | 'live-orders' | 'menu' | 'inventory' | 'ai-command' | 'event-management' | 'demand-prediction' | 'food-waste' | 'analytics' | 'settings'

  // Access denied state
  const [accessDeniedMessage, setAccessDeniedMessage] = useState(null);

  // Menu items & inventory
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('feastiq_menu');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item) => {
          const match = INITIAL_MENU_ITEMS.find((m) => m.id === item.id);
          return match ? { ...item, image: match.image } : item;
        });
      } catch (e) {
        console.warn('Error reading menu items cache:', e);
      }
    }
    return INITIAL_MENU_ITEMS;
  });

  // Orders queue
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('feastiq_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Student Cart
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('feastiq_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Event Management System (The Core USP)
  const [eventRushActive, setEventRushActive] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [eventHistory, setEventHistory] = useState(PAST_EVENTS_HISTORY);
  const [appliedRecommendations, setAppliedRecommendations] = useState([]);
  const [showEventRecoveryModal, setShowEventRecoveryModal] = useState(false);
  const [recoverySummary, setRecoverySummary] = useState(null);

  // Rush metrics
  const [metrics, setMetrics] = useState({
    rushLevel: 'LOW', // 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME'
    ordersPerMinute: 5,
    activeUsers: 64,
    activeOrders: 18,
    predictedOrders: 120,
    estimatedWaitTime: 8,
    todayRevenue: 24850,
    demandConfidence: 87,
    todayOrdersCount: 142
  });

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Welcome to FeastIQ',
      message: 'Canteen is running smoothly. Normal rush estimated.',
      type: 'info',
      time: 'Just now'
    }
  ]);

  // Sync orders from SQLite on mount
  useEffect(() => {
    let isMounted = true;
    async function loadDbOrders() {
      const dbOrders = await fetchOrdersApi();
      if (isMounted && dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
      }
    }
    loadDbOrders();
    return () => { isMounted = false; };
  }, []);

  // Persist items
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('feastiq_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('feastiq_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('feastiq_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('feastiq_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('feastiq_cart', JSON.stringify(cart));
  }, [cart]);

  // Handle navigation with strict role verification
  const navigateTo = (view, targetAdminTab = null) => {
    if (view === 'admin') {
      if (currentUser?.role !== 'admin') {
        setAccessDeniedMessage(
          'Access Denied — Only authorized kitchen staff can access the canteen management portal.'
        );
        setCurrentView('access-denied');
        return;
      }
      if (targetAdminTab) {
        setAdminTab(targetAdminTab);
      }
      setCurrentView('admin');
      return;
    }
    setAccessDeniedMessage(null);
    setCurrentView(view);
  };

  // Dynamic Student Authentication (SQLite backed)
  const loginAsStudent = async (emailOrId = 'STU001', customName = '', customEmail = '') => {
    try {
      const user = await authenticateStudentApi(emailOrId, customName, customEmail);
      setCurrentUser(user);
      localStorage.setItem('feastiq_user', JSON.stringify(user));
      setCurrentView('home');
      addNotification('Student Login', `Logged in as ${user.name} (${user.student_id || user.studentId})`, 'success');

      // Fetch fresh orders
      const dbOrders = await fetchOrdersApi();
      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
      }
      return user;
    } catch (err) {
      console.error('Student login error:', err);
    }
  };

  const loginAsAdmin = (passcode = 'STAFF-01') => {
    setCurrentUser(DEMO_USERS.admin);
    setCurrentView('admin');
    setAdminTab('dashboard');
    addNotification('Admin Authorized', 'Authenticated as Kitchen Operations Staff (Chef Ramesh)', 'success');
  };

  const logout = () => {
    localStorage.removeItem('feastiq_user');
    setCurrentUser(null);
    clearCart();
    setCurrentView('home');
    addNotification('Signed Out', 'You have been signed out. Please sign in with your Student ID.', 'info');
  };

  // Cart operations
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    addNotification('Item Added', `${item.name} added to cart`, 'info');
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateCartQuantity = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartTax = Math.round(cartSubtotal * 0.05); // 5% GST/service
  const cartTotal = cartSubtotal + cartTax;

  // Place order dynamically linked to student
  const placeOrder = (details = {}) => {
    if (cart.length === 0 || !currentUser) return null;

    const studentId = currentUser.student_id || currentUser.studentId || 'STU001';
    const studentName = currentUser.name || `Student ${studentId}`;
    const tokenNum = `TOKEN #F${Math.floor(285 + orders.length)}`;
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      token: tokenNum,
      student_id: studentId,
      studentId: studentId,
      studentName: studentName,
      items: cart.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      total: cartTotal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Order Placed',
      eta: '8 mins',
      counter: details.counter || 'Counter 1 (Meals)',
      paymentMethod: details.paymentMethod || 'UPI (Simulated)'
    };

    // Deduct stock
    setMenuItems((prev) =>
      prev.map((m) => {
        const cartMatch = cart.find((c) => c.id === m.id);
        if (cartMatch) {
          return { ...m, stock: Math.max(0, m.stock - cartMatch.quantity) };
        }
        return m;
      })
    );

    // Save to SQLite asynchronously
    saveOrderApi(newOrder);

    setOrders((prev) => [newOrder, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      todayRevenue: prev.todayRevenue + cartTotal,
      todayOrdersCount: prev.todayOrdersCount + 1,
      activeOrders: prev.activeOrders + 1
    }));

    clearCart();

    addNotification(
      'Order Placed Successfully!',
      `${tokenNum} is confirmed for ${studentName} (${studentId}). Estimated wait: 8 mins.`,
      'success'
    );

    return newOrder;
  };

  // Update order status (Admin)
  const updateOrderStatus = (orderId, newStatus) => {
    let nextEta = '0 mins';
    if (newStatus === 'Accepted') nextEta = '6 mins';
    if (newStatus === 'Preparing') nextEta = '3 mins';
    if (newStatus === 'Ready') nextEta = 'Ready for pickup!';
    if (newStatus === 'Completed') nextEta = 'Delivered';

    updateOrderStatusInDb(orderId, newStatus, nextEta);

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return { ...o, status: newStatus, eta: nextEta };
        }
        return o;
      })
    );

    addNotification('Order Updated', `Order ${orderId} moved to "${newStatus}"`, 'info');
  };

  // Menu Management
  const toggleItemAvailability = (id) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  const updateItemPrice = (id, newPrice) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: Number(newPrice) } : item))
    );
  };

  const updateItemStock = (id, newStock) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: Number(newStock) } : item))
    );
  };

  // SIMULATE EVENT RUSH (500+ STUDENTS!)
  const simulateEventRush = () => {
    setEventRushActive(true);
    const sportsDayEvent = {
      name: 'Annual Sports Day 2026',
      type: 'Sports Event',
      crowd: 500,
      startTime: '11:00 AM',
      endTime: '3:00 PM',
      predictedOrders: 438,
      notes: 'Heavy surge from athletic track & field athletes and spectators.'
    };
    setActiveEvent(sportsDayEvent);

    // Update real-time metrics to EXTREME RUSH
    setMetrics((prev) => ({
      ...prev,
      rushLevel: 'EXTREME',
      ordersPerMinute: 34,
      activeUsers: 520,
      activeOrders: 287,
      predictedOrders: 438,
      estimatedWaitTime: 14,
      demandConfidence: 89,
      todayRevenue: prev.todayRevenue + 42000
    }));

    // Inject simulated surge orders into the live queue to look realistic
    const surgeOrders = [
      {
        id: 'ORD-9101',
        token: 'TOKEN #F290',
        studentName: 'Rahul Verma (Sports Captain)',
        studentId: '22ME045',
        items: [{ name: 'Biryani', quantity: 3, price: 140 }, { name: 'Thums Up', quantity: 3, price: 40 }],
        total: 540,
        time: '12:30 PM',
        status: 'Preparing',
        eta: '6 mins',
        counter: 'Counter 1 (Meals)'
      },
      {
        id: 'ORD-9102',
        token: 'TOKEN #F291',
        studentName: 'Sneha Patel',
        studentId: '23CS112',
        items: [{ name: 'Shawarma', quantity: 2, price: 90 }, { name: 'Sprite', quantity: 2, price: 40 }],
        total: 260,
        time: '12:31 PM',
        status: 'Accepted',
        eta: '9 mins',
        counter: 'Counter 2 (Snacks)'
      },
      {
        id: 'ORD-9103',
        token: 'TOKEN #F292',
        studentName: 'Athletics Team Group A',
        studentId: '21PE009',
        items: [{ name: 'Puffs', quantity: 8, price: 25 }, { name: 'Maaza', quantity: 8, price: 35 }],
        total: 480,
        time: '12:32 PM',
        status: 'Order Placed',
        eta: '11 mins',
        counter: 'Counter 2 (Snacks)'
      },
      {
        id: 'ORD-9104',
        token: 'TOKEN #F293',
        studentName: 'Vikas Nambiar',
        studentId: '24EC056',
        items: [{ name: 'Chicken Noodles', quantity: 2, price: 110 }],
        total: 220,
        time: '12:32 PM',
        status: 'Order Placed',
        eta: '12 mins',
        counter: 'Counter 1 (Meals)'
      }
    ];

    setOrders((prev) => [...surgeOrders, ...prev]);

    addNotification(
      '🚨 EVENT RUSH DETECTED!',
      '500+ students detected on campus. Orders/min jumped to 34. Event Management Agent active.',
      'critical'
    );
  };

  // Stop Event / Recovery Mode
  const endEventSimulation = () => {
    const summary = {
      event: activeEvent?.name || 'Annual Sports Day',
      duration: '3.5 hours',
      totalOrders: 438,
      peakOrdersPerMin: 34,
      mostPopularItem: 'Shawarma (142 portions sold)',
      itemsSold: [
        { name: 'Shawarma', sold: 142, revenue: 12780 },
        { name: 'Biryani', sold: 135, revenue: 18900 },
        { name: 'Cool Drinks', sold: 215, revenue: 8600 },
        { name: 'Puffs', sold: 98, revenue: 2450 }
      ],
      estimatedUnsoldFood: '1.8 kg (Vegetable curry buffer)',
      estimatedWasteSaved: '32.4 kg / ₹4,650 saved vs unmanaged rush',
      averageWaitingTime: '12.4 minutes',
      recommendations: [
        'Shawarma demand was 38% higher than projected. Expand grill skewers next sports meet.',
        'Pre-bagged chilled beverages at Counter 3 prevented a 15-minute queue choke.',
        'Biryani batch prep alert at 12:15 PM saved 45 students from missing lunch.'
      ]
    };

    setRecoverySummary(summary);
    setShowEventRecoveryModal(true);
    setEventRushActive(false);
    setActiveEvent(null);

    // Return to elevated normal
    setMetrics((prev) => ({
      ...prev,
      rushLevel: 'MEDIUM',
      ordersPerMinute: 8,
      activeUsers: 85,
      activeOrders: 24,
      predictedOrders: 160,
      estimatedWaitTime: 7
    }));

    addNotification(
      'Event Concluded — Recovery Mode Active',
      'Event performance report compiled. Post-event AI analysis ready for review.',
      'success'
    );
  };

  // Create custom event manually
  const createManualEvent = (eventData) => {
    setActiveEvent(eventData);
    setEventRushActive(true);

    const estOrders = Math.round(eventData.crowd * 0.84); // 84% conversion rate
    setMetrics((prev) => ({
      ...prev,
      rushLevel: eventData.crowd >= 400 ? 'EXTREME' : 'HIGH',
      ordersPerMinute: Math.round(eventData.crowd / 15),
      activeUsers: eventData.crowd,
      predictedOrders: estOrders,
      activeOrders: Math.round(estOrders * 0.45)
    }));

    addNotification(
      `Event Scheduled: ${eventData.name}`,
      `Agent recalculated demand for ${eventData.crowd} attendees. Predicted ${estOrders} orders.`,
      'info'
    );
  };

  // Apply AI action plan recommendation
  const applyAIRecommendation = (recId, recType, detail) => {
    setAppliedRecommendations((prev) => [...prev, recId]);

    // Perform practical stock adjustments based on rec
    if (recType === 'PREPARE_BIRYANI') {
      setMenuItems((prev) =>
        prev.map((i) => (i.id === 'lun-1' ? { ...i, stock: i.stock + 70 } : i))
      );
      addNotification('AI Action Executed', 'Added 70 portions to Biryani prep queue.', 'success');
    } else if (recType === 'PREPARE_SHAWARMA') {
      setMenuItems((prev) =>
        prev.map((i) => (i.id === 'snk-3' ? { ...i, stock: i.stock + 100 } : i))
      );
      addNotification('AI Action Executed', 'Ordered kitchen to load 100 Shawarma portions onto spit.', 'success');
    } else if (recType === 'RESTOCK_BEVERAGES') {
      setMenuItems((prev) =>
        prev.map((i) => (i.category === 'COOL DRINKS' ? { ...i, stock: i.stock + 50 } : i))
      );
      addNotification('AI Action Executed', 'Chillers replenished with 150 beverages at Counter 3.', 'success');
    } else {
      addNotification('AI Action Executed', detail || 'Recommendation implemented.', 'success');
    }
  };

  // Helper notification dispatcher
  const addNotification = (title, message, type = 'info') => {
    const id = `notif-${Date.now()}`;
    const newNotif = {
      id,
      title,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 9)]);
  };

  return (
    <CanteenContext.Provider
      value={{
        currentUser,
        currentView,
        adminTab,
        accessDeniedMessage,
        menuItems,
        orders,
        cart,
        cartSubtotal,
        cartTax,
        cartTotal,
        metrics,
        eventRushActive,
        activeEvent,
        eventHistory,
        appliedRecommendations,
        showEventRecoveryModal,
        recoverySummary,
        notifications,
        navigateTo,
        setAdminTab,
        loginAsStudent,
        loginAsAdmin,
        logout,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        toggleItemAvailability,
        updateItemPrice,
        updateItemStock,
        simulateEventRush,
        endEventSimulation,
        createManualEvent,
        applyAIRecommendation,
        setShowEventRecoveryModal,
        addNotification
      }}
    >
      {children}
    </CanteenContext.Provider>
  );
}

export function useCanteen() {
  const context = useContext(CanteenContext);
  if (!context) {
    throw new Error('useCanteen must be used within a CanteenProvider');
  }
  return context;
}
