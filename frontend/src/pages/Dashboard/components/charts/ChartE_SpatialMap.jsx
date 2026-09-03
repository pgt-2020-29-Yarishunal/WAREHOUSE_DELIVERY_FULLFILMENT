import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { NoData } from '../../../../components/common/index.js';
import { dashboardApi } from '../../api/dashboardApi.js';
import { INDONESIA_PROVINCES_PATHS } from '../../data/indonesiaProvincesPaths.js';
import {
  PROVINCE_DISPLAY_NAMES,
  PROVINCE_REGION_GROUP,
  resolveGeoJSONProvinceName,
} from '../../data/provinceMapping.js';
import styles from './ChartE_SpatialMap.module.css';

export const ChartE_SpatialMap = ({ data = [], salesType = 'REP', productType = 'Tire', period = 'CURRENT_MONTH', availableBrands = ['ALL'] }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [mapData, setMapData] = useState(data);
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Pan and Zoom states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgContainerRef = useRef(null);

  const isAvailable = salesType === 'REP' && period === 'CURRENT_MONTH';

  // Category filter options dynamic based on active warehouse available brands
  const filterOptions = useMemo(() => {
    if (availableBrands && availableBrands.length > 0) {
      return availableBrands.map((b) => ({ id: b, label: b === 'ALL' ? 'ALL' : b }));
    }
    return [{ id: 'ALL', label: 'ALL' }];
  }, [availableBrands]);

  // Reset category if not in filter options when productType switches
  useEffect(() => {
    if (!filterOptions.some((opt) => opt.id === selectedCategory)) {
      setSelectedCategory('ALL');
    }
  }, [filterOptions, selectedCategory]);

  // Fetch / Sync sub-dataset based on in-card unified filter
  useEffect(() => {
    if (!isAvailable) {
      setMapData([]);
      return;
    }

    if (selectedCategory !== 'ALL') {
      dashboardApi.getSpatialMapData(salesType, productType, period, selectedCategory).then((res) => {
        if (res && res.length > 0) {
          setMapData(res);
        } else {
          setMapData([]);
        }
      });
    } else {
      dashboardApi.getSpatialMapData(salesType, productType, period, 'ALL').then((res) => {
        if (res && res.length > 0) {
          setMapData(res);
        } else {
          setMapData(data || []);
        }
      });
    }
  }, [selectedCategory, data, isAvailable, salesType, productType, period]);

  // Build high-speed lookup dictionary keyed by GeoJSON province name
  const provinceDataMap = useMemo(() => {
    const map = {};
    if (!mapData || mapData.length === 0) return map;

    mapData.forEach((item) => {
      const geoName = resolveGeoJSONProvinceName(item.name);
      if (geoName) {
        map[geoName] = {
          rawName: item.name,
          displayName: PROVINCE_DISPLAY_NAMES[geoName] || item.name,
          geoName,
          region: PROVINCE_REGION_GROUP[geoName] || item.region || 'Nasional',
          achievement: item.achievement || 0,
          leader: item.leader || (selectedCategory !== 'ALL' ? selectedCategory : 'IRC'),
        };
      }
    });

    return map;
  }, [mapData, selectedCategory]);

  // National summary statistics
  const summaryStats = useMemo(() => {
    const entries = Object.values(provinceDataMap);
    if (entries.length === 0) {
      return { total: 0, avg: 0, highest: null, lowest: null };
    }

    const sorted = [...entries].sort((a, b) => b.achievement - a.achievement);
    const sum = sorted.reduce((acc, curr) => acc + curr.achievement, 0);
    const avg = sum / sorted.length;

    return {
      total: entries.length,
      avg: Number(avg.toFixed(1)),
      highest: sorted[0],
      lowest: sorted[sorted.length - 1],
    };
  }, [provinceDataMap]);

  // Color interpolation for choropleth map
  const getProvinceColor = useCallback((geoName) => {
    const item = provinceDataMap[geoName];
    if (!item || item.achievement === undefined || item.achievement === null) {
      return '#e2e8f0'; // No data slate
    }

    const ach = item.achievement;
    if (ach >= 100) return '#059669'; // Exceeded Target (Emerald Green)
    if (ach >= 75) return '#0284c7';  // Strong Performance (Ocean Blue)
    if (ach >= 50) return '#f59e0b';  // Moderate (Amber Gold)
    return '#e11d48';                 // Underperforming (Rose Red)
  }, [provinceDataMap]);

  // Zoom and Pan Handlers
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.3, 4));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.3, 0.8));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedProvince(null);
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    if (svgContainerRef.current) {
      const rect = svgContainerRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left + 15;
      const rawY = e.clientY - rect.top - 10;
      const clampedX = Math.max(10, Math.min(rawX, rect.width - 260));
      const clampedY = Math.max(10, Math.min(rawY, rect.height - 180));
      setTooltipPos({ x: clampedX, y: clampedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const activeItem = hoveredProvince || selectedProvince;

  return (
    <div className={styles.card}>
      {/* Card Header with Title, Metrics Summary and Filter Tabs */}
      <div className={styles.cardHeader}>
        <div className={styles.titleSection}>
          <div className={styles.titleRow}>
            <h3 className={styles.cardTitle}>Peta Distribusi Pencapaian Target Spasial</h3>
            <span className={styles.liveBadge}>GeoChart 34 Provinsi</span>
          </div>
          <p className={styles.cardSubtitle}>
            Visualisasi choropleth spasial intensitas pencapaian target penjualan ban per provinsi se-Indonesia
          </p>
        </div>

        {/* Filter Chips */}
        {isAvailable && (
          <div className={styles.controlsRow}>
            <div className={styles.brandGroup}>
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`${styles.brandChip} ${selectedCategory === opt.id ? styles.activeBrand : ''}`}
                  onClick={() => {
                    setSelectedCategory(opt.id);
                    setSelectedProvince(null);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mini KPI Bar */}
      {isAvailable && summaryStats.total > 0 && (
        <div className={styles.kpiBar}>
          <div className={styles.kpiItem}>
            <span className={styles.kpiLabel}>Rata-rata Nasional</span>
            <span className={styles.kpiValue} style={{ color: summaryStats.avg >= 75 ? '#0284c7' : '#f59e0b' }}>
              {summaryStats.avg}%
            </span>
          </div>
          <div className={styles.kpiDivider} />
          <div className={styles.kpiItem}>
            <span className={styles.kpiLabel}>Pencapaian Tertinggi</span>
            <span className={styles.kpiValue} style={{ color: '#059669' }}>
              {summaryStats.highest?.displayName} ({summaryStats.highest?.achievement}%)
            </span>
          </div>
          <div className={styles.kpiDivider} />
          <div className={styles.kpiItem}>
            <span className={styles.kpiLabel}>Pencapaian Terendah</span>
            <span className={styles.kpiValue} style={{ color: '#e11d48' }}>
              {summaryStats.lowest?.displayName} ({summaryStats.lowest?.achievement}%)
            </span>
          </div>
          <div className={styles.kpiDivider} />
          <div className={styles.kpiItem}>
            <span className={styles.kpiLabel}>Cakupan Wilayah</span>
            <span className={styles.kpiValue}>{summaryStats.total} Provinsi</span>
          </div>
        </div>
      )}

      {/* Map Interactive Canvas */}
      {!isAvailable || !mapData || mapData.length === 0 ? (
        <NoData message="(No data available)" minHeight="360px" />
      ) : (
        <div
          ref={svgContainerRef}
          className={`${styles.mapContainer} ${isDragging ? styles.grabbing : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setIsDragging(false);
            setHoveredProvince(null);
          }}
        >
          {/* Map Controls */}
          <div className={styles.mapControls}>
            <button
              type="button"
              className={styles.mapControlBtn}
              onClick={handleZoomIn}
              title="Zoom In"
              aria-label="Zoom In"
            >
              +
            </button>
            <button
              type="button"
              className={styles.mapControlBtn}
              onClick={handleZoomOut}
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              &minus;
            </button>
            <button
              type="button"
              className={styles.mapControlBtn}
              onClick={handleResetZoom}
              title="Reset Tampilan Peta"
              aria-label="Reset View"
            >
              &#8634;
            </button>
          </div>

          {/* SVG Vector Map Rendering with WGS84 Mercator Paths */}
          <svg
            viewBox="0 0 1000 450"
            className={styles.mapSvg}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            {/* Background Ocean / Canvas */}
            <rect width="1000" height="450" fill="transparent" />

            {/* Provinces MultiPolygon Vectors */}
            <g className={styles.provincesGroup}>
              {INDONESIA_PROVINCES_PATHS.map((prov) => {
                const geoName = prov.name;
                const dataItem = provinceDataMap[geoName];
                const isHovered = hoveredProvince?.geoName === geoName;
                const isSelected = selectedProvince?.geoName === geoName;
                const fillColor = getProvinceColor(geoName);

                return (
                  <path
                    key={prov.id || geoName}
                    d={prov.path}
                    className={`${styles.provincePath} ${isHovered ? styles.provinceHovered : ''} ${isSelected ? styles.provinceSelected : ''}`}
                    fill={fillColor}
                    onMouseEnter={() => {
                      if (dataItem) {
                        setHoveredProvince(dataItem);
                      } else {
                        setHoveredProvince({
                          geoName,
                          displayName: PROVINCE_DISPLAY_NAMES[geoName] || geoName,
                          region: PROVINCE_REGION_GROUP[geoName] || 'Nasional',
                          achievement: 0,
                          leader: '-',
                        });
                      }
                    }}
                    onMouseLeave={() => setHoveredProvince(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (dataItem) {
                        setSelectedProvince(dataItem);
                      }
                    }}
                  />
                );
              })}
            </g>

            {/* Island Group Text Labels */}
            <g className={styles.islandLabels} pointerEvents="none">
              <text x="110" y="160" className={styles.islandLabel}>SUMATERA</text>
              <text x="290" y="140" className={styles.islandLabel}>KALIMANTAN</text>
              <text x="260" y="320" className={styles.islandLabel}>JAWA</text>
              <text x="480" y="170" className={styles.islandLabel}>SULAWESI</text>
              <text x="460" y="340" className={styles.islandLabel}>BALI &amp; NUSA TENGGARA</text>
              <text x="730" y="150" className={styles.islandLabel}>MALUKU</text>
              <text x="860" y="220" className={styles.islandLabel}>PAPUA</text>
            </g>
          </svg>

          {/* Floating Hover Tooltip */}
          {activeItem && (
            <div
              className={styles.tooltip}
              style={{
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y}px`,
              }}
            >
              <div className={styles.tooltipHeader}>
                <span className={styles.tooltipTitle}>{activeItem.displayName}</span>
                <span className={styles.tooltipRegionBadge}>{activeItem.region}</span>
              </div>

              <div className={styles.tooltipBody}>
                <div className={styles.tooltipStatRow}>
                  <span className={styles.tooltipLabel}>Pencapaian Target:</span>
                  <span
                    className={styles.tooltipAchievement}
                    style={{
                      color:
                        activeItem.achievement >= 100
                          ? '#059669'
                          : activeItem.achievement >= 75
                          ? '#0284c7'
                          : activeItem.achievement >= 50
                          ? '#f59e0b'
                          : '#e11d48',
                    }}
                  >
                    {activeItem.achievement}%
                  </span>
                </div>

                <div className={styles.progressBarBg}>
                  <div
                    className={styles.progressBarFill}
                    style={{
                      width: `${Math.min(activeItem.achievement, 100)}%`,
                      backgroundColor:
                        activeItem.achievement >= 100
                          ? '#059669'
                          : activeItem.achievement >= 75
                          ? '#0284c7'
                          : activeItem.achievement >= 50
                          ? '#f59e0b'
                          : '#e11d48',
                    }}
                  />
                </div>

                <div className={styles.tooltipDetailRow}>
                  <span className={styles.tooltipLabel}>Brand Leader:</span>
                  <span className={styles.leaderBadge}>{activeItem.leader || 'IRC'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Choropleth Legend Bar */}
          <div className={styles.legendContainer}>
            <span className={styles.legendTitle}>Target Pencapaian:</span>
            <div className={styles.legendSteps}>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#e11d48' }} />
                <span>&lt; 50%</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#f59e0b' }} />
                <span>50% - 74%</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#0284c7' }} />
                <span>75% - 99%</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#059669' }} />
                <span>&ge; 100%</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#e2e8f0', border: '1px solid #cbd5e1' }} />
                <span>Tanpa Data</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};