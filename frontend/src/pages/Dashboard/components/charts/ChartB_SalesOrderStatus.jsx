import React from 'react';
import { NoData } from '../../../../components/common/index.js';
import styles from './ChartB_SalesOrderStatus.module.css';

export const ChartB_SalesOrderStatus = ({ data }) => {
  if (!data || !data.statuses || data.statuses.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Status Sales Order (Overview)</h3>
          <p className={styles.cardSubtitle}>Monitoring alur pengerjaan SO berjalan</p>
        </div>
        <NoData message="(No data available)" minHeight="180px" />
      </div>
    );
  }

  const { totalSO = 0, statuses = [] } = data;

  // Calculate SVG Donut stroke segments
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Status Sales Order (Overview)</h3>
        <p className={styles.cardSubtitle}>Monitoring alur pengerjaan SO berjalan</p>
      </div>

      <div className={styles.donutBody}>
        {/* SVG Donut */}
        <div className={styles.donutWrapper}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.donutSvg}>
            {statuses.map((item) => {
              const percent = totalSO > 0 ? (item.count / totalSO) * 100 : 0;
              const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += percent;

              return (
                <circle
                  key={item.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className={styles.donutSegment}
                />
              );
            })}
          </svg>

          {/* Center Metric */}
          <div className={styles.centerMetric}>
            <span className={styles.centerLabel}>Total SO</span>
            <span className={styles.centerValue}>{totalSO.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Legend Breakdown List */}
        <div className={styles.breakdownList}>
          {statuses.map((item) => {
            const percent = totalSO > 0 ? ((item.count / totalSO) * 100).toFixed(1) : '0.0';
            return (
              <div key={item.label} className={styles.breakdownItem}>
                <div className={styles.labelRow}>
                  <span className={styles.statusDot} style={{ backgroundColor: item.color }} />
                  <span className={styles.statusText}>{item.label}</span>
                </div>
                <div className={styles.valRow}>
                  <strong className={styles.countText}>{item.count.toLocaleString('id-ID')} SO</strong>
                  <span className={styles.percentText}>({percent}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};