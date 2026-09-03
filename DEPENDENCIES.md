# Rangkuman Dependensi & Pustaka Proyek (Delivery Dashboard Gudang)

Dokumen ini merangkum seluruh **dependencies**, **libraries**, dan **tools** yang digunakan dalam pengembangan proyek **Delivery Dashboard Gudang - PT Gajah Tunggal Tbk**, dengan fokus mendalam pada komponen **Frontend**, serta ringkasan pada komponen pendukung lainnya.

---

## 1. Ringkasan Eksekutif & Filosofi Arsitektur

Frontend Delivery Dashboard Gudang dibangun dengan pendekatan **High Performance & Zero-Bloat**. Alih-alih menggunakan UI framework yang berat atau charting library berukuran besar (seperti Chart.js/Recharts/Highcharts yang menambah ukuran bundle hingga ratusan KB), frontend menggunakan:
- **React 19 & Vite 8** untuk performa rendering dan build ultra cepat.
- **Custom Native SVG Charts** untuk visualisasi data interaktif yang presisi dan ringan.
- **CSS Modules & CSS Variables** untuk modularitas styling tanpa runtime overhead (zero runtime CSS-in-JS).
- **Google Material Symbols** untuk konsistensi ikonografi sistem warehouse enterprise.

---

## 2. Rincian Dependensi Frontend (`frontend/package.json`)

### A. Production / Runtime Dependencies
Pustaka inti yang dimuat dan dijalankan langsung di browser pengguna:

| Nama Paket | Versi | Kategori | Penjelasan & Peran dalam Proyek |
| :--- | :--- | :--- | :--- |
| **`react`** | `^19.2.8` | Core Framework | Library utama berbasis komponen untuk membangun antarmuka pengguna deklaratif dan reaktif dengan Concurrent Mode terbaru. |
| **`react-dom`** | `^19.2.8` | DOM Renderer | Penghubung antara React Virtual DOM dengan DOM asli browser untuk manipulasi dan rendering elemen web. |
| **`react-router-dom`** | `^7.18.2` | Routing & Navigasi | Mengelola navigasi single-page application (SPA), route guard/layouting, URL parameters, dan filter routing pada dashboard. |
| **`material-symbols`** | `^0.46.0` | Iconography | Pustaka ikon resmi Google Material Symbols (Outlined, Rounded, Sharp) yang digunakan secara lokal/offline untuk seluruh tombol, status indikator, sidebar, dan filter. |

---

### B. Development Dependencies (DevTools & Build Tools)
Pustaka yang digunakan selama proses pengembangan, kompilasi, dan linting:

| Nama Paket | Versi | Kategori | Penjelasan & Peran dalam Proyek |
| :--- | :--- | :--- | :--- |
| **`vite`** | `^8.2.0` | Build Tool & Dev Server | Development server berbasis Native ESM super cepat dan module bundler modern dengan Rollup untuk produksi. |
| **`@vitejs/plugin-react`** | `^6.0.4` | Vite Plugin | Plugin resmi Vite untuk mendukung kompilasi JSX/TSX dengan Fast Refresh (HMR) saat development. |
| **`eslint`** | `^10.8.0` | Code Linter | Tool analisis statis untuk menjaga standar kualitas kode JavaScript/React di seluruh tim. |
| **`@eslint/js`** | `^10.0.1` | ESLint Config | Konfigurasi bawaan standar JavaScript dari ESLint. |
| **`eslint-plugin-react-hooks`**| `^7.1.1` | Linter Plugin | Menjamin aturan React Hooks (seperti dependensi `useEffect`, `useCallback`, `useMemo`) ditaati dengan benar. |
| **`eslint-plugin-react-refresh`**| `^0.5.3` | Linter Plugin | Memastikan komponen React aman untuk fitur Fast Refresh tanpa kehilangan state. |
| **`globals`** | `^17.7.0` | Linter Tooling | Daftar identifier variabel global (browser window, document, node) untuk konfigurasi ESLint flat config (`eslint.config.js`). |

---

## 3. Komponen & Utilitas Internal (Zero 3rd-Party Overhead)

Untuk menjaga dashboard tetap responsif di perangkat gudang/operasional, sejumlah fitur kompleks diimplementasikan secara mandiri tanpa library pihak ketiga tambahan:

### 1. Visualisasi Grafik & Peta (Custom SVG Engine)
- **Multi-Year Sales Trend**: Line chart berbasis native SVG (`<path>`, `<circle>`, `<linearGradient>`) dengan tooltip dinamis.
- **Supply Bottleneck & SO Status**: Bar chart & progress meter berbasis CSS Flexbox dan SVG dinamis.
- **Peta Distribusi Spasial**: Peta interaktif berbasis koordinat/vektor SVG untuk seluruh area distribusi Indonesia (Sumatera, Jawa, Bali, Kalimantan, Sulawesi, dll).

### 2. Styling & Desain Token
- **CSS Modules (`*.module.css`)**: Mencegah tabrakan nama class (scoped styles).
- **CSS Design Tokens (`src/styles/variables.css`)**: Menyediakan palet warna resmi Gajah Tunggal, standard spacing, shadow elevation, typography, dan responsive breakpoints.

### 3. State & Notification Management
- **Context API (`NotificationContext.jsx`)**: Global toast notification system tanpa perlu library eksternal seperti `react-toastify`.
- **Custom Hooks (`useDebounce`, `useNotification`)**: Utilitas internal untuk optimasi pencarian data dan trigger notifikasi.

---

## 4. Rincian Dependensi Backend (`backend/go.mod`)

| Komponen | Versi | Penjelasan |
| :--- | :--- | :--- |
| **`Go (Golang)`** | `1.26.5` / `1.24+` | Bahasa backend utama dengan performa tinggi dan konsumsi memori rendah. |
| **Standard Library (`net/http`, `encoding/json`, `database/sql`)** | Bawaan Go | Digunakan untuk REST API endpoint, handler routing, dan pemrosesan data gudang. |

---

## 5. Ringkasan Ukuran & Keuntungan Dependensi

| Keunggulan | Dampak Teknis |
| :--- | :--- |
| **Bundle Size Minimal** | Total bundle frontend sangat kecil (< 200 KB gzipped) sehingga loading dashboard instan bahkan pada jaringan gudang yang terbatas. |
| **Bebas Kerentanan (Zero CVE Dependency)** | Jumlah dependencies yang sangat ramping meminimalisir risiko keamanan (security vulnerability) dan masalah dependensi usang (dependency hell). |
| **Kemudahan Maintenance** | Tidak tergantung pada library grafik pihak ketiga yang sering mengalami breaking change pada update mayor React. |
