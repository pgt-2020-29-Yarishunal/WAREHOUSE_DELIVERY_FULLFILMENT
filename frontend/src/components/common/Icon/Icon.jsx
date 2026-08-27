import React from 'react';
import styles from './Icon.module.css';

export const Icon = ({ name, size = 20, color, className = '' }) => {
  return (
    <span
      className={`material-symbols-outlined ${styles.icon} ${className}`}
      style={{ fontSize: `${size}px`, color: color }}
    >
      {name}
    </span>
  );
};
