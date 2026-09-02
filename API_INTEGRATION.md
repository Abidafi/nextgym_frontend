# GearUp - API Integration & Route Mapping

This document maps the Next.js frontend pages and components to the deployed Render backend API endpoints.

## 1. Authentication
| Method | Endpoint | Description | Frontend Component/Action |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register new user (customer/provider) | `src/app/auth/register/page.tsx` |
| **POST** | `/api/auth/login` | Login user, return JWT | `src/app/auth/login/page.tsx` |
| **GET** | `/api/auth/me` | Get current authenticated user | Global Layout / Auth Context |

## 2. Gear (Public)
| Method | Endpoint | Description | Frontend Component/Action |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/gear` | Get all gear with filters (category, price, brand) | `src/app/gear/page.tsx` |
| **GET** | `/api/gear/:id` | Get gear details | `src/app/gear/[id]/page.tsx` |
| **GET** | `/api/categories` | Get all gear categories | Gear Catalog Filter Sidebar |

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
| **GET** | `/api/payments/:id` | Get payment details | Payment Receipt View |

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