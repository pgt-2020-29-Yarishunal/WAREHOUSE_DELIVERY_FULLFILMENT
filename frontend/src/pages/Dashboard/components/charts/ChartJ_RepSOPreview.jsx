import React, { useState, useMemo } from 'react';
import { NoData } from '../../../../components/common/index.js';
import styles from './ChartJ_RepSOPreview.module.css';

export const ChartJ_RepSOPreview = ({
  data = [],
  salesType = 'REP',
  productType = 'Tire',
  availableBrands = ['ALL'],
  targetMTD = { percentage: 63.16 },
  targetEOW = { percentage: 89.47 },
}) => {
  // Render ONLY when Sales Type is 'REP' and Product Type is 'Tire'
  if (salesType !== 'REP' || productType !== 'Tire') return null;

  // Unified In-Card Filter States
  const [selectedBrandType, setSelectedBrandType] = useState('ALL');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState('ALL');

  const filterOptions = useMemo(() => {
    if (availableBrands && availableBrands.length > 0) {
      return availableBrands.map((b) => ({ id: b, label: b === 'ALL' ? 'ALL' : b }));
    }
    return [{ id: 'ALL', label: 'ALL' }];
  }, [availableBrands]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemUnified = (item.category || `${item.brand || ''} ${item.tireType || ''}`).trim().toUpperCase();
      const matchBrandType =
        selectedBrandType === 'ALL' ||
        itemUnified === selectedBrandType.toUpperCase() ||
        itemUnified.includes(selectedBrandType.toUpperCase()) ||
        selectedBrandType.toUpperCase().includes(itemUnified);

      const matchProv =
        selectedProvinceFilter === 'ALL' ||
        item.province?.toLowerCase() === selectedProvinceFilter.toLowerCase();

      return matchBrandType && matchProv;
    });
  }, [data, selectedBrandType, selectedProvinceFilter]);

  // Global Reference Target Benchmarks
  const targetMTDPercent = targetMTD?.percentage ?? 63.16;
  const targetEOWPercent = targetEOW?.percentage ?? 89.47;
  const maxScalePercent = 110;

  // Distinct province list for dropdown
  const uniqueProvinces = useMemo(() => {
    const provs = Array.from(new Set(data.map((d) => d.province).filter(Boolean)));
    return provs;
  }, [data]);

  return (
    <div className={styles.card}>
      {/* Header & In-Card Control Bar */}
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.titleRow}>
            <h3 className={styles.cardTitle}>Preview SO per Area</h3>
            <span className={styles.repOnlyBadge}>Khusus Kanal REP (Tire)</span>
          </div>
          <p className={styles.cardSubtitle}>
            Struktur komposisi antrian SO per area terhadap Target MTD ({targetMTDPercent}%) & Target EOW ({targetEOWPercent}%)
          </p>
        </div>

        {/* Unified Controls Bar */}
        <div className={styles.controlsBar}>
          {/* 1. Unified Brand & Jenis Ban Pill Selector */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Kategori:</span>
            <div className={styles.chips}>
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`${styles.chip} ${selectedBrandType === opt.id ? styles.activeChip : ''}`}
                  onClick={() => setSelectedBrandType(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Province Filter Dropdown */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Area / Provinsi:</span>
            <select
              value={selectedProvinceFilter}
              onChange={(e) => setSelectedProvinceFilter(e.target.value)}
              className={styles.provinceSelect}
            >
              <option value="ALL">Seluruh Area ({uniqueProvinces.length})</option>
              {uniqueProvinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Legend Row */}
      <div className={styles.legendRow}>
        <div className={styles.barSegmentsLegend}>
          <span className={styles.legendItem}>
            <span className={`${styles.colorBox} ${styles.colorClosed}`} /> SO Closed / Terkirim
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.colorBox} ${styles.colorLoading}`} /> SO Loading Hari Ini
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.colorBox} ${styles.colorGulungan}`} /> SO Gulungan
          </span>
        </div>

        <div className={styles.referenceLegend}>
          <span className={styles.refItem}>
            <span className={styles.refLineMTD} /> Garis Target MTD ({targetMTDPercent}%)
          </span>
          <span className={styles.refItem}>
            <span className={styles.refLineEOW} /> Garis Target EOW ({targetEOWPercent}%)
          </span>
        </div>
      </div>

      {/* Chart Visualization Area or No Data */}
      {!data || data.length === 0 || filteredData.length === 0 ? (
        <NoData message="(No data available)" minHeight="200px" />
      ) : (
        <div className={styles.chartCanvasContainer}>
          {/* Continuous Reference Lines */}
          <div
            className={styles.continuousLineMTD}
            style={{ left: `calc(180px + (100% - 180px) * ${targetMTDPercent / maxScalePercent})` }}
          >
            <span className={styles.lineTagMTD}>Target MTD ({targetMTDPercent}%)</span>
          </div>

          <div
            className={styles.continuousLineEOW}
            style={{ left: `calc(180px + (100% - 180px) * ${targetEOWPercent / maxScalePercent})` }}
          >
            <span className={styles.lineTagEOW}>Target EOW ({targetEOWPercent}%)</span>
          </div>

          {/* Stacked Horizontal Bar List */}
          <div className={styles.barList}>
            {filteredData.map((item, idx) => {
              const closedVal = Number(item.closed || 0);
              const loadingVal = Number(item.loadingHariIni || 0);
              const gulunganVal = Number(item.gulungan || 0);
              const totalPercent = (closedVal + loadingVal + gulunganVal).toFixed(2);

              const closedWidth = (closedVal / maxScalePercent) * 100;
              const loadingWidth = (loadingVal / maxScalePercent) * 100;
              const gulunganWidth = (gulunganVal / maxScalePercent) * 100;

              const displayLabel = item.category || `${item.brand || ''} ${item.tireType || ''}`.trim();

              return (
                <div key={`${item.province}-${item.category || idx}`} className={styles.barRow}>
                  {/* Left: Province label & closed percentage */}
                  <div className={styles.provinceCol}>
                    <span className={styles.provinceName}>{item.province}</span>
                    <span className={styles.provinceTotal}>
                      {closedVal.toFixed(1)}% ({totalPercent}% total)
                      {displayLabel && <span className={styles.categoryTag}> • {displayLabel}</span>}
                    </span>
                  </div>

                  {/* Right: Stacked Bar Track */}
                  <div className={styles.trackCol}>
                    <div className={styles.stackedTrack}>
                      {/* Segment 1: Closed */}
                      {closedWidth > 0 && (
                        <div
                          className={`${styles.segment} ${styles.segmentClosed}`}
                          style={{ width: `${closedWidth}%` }}
                          title={`Closed / Terkirim: ${closedVal.toFixed(2)}%`}
                        />
                      )}
                      {/* Segment 2: Loading Hari Ini */}
                      {loadingWidth > 0 && (
                        <div
                          className={`${styles.segment} ${styles.segmentLoading}`}
                          style={{ width: `${loadingWidth}%` }}
                          title={`Loading Hari Ini: ${loadingVal.toFixed(2)}%`}
                        />
                      )}
                      {/* Segment 3: Gulungan */}
                      {gulunganWidth > 0 && (
                        <div
                          className={`${styles.segment} ${styles.segmentGulungan}`}
                          style={{ width: `${gulunganWidth}%` }}
                          title={`Gulungan: ${gulunganVal.toFixed(2)}%`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};