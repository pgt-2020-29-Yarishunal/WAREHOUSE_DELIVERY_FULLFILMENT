# 📊 Laporan Analisis Data SO, Struktur Gudang & Kebutuhan Dashboard
**PT Gajah Tunggal Tbk — Delivery & Warehouse Operations Dashboard**

---

## 📑 Daftar Isi
1. [Ringkasan Eksekutif & Struktur Akun Pengguna Gudang](#1-ringkasan-eksekutif--struktur-akun-pengguna-gudang)
2. [Audit Komprehensif: Struktur 36 Kolom & Karakteristik `data SO.csv`](#2-audit-komprehensif-struktur-36-kolom--karakteristik-data-socsv)
3. [Aturan Klasifikasi Data & Penentuan Gudang (APW, BPW, DPW, RPW)](#3-aturan-klasifikasi-data--penentuan-gudang-apw-bpw-dpw-rpw)
   - [3.1 Klasifikasi Gudang APW (Plant A - Bias)](#31-klasifikasi-gudang-apw-plant-a---bias)
   - [3.2 Klasifikasi Gudang BPW (Plant B - Motor)](#32-klasifikasi-gudang-bpw-plant-b---motor)
   - [3.3 Klasifikasi Gudang DPW (Plant D - Radial) & Sub-Kategori Radial](#33-klasifikasi-gudang-dpw-plant-d---radial--sub-kategori-radial)
   - [3.4 Klasifikasi Gudang RPW (Plant R - TBR & Konsinyasi)](#34-klasifikasi-gudang-rpw-plant-r---tbr--konsinyasi)
4. [Analisis Kebutuhan Data Tambahan di Luar Data Transaksi SO](#4-analisis-kebutuhan-data-tambahan-di-luar-data-transaksi-so)
5. [Tabel Komparasi: Kebutuhan Data Komponen Dashboard vs Dataset SO](#5-tabel-komparasi-kebutuhan-data-komponen-dashboard-vs-dataset-so)
6. [Spesifikasi Skema Data (JSON Contract) & Kebutuhan Setiap Komponen Dashboard](#6-spesifikasi-skema-data-json-contract--kebutuhan-setiap-komponen-dashboard)
   - [6.1 TopBar Metrics & KPI](#61-topbar-metrics--kpi-working-day-target-mtd-achievement)
   - [6.2 Chart B: Sales Order Status Overview](#62-chart-b-sales-order-status-overview-donut)
   - [6.3 Chart C: Actual Sales vs Supply Plan per Kategori Ban](#63-chart-c-actual-sales-vs-supply-plan-per-kategori-ban-grouped-bar)
   - [6.4 Chart D: Pencapaian Target Penjualan per Area](#64-chart-d-pencapaian-target-penjualan-per-area-horizontal-bar)
   - [6.5 Chart E: Peta Distribusi Pencapaian Target Spasial (Choropleth Map Indonesia)](#65-chart-e-peta-distribusi-pencapaian-target-spasial-choropleth-map-indonesia)
   - [6.6 Chart F: Top 5 SKU Supply Plan Terendah (Bottleneck)](#66-chart-f-top-5-sku-supply-plan-terendah-bottleneck-ranking-bar)
   - [6.7 Chart G: Status Sales Order Masuk Gudang](#67-chart-g-status-sales-order-masuk-gudang-donut)
   - [6.8 Chart H: Rencana Kirim Armada Hari Ini](#68-chart-h-rencana-kirim-armada-hari-ini-vertical-column)
   - [6.9 Chart I: Rincian Distribusi Kirim per Provinsi](#69-chart-i-rincian-distribusi-kirim-per-provinsi-vertical-column)
   - [6.10 Chart J: Preview SO per Area (Khusus Tipe REP)](#610-chart-j-preview-so-per-area-khusus-tipe-rep-stacked-bar)
7. [Ruang Kerja Perancangan Skema Database Baru (From Scratch)](#7-ruang-kerja-perancangan-skema-database-baru-from-scratch)

---

## 1. 📌 Ringkasan Eksekutif & Struktur Akun Pengguna Gudang

Sistem dashboard dirancang untuk melayani **4 entitas gudang operasional utama** ditambah **1 perencana logistik konsolidasi** dengan prinsip **1 Akun Master per Gudang**:

```
+-------------------------------------------------------------------------------------------------------------------+
|                                      STRUKTUR PENGGUNA GUDANG (1 GUDANG 1 AKUN)                                   |
+-------------------------------------------------------------------------------------------------------------------+
|  Gudang | Username    | Nama Akun                 | Lingkup Hasil Produksi & Merek yang Dikelola                   |
+---------+-------------+---------------------------+---------------------------------------------------------------+
|  APW    | gudang.apw  | Petugas Gudang APW        | Ban Bias, Tube Bias, Flap Bias (Plant A - Merek Gajah Tunggal)|
|  BPW    | gudang.bpw  | Petugas Gudang BPW        | Ban Motor IRC ("Motor"), Ban Motor Zeneos, Tube IRC (Plant B) |
|  DPW    | gudang.dpw  | Petugas Gudang DPW        | Ban Mobil Penumpang Radial / Passenger Car Radial (Plant D)   |
|  RPW    | gudang.rpw  | Petugas Gudang RPW        | Ban Truk & Bus Radial (TBR), Tube & Flap Radial (Plant R)     |
|  LOG    | logistics   | Perencana Logistik Pusat  | Konsolidasi Armada Truk & Pengiriman Antar-Gudang             |
+-------------------------------------------------------------------------------------------------------------------+
*(Default password akun testing: password123)*
```

---

## 2. 📦 Audit Komprehensif: Struktur 36 Kolom & Karakteristik `data SO.csv`

Dataset master transaksi [data SO.csv](file:///d:/Binus/Gajah%20Tunggal/Project%20Delivery%20Dashboard%20Gudang/Delivery%20Dashboard%20Gudang/data%20SO.csv) memuat total **46.399 baris transaksi** (44.470 baris transaksi komersial dan 1.929 baris sample/testing pabrik) dari modul Oracle Order Management (OM) dengan 36 kolom lengkap:

### 🔹 Struktur 36 Kolom Data:
1. `Order No.` : Nomor dokumen Sales Order Oracle (e.g. `1002600180`).
2. `Order Date` : Tanggal pemesanan dibuat oleh pelanggan/sales.
3. `Booked Date` : Tanggal Sales Order diverifikasi dan dibukukan (*booked*).
4. `Brand` : Merek produk (`Gajah Tunggal`, `IRC`, `Zeneos`, `GITI`, `GT`, `Dextero`, `Caldera`).
5. `Order Type` : Saluran penjualan (`REP-Sales-Bias`, `REP-Sales-Motor`, `REP-Sales-Motor-Zeneos`, `REP-Sales-Radial`, `REP-Sales-TBR`, `OEM-Sales`, `EXP-Sales`).
6. `Bill To Cust` : Nama entitas penagihan komersial utama (`GITI TIRE (USA) LTD.`, `MICHELIN NORTH AMERICA`, `TIGAR TYRES DOO`, dll.).
7. `Child Cust SSU` : Sub-unit entitas pelanggan.
8. `Line` : Nomor urut baris item pesanan.
9. `Internal Item` : Kode barang pabrik (memuat penanda seperti `-0` untuk OEM atau `-1` untuk Ekspor).
10. `Type` : Tipe hasil produksi (`BIAS FLAP`, `BIAS TIRE`, `BIAS TUBE`, `MOT TIRE`, `MOT SCO TIRE`, `MOT TUBE`, `MOT SCO TUBE`, `RADIAL TIRE`, `RADIAL TUBE`, `RADIAL FLAP`, `TBR TIRE`, `MOT RIM BAND`, `MOB VALVE`).
11. `Description` : Pola telapak ban (*Pattern SKU*, misal `80/90-14 NR73`, `20R FLAP`, `265/65 R17 SAVERO SUV`).
12. `Qty` : Kuantitas fisik pesanan (satuan PCS/SET).
13. `On Hold` : Penanda status hold pesanan (`*` jika ditahan).
14. `Status` : Tahapan status SO (`BOOKED`, `ENTERED`, `AWAITING_SHIPPING`, `CLOSED`).
15. `OM Status` : Kode internal status Oracle OM (`AS`, `ET`, dll.).
16. `No. Invoice` : Nomor faktur komersial penagihan.
17. `Loading Date` : Tanggal rencana/aktual muat barang ke armada.
18. `Schedule Ship Date` : Tanggal komitmen jadwal pengiriman barang ke customer.
19. `Salesrep` : Nama petugas representatif penjualan.
20. `Request Date` : Tanggal permintaan kirim dari pembeli.
21. `Ship To Location` : Nama fasilitas penerima (e.g. `Hino Motors Purwakarta`).
22. `Final Destination` : Tujuan akhir rantai pasok.
23. `Actual Final Destination` : Tujuan akhir fisik pengiriman.
24. `ATR` : Nomor alokasi rujukan armada.
25. `Cntr` : Nomor kontainer pengiriman ekspor.
26. `Ship Date` : Tanggal aktual keberangkatan armada.
27. `PFI No.` : Nomor Proforma Invoice.
28. `Child Cust Name` : Nama cabang pelanggan.
29. `LA No.` : Nomor Loading Authorization.
30. `Cust. PO` : Nomor Purchase Order rujukan pembeli.
31. `Sales Group GITI China` : Klasifikasi grup penjualan regional GITI (`WM`, `NA replenishment`, `NA Direct Container`, `TAG`, `EU`, `GTUK`).
32. `UOM` : Satuan unit (`PCS`, `SET`).
33. `BODC` : Kode Bill of Delivery Customer.
34. `Child Cust Shipto Address` : Alamat lengkap pengiriman customer.
35. `Product Category` : Kategori produk pabrik (`IRC TIRE T/L`, `IRC TIRE T/T`, `ZENEOS TIRE T/L`, `IRC TUBE`, `GT RADIAL SUMMER`, `FLAP`, `VALVE`, dll.).
36. `RIM` : Diameter velg/pelek roda (`14`, `15`, `16`, `17`, `18`, `20`, dll.).

---

### 🔹 Distribusi Volume Aktual per Gudang dalam `data SO.csv`:

```
+-------------------------------------------------------------------------------------------------------------------+
| GUDANG | KATEGORI       | TIPE PRODUK (*Type*)        | ORDER TYPE UTAMA                                    | VOLUME DATA |
+--------+----------------+-----------------------------+-----------------------------------------------------+-------------+
| APW    | TIRE           | BIAS TIRE                   | REP-Sales-Bias, OEM-Sales, EXP-Sales                | 3.926 baris |
|        | TUBE           | BIAS TUBE                   | REP-Sales-Bias, OEM-Sales, EXP-Sales                | 1.713 baris |
|        | FLAP           | BIAS FLAP                   | REP-Sales-Bias, OEM-Sales, EXP-Sales                | 1.216 baris |
|        |                |                             | -> Subtotal Transaksi Komersial APW                 | 6.855 baris |
+--------+----------------+-----------------------------+-----------------------------------------------------+-------------+
| BPW    | TIRE           | MOT TIRE, MOT SCO TIRE      | REP-Sales-Motor (IRC), REP-Sales-Zeneos, OEM, EXP   | 17.682 baris|
|        | TUBE           | MOT TUBE, MOT SCO TUBE      | REP-Sales-Motor (Khusus IRC), OEM-Sales             | 2.494 baris |
|        | RIM BAND       | MOT RIM BAND                | OEM-Sales (Tanpa Merek)                             |   304 baris |
|        |                |                             | -> Subtotal Transaksi Komersial BPW                 |20.480 baris |
+--------+----------------+-----------------------------+-----------------------------------------------------+-------------+
| DPW    | TIRE           | RADIAL TIRE                 | REP-Sales-Radial, OEM-Sales, EXP-Sales              | 14.123 baris|
|        |                |                             | -> Subtotal Transaksi Komersial DPW                 | 14.123 baris|
+--------+----------------+-----------------------------+-----------------------------------------------------+-------------+
| RPW    | TIRE           | TBR TIRE                    | REP-Sales-TBR, OEM-Sales, EXP-Sales                 | 1.677 baris |
|        | TUBE           | RADIAL TUBE, BIAS TUBE      | REP-Sales-TBR (Bias Tube Khusus TBR RPW)            |   147 baris |
|        | TUBE           | RADIAL TUBE                 | OEM-Sales, EXP-Sales (Special Case Radial Tube)     |   521 baris |
|        | FLAP           | RADIAL FLAP                 | REP-Sales-TBR, OEM-Sales, EXP-Sales                 |   667 baris |
|        |                |                             | -> Subtotal Transaksi Komersial RPW                 | 3.012 baris |
+--------+----------------+-----------------------------+-----------------------------------------------------+-------------+
| TOTAL TRANSAKSI KOMERSIAL TERKLASIFIKASI                                                            | 44.470 baris|
| Transaksi Uji Coba Pabrik (Sample & Test, Quality Assurance, Lab Testing)                           |  1.929 baris|
| TOTAL DATA CSV MASTER                                                                               | 46.399 baris|
+-------------------------------------------------------------------------------------------------------------------+
```

---

## 3. 🎯 Aturan Klasifikasi Data & Penentuan Gudang (APW, BPW, DPW, RPW)

### 3.1 Klasifikasi Gudang APW (Plant A - Bias)
* **TIRE**: `Type` = `BIAS TIRE` + `Order Type` = `REP-Sales-Bias`, `OEM-Sales`, `EXP-Sales`
* **TUBE**: `Type` = `BIAS TUBE` + `Order Type` = `REP-Sales-Bias`, `OEM-Sales`, `EXP-Sales` *(Tetap APW)*
* **FLAP**: `Type` = `BIAS FLAP` + `Order Type` = `REP-Sales-Bias`, `OEM-Sales`, `EXP-Sales`

### 3.2 Klasifikasi Gudang BPW (Plant B - Motor)
* **TIRE**: `Type` = `MOT TIRE`, `MOT SCO TIRE` + `Order Type` = `REP-Sales-Motor` (Brand: **IRC**), `REP-Sales-Motor-Zeneos` (Brand: **Zeneos**), `OEM-Sales`, `EXP-Sales`
* **TUBE**: `Type` = `MOT TUBE`, `MOT SCO TUBE` + `Order Type` = `REP-Sales-Motor` (Brand: **IRC**), `REP-Sales-Motor-Zeneos` (Brand: **Zeneos**), `OEM-Sales`, `EXP-Sales`
* **RIM BAND**: `Type` = `MOT RIM BAND` + `Order Type` = `OEM-Sales` (Brand: **NoBrand**)

### 3.3 Klasifikasi Gudang DPW (Plant D - Radial) & Sub-Kategori Radial
* **TIRE**: `Type` = `RADIAL TIRE` + `Order Type` = `REP-Sales-Radial`, `OEM-Sales`, `EXP-Sales`
* **Brand / Sub-Kategori Radial**:
  1. **GITI**:
     - **Walmart**: `Bill To Cust` memuat `GITI TIRE` + `Brand` = `Dextero` (atau Sales Group = `WM`)
     - **Caldera**: `Bill To Cust` memuat `GITI TIRE` + `Brand` = `Caldera`
     - **Trade**: `Bill To Cust` memuat `GITI TIRE` + `Sales Group GITI China` = `NA replenishment`
     - **Direct Customer**: `Bill To Cust` memuat `GITI TIRE` + `Sales Group` = `TAG` / `NA Direct Container` + `Brand` exclude Dextero & Caldera
  2. **Michelin**:
     - **TP3**: `Bill To Cust` memuat `MICHELIN NORTH AMERICA`
     - **BFG**: `Bill To Cust` memuat `TIGAR` + `Description` memuat `BFG`
     - **KLEBER**: `Bill To Cust` memuat `TIGAR` + `Description` memuat `KLEBER`
     - **RIKEN**: `Bill To Cust` memuat `TIGAR` + `Description` memuat `RIKEN`
     - **ROW**: `Bill To Cust` exclude GITI/Michelin/Tigar/Maftco + `Description` memuat `BFG` + `Internal Item` memuat `-1`
  3. **GT Radial**:
     - **OEM**: (`Product Category` memuat `Radial Tire` & `Order Type` = `OEM-Sales`) ATAU (`Product Category` memuat `Radial Tire` & `Order Type` = `EXP-Sales` & `Internal Item` memuat `-0`)
     - **OK/REP**: `Order Type` = `REP-Sales-Radial`

### 3.4 Klasifikasi Gudang RPW (Plant R - TBR & Konsinyasi)
* **TIRE**:
  - `Type` = `TBR TIRE`, `RADIAL TIRE` + `Order Type` = `REP-Sales-TBR`
  - `Type` = `TBR TIRE` + `Order Type` = `OEM-Sales`, `EXP-Sales` (**Special Case TBR**)
* **TUBE**:
  - `Type` = `RADIAL TUBE`, `BIAS TUBE` + `Order Type` = `REP-Sales-TBR`
  - `Type` = `RADIAL TUBE` + `Order Type` = `OEM-Sales`, `EXP-Sales` (**Special Case Radial Tube**)
* **FLAP**:
  - `Type` = `RADIAL FLAP` + `Order Type` = `REP-Sales-TBR`, `OEM-Sales`, `EXP-Sales`
* **VALVE**:
  - `Type` = `MOB VALVE` + `Order Type` = `OEM-Sales`

---

## 4. ⚠️ Analisis Kebutuhan Data Tambahan di Luar Data Transaksi SO

Terdapat **4 kelompok data pendukung** yang dibutuhkan dashboard:

1. **Rencana Pasokan Pabrik**: Target alokasi pasokan barang dari PPC untuk menghitung rasio pemenuhan di **Chart C** dan **Chart F**.
2. **Target Kuota Penjualan**: Angka target penjualan bulanan per gudang, brand, dan provinsi untuk **TopBar**, **Chart D**, **Chart E**, dan **Chart J**.
3. **Perencanaan Armada Truk**: Operasional armada truk (*Loading Hari Ini*, *Gulungan*, *Loading Selanjutnya*) untuk **Chart H**, **Chart I**, dan **Chart J**.
4. **Kalender Kerja Operasional**: Informasi total hari kerja dan hari berjalan untuk benchmark target MTD & EOW.

---

## 5. 📊 Tabel Komparasi: Kebutuhan Data Komponen Dashboard vs Dataset SO

| No | Komponen Dashboard | Kebutuhan Data Chart | Sumber Data dari SO / Pendukung |
| :---: | :--- | :--- | :--- |
| **Top** | **TopBar Metrics** | Target Bulanan, Actual MTD (Closed SO), Hari Kerja, Target MTD % & EOW % | • Master Kalender (`current_working_day`, `total_working_days`)<br>• Master Target (`target_monthly_qty`)<br>• Transaksi SO (`SUM(qty)` WHERE `status = 'CLOSED'`) |
| **B** | **Status SO Overview** | Proporsi SO: Booked, Entered, Awaiting Shipping, Closed | • Transaksi SO (`COUNT(order_no)` & `SUM(qty)` GROUP BY `status`) |
| **C** | **Actual Sales vs Supply Plan** | Actual vs Supply per Brand (BPW: IRC/Zeneos; DPW: GITI/Michelin/GT; APW: Bias; RPW: TBR) | • Transaksi SO (`SUM(qty)` per `brand`)<br>• Rencana Pasokan PPC (`SUM(supply_plan_qty)`) |
| **D** | **Target per Area** | Target & Actual Sales per Wilayah/Provinsi | • Transaksi SO (`SUM(qty)` per `province`)<br>• Master Target Area (`target_monthly_qty`) |
| **E** | **Spatial Map 34/38 Provinsi** | % Closed per Provinsi, Leader Brand, Sub-filter Tubeless/Tube Type | • Transaksi SO (`SUM(qty)`, `brand`, `is_tubeless`)<br>• Master Target Provinsi (`target_monthly_qty`) |
| **F** | **Top Bottleneck SKU** | Top 5 SKU Rasio Pemenuhan Pasokan Terendah | • Transaksi SO (`SUM(qty)` per SKU)<br>• Rencana Pasokan PPC (`supply_plan_qty`) |
| **G** | **Status SO Gudang** | Status level fisik gudang: Booked, Awaiting Delivery, AS, Closed | • Transaksi SO (`COUNT(order_no)` GROUP BY status fisik) |
| **H** | **Rencana Kirim Armada** | Satuan Truk Engkel (Loading Hari Ini, Gulungan, Loading Selanjutnya) | • Operasional Armada Truk (`SUM(truck_count)` per `dispatch_type`) |
| **I** | **Distribusi Armada Provinsi** | Rincian armada truk ke provinsi distribusi utama | • Operasional Armada Truk (`truck_count` per `province`) |
| **J** | **Preview SO Area REP** | Stacked bar (Closed, Loading Hari Ini, Gulungan) + Garis MTD/EOW | • Transaksi SO (`SUM(qty)` per provinsi & status muat)<br>• Master Target & Kalender Kerja |

---

## 6. 🔍 Spesifikasi Skema Data (JSON Contract) & Kebutuhan Setiap Komponen Dashboard

Berikut adalah rincian format data JSON yang dibutuhkan oleh frontend dashboard untuk seluruh komponen visual:

---

### 6.1 TopBar Metrics & KPI (Working Day & Target MTD Achievement)

#### 🔹 Format Skema Data JSON Frontend:
```json
{
  "workingDay": {
    "currentWorkingDay": 12,
    "totalWorkingDays": 19,
    "monthName": "Agustus",
    "year": 2026
  },
  "metrics": {
    "totalTargetMonthlyQty": 1765800,
    "targetMtdQty": 1115242,
    "targetMtdPct": 63.16,
    "actualMtdQty": 1184986,
    "actualMtdPct": 67.11,
    "targetEowPct": 89.47
  }
}
```
* **Kebutuhan Data**:
  - Hari kerja aktif & total hari kerja operasional (dari Master Kalender).
  - Total target kuota bulanan per gudang & saluran order.
  - Akumulasi penjualan aktual dari pesanan berstatus `CLOSED`.

---

### 6.2 Chart B: Sales Order Status Overview (Donut)

#### 🔹 Format Skema Data JSON Frontend:
```json
{
  "totalSO": 1284,
  "statuses": [
    { "label": "Closed", "count": 780, "qty": 1184986, "color": "#2ECC40" },
    { "label": "Awaiting Shipping", "count": 210, "qty": 284100, "color": "#FFB700" },
    { "label": "Booked", "count": 244, "qty": 250714, "color": "#003B73" },
    { "label": "Entered", "count": 50, "qty": 46000, "color": "#0074D9" }
  ]
}
```
* **Kebutuhan Data**:
  - Jumlah order (`COUNT(order_no)`) dan total unit fisik ban (`SUM(qty)`) dikelompokkan berdasarkan status transaksi SO.

---

### 6.3 Chart C: Actual Sales vs Supply Plan per Kategori Ban (Grouped Bar)

#### 🔹 Format Skema Data JSON Frontend:
```json
[
  { "brand": "IRC", "category": "IRC Tubeless", "actual": 685400, "supplyPlan": 720000, "achievement": 95.19 },
  { "brand": "IRC", "category": "IRC Tube Type", "actual": 345000, "supplyPlan": 380000, "achievement": 90.79 },
  { "brand": "Zeneos", "category": "Zeneos Tubeless", "actual": 154586, "supplyPlan": 180000, "achievement": 85.88 }
]
```
* **Kebutuhan Data**:
  - Total penjualan aktual vs target pasokan pabrik (Supply Plan PPC) per brand dan varian konstruksi ban.

---

### 6.4 Chart D: Pencapaian Target Penjualan per Area (Horizontal Bar)

#### 🔹 Format Skema Data JSON Frontend:
```json
[
  { "area": "Jawa Timur", "actual": 284500, "target": 310000, "achievement": 91.77 },
  { "area": "Jawa Barat", "actual": 245000, "target": 290000, "achievement": 84.48 },
  { "area": "DKI Jakarta", "actual": 198000, "target": 220000, "achievement": 90.00 }
]
```
* **Kebutuhan Data**:
  - Kuantitas aktual penjualan dan target kuota bulanan per provinsi tujuan distribusi.

---

### 6.5 Chart E: Peta Distribusi Pencapaian Target Spasial (Choropleth Map Indonesia)

#### 🔹 Format Skema Data JSON Frontend:
```json
{
  "provinces": [
    {
      "id": "ID-JB",
      "name": "Jawa Barat",
      "actual": 245000,
      "target": 290000,
      "achievement": 84.48,
      "leaderBrand": "IRC",
      "intensityLevel": 3
    }
  ]
}
```
* **Kebutuhan Data**:
  - Kode provinsi ISO/GeoJSON, pencapaian target, brand dengan penjualan tertinggi (*Leader Brand*), dan level gradasi warna intensitas peta.

---

### 6.6 Chart F: Top 5 SKU Supply Plan Terendah / Bottleneck (Ranking Bar)

#### 🔹 Format Skema Data JSON Frontend:
```json
[
  {
    "sku": "MOT-IRC-001",
    "pattern": "IRC NR73 80/90-14",
    "brand": "IRC",
    "actual": 42000,
    "supplyPlan": 95000,
    "gap": -53000,
    "fulfillmentRate": 44.21,
    "severity": "CRITICAL"
  }
]
```
* **Kebutuhan Data**:
  - 5 SKU dengan rasio pemenuhan pasokan terendah ($\text{Fulfillment Rate} = \frac{\text{Actual}}{\text{Supply Plan}} \times 100\%$) dan selisih defisit (*Gap*).

---

### 6.7 Chart G: Status Sales Order Masuk Gudang (Donut)

#### 🔹 Format Skema Data JSON Frontend:
```json
{
  "totalWarehouseSO": 1234,
  "statuses": [
    { "label": "Closed", "count": 780, "percentage": 63.21, "color": "#2ECC40" },
    { "label": "Awaiting Shipping", "count": 210, "percentage": 17.02, "color": "#FFB700" },
    { "label": "Awaiting Delivery", "count": 180, "percentage": 14.59, "color": "#39CCCC" },
    { "label": "Booked", "count": 64, "percentage": 5.18, "color": "#003B73" }
  ]
}
```
* **Kebutuhan Data**:
  - Status antrian fisik operasional gudang (`Closed`, `Awaiting Shipping`, `Awaiting Delivery`, `Booked`).

---

### 6.8 Chart H: Rencana Kirim Armada Hari Ini (Vertical Column)

#### 🔹 Format Skema Data JSON Frontend:
```json
[
  { "dispatchType": "Gulungan", "truckCount": 8.5, "productQty": 17000, "color": "#FF851B" },
  { "dispatchType": "Loading Hari Ini", "truckCount": 24.0, "productQty": 48000, "color": "#003B73" },
  { "dispatchType": "Loading Selanjutnya", "truckCount": 14.0, "productQty": 28000, "color": "#0074D9" }
]
```
* **Kebutuhan Data**:
  - Jumlah armada truk engkel dan total kuantitas produk berdasarkan status pemuatan harian: *Gulungan*, *Loading Hari Ini*, dan *Loading Selanjutnya*.

---

### 6.9 Chart I: Rincian Distribusi Kirim per Provinsi (Vertical Column)

#### 🔹 Format Skema Data JSON Frontend:
```json
[
  {
    "province": "Jawa Timur",
    "gulungan": 2.5,
    "loadingHariIni": 8.0,
    "loadingSelanjutnya": 4.0,
    "totalTruck": 14.5
  }
]
```
* **Kebutuhan Data**:
  - Persebaran armada truk ke 10 provinsi distribusi utama dengan breakdown status muat.

---

### 6.10 Chart J: Preview SO per Area (Khusus Tipe REP) (Stacked Bar)

#### 🔹 Format Skema Data JSON Frontend:
```json
{
  "referenceLines": {
    "targetMtdPct": 63.16,
    "targetEowPct": 89.47
  },
  "areaData": [
    {
      "province": "Jawa Barat",
      "targetQty": 290000,
      "closedQty": 185000,
      "loadingHariIniQty": 42000,
      "gulunganQty": 18000,
      "closedPct": 63.79
    }
  ]
}
```
* **Kebutuhan Data**:
  - Khusus pesanan Replacement (REP): Akumulasi kuantitas Closed, Loading Hari Ini, dan Gulungan per provinsi serta garis benchmark vertikal Target MTD % dan EOW % dari kalender kerja.

---

## 7. 🚀 Ruang Kerja Perancangan Skema Database Baru (From Scratch)

*(Bagian ini disiapkan untuk merancang skema database baru dari awal bersama)*

---
