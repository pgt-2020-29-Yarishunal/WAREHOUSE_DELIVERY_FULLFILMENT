import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '../../components/common/index.js';
import { useAuth } from '../../hooks/useAuth.js';
import styles from './Sidebar.module.css';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
];

export const Sidebar = ({
  isCollapsed,
  isMobileOpen = false,
  onToggle,
  onCloseMobile,
}) => {
  const { warehouseId, warehouse } = useAuth();
  const warehouseName = warehouse?.warehouse_name || (warehouseId ? `Gudang ${warehouseId}` : 'Gudang Non-Radial');

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${
        isMobileOpen ? styles.mobileOpen : ''
      }`}
    >
      {/* Brand Header */}
      <div className={styles.brand}>
        <div className={styles.brandLeft}>
          <div className={styles.brandLogo}>
            <Icon name="local_shipping" size={22} color="var(--color-secondary, #ff851b)" />
          </div>
          {!isCollapsed && (
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>GAJAH TUNGGAL</span>
              <span className={styles.brandSubtitle}>Warehouse Logistics</span>
            </div>
          )}
        </div>

        {/* Mobile Close Drawer Button */}
        {isMobileOpen && (
          <button
            type="button"
            className={styles.mobileCloseBtn}
            onClick={onCloseMobile}
            aria-label="Tutup navigasi sidebar"
          >
            <Icon name="close" size={20} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className={styles.navSection}>
        <div className={styles.sectionLabel}>{!isCollapsed ? 'MENU' : '•••'}</div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <span className={styles.navIcon}>
                <Icon name={item.icon} size={20} />
              </span>
              {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span className={styles.navBadge}>{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer System Server Status Indicator & Toggle Button */}
      <div className={styles.footer}>
        {!isCollapsed ? (
          <>
            <div className={styles.systemStatus}>
              <span className={styles.statusDot}></span>
              <div className={styles.statusInfo}>
                <span className={styles.statusTitle}>Warehouse Server</span>
                <span className={styles.statusSubtitle} title={warehouseName}>
                  Online ({warehouseId || 'GT-WMS'})
                </span>
              </div>
            </div>
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={onToggle}
              aria-label="Ciutkan sidebar"
              title="Ciutkan sidebar"
            >
              <Icon name="chevron_left" size={18} />
            </button>
          </>
        ) : (
          <button
            type="button"
            className={styles.collapsedToggleBtn}
            onClick={onToggle}
            aria-label="Perluas sidebar"
            title={`Perluas sidebar (${warehouseId || 'Online'})`}
          >
            <span className={styles.statusDot}></span>
            <Icon name="chevron_right" size={18} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
