import { apiClient } from '../../../services/apiClient.js';

const buildQueryParams = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
};

export const dashboardApi = {
  // 0. Dynamic filter configuration per active warehouse
  getFilterConfig: async (warehouseId) => {
    const res = await apiClient.get(`/dashboard/filters${buildQueryParams({ warehouse_id: warehouseId })}`);
    return res.data;
  },

  // 1. Top Bar Metrics & Operational Calendar
  getTopBarMetrics: async (salesType = 'REP', productType = 'Tire', period = 'CURRENT_MONTH', brand = 'ALL', warehouseId) => {
    const res = await apiClient.get(`/dashboard/topbar${buildQueryParams({
      sales_type: salesType,
      product_type: productType,
      period,
      brand,
      warehouse_id: warehouseId,
    })}`);
    return res.data;
  },

  // 2. Chart B: Sales Order Status Overview
  getSalesOrderStatus: async (salesType = 'REP', productType = 'Tire', brand = 'ALL', warehouseId) => {
    const res = await apiClient.get(`/dashboard/so-status${buildQueryParams({
      sales_type: salesType,
      product_type: productType,
      brand,
      warehouse_id: warehouseId,
    })}`);
    return res.data;
  },

  // 3. Chart C: Actual Sales vs Supply Plan per Category
  getActualVsSupply: async (salesType = 'REP', productType = 'Tire', brand = 'ALL', warehouseId) => {
    const res = await apiClient.get(`/dashboard/actual-vs-supply${buildQueryParams({
      sales_type: salesType,
      product_type: productType,
      brand,
      warehouse_id: warehouseId,
    })}`);
    return res.data || [];
  },

  // 4. Chart D: Target Achievement per Area
  getAreaAchievement: async (salesType = 'REP', productType = 'Tire', brand = 'ALL', warehouseId) => {
    const res = await apiClient.get(`/dashboard/area-achievement${buildQueryParams({
      sales_type: salesType,
      product_type: productType,
      brand,
      warehouse_id: warehouseId,
    })}`);
    return res.data || [];
  },

  // 5. Chart E: Spatial Map Dataset (Indonesian Provinces)
  getSpatialMapData: async (salesType = 'REP', productType = 'Tire', period = 'CURRENT_MONTH', brand = 'ALL', warehouseId) => {
    const res = await apiClient.get(`/dashboard/spatial-map${buildQueryParams({
      sales_type: salesType,
      product_type: productType,
      period,
      brand,
      warehouse_id: warehouseId,
    })}`);
    return res.data || [];
  },

  // 6. Chart F: Top 5 SKU Supply Plan Terendah (Bottlenecks)
  getBottleneckSKUs: async (salesType = 'REP', productType = 'Tire', brand = 'ALL', warehouseId) => {
    const res = await apiClient.get(`/dashboard/bottleneck-skus${buildQueryParams({
      sales_type: salesType,
      product_type: productType,
      brand,
      warehouse_id: warehouseId,
    })}`);
    return res.data || [];
  },

  // 7. Chart G: Status SO Masuk Gudang
  getWarehouseSOStatus: async (salesType = 'REP', productType = 'Tire', brand = 'ALL', warehouseId) => {
    const res = await apiClient.get(`/dashboard/warehouse-so${buildQueryParams({
      sales_type: salesType,
      product_type: productType,
      brand,
      warehouse_id: warehouseId,
    })}`);
    return res.data;
  },

  // 8. Chart H: Rencana Kirim Armada Hari Ini
  getDailyTruckPlan: async (salesType = 'REP', productType = 'Tire', brand = 'ALL', warehouseId) => {
    const res = await apiClient.get(`/dashboard/daily-truck-plan${buildQueryParams({
      sales_type: salesType,
      product_type: productType,
      brand,
      warehouse_id: warehouseId,
    })}`);
    return res.data || [];
  },

  // 9. Chart I: Rincian Distribusi Kirim per Provinsi
  getProvinceTruckDistribution: async (salesType = 'REP', productType = 'Tire', filterType = 'ALL', brand = 'ALL', warehouseId) => {
    const res = await apiClient.get(`/dashboard/province-trucks${buildQueryParams({
      sales_type: salesType,
      product_type: productType,
      filter_type: filterType,
      brand,
      warehouse_id: warehouseId,
    })}`);
    return res.data || [];
  },

  // 10. Chart J: Preview SO per Area (Khusus REP Tire)
  getRepSOPreview: async ({ salesType = 'REP', productType = 'Tire', brand = 'ALL', brandType = 'ALL', tireType = 'ALL', selectedProvince = 'ALL', warehouseId } = {}) => {
    const res = await apiClient.get(`/dashboard/rep-preview${buildQueryParams({
      sales_type: salesType,
      product_type: productType,
      brand: brand !== 'ALL' ? brand : (brandType !== 'ALL' ? brandType : tireType),
      province: selectedProvince,
      warehouse_id: warehouseId,
    })}`);
    return res.data || [];
  },
};

export default dashboardApi;