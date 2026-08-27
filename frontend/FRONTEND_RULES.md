# Frontend Development Guidelines & Architecture Rules
**Project:** Delivery Dashboard Gudang (Gajah Tunggal)  
**Tech Stack:** React 19 + JavaScript (JSX) + Vite

---

## 1. Prinsip Utama (Core Principles)

1. **Pure React JavaScript (JSX)**: Semua komponen dibuat menggunakan format **`.jsx`** dan utilitas/hook/service menggunakan format **`.js`**. Tidak menggunakan TypeScript ataupun folder tipe data (`types/`).
2. **Strict No-Inline-CSS**: Dilarang keras menulis styling inline (`style={{ ... }}`). Semua styling wajib ditempatkan pada file CSS terpisah menggunakan **CSS Modules** (`*.module.css`) atau CSS Variables global.
   * *Pengecualian*: Properti dengan nilai yang murni dihitung secara runtime dinamis (misal: persentase progress bar `style={{ width: `${progress}%` }}`).
3. **Feature & Page Encapsulation**: Kode spesifik halaman (API call, custom hook, sub-komponen, CSS module) dikemas di dalam folder halaman masing-masing.
4. **Clean Separation of Concerns**: JSX murni untuk rendering UI. Logika bisnis, pemanggilan API, dan manipulasi data wajib berada di custom hook atau service layer.

---

## 2. Struktur Direktori Proyek (JSX Structure)

```text
frontend/src/
├── assets/                          # Static assets (gambar, logo Gajah Tunggal, ilustrasi)
├── components/                      # Global Reusable Components
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   └── Button.module.css
│   │   ├── SearchBar/
│   │   │   ├── SearchBar.jsx
│   │   │   └── SearchBar.module.css
│   │   ├── Modal/
│   │   │   ├── Modal.jsx
│   │   │   └── Modal.module.css
│   │   ├── Notification/            # Toast / Pop-up Notification Component
│   │   │   ├── Toast.jsx
│   │   │   └── Toast.module.css
│   │   ├── Badge/                   # Status badge (Pending, Delivered, Cancel, dll)
│   │   │   ├── Badge.jsx
│   │   │   └── Badge.module.css
│   │   ├── Table/                   # Reusable Table & Pagination
│   │   │   ├── DataTable.jsx
│   │   │   └── DataTable.module.css
│   │   └── Icon/                    # Material Symbols Icon Wrapper Component
│   │       ├── Icon.jsx
│   │       └── Icon.module.css
│   └── index.js                     # Barrel export komponen common
│
├── layouts/                         # Shell & Template Layout Aplikasi
│   ├── MainLayout/
│   │   ├── MainLayout.jsx           # Wrapper layout (Sidebar + Header + Outlet)
│   │   └── MainLayout.module.css
│   ├── Header/
│   │   ├── Header.jsx               # Topbar (Judul "Delivery Dashboard", Search, Notifikasi, User)
│   │   └── Header.module.css
│   ├── Sidebar/
│   │   ├── Sidebar.jsx              # Navigasi modul gudang (Dashboard, dll)
│   │   └── Sidebar.module.css
│   └── AuthLayout/                  # Layout untuk halaman login/otentikasi
│
├── pages/                           # Halaman / Fitur Utama (Encapsulated)
│   ├── Auth/
│   │   ├── LoginPage.jsx
│   │   └── LoginPage.module.css
│   ├── Dashboard/
│   │   ├── components/              # Sub-komponen khusus halaman Dashboard
│   │   │   ├── SummaryCards.jsx
│   │   │   └── SummaryCards.module.css
│   │   ├── hooks/                   # Custom hook logika lokal Dashboard
│   │   │   └── useDashboard.js
│   │   ├── api/                     # Endpoint API khusus Dashboard
│   │   │   └── dashboardApi.js
│   │   ├── DashboardPage.jsx
│   │   └── DashboardPage.module.css
│   ├── DeliverySchedule/           # Modul Jadwal Pengiriman
│   ├── StockOut/                    # Modul Pengeluaran Barang
│   └── WarehouseMonitoring/         # Modul Monitoring Gudang
│
├── routes/                          # Manajemen Routing & Navigasi
│   ├── AppRoutes.jsx                # Definisi route tree
│   └── ProtectedRoute.jsx           # Route Guard untuk memeriksa JWT Token
│
├── services/                        # Konfigurasi Network & HTTP Client
│   ├── apiClient.js                 # Axios instance dengan JWT Interceptors
│   ├── authService.js               # Login, Refresh Token, Logout methods
│   └── tokenStorage.js              # Utilitas simpan/ambil JWT dari LocalStorage
│
├── context/                         # Global State Management via Context API
│   ├── AuthContext.jsx              # User state, login/logout session
│   └── NotificationContext.jsx      # Global Toast/Alert Notification Dispatcher
│
├── hooks/                           # Global Reusable Custom Hooks
│   ├── useAuth.js                   # Shortcut hook untuk AuthContext
│   ├── useNotification.js           # Shortcut hook untuk trigger Toast
│   └── useDebounce.js               # Debouncing input pencarian
│
├── styles/                          # Global Styles & Design Tokens
│   ├── variables.css                # CSS Variables (Color palette, font, spacing, shadow)
│   ├── reset.css                    # CSS Normalize/Reset
│   └── global.css                   # Global class & Material Symbols font config
│
└── utils/                           # Helper Functions (Format Date, Rupiah, Format Angka)
    ├── dateUtils.js
    └── formatters.js
```

