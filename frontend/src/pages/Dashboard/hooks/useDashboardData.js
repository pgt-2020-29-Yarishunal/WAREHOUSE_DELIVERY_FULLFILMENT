import { useState, useEffect, useMemo, useCallback } from 'react';
import { dashboardApi } from '../api/dashboardApi.js';

export const useDashboardData = () => {
  // Global Top Bar Filter States
  const [period, setPeriod] = useState('CURRENT_MONTH');
  const [salesType, setSalesType] = useState('REP'); // REP | EXP | OEM
  const [productType, setProductType] = useState('Tire'); // Tire | Tube | RIM Band

  // Cascading Rule Engine for Sales & Product Types
  const availableProductTypes = useMemo(() => {
    if (salesType === 'EXP') return ['Tire'];
    if (salesType === 'OEM') return ['Tire', 'Tube', 'RIM Band'];
    return ['Tire', 'Tube']; // REP default
  }, [salesType]);

  // Sync product type when sales type changes
  useEffect(() => {
    if (!availableProductTypes.includes(productType)) {
      setProductType(availableProductTypes[0]);
    }
  }, [salesType, availableProductTypes, productType]);

  const handleSalesTypeChange = useCallback((newSalesType) => {
    setSalesType(newSalesType);
    if (newSalesType === 'EXP') setProductType('Tire');
    else if (newSalesType === 'OEM') setProductType('Tire');
    else setProductType('Tire');
  }, []);

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

  // Calculated MTD Metric according to formula: (currentWorkingDay / totalWorkingDays) * 100
  const targetMTDCalculated = useMemo(() => {
    if (!topBar || !topBar.totalWorkingDays || !topBar.totalTarget) return { nominal: 0, percentage: 0 };
    const percentage = (topBar.currentWorkingDay / topBar.totalWorkingDays) * 100;
    const nominal = (topBar.totalTarget / topBar.totalWorkingDays) * topBar.currentWorkingDay;
    return {
      nominal: Math.round(nominal),
      percentage: Number(percentage.toFixed(2)),
    };
  }, [topBar]);

  // Calculated EOW Metric according to formula: min(100, ((currentWorkingDay + 5) / totalWorkingDays) * 100)
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

  // Initial & Reactive Fetch
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
        dashboardApi.getTopBarMetrics(salesType, productType, period),
        dashboardApi.getSalesOrderStatus(salesType, productType),
        dashboardApi.getActualVsSupply(salesType, productType),
        dashboardApi.getAreaAchievement(salesType, productType),
        dashboardApi.getSpatialMapData(salesType, productType, period, 'ALL'),
        dashboardApi.getBottleneckSKUs(salesType, productType, 'ALL'),
        dashboardApi.getWarehouseSOStatus(salesType, productType),
        dashboardApi.getDailyTruckPlan(salesType, productType),
        dashboardApi.getProvinceTruckDistribution(salesType, productType, 'ALL'),
        dashboardApi.getRepSOPreview({ salesType, productType }),
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
      console.error('Error fetching dashboard datasets', err);
    } finally {
      setIsLoading(false);
    }
  }, [period, salesType, productType]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return {
    // Global filter states
    period,
    setPeriod,
    salesType,
    setSalesType: handleSalesTypeChange,
    productType,
    setProductType,
    availableProductTypes,

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