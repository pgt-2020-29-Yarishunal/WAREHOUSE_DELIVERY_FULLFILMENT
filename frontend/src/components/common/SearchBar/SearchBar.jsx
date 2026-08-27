import React from 'react';
import { Icon } from '../Icon/Icon.jsx';
import styles from './SearchBar.module.css';

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Cari surat jalan, no. truk, atau tujuan...',
  onClear,
  className = '',
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <span className={styles.searchIcon}>
        <Icon name="search" size={18} color="var(--color-text-muted)" />
      </span>
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          aria-label="Clear search"
        >
          <Icon name="close" size={16} color="var(--color-text-muted)" />
        </button>
      )}
    </div>
  );
};
