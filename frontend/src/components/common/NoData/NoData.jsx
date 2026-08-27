import React from 'react';
import { Icon } from '../Icon/Icon.jsx';
import styles from './NoData.module.css';

export const NoData = ({
  message = '(No data available)',
  subMessage = 'Tidak ada data untuk filter yang dipilih',
  icon = 'database_off',
  minHeight = '100%',
  className = '',
}) => {
  return (
    <div className={`${styles.noDataContainer} ${className}`} style={{ minHeight }}>
      <div className={styles.iconCircle}>
        <Icon name={icon} size={28} color="var(--color-text-subtle)" />
      </div>
      <span className={styles.mainMessage}>{message}</span>
      {subMessage && <span className={styles.subMessage}>{subMessage}</span>}
    </div>
  );
};
