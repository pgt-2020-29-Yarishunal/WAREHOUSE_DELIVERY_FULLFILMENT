import React from 'react';
import { NoData } from '../../../../components/common/index.js';
import styles from './ChartG_WarehouseSOStatus.module.css';

export const ChartG_WarehouseSOStatus = ({ data }) => {
  if (!data || !data.statuses || data.statuses.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Status SO Masuk Gudang</h3>
          <p className={styles.cardSubtitle}>Antrian fisik muat barang di loading dock</p>
        </div>
        <NoData message="(No data available)" minHeight="140px" />
      </div>
    );
  }

  const { totalWarehouseSO = 0, statuses = [] } = data;
  const size = 110;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let acc = 0;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Status SO Masuk Gudang</h3>
        <p className={styles.cardSubtitle}>Antrian fisik muat barang di loading dock</p>
      </div>

      <div className={styles.body}>
        <div className={styles.donutBox}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.svg}>
            {statuses.map((item) => {
              const dasharray = `${(item.percent / 100) * circumference} ${circumference}`;
              const dashoffset = -((acc / 100) * circumference);
              acc += item.percent;

              return (
                <circle
                  key={item.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dasharray}
                  strokeDashoffset={dashoffset}
                />
              );
            })}
          </svg>
          <div className={styles.centerText}>
            <span className={styles.centerNum}>{totalWarehouseSO.toLocaleString('id-ID')}</span>
            <span className={styles.centerSub}>Antrian SO</span>
          </div>
        </div>

        <div className={styles.list}>
          {statuses.map((s) => (
            <div key={s.label} className={styles.listItem}>
              <div className={styles.dotLabel}>
                <span className={styles.dot} style={{ backgroundColor: s.color }} />
                <span>{s.label}</span>
              </div>
              <strong className={styles.itemVal}>{s.count.toLocaleString('id-ID')} ({s.percent}%)</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};