import React, { useState, useMemo, useEffect } from 'react';
import { NoData } from '../../../../components/common/index.js';
import styles from './ChartF_BottleneckSKU.module.css';

export const ChartF_BottleneckSKU = ({ data = [] }) => {
  const [brandFilter, setBrandFilter] = useState('ALL');

  const availableBrands = useMemo(() => {
    if (!data || data.length === 0) return ['ALL'];
    const brands = Array.from(new Set(data.map((d) => (d.category || d.brand)?.toUpperCase()).filter(Boolean)));
    return brands.length > 1 ? ['ALL', ...brands] : ['ALL', ...brands];
  }, [data]);

  useEffect(() => {
    if (!availableBrands.includes(brandFilter)) {
      setBrandFilter('ALL');
    }
  }, [availableBrands, brandFilter]);

  const filteredData = useMemo(() => {
    let list = data;
    if (brandFilter !== 'ALL') {
      list = data.filter((d) => {
        const itemCat = (d.category || d.brand || '').toUpperCase();
        return itemCat.includes(brandFilter.toUpperCase()) || brandFilter.toUpperCase().includes(itemCat);
      });
    }
    return [...list].sort((a, b) => (a.fulfillment || 0) - (b.fulfillment || 0));
  }, [data, brandFilter]);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Top 5 SKU Supply Bottleneck</h3>
          <p className={styles.cardSubtitle}>SKU dengan rasio pemenuhan supply plan paling rendah</p>
        </div>
        {availableBrands.length > 1 && (
          <div className={styles.brandChips}>
            {availableBrands.map((b) => (
              <button
                key={b}
                type="button"
                className={`${styles.chip} ${brandFilter === b ? styles.activeChip : ''}`}
                onClick={() => setBrandFilter(b)}
              >
                {b}
              </button>
            ))}
          </div>
        )}
      </div>

      {!data || data.length === 0 || filteredData.length === 0 ? (
        <NoData message="(No data available)" minHeight="180px" />
      ) : (
        <div className={styles.rankingList}>
          {filteredData.slice(0, 5).map((item, idx) => {
            const fulfillment = item.fulfillment || 0;
            const isCritical = fulfillment < 50;
            const unifiedLabel = item.pattern || `${item.brand || ''} ${item.sku || ''}`.trim();

            return (
              <div key={item.sku || idx} className={styles.rankItem}>
                <div className={styles.rankHeader}>
                  <div className={styles.skuBadge}>
                    <span className={styles.rankNum}>#{idx + 1}</span>
                    <strong className={styles.skuPattern}>{unifiedLabel}</strong>
                  </div>
                  <span className={`${styles.fulfillBadge} ${isCritical ? styles.badgeDanger : styles.badgeWarning}`}>
                    {fulfillment}% Terpenuhi
                  </span>
                </div>

                <div className={styles.track}>
                  <div
                    className={`${styles.fill} ${isCritical ? styles.fillDanger : styles.fillWarning}`}
                    style={{ width: `${Math.min(fulfillment, 100)}%` }}
                  />
                </div>
                <div className={styles.qtyRow}>
                  <span>Pasokan: {(item.supply || 0).toLocaleString('id-ID')} Pcs</span>
                  {item.demand > 0 ? (
                    <span>Kebutuhan: {item.demand.toLocaleString('id-ID')} Pcs</span>
                  ) : (
                    <span>SKU Kritis</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};