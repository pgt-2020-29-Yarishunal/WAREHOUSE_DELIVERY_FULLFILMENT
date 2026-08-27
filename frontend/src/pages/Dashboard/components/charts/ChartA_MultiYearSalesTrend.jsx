import React, { useState } from 'react';
import { NoData } from '../../../../components/common/index.js';
import styles from './ChartA_MultiYearSalesTrend.module.css';

export const ChartA_MultiYearSalesTrend = ({ data = [] }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Multi-Year Sales Trend (3 Tahun Terakhir)</h3>
            <p className={styles.cardSubtitle}>Perbandingan tren volume penjualan historis bulanan</p>
          </div>
        </div>
        <NoData message="(No data available)" minHeight="200px" />
      </div>
    );
  }

  // Chart dimensions & scaling
  const width = 600;
  const height = 240;
  const padding = { top: 20, right: 20, bottom: 35, left: 50 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Dynamic scaling based on dataset
  const allValues = data.flatMap((d) => [d.year2024, d.year2025, d.year2026]).filter(Boolean);
  const dataMax = allValues.length ? Math.max(...allValues) : 2000000;
  const dataMin = allValues.length ? Math.min(...allValues) : 500000;

  const maxVal = Math.ceil((dataMax * 1.05) / 250000) * 250000 || 2250000;
  const minVal = Math.max(0, Math.floor((dataMin * 0.95) / 250000) * 250000);

  const step = (maxVal - minVal) / 4;
  const gridValues = [minVal + step, minVal + step * 2, minVal + step * 3, maxVal];

  const formatYLabel = (v) => {
    if (v >= 1000000) {
      const formatted = (v / 1000000).toFixed(1);
      return formatted.endsWith('.0') ? `${formatted.slice(0, -2)}M` : `${formatted}M`;
    }
    if (v >= 1000) return `${Math.round(v / 1000)}k`;
    return `${v}`;
  };

  const getX = (idx) => padding.left + (idx / (data.length - 1)) * graphWidth;
  const getY = (val) => {
    if (val === null || val === undefined) return null;
    const clamped = Math.max(minVal, Math.min(val, maxVal));
    return padding.top + graphHeight - ((clamped - minVal) / (maxVal - minVal)) * graphHeight;
  };

  // Build SVG path strings for 2024, 2025, 2026
  const makeLinePath = (key) => {
    const validPoints = data
      .map((d, i) => ({ x: getX(i), y: getY(d[key]), val: d[key] }))
      .filter((p) => p.y !== null);

    if (validPoints.length === 0) return '';
    return validPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  };

  const makeAreaPath = (key) => {
    const validPoints = data
      .map((d, i) => ({ x: getX(i), y: getY(d[key]), val: d[key] }))
      .filter((p) => p.y !== null);

    if (validPoints.length === 0) return '';
    const line = validPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
    const firstX = validPoints[0].x;
    const lastX = validPoints[validPoints.length - 1].x;
    const bottomY = padding.top + graphHeight;
    return `${line} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Multi-Year Sales Trend (3 Tahun Terakhir)</h3>
          <p className={styles.cardSubtitle}>Perbandingan tren volume penjualan historis bulanan</p>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.color2026}`} /> 2026 (Aktif)
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.color2025}`} /> 2025
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.color2024}`} /> 2024
          </span>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg}>
          <defs>
            <linearGradient id="areaGradient2026" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0074D9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0074D9" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridValues.map((v) => (
            <g key={v}>
              <line
                x1={padding.left}
                y1={getY(v)}
                x2={width - padding.right}
                y2={getY(v)}
                className={styles.gridLine}
              />
              <text x={padding.left - 8} y={getY(v) + 4} className={styles.axisLabelY}>
                {formatYLabel(v)}
              </text>
            </g>
          ))}

          {/* Area 2026 */}
          <path d={makeAreaPath('year2026')} fill="url(#areaGradient2026)" />

          {/* Lines */}
          <path d={makeLinePath('year2024')} className={styles.line2024} />
          <path d={makeLinePath('year2025')} className={styles.line2025} />
          <path d={makeLinePath('year2026')} className={styles.line2026} />

          {/* X Axis Labels & Interactive Cursor */}
          {data.map((d, i) => {
            const x = getX(i);
            const isHovered = hoveredIdx === i;

            return (
              <g key={d.month} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
                <text x={x} y={height - 10} className={`${styles.axisLabelX} ${isHovered ? styles.activeLabelX : ''}`}>
                  {d.month}
                </text>
                {/* Hitbox */}
                <rect x={x - 15} y={padding.top} width="30" height={graphHeight} className={styles.hitbox} />
                {isHovered && (
                  <line x1={x} y1={padding.top} x2={x} y2={padding.top + graphHeight} className={styles.cursorLine} />
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div
            className={styles.tooltip}
            style={{ left: `${(getX(hoveredIdx) / width) * 100}%` }}
          >
            <div className={styles.tooltipTitle}>{data[hoveredIdx].month}</div>
            {data[hoveredIdx].year2026 && (
              <div className={styles.tooltipRow}>
                <span className={styles.blueDot} /> 2026: <strong>{data[hoveredIdx].year2026.toLocaleString()} Pcs</strong>
              </div>
            )}
            <div className={styles.tooltipRow}>
              <span className={styles.greyDot} /> 2025: {data[hoveredIdx].year2025.toLocaleString()} Pcs
            </div>
            <div className={styles.tooltipRow}>
              <span className={styles.lightDot} /> 2024: {data[hoveredIdx].year2024.toLocaleString()} Pcs
            </div>
          </div>
        )}
      </div>
    </div>
  );
};