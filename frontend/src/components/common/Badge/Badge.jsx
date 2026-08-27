import React from 'react';
import { Icon } from '../Icon/Icon.jsx';
import styles from './Badge.module.css';

export const Badge = ({
  children,
  variant = 'neutral',
  icon,
  size = 'md',
}) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
      {icon && <Icon name={icon} size={size === 'sm' ? 12 : 14} />}
      <span>{children}</span>
    </span>
  );
};
