import React from 'react';
import { Icon } from '../../../components/common/index.js';
import styles from './SummaryCards.module.css';

export const SummaryCards = ({ kpi }) => {
  return (
    <div className={styles.kpiGrid}>
      <div className={styles.kpiCard}>
        <div className={styles.kpiHeader}>
          <span className={styles.kpiTitle}>Total Pengiriman Hari Ini</span>
          <div className={`${styles.kpiIconWrapper} ${styles.blue}`}>
            <Icon name="local_shipping" size={22} />
          </div>
        </div>
        <div className={styles.kpiValue}>{kpi ? `${kpi.totalRitToday} Rit` : '—'}</div>
        <div className={styles.kpiFooter}>
          <span className={styles.kpiBadgePositive}>+4 Rit</span> dibanding kemarin
        </div>
      </div>

      <div className={styles.kpiCard}>
        <div className={styles.kpiHeader}>
          <span className={styles.kpiTitle}>Total Muatan Ban Keluar</span>
          <div className={`${styles.kpiIconWrapper} ${styles.orange}`}>
            <Icon name="inventory_2" size={22} />
          </div>
        </div>
        <div className={styles.kpiValue}>
          {kpi ? `${kpi.totalTireQty.toLocaleString('id-ID')} Pcs` : '—'}
        </div>
        <div className={styles.kpiFooter}>
          <span className={styles.kpiSubtitle}>Target Harian: 5,000 Pcs (97%)</span>
        </div>
      </div>

      <div className={styles.kpiCard}>
        <div className={styles.kpiHeader}>
          <span className={styles.kpiTitle}>Dalam Perjalanan (In Transit)</span>
          <div className={`${styles.kpiIconWrapper} ${styles.yellow}`}>
            <Icon name="route" size={22} />
          </div>
        </div>
        <div className={styles.kpiValue}>{kpi ? `${kpi.inTransitCount} Armada` : '—'}</div>
        <div className={styles.kpiFooter}>
          <span className={styles.kpiSubtitle}>2 armada mendekati tujuan</span>
        </div>
      </div>

      <div className={styles.kpiCard}>
        <div className={styles.kpiHeader}>
          <span className={styles.kpiTitle}>Terkirim Selesai</span>
          <div className={`${styles.kpiIconWrapper} ${styles.green}`}>
            <Icon name="verified" size={22} />
          </div>
        </div>
        <div className={styles.kpiValue}>{kpi ? `${kpi.deliveredCount} Rit` : '—'}</div>
        <div className={styles.kpiFooter}>
          <span className={styles.kpiBadgePositive}>100% On-Time Delivery</span>
        </div>
      </div>
    </div>
  );
};