---

## 3. Design Tokens & Acuan Color Palette

Semua warna wajib menggunakan CSS Custom Properties yang didefinisikan di `src/styles/variables.css`:

```css
:root {
  /* Primary & Accent (Industrial Automotive/Warehouse Theme) */
  --color-primary: #003b73;         /* Deep Corporate Navy */
  --color-primary-light: #0074d9;   /* Hover & Active elements */
  --color-primary-dark: #001f3f;    /* Sidebar & High-contrast surfaces */
  --color-secondary: #ff851b;       /* Warehouse Accent Orange (Highlights/CTAs) */

  /* Neutrals & Surfaces */
  --color-bg-main: #f4f6f9;         /* Latar belakang konten utama */
  --color-bg-surface: #ffffff;      /* Latar kartu, modal, tabel */
  --color-text-main: #1a202c;       /* Teks utama */
  --color-text-muted: #718096;      /* Teks sekunder, placeholder */
  --color-border: #e2e8f0;          /* Garis pemisah & border */

  /* Status Indicators (Semantics) */
  --color-success: #2ecc40;         /* "Delivered" / "Ready" / "Selesai" */
  --color-warning: #ffb700;         /* "In Transit" / "Pending" / "Loading" */
  --color-danger: #ff4136;          /* "Delayed" / "Canceled" / "Error" */
  --color-info: #39cccc;            /* "Scheduled" / "Draft" */

  /* Elevation & Borders */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-card: 0 2px 6px rgba(0, 0, 0, 0.05);
  --shadow-modal: 0 10px 30px rgba(0, 0, 0, 0.15);
}
```

---

## 4. Google Material Symbols Outlined Setup (Offline / Self-Hosted)

Aplikasi **wajib berjalan 100% offline** tanpa ketergantungan CDN online Google Fonts (`fonts.googleapis.com`). Icon Material Symbols Outlined di-bundle secara lokal melalui npm package:

```bash
npm install material-symbols
```

Import CSS font lokal di `src/styles/global.css`:
```css
@import 'material-symbols/outlined.css';
```

### Icon Component Wrapper (`src/components/common/Icon/Icon.jsx`)
```jsx
import React from 'react';
import styles from './Icon.module.css';

export const Icon = ({ name, size = 20, color, className = '' }) => {
  return (
    <span 
      className={`material-symbols-outlined ${styles.icon} ${className}`}
      style={{ fontSize: `${size}px`, color: color }}
    >
      {name}
    </span>
  );
};
```

---

## 5. JWT Authentication & HTTP Client Setup

### 5.1. Token Storage (`src/services/tokenStorage.js`)
```javascript
const ACCESS_TOKEN_KEY = 'gt_access_token';
const REFRESH_TOKEN_KEY = 'gt_refresh_token';

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
```

### 5.2. Axios Instance dengan Request/Response Interceptors (`src/services/apiClient.js`)
```javascript
import axios from 'axios';
import { tokenStorage } from './tokenStorage.js';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      tokenStorage.clearTokens();
      window.location.href = '/login?session_expired=true';
    }
    return Promise.reject(error);
  }
);
```

---

## 6. Routing System & Protected Route Rules

Gunakan **React Router v7 / v6** dengan pola Nested Layout dan Route Guards.

### 6.1. Route Guard Component (`src/routes/ProtectedRoute.jsx`)
```jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading session...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
```

### 6.2. Route Tree Structure (`src/routes/AppRoutes.jsx`)
```jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout/MainLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

import { LoginPage } from '../pages/Auth/LoginPage.jsx';
import { DashboardPage } from '../pages/Dashboard/DashboardPage.jsx';
import { DeliverySchedulePage } from '../pages/DeliverySchedule/DeliverySchedulePage.jsx';
import { StockOutPage } from '../pages/StockOut/StockOutPage.jsx';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes inside Main Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/delivery-schedule" element={<DeliverySchedulePage />} />
          <Route path="/stock-out" element={<StockOutPage />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
```

---

## 7. Global Notification / Toast System

Setiap aksi (Create, Update, Delete, Error Fetch) harus memberikan feedback menggunakan Toast Notification melalui `NotificationContext`:

```jsx
// Contoh pemanggilan di komponen atau hook:
const { showNotification } = useNotification();

showNotification({
  type: 'success', // 'success' | 'warning' | 'danger' | 'info'
  title: 'Pengiriman Berhasil',
  message: 'Surat jalan #SJ-2026-08-001 telah berhasil diperbarui.',
});
```

---

## 8. Checklist Development untuk Developer

- [ ] Menggunakan ekstensi `.jsx` untuk file komponen dan `.js` untuk logic/hook/service.
- [ ] Tidak ada penggunaan inline styling (`style={{ ... }}`) kecuali nilai kalkulasi murni.
- [ ] Setiap komponen memiliki file `.module.css` sendiri.
- [ ] Seluruh pemanggilan endpoint API ditaruh di folder `api/` atau `services/`, bukan di dalam JSX.
- [ ] Icon menggunakan komponen `<Icon name="nama_icon" />` yang di-load secara offline (`material-symbols`).
- [ ] Request API memanfaatkan instance `apiClient` yang telah terinjeksi JWT Bearer token.
- [ ] Halaman baru didaftarkan di `src/routes/AppRoutes.jsx`.
- [ ] Semua state loading, error, dan data kosong (empty state) ditangani secara eksplisit pada UI.