# Dokumentasi Teknis Spesifikasi Desain UI & Komponen Dashboard Gudang & Delivery
**Proyek:** Delivery & Warehouse Dashboard System  
**Klien / Domain:** PT Gajah Tunggal Tbk  
**Format Komponen:** Modular Component-Driven Architecture  
**Target Pembaca:** Frontend Engineer, UI/UX Designer, Backend/API Engineer

---

## DAFTAR ISI
1. [Arsitektur & Konsep Modularitas](#1-arsitektur--konsep-modularitas)
2. [Global Header & Filter Metrics (Top Bar Section)](#2-global-header--filter-metrics-top-bar-section)
   - [2.1 Komponen: Working Day Indicator](#21-komponen-working-day-indicator)
   - [2.2 Komponen: Target MTD Indicator](#22-komponen-target-mtd-indicator)
   - [2.3 Komponen: Filter Periode](#23-komponen-filter-periode)
   - [2.4 Komponen: Cascading Filter Penjualan & Produk](#24-komponen-cascading-filter-penjualan--produk)
3. [Spesifikasi Teknis Komponen Visualisasi & Chart](#3-spesifikasi-teknis-komponen-visualisasi--chart)
   - [3.1 Chart A: Multi-Year Sales Trend](#31-chart-a-multi-year-sales-trend)
   - [3.2 Chart B: Sales Order Status Overview](#32-chart-b-sales-order-status-overview)
   - [3.3 Chart C: Actual Sales vs Supply Plan per Kategori Ban](#33-chart-c-actual-sales-vs-supply-plan-per-kategori-ban)
   - [3.4 Chart D: Pencapaian Target Penjualan per Area](#34-chart-d-pencapaian-target-penjualan-per-area)
   - [3.5 Chart E: Peta Distribusi Pencapaian Target Spasial (Choropleth Map)](#35-chart-e-peta-distribusi-pencapaian-target-spasial-choropleth-map)
   - [3.6 Chart F: Top 5 SKU Supply Plan Terendah (Bottleneck)](#36-chart-f-top-5-sku-supply-plan-terendah-bottleneck)
   - [3.7 Chart G: Status Sales Order Masuk Gudang](#37-chart-g-status-sales-order-masuk-gudang)
   - [3.8 Chart H: Rencana Kirim Armada Hari Ini](#38-chart-h-rencana-kirim-armada-hari-ini)
   - [3.9 Chart I: Rincian Distribusi Kirim per Provinsi](#39-chart-i-rincian-distribusi-kirim-per-provinsi)
   - [3.10 Chart J: Preview SO per Area (Khusus Tipe REP / Replacement)](#310-chart-j-preview-so-per-area-khusus-tipe-rep--replacement)
4. [Matriks Relasi Interaktivitas & State Management](#4-matriks-relasi-interaktivitas--state-management)
5. [Standar Desain & Design Tokens (Industrial Logistics Theme)](#5-standar-desain--design-tokens-industrial-logistics-theme)

---

## 1. Arsitektur & Konsep Modularitas

Dokumentasi ini disusun dengan pendekatan **Atomic Component-Driven Architecture**. Setiap kartu, filter, chart, dan indikator dirancang sebagai komponen mandiri (*self-contained module*) yang memiliki:
- **Scope & Tujuan Komponen**
- **Format Visual & Tipe Chart**
- **Data Contract / Props Definition**
- **Business Logic & Formula Kalkulasi**
- **Filter Dependency & Interactivity Handling**
- **State Visual (Loading, Empty, Error State)**

---

## 2. Global Header & Filter Metrics (Top Bar Section)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Working Day: Hari ke-15 dari 22 Hari Kerja - Agustus 2026]   [Target MTD: 68.18% / 34,090 Pcs]        │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [Periode: (o) Bulan Berjalan  ( ) Bulan Kemarin  ( ) Historikal]                                       │
│ [Tipe Penjualan: [ REP ▾ ]]  ──cascades──>  [Tipe Produk: [ Tire ▾ ] (Active: Tire, Tube)]             │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Komponen: Working Day Indicator
* **ID Komponen:** `C-TOP-01-WD`
* **Tipe Komponen:** Metric Badge / Text Pill with Calendar Icon.
* **Tujuan:** Memberikan konteks operasional hari kerja aktif bagi pimpinan gudang dan logistik untuk mengukur kecepatan (*pacing*) ritme pengiriman.
* **Format Teks:** `"Hari ke-{currentWorkingDay} dari {totalWorkingDays} Hari Kerja - {currentMonthName} {currentYear}"`
* **Contoh Output:** `"Hari ke-15 dari 22 Hari Kerja - Agustus 2026"`
* **Business Logic:**
  - Hari libur nasional dan hari Minggu dihitung sebagai *Non-Working Day*.
  - Nilai didapatkan dari kalender operasional pabrik Gajah Tunggal.
* **Data Contract:**
  ```json
  {
    "currentWorkingDay": 15,
    "totalWorkingDays": 22,
    "month": "Agustus",
    "year": 2026
  }
  ```

---

### 2.2 Komponen: Target MTD Indicator
* **ID Komponen:** `C-TOP-02-MTD`
* **Tipe Komponen:** Target Metric Card with Progress Gauge / Sub-text.
* **Tujuan:** Menampilkan target kumulatif penjualan proporsional hingga hari kerja berjalan.
* **Formula Kalkulasi:**
  $$\text{Target MTD} = \left( \frac{\text{Target Keseluruhan}}{\text{Hari Kerja Keseluruhan}} \right) \times \text{Hari Kerja Berjalan (Current)}$$
* **Variabel Data:**
  - `totalTarget`: Target volume penjualan 1 bulan penuh (Pcs).
  - `totalWorkingDays`: Total hari kerja dalam bulan berjalan.
  - `currentWorkingDay`: Hari kerja aktif saat ini.
* **Contoh Kalkulasi:**
  - Target Bulanan = $50.000\text{ Pcs}$
  - Hari Kerja Keseluruhan = $22\text{ Hari}$
  - Hari Kerja Berjalan = $15\text{ Hari}$
  - $\text{Target MTD} = \left(\frac{50.000}{22}\right) \times 15 = 34.090,91 \approx 34.091\text{ Pcs}$ ($68,18\%$)
* **Visual Display:**
  - Nilai Nominal: `34.091 Pcs`
  - Persentase Target Waktu: `68.2% of Full Month Target`

---

### 2.3 Komponen: Filter Periode
* **ID Komponen:** `C-TOP-03-PERIOD`
* **Tipe Komponen:** Segmented Control / Button Group Selector.
* **Opsi Pilihan:**
  1. `CURRENT_MONTH` ("Bulan Berjalan") — *Default*
  2. `LAST_MONTH` ("Bulan Kemarin")
  3. `HISTORICAL` ("Historikal") — Membuka Date Range Picker (Bulan/Tahun).
* **Interaktivitas:**
  - Mengubah opsi periode akan men-trigger *re-fetch* atau *re-filter* pada seluruh chart dashboard (Chart A hingga Chart J).

---

### 2.4 Komponen: Cascading Filter Penjualan & Produk
* **ID Komponen:** `C-TOP-04-CASCADE-FILTER`
* **Tipe Komponen:** 2-Tier Cascading Dropdown / Chip Selectors.
* **Field 1 (Tipe Penjualan / Sales Type):**
  - Opsi: `Replacement (REP)`, `Export (EXP)`, `OEM (Original Equipment Manufacturer)`.
  - Default: `Replacement (REP)`.
* **Field 2 (Tipe Produk / Product Type):**
  - Opsi Master: `Tire` (Ban Luar), `Tube` (Ban Dalam), `RIM Band` (Selendang Ban).
* **Dependency & State Cascading Rule Matrix:**

| Pilihan Tipe Penjualan | Opsi Tipe Produk yang Aktif | Status Opsi Lain | Default Terpilih |
| :--- | :--- | :--- | :--- |
| **Replacement (REP)** | `Tire`, `Tube` | `RIM Band` disembunyikan/disabled | `Tire` |
| **Export (EXP)** | `Tire` | `Tube` & `RIM Band` disembunyikan/disabled | `Tire` (Terkunci) |
| **OEM** | `RIM Band` | `Tire` & `Tube` disembunyikan/disabled | `RIM Band` (Terkunci) |

* **Efek Terhadap UI:**
  - Saat user memilih `EXP`, dropdown Produk otomatis berganti ke `Tire` dan opsi `Tube` dinonaktifkan.
  - Saat user memilih `OEM`, dropdown Produk otomatis berganti ke `RIM Band` dan opsi ban dinonaktifkan.

---

## 3. Spesifikasi Teknis Komponen Visualisasi & Chart

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Chart A: Multi-Year Area]        │ [Chart B: SO Status Donut]    │ [Chart C: Actual vs Supply Bar]    │
├───────────────────────────────────┼───────────────────────────────┴────────────────────────────────────┤
│ [Chart D: Target per Area Bar]    │ [Chart E: Interactive Map Indonesia (Tube Type/Tubeless & Brand)]  │
├───────────────────────────────────┼───────────────────────────────┬────────────────────────────────────┤
│ [Chart F: Top 5 SKU Bottleneck]   │ [Chart G: SO Masuk Gudang]    │ [Chart H: Rencana Kirim Truk]      │
├───────────────────────────────────┴───────────────────────────────┼────────────────────────────────────┤
│ [Chart I: Distribusi Truk per Provinsi Column]                    │ [Chart J: Preview SO Area (REP)]   │
└───────────────────────────────────────────────────────────────────┴────────────────────────────────────┘
```

---

### 3.1 Chart A: Multi-Year Sales Trend
* **ID Komponen:** `CHART-A-SALES-TREND`
* **Tipe Visualisasi:** Multi-Line / Spline Area Chart with Gradient Fill.
* **Tujuan:** Menganalisis pola musiman (*seasonality*) pengiriman ban selama 3 tahun berturut-turut.
* **Dimensi Sumbu:**
  - **Sumbu X:** Bulan (Januari s.d. Desember).
  - **Sumbu Y:** Volume Penjualan / Pengiriman (Satuan: Ribuan Pcs / Tonase).
* **Series Data (3 Garis Area):**
  - Series 1: Tahun Berjalan ($N$, misal: 2026) — Warna: Solid Navy Blue (`#0074D9`), gradient opacity $0.3$.
  - Series 2: Tahun Sebelumnya ($N-1$, misal: 2025) — Warna: Slate Grey (`#718096`), dashed line.
  - Series 3: 2 Tahun Lalu ($N-2$, misal: 2024) — Warna: Light Grey (`#CBD5E0`), dotted line.
* **Interaktivitas & Tooltip:**
  - Hover pada titik bulan menampilkan: Nilai riil 3 tahun, selisih persentase YoY (*Year-over-Year growth*).
* **Data Contract:**
  ```json
  [
    { "month": "Jan", "year2024": 38000, "year2025": 42000, "year2026": 45000 },
    { "month": "Feb", "year2024": 39500, "year2025": 41000, "year2026": 47200 }
  ]
  ```

---

### 3.2 Chart B: Sales Order Status Overview
* **ID Komponen:** `CHART-B-SO-STATUS`
* **Tipe Visualisasi:** Donut Chart with Centered KPI Metric.
* **Tujuan:** Monitoring proporsi status seluruh Sales Order (SO) yang sedang berjalan di sistem penjualan.
* **Kategori Segmen Donat & Palet Warna:**
  1. `Closed` (Selesai Kirim/Faktur): Emerald Green (`#2ECC40`)
  2. `Booked` (Sudah Dialokasikan Stok): Industrial Corporate Navy (`#003B73`)
  3. `Awaiting Shipping` (Menunggu Antrian Muat): Warehouse Warning Amber (`#FFB700`)
* **Center Metric (Titik Tengah Donut):**
  - Label: `"Total SO"`
  - Value: Nilai kumulatif seluruh SO (Contoh: `1,284 SO`).
* **Interaktivitas:**
  - Klik pada slice status berfungsi sebagai *cross-filter* untuk menyorot baris tabel pengiriman terkait.

---

### 3.3 Chart C: Actual Sales vs Supply Plan per Kategori Ban
* **ID Komponen:** `CHART-C-ACTUAL-VS-SUPPLY`
* **Tipe Visualisasi:** Horizontal Grouped / Bullet Bar Chart.
* **Tujuan:** Membandingkan realisasi penjualan terhadap target pasokan (*Supply Plan*) untuk tiap lini varian ban.
* **Kategori Produk yang Ditampilkan:**
  - `IRC Tube Type` (2 Bar: Actual Sales vs Supply Plan)
  - `IRC Tubeless` (2 Bar: Actual Sales vs Supply Plan)
  - `Zeneos Tubeless` (2 Bar: Actual Sales vs Supply Plan)
* **Elemen Visual Bar per Kategori:**
  - **Bar 1 (Actual Sales):** Warna Solid Navy (`#003B73`).
  - **Bar 2 (Supply Plan Target):** Warna Striped / Secondary Orange (`#FF851B`).
  - **Data Label:**
    - Nilai volume Actual (Pcs) & Nilai Target Supply Plan (Pcs).
    - **Badge Persentase Pencapaian:**
      $$\text{Achievement \%} = \left( \frac{\text{Actual Sales}}{\text{Supply Plan}} \right) \times 100\%$$
      - Hijau jika $\ge 100\%$
      - Kuning jika $85\% - 99.9\%$
      - Merah jika $< 85\%$

---

### 3.4 Chart D: Pencapaian Target Penjualan per Area
* **ID Komponen:** `CHART-D-AREA-ACHIEVEMENT`
* **Tipe Visualisasi:** Sorted Horizontal Bar Chart.
* **Tujuan:** Evaluasi persentase pencapaian kuota penjualan per wilayah pemasaran.
* **Sumbu Data:**
  - **Sumbu Y:** Nama Area / Provinsi.
  - **Sumbu X:** Persentase Pencapaian Target ($0\% - 150\%$).
* **Dynamic Rule Berdasarkan Tipe Penjualan (Cascading):**
  1. Jika Tipe Penjualan = **`REP (Replacement)`**:
     - Menampilkan **seluruh 38 Provinsi di Indonesia** (disediakan *vertical scroll* / paginasi top-10).
  2. Jika Tipe Penjualan = **`OEM`**:
     - Hanya menampilkan **2 Entri**: `"Jawa Barat"` dan `"DKI Jakarta"`.
  3. Jika Tipe Penjualan = **`EXP (Export)`**:
     - Hanya menampilkan **1 Entri Tunggal**: `"International"`.
* **Benchmark Line:** Garis vertikal putus-putus pada titik $100\%$ target.

---

### 3.5 Chart E: Peta Distribusi Pencapaian Target Spasial (Choropleth Map)
* **ID Komponen:** `CHART-E-SPATIAL-MAP`
* **Tipe Visualisasi:** Interactive High-Resolution GeoJSON Choropleth Map (Peta Indonesia).
* **Tujuan:** Pemetaan geospasial realisasi target penjualan ban di setiap provinsi.
* **Skema Warna Monokromatik (Heat Intensity):**
  - Skema 1 Warna Navy Blue bertingkat:
    - $< 50\%$ Target: `#E1EDF8` (Sangat Muda)
    - $50\% - 75\%$: `#84B9E9` (Muda)
    - $75\% - 99\%$: `#2B78C5` (Sedang)
    - $\ge 100\%$ Target: `#003B73` (Navy Pekat)
* **Filter Internal Komponen (In-Card Controls):**
  1. **Toggle Konstruksi Ban (Kiri Atas):**
     - Opsi: `[ Tube Type ]` | `[ Tubeless ]`
  2. **Brand Selector Chips (Kanan Peta):**
     - Opsi: `[ GT ]`, `[ IRC ]`, `[ ZENEOS ]`
* **Business Rule Khusus (Keterkaitan Tube Type & Brand):**
  - **Kondisi:** Varian produk *Tube Type* **hanya diproduksi untuk brand IRC**.
  - **Aksi Otomatis:**
    - Jika user memilih toggle **`Tube Type`**, maka brand **`GT`** dan **`ZENEOS`** otomatis dibuat **disabled / hidden**.
    - Sistem mengunci (*auto-select*) filter brand hanya ke **`IRC`**.
    - Jika user mengembalikan toggle ke **`Tubeless`**, semua brand (`GT`, `IRC`, `ZENEOS`) aktif kembali.
* **Hover & Click Interactivity:**
  - **Hover Tooltip:** Menampilkan nama provinsi, volume penjualan riil (Pcs), target (Pcs), persentase pencapaian, dan brand leader.
  - **Click State:** Melakukan zoom ke provinsi terpilih dan memfilter Chart D & Chart I ke provinsi tersebut.

---

### 3.6 Chart F: Top 5 SKU Supply Plan Terendah (Bottleneck)
* **ID Komponen:** `CHART-F-BOTTLENECK-SKU`
* **Tipe Visualisasi:** Horizontal Bar Chart (Ranking).
* **Tujuan:** *Early warning system* untuk mendeteksi SKU ban yang mengalami defisit pasokan paling kritis dari pabrik ke gudang.
* **Filter Internal:**
  - Brand Filter: `[ ALL ]`, `[ GT ]`, `[ IRC ]`, `[ ZENEOS ]`
* **Metrik & Perhitungan:**
  - Nilai Bar: Rasio Pemenuhan Supply Plan ($\text{Fulfillment Rate} = \frac{\text{Supply Actual}}{\text{Supply Target}} \times 100\%$).
  - Diurutkan dari persentase **terendah ke tertinggi** (5 item paling bawah).
* **Indikator Warna Kritis:**
  - $< 50\%$: Crimson Red (`#FF4136`) — Kategori *Severe Shortage*
  - $50\% - 79\%$: Warning Amber (`#FFB700`) — Kategori *Moderate Deficit*
* **Label Data:** Menampilkan kode SKU, pola telapak (*pattern*, misal: `IRC NR73 80/90-14`), dan angka `% fulfillment`.

---

### 3.7 Chart G: Status Sales Order Masuk Gudang
* **ID Komponen:** `CHART-G-WAREHOUSE-SO`
* **Tipe Visualisasi:** Donut Chart with Legend Breakdown.
* **Tujuan:** Mengukur beban kerja antrian fisik muat barang di dalam gudang pengiriman.
* **Kategori Status:**
  1. `Awaiting Delivery`: Surat Jalan sudah terbit, menunggu armada tiba di loading dock (`#39CCCC`).
  2. `Awaiting Shipping`: Barang sedang di-staging/dicek fisik oleh operator (`#FFB700`).
  3. `Closed`: Barang telah selesai dimuat dan armada telah berangkat (`#2ECC40`).
* **Metrik yang Ditampilkan:**
  - Total SO masuk gudang.
  - Jumlah nominal SO dan persentase kontribusi masing-masing status terhadap total antrian.

---

### 3.8 Chart H: Rencana Kirim Armada Hari Ini
* **ID Komponen:** `CHART-H-DAILY-TRUCK-PLAN`
* **Tipe Visualisasi:** Vertical Column Chart.
* **Tujuan:** Monitoring ketersediaan dan utilisasi armada pengiriman harian.
* **Satuan Data:** **Jumlah Truk Engkel (Unit Armada)**.
* **Kategori Alur Muat (Sumbu X):**
  1. `Gulungan`: Order sisa hari sebelumnya yang belum termuat/tertunda (*Rollover Delivery*). Warna: Amber/Orange (`#FF851B`).
  2. `Loading Hari Ini`: Order terjadwal normal yang sedang/akan dimuat hari ini. Warna: Corporate Navy (`#003B73`).
  3. `Loading Selanjutnya`: Antrian order gelombang berikutnya untuk shift sore/malam. Warna: Sky Blue (`#0074D9`).
* **Tooltip Info:** Menampilkan jumlah armada truk engkel, estimasi kapasitas muatan (Pcs), dan alokasi pintu *loading dock*.

---

### 3.9 Chart I: Rincian Distribusi Kirim per Provinsi
* **ID Komponen:** `CHART-I-PROVINCE-TRUCK-DISTRIBUTION`
* **Tipe Visualisasi:** Vertical Column Chart with Multi-Filter.
* **Tujuan:** Evaluasi alokasi persebaran armada truk ke berbagai daerah tujuan distribusi.
* **Sumbu Data:**
  - **Sumbu X:** Provinsi Tujuan (Jawa Timur, Jawa Tengah, Bali, Lampung, Sumut, dll).
  - **Sumbu Y:** Jumlah Armada (Satuan: Truk Engkel).
* **Filter Internal Komponen:**
  - Segmented Filter: `[ ALL ]` | `[ Gulungan ]` | `[ Loading Hari Ini ]` | `[ Loading Selanjutnya ]`
* **Interaktivitas:**
  - Mengubah filter akan memperbarui visualisasi tinggi kolom sesuai status pengiriman truk ke provinsi tersebut.

---

### 3.10 Chart J: Preview SO per Area (Khusus Tipe REP / Replacement)
* **ID Komponen:** `CHART-J-REP-SO-PREVIEW`
* **Tipe Visualisasi:** Stacked Horizontal Bar Chart with Dual Reference Lines and Multi-Dimension In-Card Filters.
* **Tujuan:** Visualisasi komprehensif struktur antrian SO per area khusus kanal distribusi pasar *Replacement* (Toko Ban & Distributor Retail).
* **Kondisi Tampil (Conditional Rendering):**
  - **Wajib aktif & dirender HANYA KETIKA Tipe Penjualan = `Replacement (REP)`**.
  - Jika user memilih `OEM` atau `EXP`, komponen ini **disembunyikan (*unmounted*)** atau digantikan pesan notifikasi relevan.

#### A. Filter Internal Komponen (In-Card Header Controls)
Chart J dilengkapi dengan 3 kontrol filter independen pada card header:

1. **Filter Produk / Brand (Chip Selector):**
   - Opsi: `[ ALL ]`, `[ GTC ]`, `[ IRC ]`, `[ ZENEOS ]`
   - Default: `[ ALL ]`
   - Fungsi: Memfilter data antrian SO hanya untuk ban dari brand yang dipilih.

2. **Filter Tipe Produk / Konstruksi Ban (Segmented Toggle):**
   - Opsi: `[ ALL ]`, `[ TUBELESS ]`, `[ TUBE TYPE ]`
   - Default: `[ ALL ]`
   - **Aturan Relasi Brand & Tipe Produk:**
     - Karena varian *Tube Type* secara eksklusif hanya diproduksi oleh **IRC**, jika user memilih filter **`TUBE TYPE`**, maka pilihan brand **`GTC`** dan **`ZENEOS`** otomatis menjadi **disabled / non-aktif**, dan sistem secara otomatis mengunci (*auto-select*) filter brand ke **`IRC`**.
     - Jika dikembalikan ke **`TUBELESS`** atau **`ALL`**, seluruh pilihan brand (`GTC`, `IRC`, `ZENEOS`) dapat dipilih kembali.

3. **Filter Area / Provinsi (Searchable Multi-Select Dropdown):**
   - Opsi Default: `[ Seluruh Provinsi ]` (Menampilkan semua 38 provinsi di Indonesia yang sudah ada di database).
   - Custom Selection: User dapat memilih satu atau beberapa provinsi tertentu (misal: hanya ingin membandingkan *Jawa Barat*, *DKI Jakarta*, dan *Jawa Timur*).
   - Fitur Input: Dilengkapi fitur pencarian (*search box*) untuk mempermudah pencarian nama provinsi.

#### B. Dimensi & Data Visualisasi Sumbu
* **Sumbu Y:** Daftar Provinsi terpilih (atau seluruh 38 provinsi terurut berdasarkan total volume terbesar).
* **Sumbu X:** Jumlah Volume Sales Order (Pcs / Tonase).

#### C. Segmentasi Stacked Bar (3 Lapisan Warna)
Setiap batang horizontal pada chart merupakan akumulasi dari 3 lapisan status SO:
1. **Segmen 1 (Closed / Terkirim):** Warna Hijau (`#2ECC40`) — Order yang sudah terkirim ke distributor/toko.
2. **Segmen 2 (Loading Hari Ini):** Warna Navy (`#003B73`) — Order yang terjadwal dan sedang dalam proses muat hari ini.
3. **Segmen 3 (Gulungan):** Warna Orange (`#FF851B`) — Order tertunda dari hari sebelumnya yang belum termuat.

#### D. Target Reference Lines (2 Garis Benchmark Vertikal Utuh & Kontinu)
1. **Garis Target MTD (Month-to-Date):**
   - 1 Garis vertikal putus-putus berwarna Merah (`#FF4136`) dengan ketebalan `2px` yang membentang utuh dan kontinu melintasi seluruh daftar bar provinsi dari atas hingga bawah (tidak terpotong-potong per provinsi).
   - Posisi proporsional terhadap hari kerja berjalan (Contoh: Hari ke-15 dari 22 hari kerja = $68.2\%$).
2. **Garis Target EOW (End-of-Week):**
   - 1 Garis vertikal putus-putus berwarna Biru Terang (`#0074D9`) dengan ketebalan `2px` yang membentang utuh di sebelah kanan garis MTD.
   - **Aturan Relasi:** $\text{Target EOW} > \text{Target MTD}$ karena target mingguan terakumulasi hingga akhir minggu aktif (Contoh: $80.0\%$), dan batas target mingguan ini akan bergeser maju setiap pergantian minggu.

---

## 4. Matriks Relasi Interaktivitas & State Management

Berikut adalah tabel matriks dependensi state global dan lokal yang mengatur interaksi antar komponen:

| Event Trigger / Aksi User | Komponen Sumber | Komponen Terdampak | Perubahan State & Business Logic yang Dijalankan |
| :--- | :--- | :--- | :--- |
| **Ganti Periode** | `C-TOP-03-PERIOD` | Seluruh Chart (A s.d. J) | Mengirim parameter `period` ke API; merender ulang data historis/bulanan; mengkalkulasi ulang Hari Kerja & Target MTD. |
| **Pilih Tipe Penjualan = "EXP"** | `C-TOP-04-CASCADE-FILTER` | Filter Produk (`C-TOP-04`), Chart D, Chart J | 1. Filter Produk terkunci ke `Tire` (`Tube` & `RIM Band` disabled).<br>2. Chart D hanya menampilkan entri `"International"`.<br>3. Chart J otomatis di-*unmount* (hidden). |
| **Pilih Tipe Penjualan = "OEM"** | `C-TOP-04-CASCADE-FILTER` | Filter Produk (`C-TOP-04`), Chart D, Chart J | 1. Filter Produk terkunci ke `RIM Band` (`Tire` & `Tube` disabled).<br>2. Chart D hanya menampilkan entri `"Jawa Barat"` & `"DKI Jakarta"`.<br>3. Chart J otomatis di-*unmount* (hidden). |
| **Pilih Tipe Penjualan = "REP"** | `C-TOP-04-CASCADE-FILTER` | Filter Produk (`C-TOP-04`), Chart D, Chart J | 1. Filter Produk mengaktifkan `Tire` dan `Tube`.<br>2. Chart D menampilkan seluruh 38 Provinsi.<br>3. Chart J **dirender aktif** dengan reference line MTD & EOW serta filter in-card. |
| **Klik Toggle "Tube Type" pada Peta (Chart E)** | `CHART-E-SPATIAL-MAP` | Brand Filter Peta (`CHART-E`), Peta Spasial | 1. Opsi brand `GT` dan `ZENEOS` dibuat **disabled/hidden**.<br>2. State brand terkunci ke `IRC`.<br>3. Warna gradasi peta dihitung ulang hanya dari data ban IRC Tube Type. |
| **Klik Toggle "Tubeless" pada Peta (Chart E)** | `CHART-E-SPATIAL-MAP` | Brand Filter Peta (`CHART-E`), Peta Spasial | Mengaktifkan kembali semua pilihan brand (`GT`, `IRC`, `ZENEOS`). |
| **Filter Brand (GTC/IRC/ZENEOS) pada Chart J** | `CHART-J-REP-SO-PREVIEW` | Chart J | Memfilter kalkulasi segmen bar (*Closed, Loading, Gulungan*) dan garis benchmark MTD/EOW khusus brand terpilih. |
| **Pilih Tipe Produk "TUBE TYPE" pada Chart J** | `CHART-J-REP-SO-PREVIEW` | Brand Filter Chart J, Chart J | 1. Brand `GTC` dan `ZENEOS` otomatis disabled.<br>2. Filter brand terkunci ke `IRC`.<br>3. Stacked bar menampilkan data SO khusus ban IRC Tube Type. |
| **Pilih Filter Provinsi pada Chart J** | `CHART-J-REP-SO-PREVIEW` | Chart J | Menampilkan hanya baris provinsi terpilih pada Sumbu Y (atau kembali ke 38 provinsi jika `[ Seluruh Provinsi ]` dipilih). |
| **Filter Status Delivery pada Chart I** | `CHART-I-PROVINCE-TRUCK` | Chart I | Memfilter sumbu nilai kolom armada hanya untuk status terpilih (`Gulungan` / `Loading Hari Ini` / `Loading Selanjutnya`). |
| **Klik Provinsi pada Peta (Chart E)** | `CHART-E-SPATIAL-MAP` | Chart D, Chart I, Chart J | Memfilter tampilan Chart D, I, dan J untuk fokus menyorot provinsi yang diklik (*drill-down view*). |

---

## 5. Standar Desain & Design Tokens (Industrial Logistics Theme)

Seluruh komponen visual wajib mengacu pada token CSS di `frontend/src/styles/variables.css`:

```css
:root {
  /* Brand & Neutrals */
  --color-primary: #003b73;         /* Deep Corporate Navy */
  --color-primary-light: #0074d9;   /* Active / Hover State */
  --color-primary-dark: #001f3f;    /* Sidebar & High Contrast */
  --color-secondary: #ff851b;       /* Warehouse Accent Orange (Gulungan/Highlights) */

  /* Surfaces & Background */
  --color-bg-main: #f4f6f9;         /* Dashboard Canvas Background */
  --color-bg-surface: #ffffff;      /* Card & Modal Surface */
  --color-border: #e2e8f0;          /* Card & Grid Dividers */

  /* Status Semantics */
  --color-success: #2ecc40;         /* Closed / Delivered / On-Target */
  --color-warning: #ffb700;         /* In Transit / Awaiting Shipping / Buffer */
  --color-danger: #ff4136;          /* Bottleneck / Shortage / Delayed */
  --color-info: #39cccc;            /* Scheduled / Awaiting Delivery */

  /* Map Monochromatic Ramp */
  --map-step-1: #e1edf8;
  --map-step-2: #84b9e9;
  --map-step-3: #2b78c5;
  --map-step-4: #003b73;
}
```

---

## 6. Petunjuk Implementasi Frontend Engineer

1. **Komposisi File & Folder**:
   Buat setiap chart di folder terisolasi di bawah `src/pages/Dashboard/components/charts/` dengan file `.jsx` dan `.module.css` masing-masing.
2. **Library Rekomendasi**:
   - **Chart Engine:** `echarts` atau `recharts` / `chart.js` untuk performa render bar/donut/area yang tinggi.
   - **Peta Spasial:** `react-simple-maps` atau `echarts-for-react` dengan GeoJSON Indonesia.
3. **State Management**:
   Gunakan custom hook `useDashboardFilters.js` di `src/pages/Dashboard/hooks/` untuk mengelola cascading state filter agar tidak terjadi re-render berlebihan.

