import React from 'react';
import { NoData } from '../../../../components/common/index.js';
import styles from './ChartC_ActualVsSupplyPlan.module.css';

export const ChartC_ActualVsSupplyPlan = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Actual Sales vs Supply Plan</h3>
            <p className={styles.cardSubtitle}>Pencapaian penjualan riil terhadap target pasokan</p>
          </div>
        </div>
        <NoData message="(No data available)" minHeight="180px" />
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => Math.max(d.actual, d.supplyPlan)), 25000);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Actual Sales vs Supply Plan</h3>
          <p className={styles.cardSubtitle}>Pencapaian penjualan riil terhadap target pasokan</p>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotActual}`} /> Actual Sales
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotSupply}`} /> Supply Plan
          </span>
        </div>
      </div>

      <div className={styles.categoryList}>
        {data.map((item) => {
          const achievement = item.supplyPlan > 0
            ? ((item.actual / item.supplyPlan) * 100).toFixed(1)
            : item.achievement || '0.0';
          const isHigh = Number(achievement) >= 100;
          const isMid = Number(achievement) >= 85 && Number(achievement) < 100;

          // Unified brand & jenis ban display
          const displayLabel = item.category || `${item.brand || ''} ${item.type || ''}`.trim().toUpperCase();

          return (
            <div key={displayLabel} className={styles.categoryItem}>
              <div className={styles.itemHeader}>
                <span className={styles.categoryName}>{displayLabel}</span>
                <span
                  className={`${styles.achievementBadge} ${
                    isHigh ? styles.badgeGreen : isMid ? styles.badgeYellow : styles.badgeRed
                  }`}
                >
                  {achievement}%
                </span>
              </div>

              {/* Grouped Bars */}
              <div className={styles.barsContainer}>
                {/* Actual Bar */}
                <div className={styles.barTrack}>
                  <div
                    className={styles.barActual}
                    style={{ width: `${(item.actual / maxVal) * 100}%` }}
                  />
                  <span className={styles.barLabel}>{item.actual.toLocaleString('id-ID')} Pcs</span>
                </div>

                {/* Supply Plan Bar */}
                <div className={styles.barTrack}>
                  <div
                    className={styles.barSupply}
                    style={{ width: `${(item.supplyPlan / maxVal) * 100}%` }}
                  />
                  <span className={styles.barLabelMuted}>
                    Plan: {item.supplyPlan.toLocaleString('id-ID')} Pcs
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};