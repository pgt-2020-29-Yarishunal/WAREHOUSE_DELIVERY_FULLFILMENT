# Design System — Delivery Dashboard Gudang (Gajah Tunggal)

Locked design system extracted via **Hallmark Study** from [`UI_SPECIFICATION.md`](UI_SPECIFICATION.md).  
Future Hallmark runs and frontend compilation steps read this file first; all layout and visual modules defer to it.

---

## 1. Provenance
- **Source Mode:** Document Study (`UI_SPECIFICATION.md`)
- **Extraction Date:** 2026-08-20
- **Domain / Context:** Enterprise Warehouse & Delivery Logistics Operations (PT Gajah Tunggal Tbk)
- **Confidence Note:** DNA tokens and layout blueprints are authoritative, matching exact industrial logistics operational requirements.

---

## 2. System
- **Genre:** `modern-minimal` (Enterprise Logistics / Industrial Operations Workbench)
- **Macrostructure:** `Workbench Grid / Bento Operations` (Top bar metric controls + 10 encapsulated visualization chart modules + interactive spatial choropleth map)
- **Theme:** `Cobalt Industrial` (Corporate Navy Blue `#003B73` + Warehouse Orange Accent `#FF851B`)
- **Axes:** Light Paper Band (`#F4F6F9`) / Upright Neutral Grotesk Display (`Inter`) / Cool Corporate Navy Accent (`#003B73`)

---

## 3. Tokens (Canonical Design System)

```css
:root {
  /* Surface & Background */
  --color-paper:          #f4f6f9;   /* Main canvas background */
  --color-paper-surface:  #ffffff;   /* Card, modal, & panel surfaces */
  --color-paper-subtle:   #f8fafc;   /* Table headers & filter wells */
  --color-paper-hover:    #edf2f7;   /* Hover states & row highlights */
  --color-sidebar-bg:     #001f3f;   /* High-contrast deep navy sidebar */

  /* Text & Ink */
  --color-ink-main:       #1a202c;   /* Primary body & headline text */
  --color-ink-muted:      #718096;   /* Secondary captions, subtitles, placeholders */
  --color-ink-subtle:     #a0aec0;   /* Icons & disabled text */
  --color-ink-inverse:    #ffffff;   /* Pure white text on dark surfaces */

  /* Primary Brand & Accents */
  --color-primary:        #003b73;   /* Gajah Tunggal Corporate Deep Navy */
  --color-primary-light:  #0074d9;   /* Active state, selection pill, link */
  --color-primary-dark:   #001f3f;   /* High contrast header */
  --color-secondary:      #ff851b;   /* Warehouse Orange (Gulungan & priority highlights) */
  --color-secondary-hover:#e07413;   /* Orange hover */

  /* Semantic Status Tokens */
  --color-success:        #2ecc40;   /* Closed / Delivered / On-Target */
  --color-success-bg:     #eafaf1;
  --color-success-text:   #197a29;

  --color-warning:        #ffb700;   /* In Transit / Awaiting Shipping / Buffer */
  --color-warning-bg:     #fffbf0;
  --color-warning-text:   #b38000;

  --color-danger:         #ff4136;   /* Bottleneck / Shortage / Delayed */
  --color-danger-bg:      #fff5f5;
  --color-danger-text:    #c5271f;

  --color-info:           #39cccc;   /* Scheduled / Awaiting Delivery */
  --color-info-bg:        #f0fdfd;
  --color-info-text:      #1d7b7b;

  /* Spatial Map Monochromatic Ramp (Navy Intensity) */
  --map-step-1:           #e1edf8;   /* < 50% target */
  --map-step-2:           #84b9e9;   /* 50% - 75% target */
  --map-step-3:           #2b78c5;   /* 75% - 99% target */
  --map-step-4:           #003b73;   /* >= 100% target */

  /* Borders & Dividers */
  --color-border:         #e2e8f0;   /* Clean hairline divider */
  --color-border-light:   #edf2f7;   /* Table row border */
  --color-border-focus:   #0074d9;   /* Input focus ring */

  /* Typography Stack */
  --font-display: 'Inter', system-ui, -apple-system, sans-serif;
  --font-body:    'Inter', system-ui, -apple-system, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', Consolas, monospace;

  /* 4-pt Spacing Scale */
  --space-2xs: 2px;
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;
  --space-2xl: 48px;

  /* Radii */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadows & Elevation */
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-modal: 0 20px 25px -5px rgba(0, 0, 0, 0.15);

  /* Transitions */
  --dur-fast: 150ms;
  --dur-normal: 250ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 4. Layout DNA & Macrostructure Blueprints

### 4.1 Master Grid Layout (`Workbench Grid`)
Dashboard disusun dalam grid modular yang adaptif:
1. **Top Bar Header & Filter Station** (`Full Width`):
   - Working Day Pacing Metric (`Hari ke-X dari Y Hari Kerja`)
   - Target MTD Pacing Indicator ($Target = \frac{Target}{WorkingDays} \times CurrentDay$)
   - Segmented Period Selector (`Bulan Berjalan` | `Bulan Kemarin` | `Historikal`)
   - Cascading Sales & Product Selector (`REP`, `EXP`, `OEM` $\leftrightarrow$ `Tire`, `Tube`, `RIM Band`)
2. **Analytical Layer 1 (Trend & Distribution)**:
   - Chart A: Multi-Year Sales Area Chart ($N, N-1, N-2$)
   - Chart B: Sales Order Status Donut (`Closed`, `Booked`, `Awaiting Shipping`)
   - Chart C: Actual Sales vs Supply Plan per Category (`IRC Tube Type`, `IRC Tubeless`, `Zeneos Tubeless`)
3. **Geospatial & Area Achievement Layer**:
   - Chart D: Horizontal Bar Pencapaian Target per Area (Dynamic REP: 38 Provinsi / OEM: 2 / EXP: 1)
   - Chart E: Interactive Choropleth Map Indonesia (Monochromatic Heat Ramp + In-Card Toggle `Tube Type`/`Tubeless` + Brand Filter `GT`, `IRC`, `ZENEOS` with IRC Lock rule)
4. **Operations & Warehouse Staging Layer**:
   - Chart F: Top 5 SKU Supply Bottleneck (Warning `<80%`, Severe `<50%`)
   - Chart G: SO Masuk Gudang Donut (`Awaiting Delivery`, `Awaiting Shipping`, `Closed`)
   - Chart H: Rencana Kirim Armada Hari Ini (Unit: Truk Engkel, `Gulungan`, `Loading Hari Ini`, `Loading Selanjutnya`)
   - Chart I: Rincian Distribusi Kirim per Provinsi (Truk Engkel)
5. **Specialized Distribution Channel Layer**:
   - Chart J: Preview SO per Area (Khusus Tipe `REP`) with Stacked Bar (`Closed`, `Loading Hari Ini`, `Gulungan`), In-card Brand/Construction/Province filters, and Dual Reference Lines (`Target MTD` & `Target EOW`).

---

## 5. Interaction & Component Voice

### 5.1 Buttons & Action Voice
- **Primary CTA:** Solid Corporate Navy (`#003B73`), text white, radius `8px`, font-weight `600`, active transform `translateY(1px)`.
- **Secondary CTA:** Warehouse Orange (`#FF851B`) for dispatch and queueing actions.
- **Outline / Ghost:** Transparent, hairline border (`#E2E8F0`), text muted, hover background `#F8FAFC`.
- **Filter Chips & Pills:** Full pill radius (`9999px`), background `#F8FAFC`, active state filled with `--color-primary` and text inverse.

