import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, SearchBar } from '../../components/common/index.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useNotification } from '../../hooks/useNotification.js';
import styles from './Header.module.css';

export const Header = ({ searchTerm, onSearchChange, onOpenMobileSidebar }) => {
  const { user, warehouseId, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSimulateNotification = () => {
    showNotification({
      type: 'info',
      title: 'Truk Menuju Loading Dock',
      message: 'Truk B 9812 GT tiba di Pintu 4 untuk muatan Ban TBR.',
    });
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
    showNotification({
      type: 'info',
      title: 'Sesi Selesai',
      message: 'Anda telah keluar dari akun gudang.',
    });
    navigate('/login', { replace: true });
  };

  const displayName = user?.full_name || 'Petugas Gudang';
  const displayRole = user?.role ? user.role.replace(/_/g, ' ') : 'Operasional';
  const displayWh = warehouseId || 'GUDANG';

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

        {/* Notification Bell */}
        <button
          type="button"
          className={styles.actionIconBtn}
          onClick={handleSimulateNotification}
          aria-label="Notifikasi Pengiriman"
          title="Notifikasi Pengiriman"
        >
          <Icon name="notifications" size={22} />
          <span className={styles.badgeCount}>
            <span className={styles.srOnly}>Notifikasi baru</span>
          </span>
        </button>

        <div className={styles.divider}></div>

        {/* User Profile & Logout Action */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={styles.userProfile}
            onClick={() => setShowUserMenu((prev) => !prev)}
            aria-label={`Profil Akun: ${displayName} (${displayWh})`}
            title="Klik untuk membuka menu profil / logout"
          >
            <div className={styles.avatar}>
              <Icon name="person" size={20} color="var(--color-primary, #003b73)" />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{displayName}</span>
              <span className={styles.userRole}>
                <strong style={{ color: 'var(--color-primary-light, #0074d9)', marginRight: '4px' }}>
                  [{displayWh}]
                </strong>
                {displayRole}
              </span>
            </div>
            <Icon name={showUserMenu ? 'expand_less' : 'expand_more'} size={18} color="var(--color-text-muted, #718096)" />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              backgroundColor: 'var(--color-bg-surface, #ffffff)',
              border: '1px solid var(--color-border, #e2e8f0)',
              borderRadius: 'var(--radius-md, 8px)',
              boxShadow: 'var(--shadow-modal, 0 10px 30px rgba(0,0,0,0.15))',
              minWidth: '200px',
              zIndex: 120,
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{
                padding: '8px 10px',
                borderBottom: '1px solid var(--color-border, #e2e8f0)',
                fontSize: '12px',
              }}>
                <div style={{ fontWeight: 700, color: 'var(--color-text-main, #1a202c)' }}>{displayName}</div>
                <div style={{ color: 'var(--color-text-muted, #718096)', fontSize: '11px' }}>{user?.email || 'gt-tires.com'}</div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  borderRadius: 'var(--radius-sm, 4px)',
                  color: 'var(--color-danger, #ff4136)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'left',
                }}
              >
                <Icon name="logout" size={18} color="var(--color-danger, #ff4136)" />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
