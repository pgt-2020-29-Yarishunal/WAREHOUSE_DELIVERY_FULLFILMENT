# Implementasi Fitur Peta Regional

## 6. Rendering Peta (OpenLayers)

**File**: `IndonesiaSalesMap.js`

### 6.1 Sumber Data Geografis (GeoJSON)

```javascript
import indonesiaProvincesGeoJSON from 'indonesiaProvinces.json';
```

- **File**: `indonesiaProvinces.json` (~2.5 MB, 98.675 baris)
- **Format**: GeoJSON `FeatureCollection` dengan geometri `MultiPolygon` per provinsi
- **Sistem Koordinat**: WGS84 (EPSG:4326)
- **Properti feature**: field `name` berisi nama provinsi dalam bahasa Inggris (contoh: `"West Java"`)
- **Catatan**: File ini adalah aset **statis yang di-bundle** bersama frontend — tidak di-load dari server saat runtime

### 6.2 Inisialisasi OpenLayers

```javascript
// Parse GeoJSON + reproject EPSG:4326 → EPSG:3857 (Web Mercator)
const vectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(indonesiaProvincesGeoJSON, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  })
});

const map = new Map({
  target: mapRef.current,
  layers: [vectorLayer],
  view: new View({
    center: fromLonLat([118.0, -2.5]), // Pusat Indonesia
    zoom: 5,
    maxZoom: 12,
    minZoom: 4
  }),
  controls: [new ScaleLine(), new Zoom()]
});
```

### 6.3 Choropleth Coloring

Warna setiap provinsi dihitung dari normalisasi nilai metrik:

```javascript
const ratio = (value - minValue) / (maxValue - minValue);
const hue = (1 - ratio) * 120; // 120 = hijau (baik), 0 = merah (buruk)
return `hsla(${hue}, 80%, 50%, 0.85)`;
```

| Warna | Makna |
|---|---|
| Hijau (hue 120) | Rasio rendah — biaya efisien |
| Kuning | Rasio menengah |
| Merah (hue 0) | Rasio tinggi — biaya mahal |
| Putih | Provinsi tanpa data |

### 6.4 Resolusi Nama Provinsi

Terdapat potensi ketidakcocokan antara nama di Mapping csv untuk data master region (MASTER REGION INDO) (uppercase Indonesia) vs nama di GeoJSON (Inggris). Komponen menyediakan dictionary `provinceNameMapping`:

```javascript
const provinceNameMapping = {
  'KALIMANTAN SELATAN': 'South Kalimantan',
  'DKI JAKARTA': 'Jakarta Raya',
  'JAWA BARAT': 'West Java',
  // ... 30 provinsi
};
```

> **Catatan**: Pada versi kode saat ini, mapping ini **tidak diaplikasikan secara aktif**  sedangkan GeoJSON features menggunakan nama bahasa Inggris. Ini dapat menyebabkan beberapa provinsi tidak ter-match (tampil putih di peta meski ada data).

### 6.5 Interaksi Hover

```javascript
map.on('pointermove', (evt) => {
  const feature = map.forEachFeatureAtPixel(pixel, (f) => f);
  if (feature && salesDataMap[feature.get('name')]) {
    // Highlight stroke lebih tebal
    feature.setStyle(new Style({ stroke: new Stroke({ color: '#000', width: 3 }) }));
    // Update panel info di samping kanan peta
    setSelectedRegion({ name, ratio, transport_cost, sales, quantity });
  }
});
```

## 8. Diagram Ringkasan

```
[MySQL]
  sales_data        → province, total_sales, qty (per transaksi)
  transport_cost    → province, cost_value (per shipment)
  master_customer   → customer_type (LOCAL/EXPORT), type (OK/OE/EXP)
        │
        │  Go/Gin + GORM (raw records, tidak diagregasi server)
        ▼
[API Endpoints]
  POST /api/sales/filtered       (filter: month, year, warehouse_id)
  POST /api/shipping/filtered    (filter: month, year)
        │
        │  Axios Promise.all (parallel fetch)
        ▼
[Frontend Aggregation - RegionalCostRatio.js]
  1. Filter LOCAL customers only
  2. Sum transport_cost per province  →  shippingByRegionData{}
  3. Sum total_sales per province     →  regionMap{}
  4. Compute ratio = transport / sales × 100
  5. salesByRegion = [{name, ratio, transport_cost, ...}]
        │
        │  Props
        ▼
[IndonesiaSalesMap.js - OpenLayers]
  Static GeoJSON (indonesiaProvinces.json, bundled, ~2.5MB)
  VectorSource → GeoJSON.readFeatures (EPSG:4326 → 3857)
  styleFunction → HSL choropleth (green=low=good, red=high=bad)
  pointermove → hover highlight + sidebar info panel
        │
        ▼
[Canvas Render (Browser)]
  Choropleth map provinsi Indonesia
```


## 10. Inventaris File yang Dibutuhkan

Berikut adalah seluruh file yang **wajib ada** agar fitur peta dapat berjalan, dikelompokkan per layer.

### 🗄️ Backend — Go/Gin

| `MASTER REGION INDO.csv` | `backend-go/MASTER REGION INDO.csv` | Data seed untuk tabel `indonesian_regions` (opsional untuk peta, tapi dibutuhkan `main.go`) |

### ⚛️ Frontend — React

| File | Path | Peran |
|---|---|---|
| `IndonesiaSalesMap.js` | `IndonesiaSalesMap.js` | **Komponen utama peta** — OpenLayers init, choropleth styling, hover interaction |
| `IndonesiaSalesMap.css` | `IndonesiaSalesMap.css` | Styling OpenLayers controls (zoom, scale line) |
| `indonesiaProvinces.json` | `indonesiaProvinces.json` | **GeoJSON ~2.5MB** — geometri MultiPolygon seluruh provinsi Indonesia (WGS84) |


### 📦 Frontend — NPM Dependencies

Dependency yang harus ter-install di `node_modules` (via `npm install`):

| Package | Versi | Digunakan untuk |
|---|---|---|
| `ol` | `^8.2.0` | **OpenLayers** — rendering peta, VectorSource, VectorLayer, GeoJSON parser, proyeksi |