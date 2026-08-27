import { WAREHOUSE_DATASETS } from '../data/warehouseDatasets.js';

// Normalization helper for product type keys (e.g. "RIM Band" -> "RIM_Band")
const normalizeProduct = (prod) => {
  if (!prod) return 'Tire';
  return prod.replace(/\s+/g, '_');
};

export const dashboardApi = {
  // 1. Top Bar Metrics & Operational Calendar
  getTopBarMetrics: async (salesType = 'REP', productType = 'Tire', period = 'CURRENT_MONTH') => {
    const prodKey = normalizeProduct(productType);
    const prodData = WAREHOUSE_DATASETS[salesType]?.[prodKey];

    let totalTarget = 1765800;
    let actualSalesMTD = 1115297;

    if (prodData) {
      if (prodData.actualVsSupply && prodData.actualVsSupply.length > 0) {
        totalTarget = prodData.actualVsSupply.reduce((sum, item) => sum + (item.supplyPlan || item.actual || 0), 0);
        actualSalesMTD = prodData.actualVsSupply.reduce((sum, item) => sum + (item.actual || 0), 0);
      } else if (prodData.soStatus) {
        const closedStatus = prodData.soStatus.statuses?.find((s) => s.label === 'Closed');
        actualSalesMTD = closedStatus ? closedStatus.count : prodData.soStatus.totalSO;
        totalTarget = actualSalesMTD;
      }
    }

    if (salesType === 'EXP') {
      totalTarget = 1500000;
      actualSalesMTD = 1115297;
    }

    return {
      currentWorkingDay: 12,
      totalWorkingDays: 19,
      monthName: 'Agustus',
      year: 2026,
      totalTarget,
      actualSalesMTD,
    };
  },

  // 2. Chart B: Sales Order Status Overview
  getSalesOrderStatus: async (salesType = 'REP', productType = 'Tire') => {
    const prodKey = normalizeProduct(productType);
    const data = WAREHOUSE_DATASETS[salesType]?.[prodKey]?.soStatus;
    if (data) return data;

    if (salesType === 'EXP') {
      return {
        totalSO: 1500000,
        statuses: [
          { label: 'Booked', count: 600000, color: '#003B73' },
          { label: 'Closed', count: 500000, color: '#2ECC40' },
          { label: 'Entered', count: 250000, color: '#0074D9' },
          { label: 'Awaiting Shipping', count: 150000, color: '#FFB700' },
        ],
      };
    }

    return null;
  },

  // 3. Chart C: Actual Sales vs Supply Plan per Category
  getActualVsSupply: async (salesType = 'REP', productType = 'Tire') => {
    const prodKey = normalizeProduct(productType);
    const data = WAREHOUSE_DATASETS[salesType]?.[prodKey]?.actualVsSupply;
    if (data && data.length > 0) return data;

    if (salesType === 'EXP') {
      return [
        {
          brand: 'EXPORT',
          type: 'EXPORT RADIAL',
          category: 'RADIAL EXPORT',
          actual: 1115297,
          supplyPlan: 1500000,
          achievement: 74.35,
        },
      ];
    }

    return [];
  },

  // 4. Chart D: Target Achievement per Area
  getAreaAchievement: async (salesType = 'REP', productType = 'Tire') => {
    const prodKey = normalizeProduct(productType);
    const data = WAREHOUSE_DATASETS[salesType]?.[prodKey]?.areaAchievement;
    if (data && data.length > 0) return data;

    if (salesType === 'EXP') {
      return [
        { area: 'International Export', achievement: 74.4, target: 1500000, actual: 1115297 },
      ];
    }

    return [];
  },

  // 5. Chart E: Spatial Map Dataset (34 Indonesian Provinces & Regions)
  // Available for salesType === 'REP', productType in ['Tire', 'Tube'] and period === 'CURRENT_MONTH'
  getSpatialMapData: async (salesType = 'REP', productType = 'Tire', period = 'CURRENT_MONTH', subCategory = 'ALL') => {
    if (salesType !== 'REP' || (productType !== 'Tire' && productType !== 'Tube') || period !== 'CURRENT_MONTH') {
      return [];
    }

    const provinceRegionMap = {
      'West Kalimantan': { region: 'KALIMANTAN', leader: 'IRC' },
      'Central Kalimantan': { region: 'KALIMANTAN', leader: 'IRC' },
      'South Kalimantan': { region: 'KALIMANTAN', leader: 'IRC' },
      'East Kalimantan': { region: 'KALIMANTAN', leader: 'IRC' },
      'North Kalimantan': { region: 'KALIMANTAN', leader: 'IRC' },
      'Kepulauan Riau': { region: 'SUMATERA', leader: 'IRC' },
      'Lampung': { region: 'SUMATERA', leader: 'IRC' },
      'North Sumatra': { region: 'SUMATERA', leader: 'IRC' },
      'Jambi': { region: 'SUMATERA', leader: 'IRC' },
      'West Sumatra': { region: 'SUMATERA', leader: 'IRC' },
      'Riau': { region: 'SUMATERA', leader: 'ZENEOS' },
      'Bengkulu': { region: 'SUMATERA', leader: 'ZENEOS' },
      'South Sumatra': { region: 'SUMATERA', leader: 'IRC' },
      'Bangka Belitung': { region: 'SUMATERA', leader: 'IRC' },
      'Aceh': { region: 'SUMATERA', leader: 'IRC' },
      'Bali': { region: 'JAWA & BALI', leader: 'IRC' },
      'Central Java': { region: 'JAWA & BALI', leader: 'IRC' },
      'West Java': { region: 'JAWA & BALI', leader: 'IRC' },
      'East Java': { region: 'JAWA & BALI', leader: 'ZENEOS' },
      'Jakarta': { region: 'JAWA & BALI', leader: 'IRC' },
      'Banten': { region: 'JAWA & BALI', leader: 'ZENEOS' },
      'Yogyakarta': { region: 'JAWA & BALI', leader: 'IRC' },
      'West Nusa Tenggara': { region: 'NUSA TENGGARA', leader: 'IRC' },
      'East Nusa Tenggara': { region: 'NUSA TENGGARA', leader: 'IRC' },
      'Southeast Sulawesi': { region: 'SULAWESI', leader: 'IRC' },
      'Central Sulawesi': { region: 'SULAWESI', leader: 'IRC' },
      'South Sulawesi': { region: 'SULAWESI', leader: 'IRC' },
      'North Sulawesi': { region: 'SULAWESI', leader: 'ZENEOS' },
      'Gorontalo': { region: 'SULAWESI', leader: 'ZENEOS' },
      'West Sulawesi': { region: 'SULAWESI', leader: 'IRC' },
      'Maluku': { region: 'MALUKU & PAPUA', leader: 'ZENEOS' },
      'North Maluku': { region: 'MALUKU & PAPUA', leader: 'IRC' },
      'Papua': { region: 'MALUKU & PAPUA', leader: 'IRC' },
      'West Papua': { region: 'MALUKU & PAPUA', leader: 'IRC' },
      'Central Papua': { region: 'MALUKU & PAPUA', leader: 'IRC' },
      'South West Papua': { region: 'MALUKU & PAPUA', leader: 'ZENEOS' },
      'South Papua': { region: 'MALUKU & PAPUA', leader: 'IRC' },
      'Highland Papua': { region: 'MALUKU & PAPUA', leader: 'IRC' },
    };

    const isTube = productType === 'Tube';
    const prodKey = isTube ? 'Tube' : 'Tire';
    let baseList = WAREHOUSE_DATASETS.REP?.[prodKey]?.spatialMapNational || [];
    const normalizedKey = (subCategory || '').toUpperCase().trim();

    if (normalizedKey && normalizedKey !== 'ALL') {
      if (isTube) {
        if (normalizedKey.includes('IRC') || normalizedKey.includes('TUBE')) {
          baseList = WAREHOUSE_DATASETS.REP?.Tube?.spatialMapSub?.['IRC TUBE'] || baseList;
        }
      } else {
        if (normalizedKey.includes('TUBETYPE') || normalizedKey.includes('TUBE TYPE')) {
          baseList = WAREHOUSE_DATASETS.REP?.Tire?.spatialMapSub?.['IRC TUBETYPE'] || [];
        } else if (normalizedKey.includes('ZENEOS')) {
          baseList = WAREHOUSE_DATASETS.REP?.Tire?.spatialMapSub?.['ZENEOS TUBELESS'] || [];
        } else if (normalizedKey.includes('IRC') && normalizedKey.includes('TUBELESS')) {
          baseList = WAREHOUSE_DATASETS.REP?.Tire?.spatialMapSub?.['IRC TUBELESS'] || [];
        }
      }
    }

    if (!baseList || baseList.length === 0) return [];

    return baseList.map((item) => {
      const meta = provinceRegionMap[item.name] || { region: 'JAWA & BALI', leader: 'IRC' };
      return {
        name: item.name,
        achievement: item.achievement,
        region: meta.region,
        leader: isTube ? 'IRC' : meta.leader,
      };
    });
  },

  // 6. Chart F: Top 5 SKU Supply Plan Terendah (Bottlenecks)
  getBottleneckSKUs: async (salesType = 'REP', productType = 'Tire', brand = 'ALL') => {
    const prodKey = normalizeProduct(productType);
    const raw = WAREHOUSE_DATASETS[salesType]?.[prodKey]?.bottleneckSKUs;

    if (!raw) return [];

    let list = [];
    if (Array.isArray(raw)) {
      list = raw;
    } else if (typeof raw === 'object') {
      if (brand === 'ALL') {
        list = [...(raw.IRC || []), ...(raw.ZENEOS || [])];
      } else {
        list = raw[brand.toUpperCase()] || raw[brand] || [];
      }
    }

    if (brand !== 'ALL' && Array.isArray(list)) {
      const filterKey = brand.toUpperCase();
      const filtered = list.filter((item) => {
        const itemCat = (item.category || item.brand || '').toUpperCase();
        return itemCat.includes(filterKey) || filterKey.includes(itemCat);
      });
      if (filtered.length > 0) list = filtered;
    }

    return list;
  },

  // 7. Chart G: Status SO Masuk Gudang
  getWarehouseSOStatus: async (salesType = 'REP', productType = 'Tire') => {
    const prodKey = normalizeProduct(productType);
    const data = WAREHOUSE_DATASETS[salesType]?.[prodKey]?.warehouseSO;
    if (data) return data;
    return null;
  },

  // 8. Chart H: Rencana Kirim Armada Hari Ini
  getDailyTruckPlan: async (salesType = 'REP', productType = 'Tire') => {
    const prodKey = normalizeProduct(productType);
    const data = WAREHOUSE_DATASETS[salesType]?.[prodKey]?.dailyTruckPlan;
    if (data && data.length > 0) return data;
    return [];
  },

  // 9. Chart I: Rincian Distribusi Kirim per Provinsi
  getProvinceTruckDistribution: async (salesType = 'REP', productType = 'Tire', filterType = 'ALL') => {
    const prodKey = normalizeProduct(productType);
    const raw = WAREHOUSE_DATASETS[salesType]?.[prodKey]?.provinceTrucks || [];

    return raw.map((item) => {
      let count = item.total;
      if (filterType === 'Gulungan') count = item.gulungan;
      else if (filterType === 'Loading Hari Ini') count = item.loadingHariIni;
      else if (filterType === 'Loading Selanjutnya') count = item.loadingSelanjutnya;

      return {
        province: item.province,
        truckCount: count,
        total: item.total,
        loadingHariIni: item.loadingHariIni,
        gulungan: item.gulungan,
        loadingSelanjutnya: item.loadingSelanjutnya,
      };
    });
  },

  // 10. Chart J: Preview SO per Area (Khusus REP Tire)
  getRepSOPreview: async ({ salesType = 'REP', productType = 'Tire', brandType = 'ALL', brand = 'ALL', tireType = 'ALL', selectedProvince = 'ALL' } = {}) => {
    if (salesType !== 'REP' || productType !== 'Tire') {
      return [];
    }

    const previewData = WAREHOUSE_DATASETS.REP?.Tire?.repSOPreview || {};

    let list = [];
    const filterKey = (brandType || '').toUpperCase().trim();

    if (filterKey === 'ZENEOS TUBELESS' || (tireType === 'TUBELESS' && brand === 'ZENEOS')) {
      list = previewData['ZENEOS TUBELESS'] || [];
    } else if (filterKey === 'IRC TUBETYPE' || filterKey === 'IRC TUBE TYPE' || tireType === 'TUBETYPE' || tireType === 'TUBE TYPE') {
      list = previewData['IRC TUBETYPE'] || [];
    } else if (filterKey === 'IRC TUBELESS' || (tireType === 'TUBELESS' && brand === 'IRC')) {
      list = previewData['IRC TUBELESS'] || [];
    } else {
      list = [
        ...(previewData['IRC TUBELESS'] || []),
        ...(previewData['IRC TUBETYPE'] || []),
        ...(previewData['ZENEOS TUBELESS'] || []),
      ];
    }

    let result = [...list];
    if (selectedProvince && selectedProvince !== 'ALL') {
      result = result.filter((item) => item.province?.toLowerCase() === selectedProvince.toLowerCase());
    }

    return result;
  },
};