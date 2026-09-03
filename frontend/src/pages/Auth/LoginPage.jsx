import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useNotification } from '../../hooks/useNotification.js';
import { Icon } from '../../components/common/index.js';
import { authService } from '../../services/authService.js';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  const [username, setUsername] = useState('gudang.bpw');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [presets, setPresets] = useState([]);

  // Check if redirected due to expired session
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('session_expired') === 'true') {
      showNotification({
        type: 'warning',
        title: 'Sesi Berakhir',
        message: 'Sesi login Anda telah kadaluarsa. Silakan masuk kembali.',
      });
    }
  }, [location.search, showNotification]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Load preset warehouse users for quick dev switching (1 user per warehouse)
  useEffect(() => {
    const loadPresets = async () => {
      try {
        const data = await authService.getPresets();
        setPresets(data);
      } catch {
        // Fallback default presets: 1 user per warehouse
        setPresets([
          { user_id: 'USR-BPW', username: 'gudang.bpw', role: 'ADMIN_GUDANG', warehouse_id: 'BPW' },
          { user_id: 'USR-APW', username: 'gudang.apw', role: 'ADMIN_GUDANG', warehouse_id: 'APW' },
          { user_id: 'USR-RPW', username: 'gudang.rpw', role: 'ADMIN_GUDANG', warehouse_id: 'RPW' },
          { user_id: 'USR-LOG', username: 'logistics', role: 'LOGISTICS_PLANNER', warehouse_id: 'BPW' },
        ]);
      }
    };
    loadPresets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      showNotification({
        type: 'warning',
        title: 'Input Tidak Lengkap',
        message: 'Mohon masukkan username dan password Anda.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(username.trim(), password);
      showNotification({
        type: 'success',
        title: 'Login Berhasil',
        message: `Selamat datang, ${res.user.full_name} (${res.user.warehouse_id})`,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      showNotification({
        type: 'danger',
        title: 'Autentikasi Gagal',
        message: err.message || 'Username atau password yang dimasukkan salah.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPreset = (presetUsername) => {
    setUsername(presetUsername);
    setPassword('password123');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Brand Header */}
        <div className={styles.brandHeader}>
          <div className={styles.logoWrapper}>
            <Icon name="local_shipping" size={32} />
          </div>
          <div className={styles.titleGroup}>
            <h1 className={styles.companyTitle}>PT GAJAH TUNGGAL TBK</h1>
            <p className={styles.systemSubtitle}>Delivery & Warehouse Operations Portal</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Username Input */}
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              <Icon name="person" size={16} />
              Username Akun Gudang
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <Icon name="badge" size={18} />
              </span>
              <input
                id="username"
                type="text"
                className={styles.inputField}
                placeholder="contoh: admin.bpw / admin.apw"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              <Icon name="lock" size={16} />
              Kata Sandi
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <Icon name="key" size={18} />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={styles.inputField}
                placeholder="Masukkan kata sandi..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className={styles.togglePasswordBtn}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={18} />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Icon name="progress_activity" size={18} className="spin-animation" />
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <Icon name="arrow_forward" size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Account Switcher (Preset Warehouses) */}
        <div className={styles.presetSection}>
          <div className={styles.presetHeader}>
            <span className={styles.presetTitle}>Pilih Akun Cepat (Testing)</span>
            <span className={styles.presetHint}>Pass: password123</span>
          </div>
          <div className={styles.presetGrid}>
            {presets.slice(0, 6).map((p) => (
              <button
                key={p.user_id}
                type="button"
                className={styles.presetCard}
                onClick={() => handleSelectPreset(p.username)}
                title={`${p.full_name || p.username} - ${p.warehouse_id}`}
              >
                <span className={styles.presetBadge}>{p.warehouse_id}</span>
                <span className={styles.presetTag}>{p.username}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span>Sistem Informasi Distribusi & Logistik Terpadu</span>
          <strong>&copy; 2026 PT Gajah Tunggal Tbk</strong>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
