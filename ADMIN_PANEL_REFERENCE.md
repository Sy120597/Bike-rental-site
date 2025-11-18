# 🎯 Admin Panel - Quick Reference Guide

## Admin Routes Map

```
POST   /api/admin/login              → Admin Login (Public)
POST   /api/admin/register           → Register new Admin (SuperAdmin only)
GET    /api/admin/verify             → Verify admin token (Protected)
GET    /api/admin/me                 → Get admin profile (Protected)
POST   /api/admin/logout             → Logout admin (Protected)

GET    /api/admin/users              → Get all users (Protected)
DELETE /api/admin/users/:id          → Delete user (Protected)
PUT    /api/admin/users/:id/block    → Block/Unblock user (Protected)

GET    /api/admin/bookings           → Get all bookings (Protected)
PUT    /api/admin/bookings/:id/status → Update booking status (Protected)
DELETE /api/admin/bookings/:id       → Delete booking (Protected)

GET    /api/admin/reports/stats      → Get dashboard stats (Protected)

GET    /api/admin/notifications      → Get all notifications (Protected)
PUT    /api/admin/notifications/mark-read → Mark all as read (Protected)
DELETE /api/admin/notifications/clear → Delete all notifications (Protected)
```

---

## Frontend Routes Map

```
/admin/login                → AdminLogin page
/admin/dashboard           → AdminDashboard (Protected)
/admin/users              → ManageUsers page (Protected)
/admin/bookings           → ManageBookings page (Protected)
/admin/notifications      → AdminNotifications page (Protected)
/admin/reports            → AdminReports page (Protected)
```

---

## Component Structure

```
App.jsx (Main Router)
├── Routes (User)
│   ├── / (Home)
│   ├── /login (Login)
│   ├── /signup (Signup)
│   ├── /booking (Protected)
│   └── ...
│
└── Routes (Admin)
    ├── /admin/login (Public)
    └── AdminProtectedRoute (Wrapper)
        └── AdminLayout (Sidebar + Topbar + Content)
            ├── /admin/dashboard → AdminDashboard
            ├── /admin/users → ManageUsers
            ├── /admin/bookings → ManageBookings
            ├── /admin/notifications → AdminNotifications
            └── /admin/reports → AdminReports
```

---

## Authentication Flow

### Login Process
```
1. User enters email/password
2. Sends POST /api/admin/login
3. Backend returns JWT token
4. Token stored in localStorage as "adminToken"
5. Redirect to /admin/dashboard
```

### Protected Route Check
```
1. Navigate to /admin/dashboard
2. AdminProtectedRoute checks localStorage for "adminToken"
3. Calls GET /api/admin/verify with token
4. If verified → Show content
5. If not verified → Redirect to /admin/login
```

### Logout Process
```
1. Click Logout button
2. POST /api/admin/logout
3. Clear "adminToken" from localStorage
4. Redirect to /admin/login
```

---

## Key Files Reference

### Backend
- **Auth:** `/server/middleware/adminAuthMiddleware.js`
- **Routes:** `/server/routes/admin*.js`
- **Controllers:** `/server/controllers/admin*.js`
- **Models:** `/server/models/Admin.js`

### Frontend
- **Main:** `/client/src/App.jsx`
- **Protected Route:** `/client/src/pages/Admin/AdminProtectedRoute.jsx`
- **Layout:** `/client/src/pages/Admin/Layout/`
  - `Sidebar.jsx` - Navigation sidebar
  - `Topbar.jsx` - Top bar with logout
- **Pages:** `/client/src/pages/Admin/`
  - `AdminDashboard.jsx`
  - `ManageUsers.jsx`
  - `ManageBookings.jsx`
  - `AdminNotifications.jsx`
  - `AdminReports.jsx`

---

## Common Issues & Fixes

### Issue: Sidebar not showing
**Solution:** Make sure component is wrapped in `AdminLayout` in `App.jsx`

### Issue: "Token expired" error
**Solution:** Admin needs to login again, token stored in localStorage

### Issue: Pages show "Loading..." forever
**Solution:** Check if backend API endpoint exists and is protected properly

### Issue: Data not showing (showing "No data")
**Solution:** Check if backend has actual data in MongoDB

---

## Testing Admin Panel

### 1. Admin Login
```
Email: admin@example.com
Password: your_password
```

### 2. Check Each Page
- [ ] Dashboard loads with stats
- [ ] Users list shows all users
- [ ] Bookings list shows all bookings
- [ ] Notifications work
- [ ] Reports display charts

### 3. Check Features
- [ ] Block/Unblock user works
- [ ] Delete user works
- [ ] Update booking status works
- [ ] Search functionality works
- [ ] Mobile responsive

---

## Environment Variables Needed

```
# Backend (.env)
PORT=5001
MONGODB_URI=your_mongo_connection
JWT_SECRET=your_secret_key
FRONTEND_ORIGIN=http://localhost:5173

# Frontend (.env)
VITE_API_URL=http://localhost:5001
```

---

## Database Models Required

- **User.js** - Regular users
- **Admin.js** - Admin users
- **Booking.js** - Bookings/Rentals
- **Notification.js** - System notifications

---

## Next Steps

1. ✅ All fixes applied
2. ⏳ Test admin login
3. ⏳ Verify all CRUD operations work
4. ⏳ Check error handling
5. ⏳ Test on mobile
6. ⏳ Deploy to production

