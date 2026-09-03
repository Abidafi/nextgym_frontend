# NextGym 🏋️‍♂️ - "Rent Sports & Outdoor Gear Instantly"

[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-red?style=flat&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.21-blue.svg)](https://www.postgresql.org/)
[![Stripe JS](https://img.shields.io/badge/Stripe%20JS-blueviolet?style=flat&logo=stripe&logoColor=white)](https://stripe.com/docs/stripe-js)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

## 📋 Overview

**NextGym** is a Frontend built for a sports and outdoor equipment rental service, designed and developed as a complete system implementation. Customers can browse available gear, place rental orders, make secure payments, and return equipment. Providers manage their gear inventory and fulfill rental orders, while Admins oversee the platform, manage users, and moderate listings.

🔗 **Live Frontend URL:** https://nextgym-frontend.onrender.com/

## 🛠️ Tech Stack

<div align="left" style="background-color: #f4f6f9; padding: 10px; border-radius: 8px;">

| Technology | Purpose |
|------------|---------|
| **Next.js** (App Router) | React Framework, Routing, Server Components |
| **TypeScript** | Type safety (Mandatory) |
| **Tailwind CSS** | Styling |
| **TanStack Query (React Query)** | Server state management and data fetching |
| **Auth.js** or **Custom JWT Middleware** | Authentication and protected routes |
| **Stripe.js** | Frontend payment gateway integration |

</div>

## 👥 Roles & Permissions

<div align="left" style="background-color: #f4f6f9; padding: 10px; border-radius: 8px;">

| Role | Description | Frontend UI Expectations |
|------|-------------|-----------------|
| **Customer** | Users who rent sports gear | Public browsing, Protected Customer Dashboard, interactive date-pickers for rentals, checkout/payment flow, order tracking dashboard, review submission. |
| **Provider** | Gear vendors/rental shops | Protected provider dashboard, gear CRUD forms (with image upload UI), order management tables with status-update actions. |
| **Admin** | Platform moderators | Protected admin dashboard, user management tables (suspend/activate actions), global platform statistics, content moderation UI. |
</div>

## ✨ Features

### Customer Features

* Registration and login forms with validation error messages.
* Place rental orders specifying items and dates. 
* Secure payments integration via Stripe. 
* Track rental order status and view payment history. 
* Leave ratings and reviews after returning equipment. 

### Provider Features

* Add, update, and remove gear items from personal inventory. 
* Monitor stock levels and availability. 
* View and process incoming customer rental orders (confirm). 

### Admin Features

* Comprehensive user management (view, suspend, or activate users). 
* Oversight of platform-wide gear listings and rental orders. 
* Category administration. 
  

## GearUp - API Integration & Route Mapping

This document maps the Next.js frontend pages and components to the deployed Render backend API endpoints.

## 1. Authentication
| Method | Endpoint | Description | Frontend Component/Action |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register new user (customer/provider) | `src/app/auth/register/page.tsx` |
| **POST** | `/api/auth/login` | Login user, return JWT | `src/app/auth/login/page.tsx` |

## 2. Gear (Public)
| Method | Endpoint | Description | Frontend Component/Action |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/gear` | Get all gear with filters (category, price, brand) | `src/app/gear/page.tsx` |
| **GET** | `/api/gear/:id` | Get gear details | `src/app/gear/[id]/page.tsx` |

## 3. Rental Orders
| Method | Endpoint | Description | Frontend Component/Action |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/rentals` | Create new rental order | Gear Details "Rent Now" CTA |
| **GET** | `/api/rentals` | Get user's rental orders | `src/app/dashboard/customer/page.tsx` |
| **GET** | `/api/rentals/:id` | Get rental order details | Order Details View |

## 4. Payments (Stripe)
| Method | Endpoint | Description | Frontend Component/Action |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/payments/create` | Create a payment intent/session for a rental order | `src/app/dashboard/customer/orders/[id]/pay/page.tsx` |
| **POST** | `/api/payments/confirm` | Confirm/verify payment (webhook or callback) | `/payment/success` handling |
| **GET** | `/api/payments` | Get user's payment history | Customer Dashboard Payment Tab |

## 5. Provider Management
| Method | Endpoint | Description | Frontend Component/Action |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/provider/gear` | Add gear to inventory | `src/app/dashboard/provider/gear/new/page.tsx` |
| **PUT** | `/api/provider/gear/:id` | Update gear listing | Provider Edit Gear Form |
| **DELETE** | `/api/provider/gear/:id` | Remove gear from inventory | Provider Inventory Table |
| **GET** | `/api/provider/orders` | Get provider's incoming orders | Provider Orders Management |
| **PATCH** | `/api/provider/orders/:id` | Update rental order status | Provider Status Action Buttons |

## 6. Reviews
| Method | Endpoint | Description | Frontend Component/Action |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/reviews` | Create review (after rental return) | Customer Review Submission Form |

## 7. Admin
| Method | Endpoint | Description | Frontend Component/Action |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/admin/users` | Get all users | `src/app/dashboard/admin/page.tsx` |
| **PATCH** | `/api/admin/users/:id` | Update user status (suspend/activate) | Admin User Management Table |
| **GET** | `/api/admin/gear` | Get all gear listings | Admin Content Moderation |
| **GET** | `/api/admin/rentals` | Get all rental orders | Admin Platform Rentals View |

## Axios Global Client Configuration (`src/lib/axios.ts`)

All API requests are routed through a centralized Axios instance configured with base URLs and automatic Authorization header injection:

```ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
```

---

## 🚀 Deployment Guide (Render)

Follow these steps to deploy the NextJS & TypeScript Frontend to **Render**.

### Step 1: Create Render Web Service

1. Log into the [Render Dashboard](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub account and select the required repository.

### Step 2: Configure Web Service

Fill out the configuration dashboard with the following settings:

| Field | Configuration Value |
| :--- | :--- |
| **Name** | `Relavent Name` |
| **Region** | Select closest region (e.g., `Oregon (US West)`) |
| **Branch** | `main` |
| **Root Directory** | *Leave blank* |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### Step 3: Environment Variables

Navigate to the **Environment** tab (or click **Advanced**) and inject your keys:

* `NEXT_PUBLIC_API_URL` = `Your required input from .env.local file`
* `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `Your required input from .env.local file`

> ⚠️ **Note:** Do not add `PORT` manually. Render handles its own internal port allocation.

### Step 4: Deploy 

1. Click **Deploy Web Service**.
2. Monitor the **Logs** tab. Success is confirmed when you see your initialization logs:
   
   ```text
   Your service is live 🎉
   Available at your primary URL https://nextgym-frontend.onrender.com

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Md. Abidur Rahman  
