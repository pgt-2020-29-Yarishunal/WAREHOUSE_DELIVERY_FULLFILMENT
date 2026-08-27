import React from 'react';
import { NoData } from '../../../../components/common/index.js';
import styles from './ChartD_TargetPerArea.module.css';

export const ChartD_TargetPerArea = ({ data = [], salesType = 'REP' }) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Pencapaian Target per Area</h3>
            <p className={styles.cardSubtitle}>
              {salesType === 'REP'
                ? 'Distribusi pasar Replacement (Seluruh Provinsi)'
                : salesType === 'OEM'
                ? 'Distribusi Pabrikan OEM (Jawa Barat & DKI Jakarta)'
                : 'Distribusi Pasar Ekspor (International)'}
            </p>
          </div>
        </div>
        <NoData message="(No data available)" minHeight="200px" />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Pencapaian Target per Area</h3>
          <p className={styles.cardSubtitle}>
            {salesType === 'REP'
              ? 'Distribusi pasar Replacement (Seluruh Provinsi)'
              : salesType === 'OEM'
              ? 'Distribusi Pabrikan OEM (Jawa Barat & DKI Jakarta)'
              : 'Distribusi Pasar Ekspor (International)'}
          </p>
        </div>
      </div>

      <div className={styles.barList}>
        {data.map((item) => {
          const isOver = item.achievement >= 100;
          return (
            <div key={item.area} className={styles.barRow}>
              <div className={styles.areaInfo}>
                <span className={styles.areaName}>{item.area}</span>
                <span className={styles.areaVolume}>
                  {item.actual.toLocaleString('id-ID')} / {item.target.toLocaleString('id-ID')} Pcs
                </span>
              </div>

              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${isOver ? styles.fillOver : styles.fillNormal}`}
                  style={{ width: `${Math.min(item.achievement, 100)}%` }}
                />
                <span className={styles.percentBadge}>{item.achievement}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};