### 5.2 Micro-Interactions & Motion Stance
- **Pacing & Easing:** Fast, crisp transitions (`150ms–250ms`) with `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Live Status Dot:** Subtle pulsing halo animation on online server indicators and live data badges.
- **Chart Tooltips:** Instant dark glass / clean slate surface with monospace tabular figures.
- **Anti-Patterns Banned:** Bouncy hovers, aggressive zoom transforms, full-page spin loaders, or synthetic AI glassmorphism.

---

## 6. Business Logic & Cascading Rules Summary

1. **Sales Channel Cascading:**
   - `REP` $\implies$ Active: `Tire` + `Tube` (`RIM Band` disabled). Chart D = 38 Provinsi. Chart J rendered.
   - `EXP` $\implies$ Active: `Tire` only (`Tube` & `RIM Band` hidden). Chart D = `International`. Chart J hidden.
   - `OEM` $\implies$ Active: `RIM Band` only (`Tire` & `Tube` hidden). Chart D = `Jawa Barat` & `DKI Jakarta`. Chart J hidden.
2. **Tire Construction & Brand Exclusivity:**
   - Selecting `Tube Type` anywhere (Chart E Map / Chart J) **strictly locks brand filter to `IRC`** and disables `GT`/`ZENEOS` (since Tube Type is exclusively IRC).
3. **Reference Line Benchmarks:**
   - `Target MTD Line`: Red dashed line calculated dynamically via working day ratio.
   - `Target EOW Line`: Bright blue dashed line for current week checkpoint quota.

---

## 7. Quality Checklist for Implementation
- [ ] Strict CSS Modules (`*.module.css`) and global CSS variables only. Zero inline CSS.
- [ ] Offline Material Symbols Outlined icons (`material-symbols` package).
- [ ] Monospace typography for numbers, SKU codes, and SJ identifiers (`font-variant-numeric: tabular-nums`).
- [ ] Explicit handling of Loading, Empty, and Error states for all 10 chart modules.