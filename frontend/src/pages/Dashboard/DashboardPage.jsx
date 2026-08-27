import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDashboardData } from './hooks/useDashboardData.js';
import { TopBarMetrics } from './components/TopBarMetrics/TopBarMetrics.jsx';
import { ChartB_SalesOrderStatus } from './components/charts/ChartB_SalesOrderStatus.jsx';
import { ChartC_ActualVsSupplyPlan } from './components/charts/ChartC_ActualVsSupplyPlan.jsx';
import { ChartD_TargetPerArea } from './components/charts/ChartD_TargetPerArea.jsx';
import { ChartE_SpatialMap } from './components/charts/ChartE_SpatialMap.jsx';
import { ChartF_BottleneckSKU } from './components/charts/ChartF_BottleneckSKU.jsx';
import { ChartG_WarehouseSOStatus } from './components/charts/ChartG_WarehouseSOStatus.jsx';
import { ChartH_DailyTruckPlan } from './components/charts/ChartH_DailyTruckPlan.jsx';
import { ChartI_ProvinceTruckDistribution } from './components/charts/ChartI_ProvinceTruckDistribution.jsx';
import { ChartJ_RepSOPreview } from './components/charts/ChartJ_RepSOPreview.jsx';
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
  const { globalSearch } = useOutletContext() || {};

  const {
    period,
    setPeriod,
    salesType,
    setSalesType,
    productType,
    setProductType,
    availableProductTypes,
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
  } = useDashboardData();

  if (isLoading && !topBar) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <span className={styles.loadingText}>Memuat data dashboard operasional...</span>
      </div>
    );
  }

  return (
    <div className={styles.dashboardRoot}>
      {/* 1. Global Filter & Header Metrics (Top Bar Section) */}
      <TopBarMetrics
        topBar={topBar}
        targetMTD={targetMTDCalculated}
        period={period}
        onPeriodChange={setPeriod}
        salesType={salesType}
        onSalesTypeChange={setSalesType}
        productType={productType}
        onProductTypeChange={setProductType}
        availableProductTypes={availableProductTypes}
      />

      {/* 2. Analytical Layer 1: Status Overview (Chart B & Chart C) */}
      <section className={styles.gridLayer1}>
        <div className={styles.gridCol}>
          <ChartB_SalesOrderStatus data={soStatus} />
        </div>
        <div className={styles.gridCol}>
          <ChartC_ActualVsSupplyPlan data={actualVsSupply} />
        </div>
      </section>

      {/* 3. Regional & Geospatial Layer (Chart E & Chart D) */}
      <section className={styles.gridRegional}>
        <div className={styles.gridCol}>
          <ChartE_SpatialMap
            data={spatialMap}
            salesType={salesType}
            productType={productType}
            period={period}
          />
        </div>
        <div className={styles.gridCol}>
          <ChartD_TargetPerArea data={areaAchievement} salesType={salesType} />
        </div>
      </section>

      {/* 4. Warehouse Operations & Bottlenecks (Chart F & Chart G) */}
      <section className={styles.gridLayer3}>
        <div className={styles.gridCol}>
          <ChartF_BottleneckSKU data={bottleneckSKUs} />
        </div>
        <div className={styles.gridCol}>
          <ChartG_WarehouseSOStatus data={warehouseSO} />
        </div>
      </section>

      {/* 5. Fleet Logistics & Province Distribution (Chart H & Chart I) */}
      <section className={styles.gridLayer4}>
        <div className={styles.gridCol}>
          <ChartH_DailyTruckPlan data={dailyTruckPlan} />
        </div>
        <div className={styles.gridCol}>
          <ChartI_ProvinceTruckDistribution data={provinceTrucks} />
        </div>
      </section>

      {/* 6. Distribution Channel Deep-Dive: Chart J (Khusus Tipe REP Tire) */}
      {salesType === 'REP' && productType === 'Tire' && (
        <section className={styles.fullWidthSection}>
          <ChartJ_RepSOPreview
            data={repSOPreview}
            salesType={salesType}
            productType={productType}
            targetMTD={targetMTDCalculated}
            targetEOW={targetEOWCalculated}
          />
        </section>
      )}
    </div>
  );
};