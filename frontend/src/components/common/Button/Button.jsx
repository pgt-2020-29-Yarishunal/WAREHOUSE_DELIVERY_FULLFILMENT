import React from 'react';
import { Icon } from '../Icon/Icon.jsx';
import styles from './Button.module.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    isLoading ? styles.loading : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className={styles.spinner}>
          <Icon name="progress_activity" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        </span>
      )}
      {!isLoading && iconLeft && <Icon name={iconLeft} size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
      <span className={styles.label}>{children}</span>
      {!isLoading && iconRight && <Icon name={iconRight} size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
    </button>
  );
};
