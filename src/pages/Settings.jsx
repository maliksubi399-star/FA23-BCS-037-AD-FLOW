import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Bell, Mail, Shield, Smartphone, Save } from 'lucide-react';

const Toggle = ({ on, onClick }) => (
  <div className={`toggle-switch ${on ? 'on' : ''}`} onClick={onClick}>
    <div className="toggle-circle"></div>
  </div>
);

// Manual SVG for CheckCircle to avoid lucide version issues
const CheckCircleIcon = ({ size, color }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function Settings() {
  const context = useOutletContext() || {};
  const { user, onUpdateUser } = context;
  
  // Profile state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  
  // Initialize profile state from user once available
  useEffect(() => {
    if (user) {
      setDisplayName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    mobilePush: false,
    autoValidateAds: true,
    twoFactorAuth: false,
    publicProfile: true,
  });

  // Save feedback state
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error'

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('afp_preferences');
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load preferences', e);
    }
  }, []);

  const toggleSetting = (key) => {
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPrefs);
    localStorage.setItem('afp_preferences', JSON.stringify(newPrefs));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (saving) return;
    
    setSaving(true);
    setStatus(null);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    try {
      if (onUpdateUser) {
        onUpdateUser({ name: displayName, email });
        setStatus('success');
        setTimeout(() => setStatus(null), 3000);
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="panel-header" style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-purple)' }}>Platform & User Settings</div>
        {status === 'success' && (
          <div className="status-badge status-active" style={{ fontSize: '12px' }}>
            Profile updated successfully!
          </div>
        )}
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        {/* Profile and Account Info */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <div className="panel-header" style={{ fontSize: '16px' }}>Account Information</div>
          <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div className="form-group">
                <label style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Display Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  required
                />
            </div>
            <div className="form-group">
                <label style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={saving}
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? <div className="animate-spin" style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%' }} /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Preferences and Toggles */}
        <div className="glass-panel">
          <div className="panel-header" style={{ fontSize: '16px' }}>Organization Preferences</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1.5rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ backgroundColor: 'rgba(0, 240, 255, 0.1)', padding: '10px', borderRadius: '8px' }}>
                  <Bell size={20} color="var(--accent-cyan)" />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Email Notifications</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Send alerts for ad approvals and expirations.</div>
                </div>
              </div>
              <Toggle on={preferences.emailNotifications} onClick={() => toggleSetting('emailNotifications')} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ backgroundColor: 'rgba(181, 96, 255, 0.1)', padding: '10px', borderRadius: '8px' }}>
                  <Shield size={20} color="var(--accent-purple)" />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Two-Factor Auth</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Secure your account using 2FA codes.</div>
                </div>
              </div>
              <Toggle on={preferences.twoFactorAuth} onClick={() => toggleSetting('twoFactorAuth')} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ backgroundColor: 'rgba(0, 255, 157, 0.1)', padding: '10px', borderRadius: '8px' }}>
                  <CheckCircleIcon size={20} color="var(--accent-green)" />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Auto-Validate Ads</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Instantly approve ads from trusted sellers.</div>
                </div>
              </div>
              <Toggle on={preferences.autoValidateAds} onClick={() => toggleSetting('autoValidateAds')} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '8px' }}>
                  <Smartphone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Mobile Push Alerts</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Get notifications on your mobile device.</div>
                </div>
              </div>
              <Toggle on={preferences.mobilePush} onClick={() => toggleSetting('mobilePush')} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
