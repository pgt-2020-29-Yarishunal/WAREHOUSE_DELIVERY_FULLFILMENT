import React, { useState } from 'react';
import { NoData } from '../../../../components/common/index.js';
import styles from './ChartI_ProvinceTruckDistribution.module.css';

export const ChartI_ProvinceTruckDistribution = ({ data = [] }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');

  if (!data || data.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Rincian Distribusi Kirim per Provinsi</h3>
            <p className={styles.cardSubtitle}>Jumlah armada Truk Engkel per provinsi tujuan</p>
          </div>
        </div>
        <NoData message="(No data available)" minHeight="160px" />
      </div>
    );
  }

  const getCount = (item) => {
    if (activeFilter === 'Gulungan') return item.gulungan ?? item.truckCount ?? 0;
    if (activeFilter === 'Loading Hari Ini') return item.loadingHariIni ?? item.truckCount ?? 0;
    if (activeFilter === 'Loading Selanjutnya') return item.loadingSelanjutnya ?? item.truckCount ?? 0;
    return item.total ?? item.truckCount ?? 0;
  };

  const displayedData = data.map((d) => ({
    ...d,
    currentCount: getCount(d),
  }));

  const maxVal = Math.max(...displayedData.map((d) => d.currentCount || 0), 18);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Rincian Distribusi Kirim per Provinsi</h3>
          <p className={styles.cardSubtitle}>Jumlah armada Truk Engkel per provinsi tujuan</p>
        </div>

        <div className={styles.filterPills}>
          {['ALL', 'Gulungan', 'Loading Hari Ini', 'Loading Selanjutnya'].map((f) => (
            <button
              key={f}
              type="button"
              className={`${styles.filterPill} ${activeFilter === f ? styles.activePill : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chartArea}>
        {displayedData.map((item) => {
          const heightPercent = maxVal > 0 ? (item.currentCount / maxVal) * 100 : 0;
          return (
            <div key={item.province} className={styles.columnCol}>
              <div className={styles.colTrack}>
                <span className={styles.truckVal}>{item.currentCount}</span>
                <div
                  className={styles.colBar}
                  style={{ height: `${Math.max(heightPercent, 2)}%` }}
                />
              </div>
              <span className={styles.provinceLabel}>{item.province}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};