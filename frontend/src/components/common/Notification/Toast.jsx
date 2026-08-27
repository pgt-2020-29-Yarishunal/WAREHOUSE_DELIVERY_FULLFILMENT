import React from 'react';
import { useNotification } from '../../../hooks/useNotification.js';
import { Icon } from '../Icon/Icon.jsx';
import styles from './Toast.module.css';

export const ToastContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className={styles.container}>
      {notifications.map((item) => {
        let iconName = 'info';
        if (item.type === 'success') iconName = 'check_circle';
        if (item.type === 'warning') iconName = 'warning';
        if (item.type === 'danger') iconName = 'error';

        return (
          <div key={item.id} className={`${styles.toast} ${styles[item.type]}`}>
            <div className={styles.iconWrapper}>
              <Icon name={iconName} size={20} />
            </div>
            <div className={styles.content}>
              <div className={styles.title}>{item.title}</div>
              <div className={styles.message}>{item.message}</div>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => removeNotification(item.id)}
              aria-label="Tutup notifikasi"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
