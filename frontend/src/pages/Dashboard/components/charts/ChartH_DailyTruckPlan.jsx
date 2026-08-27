import React from 'react';
import { NoData } from '../../../../components/common/index.js';
import styles from './ChartH_DailyTruckPlan.module.css';

export const ChartH_DailyTruckPlan = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Rencana Kirim Armada Hari Ini</h3>
            <p className={styles.cardSubtitle}>Estimasi utilisasi armada Truk Engkel</p>
          </div>
          <span className={styles.unitBadge}>Satuan: Truk Engkel</span>
        </div>
        <NoData message="(No data available)" minHeight="140px" />
      </div>
    );
  }

  const maxTrucks = Math.max(...data.map((d) => d.truckCount || 0), 16);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Rencana Kirim Armada Hari Ini</h3>
          <p className={styles.cardSubtitle}>Estimasi utilisasi armada Truk Engkel</p>
        </div>
        <span className={styles.unitBadge}>Satuan: Truk Engkel</span>
      </div>

      <div className={styles.columnsContainer}>
        {data.map((item) => {
          const heightPercent = maxTrucks > 0 ? ((item.truckCount || 0) / maxTrucks) * 100 : 0;
          return (
            <div key={item.category} className={styles.columnItem}>
              <div className={styles.barArea}>
                <span className={styles.truckCountVal}>{item.truckCount || 0} Unit</span>
                <div
                  className={styles.columnBar}
                  style={{ height: `${Math.max(heightPercent, 2)}%`, backgroundColor: item.color }}
                />
              </div>
              <div className={styles.categoryLabel}>{item.category}</div>
              <span className={styles.tireQtyLabel}>{(item.tireQty || 0).toLocaleString('id-ID')} Pcs Ban</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};