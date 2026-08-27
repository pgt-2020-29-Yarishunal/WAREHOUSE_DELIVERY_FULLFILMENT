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
  productType,
  onProductTypeChange,
  availableProductTypes,
}) => {
  if (!topBar) return null;

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
            {[
              { id: 'REP', label: 'Replacement (REP)' },
              { id: 'EXP', label: 'Export (EXP)' },
              { id: 'OEM', label: 'OEM' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.pillBtn} ${salesType === item.id ? styles.activePill : ''}`}
                onClick={() => onSalesTypeChange(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterDivider} />

        {/* Cascading Filter: Tipe Produk */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Tipe Produk:</span>
          <div className={styles.pillGroup}>
            {['Tire', 'Tube', 'RIM Band'].map((prod) => {
              const isAvailable = availableProductTypes.includes(prod);
              const isSelected = productType === prod && isAvailable;

              return (
                <button
                  key={prod}
                  type="button"
                  disabled={!isAvailable}
                  className={`${styles.pillBtn} ${isSelected ? styles.activePill : ''} ${
                    !isAvailable ? styles.disabledPill : ''
                  }`}
                  onClick={() => isAvailable && onProductTypeChange(prod)}
                  title={!isAvailable ? `Tidak tersedia untuk tipe penjualan ${salesType}` : undefined}
                >
                  {prod}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};