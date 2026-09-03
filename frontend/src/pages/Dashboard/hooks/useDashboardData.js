import { useState, useEffect, useMemo, useCallback } from 'react';
import { dashboardApi } from '../api/dashboardApi.js';
import { tokenStorage } from '../../../services/tokenStorage.js';

export const useDashboardData = () => {
  // Active warehouse resolution
  const user = tokenStorage.getUser();
  const defaultWarehouse = user?.role === 'executive' ? 'ALL' : (user?.warehouse_id || 'BPW');
  const [selectedWarehouse, setSelectedWarehouse] = useState(defaultWarehouse);

  // Global Filter States
  const [period, setPeriod] = useState('CURRENT_MONTH');
  const [salesType, setSalesType] = useState('REP'); // REP | OEM | EXP
  const [productType, setProductType] = useState('Tire'); // Tire | Tube | Flap | RIM Band | Valve
  const [brandFilter, setBrandFilter] = useState('ALL');

  // Filter configuration from database / backend rules
  const [filterConfig, setFilterConfig] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadFilters = async () => {
      try {
        const config = await dashboardApi.getFilterConfig(selectedWarehouse);
        if (isMounted && config) {
          setFilterConfig(config);
        }
      } catch (err) {
        console.error('Failed to load filter config:', err);
      }
    };
    loadFilters();
    return () => { isMounted = false; };
  }, [selectedWarehouse]);

  // Derived available sales types from database
  const availableSalesTypes = useMemo(() => {
    return filterConfig?.availableSalesTypes || ['REP', 'OEM', 'EXP'];
  }, [filterConfig]);

  // Derived available product types per sales type from database
  const availableProductTypes = useMemo(() => {
    if (filterConfig?.availableProductTypes?.[salesType]) {
      return filterConfig.availableProductTypes[salesType];
    }
    return ['Tire'];
  }, [filterConfig, salesType]);

  // Derived available brand filters per sales type & product type from database
  const availableBrands = useMemo(() => {
    const keyWithSales = `${salesType}_${productType}`;
    if (filterConfig?.availableBrands?.[keyWithSales]) {
      return filterConfig.availableBrands[keyWithSales];
    }
    if (filterConfig?.availableBrands?.[productType]) {
      return filterConfig.availableBrands[productType];
    }
    return ['ALL'];
  }, [filterConfig, salesType, productType]);

  // Sync selected values when available options change
  useEffect(() => {
    if (!availableSalesTypes.includes(salesType)) {
      setSalesType(availableSalesTypes[0] || 'REP');
    }
  }, [availableSalesTypes, salesType]);

  useEffect(() => {
    if (!availableProductTypes.includes(productType)) {
      setProductType(availableProductTypes[0] || 'Tire');
    }
  }, [availableProductTypes, productType]);

  useEffect(() => {
    if (availableBrands.length > 0 && !availableBrands.includes(brandFilter)) {
      setBrandFilter('ALL');
    }
  }, [availableBrands, brandFilter]);

  // Data States for Top Bar & 10 Charts
  const [topBar, setTopBar] = useState(null);
  const [soStatus, setSoStatus] = useState(null);
  const [actualVsSupply, setActualVsSupply] = useState([]);
  const [areaAchievement, setAreaAchievement] = useState([]);
  const [spatialMap, setSpatialMap] = useState([]);
  const [bottleneckSKUs, setBottleneckSKUs] = useState([]);
  const [warehouseSO, setWarehouseSO] = useState(null);
  const [dailyTruckPlan, setDailyTruckPlan] = useState([]);
  const [provinceTrucks, setProvinceTrucks] = useState([]);
  const [repSOPreview, setRepSOPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculated MTD Metric: (currentWorkingDay / totalWorkingDays) * 100
  const targetMTDCalculated = useMemo(() => {
    if (!topBar || !topBar.totalWorkingDays || !topBar.totalTarget) return { nominal: 0, percentage: 0 };
    const percentage = (topBar.currentWorkingDay / topBar.totalWorkingDays) * 100;
    const nominal = (topBar.totalTarget / topBar.totalWorkingDays) * topBar.currentWorkingDay;
    return {
      nominal: Math.round(nominal),
      percentage: Number(percentage.toFixed(2)),
    };
  }, [topBar]);

  // Calculated EOW Metric: min(100, ((currentWorkingDay + 5) / totalWorkingDays) * 100)
  const targetEOWCalculated = useMemo(() => {
    if (!topBar || !topBar.totalWorkingDays || !topBar.totalTarget) return { nominal: 0, percentage: 0 };
    const percentage = Math.min(100, ((topBar.currentWorkingDay + 5) / topBar.totalWorkingDays) * 100);
    const nominal = Math.min(
      topBar.totalTarget,
      (topBar.totalTarget / topBar.totalWorkingDays) * (topBar.currentWorkingDay + 5)
    );
    return {
      nominal: Math.round(nominal),
      percentage: Number(percentage.toFixed(2)),
    };
  }, [topBar]);

  // Initial & Reactive Fetch from Backend API
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        topBarRes,
        soStatusRes,
        actualVsSupplyRes,
        areaAchRes,
        spatialRes,
        bottleneckRes,
        whSoRes,
        truckPlanRes,
        provinceTrucksRes,
        repPreviewRes,
      ] = await Promise.all([
        dashboardApi.getTopBarMetrics(salesType, productType, period, brandFilter, selectedWarehouse),
        dashboardApi.getSalesOrderStatus(salesType, productType, brandFilter, selectedWarehouse),
        dashboardApi.getActualVsSupply(salesType, productType, brandFilter, selectedWarehouse),
        dashboardApi.getAreaAchievement(salesType, productType, brandFilter, selectedWarehouse),
        dashboardApi.getSpatialMapData(salesType, productType, period, brandFilter, selectedWarehouse),
        dashboardApi.getBottleneckSKUs(salesType, productType, brandFilter, selectedWarehouse),
        dashboardApi.getWarehouseSOStatus(salesType, productType, brandFilter, selectedWarehouse),
        dashboardApi.getDailyTruckPlan(salesType, productType, brandFilter, selectedWarehouse),
        dashboardApi.getProvinceTruckDistribution(salesType, productType, 'ALL', brandFilter, selectedWarehouse),
        dashboardApi.getRepSOPreview({
          salesType,
          productType,
          brand: brandFilter,
          warehouseId: selectedWarehouse,
        }),
      ]);

      setTopBar(topBarRes);
      setSoStatus(soStatusRes);
      setActualVsSupply(actualVsSupplyRes);
      setAreaAchievement(areaAchRes);
      setSpatialMap(spatialRes);
      setBottleneckSKUs(bottleneckRes);
      setWarehouseSO(whSoRes);
      setDailyTruckPlan(truckPlanRes);
      setProvinceTrucks(provinceTrucksRes);
      setRepSOPreview(repPreviewRes);
    } catch (err) {
      console.error('Error fetching dashboard datasets from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, [period, salesType, productType, brandFilter, selectedWarehouse]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return {
    // Warehouse Filter
    selectedWarehouse,
    setSelectedWarehouse,
    userRole: user?.role,

    // Global filter states
    period,
    setPeriod,
    salesType,
    setSalesType,
    availableSalesTypes,
    productType,
    setProductType,
    availableProductTypes,
    brandFilter,
    setBrandFilter,
    availableBrands,

    // Metrics & Datasets
    topBar,
    targetMTDCalculated,
    targetEOWCalculated,
    soStatus,
    actualVsSupply,
    areaAchievement,
    spatialMap,
    bottleneckSKUs,
    warehouseSO,
    dailyTruckPlan,
    provinceTrucks,
    repSOPreview,
    isLoading,
    refresh: loadAllData,
  };
};