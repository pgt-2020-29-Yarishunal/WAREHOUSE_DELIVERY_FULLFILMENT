import React, { useState } from 'react';
import { Icon, SearchBar } from '../../components/common/index.js';
import { useNotification } from '../../hooks/useNotification.js';
import styles from './Header.module.css';

export const Header = ({ searchTerm, onSearchChange, onOpenMobileSidebar }) => {
  const { showNotification } = useNotification();
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);

  const handleSimulateNotification = () => {
    showNotification({
      type: 'info',
      title: 'Truk Menuju Loading Dock',
      message: 'Truk B 9812 GT tiba di Pintu 4 untuk muatan Ban TBR.',
    });
  };

  const handleProfileClick = () => {
    showNotification({
      type: 'info',
      title: 'Profil Pengguna',
      message: 'Andi Prasetyo - Supervisor Gudang GT (ID: GT-8842)',
    });
  };

  return (
    <header className={styles.header}>
      {/* Left Section: Mobile Menu Trigger + Brand/Title */}
      <div className={styles.leftSection}>
        <button
          type="button"
          className={styles.mobileMenuBtn}
          onClick={onOpenMobileSidebar}
          aria-label="Buka navigasi menu"
        >
          <Icon name="menu" size={22} />
        </button>

        <div className={styles.pageTitleWrapper}>
          <h1 className={styles.title}>Delivery Dashboard</h1>
        </div>
      </div>

      {/* Center Section: Search Bar (Responsive) */}
      <div className={`${styles.centerSection} ${isMobileSearchExpanded ? styles.searchExpanded : ''}`}>
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Cari Surat Jalan (SJ), No. Polisi, atau Customer..."
          className={styles.headerSearch}
        />
        {isMobileSearchExpanded && (
          <button
            type="button"
            className={styles.closeSearchBtn}
            onClick={() => setIsMobileSearchExpanded(false)}
            aria-label="Tutup pencarian"
          >
            <Icon name="close" size={18} />
          </button>
        )}
      </div>

      {/* Right Section: Actions & Accessible User Profile */}
      <div className={styles.rightSection}>
        {/* Mobile Search Toggle Icon */}
        <button
          type="button"
          className={styles.mobileSearchTrigger}
          onClick={() => setIsMobileSearchExpanded((prev) => !prev)}
          aria-label="Cari data pengiriman"
        >
          <Icon name="search" size={20} />
        </button>

        {/* Notification Bell with Accessible Counter */}
        <button
          type="button"
          className={styles.actionIconBtn}
          onClick={handleSimulateNotification}
          aria-label="3 Notifikasi Pengiriman Belum Dibaca"
          title="Notifikasi Pengiriman"
        >
          <Icon name="notifications" size={22} />
          <span className={styles.badgeCount}>
            <span className={styles.srOnly}>3 notifikasi baru</span>
          </span>
        </button>

        <div className={styles.divider}></div>

        {/* Accessible Profile Button */}
        <button
          type="button"
          className={styles.userProfile}
          onClick={handleProfileClick}
          aria-label="Profil Akun: Andi Prasetyo (Supervisor Gudang)"
        >
          <div className={styles.avatar}>
            <Icon name="person" size={20} color="var(--color-primary)" />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Andi Prasetyo</span>
            <span className={styles.userRole}>Supervisor Gudang GT</span>
          </div>
        </button>
      </div>
    </header>
  );
};
