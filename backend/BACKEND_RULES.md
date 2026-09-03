# Backend Development Guidelines & Architecture Rules
**Project:** Delivery Dashboard Gudang (PT Gajah Tunggal Tbk)  
**Tech Stack:** Go (Golang 1.24+) + Package-by-Feature (Vertical Slice Architecture) + GORM (MySQL) + JWT Auth

---

## 1. Prinsip Utama (Core Principles)

1. **Package-by-Feature (Vertical Slice Architecture)**: Setiap domain/fitur dibungkus dalam modul mandiri di dalam `internal/modules/<feature_name>/` yang memiliki `model.go`, `repository.go`, `service.go`, `handler.go`, dan `seeder.go` masing-masing.
2. **Stateless JWT Authentication**: Setiap request dilindungi melalui Bearer token JWT (`Authorization: Bearer <token>`) yang diverifikasi pada middleware. Payload token memuat data `user_id`, `username`, `role` (`'warehouse'` / `'executive'`), dan `warehouse_id`.
3. **Multi-Warehouse Isolation**: Akses data terisolasi berdasarkan entitas gudang aktif pengguna (`APW`, `BPW`, `DPW`, `RPW`) atau akses menyeluruh untuk role `'executive'`.
4. **Standardized API Response**: Seluruh endpoint wajib mengembalikan format respons JSON seragam:
   ```json
   {
     "success": true,
     "message": "Deskripsi hasil",
     "data": { ... },
     "error": "Pesan error jika gagal"
   }
   ```

---

## 2. Struktur Direktori Backend (Package-by-Feature / Vertical Slice)

```text
backend/
├── cmd/
│   ├── server/
│   │   └── main.go                  # Entrypoint HTTP Server Backend (Port 5000)
│   └── seeder/
│       └── main.go                  # CLI Seeder Data (Warehouse, Users, Order PPC)
│
├── config/
│   ├── config.go                    # Konfigurasi App, Port, JWT, MySQL Credentials
│   └── database.go                  # Inisialisasi GORM MySQL & AutoMigrate
│
├── internal/
│   ├── middleware/
│   │   ├── auth_middleware.go       # JWT Bearer Authentication Guard
│   │   └── cors_middleware.go       # CORS & Preflight OPTIONS Handler
│   │
│   ├── routes/
│   │   └── routes.go                # Central Router Wiring (/api/v1/...)
│   │
│   ├── modules/
│   │   ├── warehouse/               # Modul Master Gudang (APW, BPW, DPW, RPW)
│   │   │   ├── model.go             # Struct Warehouse (Tabel: warehouses)
│   │   │   ├── repository.go        # Data Access Layer Gudang
│   │   │   ├── service.go           # Business Logic Gudang
│   │   │   ├── handler.go           # HTTP Handler / Controller
│   │   │   └── seeder.go            # Seeder 4 Master Gudang
│   │   │
│   │   ├── auth/                    # Modul Pengguna & Autentikasi
│   │   │   ├── model.go             # Struct User (Tabel: users) & Auth DTOs
│   │   │   ├── repository.go        # Data Access Layer User
│   │   │   ├── service.go           # Business Logic Auth & Token JWT
│   │   │   ├── service_test.go      # Unit Test Layanan Auth
│   │   │   ├── handler.go           # HTTP Handler (Login, GetMe, Presets, Logout)
│   │   │   └── seeder.go            # Seeder 5 Akun Master User
│   │   │
│   │   └── order_ppc/               # Modul Transaksi PPC Sales Order
│   │       ├── model.go             # Struct OrderPPCWH (Tabel: order_ppc_wh)
│   │       ├── repository.go        # Data Access Transaksi (Filter Warehouse & Pagination)
│   │       ├── service.go           # Business Logic Transaksi PPC
│   │       ├── handler.go           # HTTP Handler (/api/v1/orders)
│   │       └── seeder.go            # Parser data SO.csv & Batch Seeder
│   │
│   └── pkg/                         # Reusable Shared Utilities
│       ├── jwt/
│       │   └── jwt.go               # GenerateToken & ValidateToken
│       ├── password/
│       │   └── password.go          # HashPassword & CheckPassword (Bcrypt)
│       └── response/
│           └── response.go          # JSONSuccess, JSONError, JSONBadRequest, dll.
│
├── db/
│   └── schema.sql                   # MySQL DDL Skema Relasional
│
├── go.mod                           # Go Module & Dependencies (GORM, MySQL driver, crypto)
└── go.sum
```

## 3. Spesifikasi Endpoint API Aktif

### 1. Auth API
* `POST /api/v1/auth/login` (Public) - Login pengguna & menerbitkan token JWT
* `GET /api/v1/auth/me` (Protected) - Mendapatkan profil pengguna aktif
* `GET /api/v1/auth/presets` (Public) - Daftar preset akun pengguna untuk dev switcher
* `POST /api/v1/auth/logout` (Public) - Logout pengguna

### 2. Warehouse API
* `GET /api/v1/warehouses` (Public) - Daftar master gudang operasional (APW, BPW, DPW, RPW)
* `GET /api/v1/warehouses/{id}` (Public) - Detail informasi master gudang

### 3. Order PPC API
* `GET /api/v1/orders` (Protected) - Query transaksi PPC (`warehouse_id`, `page`, `page_size`)

