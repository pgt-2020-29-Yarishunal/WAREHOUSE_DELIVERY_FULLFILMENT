import React from 'react';
import { Icon } from '../../../../components/common/index.js';
import styles from './TopBarMetrics.module.css';

export const TopBarMetrics = ({
  topBar,
  targetMTD,
  period,
  onPeriodChange,
  salesType,
  onSalesTypeChange,
  availableSalesTypes = ['REP', 'OEM', 'EXP'],
  productType,
  onProductTypeChange,
  availableProductTypes = ['Tire'],
  brandFilter = 'ALL',
  onBrandFilterChange,
  availableBrands = ['ALL'],
  selectedWarehouse,
  onWarehouseChange,
  userRole,
}) => {
  if (!topBar) return null;

  const salesTypeLabels = {
    REP: 'Replacement (REP)',
    OEM: 'OEM',
    EXP: 'Export (EXP)',
  };

  return (
    <section className={styles.topBarContainer} aria-label="Global Filter & Header Metrics">
      {/* Row 1: Operational Working Day & Target MTD KPI Cards */}
      <div className={styles.metricCardsRow}>
        {/* Working Day Pacing Card */}
        <div className={styles.metricCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconBadge}>
              <Icon name="calendar_month" size={20} color="var(--color-primary)" />
            </div>
            <span className={styles.cardSubtitle}>KALENDER OPERASIONAL GUDANG</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.workingDayMain}>
              Hari ke-<strong className={styles.highlightDay}>{topBar.currentWorkingDay}</strong> dari{' '}
              {topBar.totalWorkingDays} Hari Kerja
            </div>
            <div className={styles.calendarPeriod}>
              Periode Aktif: {topBar.monthName} {topBar.year}
            </div>
          </div>
        </div>

        {/* Target MTD Pacing Card */}
        <div className={styles.metricCard}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconBadge} ${styles.badgeOrange}`}>
              <Icon name="speed" size={20} color="var(--color-secondary)" />
            </div>
            <span className={styles.cardSubtitle}>TARGET MTD (MONTH-TO-DATE)</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.mtdValueRow}>
              <div className={styles.mtdPercentBadgeLarge}>
                <span className={styles.mtdPercentValue}>{targetMTD.percentage}%</span>
                <span className={styles.mtdPercentLabel}>Target Waktu Operasional</span>
              </div>
            </div>
            <div className={styles.progressBarWrapper}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${Math.min(targetMTD.percentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Global Control & Cascading Filters Station */}
      <div className={styles.filtersStation}>
        {/* Executive Warehouse Selector if applicable */}
        {userRole === 'executive' && onWarehouseChange && (
          <>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Gudang:</span>
              <div className={styles.pillGroup}>
                {[
                  { id: 'ALL', label: 'Semua Gudang' },
                  { id: 'APW', label: 'APW (Bias)' },
                  { id: 'BPW', label: 'BPW (Motor)' },
                  { id: 'DPW', label: 'DPW (Radial)' },
                  { id: 'RPW', label: 'RPW (TBR)' },
                ].map((wh) => (
                  <button
                    key={wh.id}
                    type="button"
                    className={`${styles.pillBtn} ${selectedWarehouse === wh.id ? styles.activePill : ''}`}
                    onClick={() => onWarehouseChange(wh.id)}
                  >
                    {wh.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.filterDivider} />
          </>
        )}

        {/* Period Selector (Segmented Button Group) */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Periode:</span>
          <div className={styles.segmentedControl} role="radiogroup" aria-label="Filter Periode">
            {[
              { id: 'CURRENT_MONTH', label: 'Bulan Berjalan' },
              { id: 'LAST_MONTH', label: 'Bulan Kemarin' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`${styles.segmentedBtn} ${period === opt.id ? styles.activeSegment : ''}`}
                onClick={() => onPeriodChange(opt.id)}
                role="radio"
                aria-checked={period === opt.id}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterDivider} />

        {/* Cascading Filter: Tipe Penjualan */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Tipe Penjualan:</span>
          <div className={styles.pillGroup}>
            {availableSalesTypes.map((item) => (
              <button
                key={item}
                type="button"
                className={`${styles.pillBtn} ${salesType === item ? styles.activePill : ''}`}
                onClick={() => onSalesTypeChange(item)}
              >
                {salesTypeLabels[item] || item}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterDivider} />

        {/* Cascading Filter: Tipe Produk */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Tipe Produk:</span>
          <div className={styles.pillGroup}>
            {availableProductTypes.map((prod) => {
              const isSelected = productType === prod;
              return (
                <button
                  key={prod}
                  type="button"
                  className={`${styles.pillBtn} ${isSelected ? styles.activePill : ''}`}
                  onClick={() => onProductTypeChange(prod)}
                >
                  {prod}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cascading Sub-Filter: Merek / Kategori (Misal IRC Tubeless vs Tubetype, Zeneos) */}
        {availableBrands && availableBrands.length > 1 && onBrandFilterChange && (
          <>
            <div className={styles.filterDivider} />
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Kategori / Merek:</span>
              <div className={styles.pillGroup}>
                {availableBrands.map((b) => {
                  const isSelected = brandFilter === b;
                  const label = b === 'ALL' ? 'Semua Merek' : b;
                  return (
                    <button
                      key={b}
                      type="button"
                      className={`${styles.pillBtn} ${isSelected ? styles.activePill : ''}`}
                      onClick={() => onBrandFilterChange(b)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};