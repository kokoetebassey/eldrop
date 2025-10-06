# Vendor & Order Processing System

## Overview
This system enables users to place orders and vendors to accept and fulfill them.

## User Flow
1. **User adds items to cart** → `/home`
2. **User proceeds to checkout** → `/cart` → `/order-summary`
3. **User pays via Paystack** → Order created in database
4. **User tracks order** → `/orders/track`

## Vendor Flow
1. **Vendor opens dashboard** → `/vendor/dashboard`
2. **Vendor sees available orders** → "Available Orders" tab
3. **Vendor accepts order** → Order status: `accepted`
4. **Vendor starts shopping** → Order status: `in-progress`
5. **Vendor delivers order** → Order status: `delivering`
6. **Vendor marks as delivered** → Order status: `delivered`

## Order Status Flow
```
pending → accepted → in-progress → delivering → delivered
```

## API Endpoints

### Orders (User)
- `POST /api/orders/create` - Create new order
- `GET /api/orders/user` - Get user's orders

### Vendor
- `GET /api/vendor/available-orders` - Get pending orders
- `POST /api/vendor/accept-order` - Accept an order
- `POST /api/vendor/update-status` - Update order status
- `GET /api/vendor/my-orders` - Get vendor's accepted orders

## Database Schema

### Orders Collection
```javascript
{
  _id: ObjectId,
  userEmail: String,
  items: Array,
  total: Number,
  deliveryAddress: String,
  status: String, // pending, accepted, in-progress, delivering, delivered
  vendorId: String, // vendor email
  createdAt: Date,
  acceptedAt: Date,
  updatedAt: Date
}
```

## Pages Created
- `/vendor/dashboard` - Vendor dashboard
- `/orders/track` - User order tracking

## Features
- Real-time order updates (10s polling)
- Order status tracking with visual progress
- Vendor can accept multiple orders
- Users can track all their orders
- Mobile responsive design

## How to Access
- **Users**: Click "Track Orders" in menu
- **Vendors**: Click "Become a vendor" banner in menu
