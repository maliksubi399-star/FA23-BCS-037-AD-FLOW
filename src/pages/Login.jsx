import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, Lock, Mail } from 'lucide-react';

// Demo credentials
const DEMO_EMAIL = 'admin@adflowpro.com';
const DEMO_PASSWORD = 'adflow2024';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate async auth check
    await new Promise((res) => setTimeout(res, 900));

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      onLogin({ email, name: 'Admin User' });
      navigate('/');
    } else {
      setLoading(false);
      setError('Invalid email or password. Try admin@adflowpro.com / adflow2024');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      <div className={`login-card ${shake ? 'shake' : ''}`}>
        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <Zap size={22} strokeWidth={2.5} />
          </div>
          <span className="login-brand-name">Ad<span className="login-brand-accent">Flow</span> Pro</span>
        </div>

        <div className="login-header">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your dashboard to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Email field */}
          <div className="login-field">
            <label className="login-label" htmlFor="login-email">Email address</label>
            <div className="login-input-wrap">
              <Mail size={16} className="login-input-icon" />
              <input
                id="login-email"
                type="email"
                className="login-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="login-field">
            <div className="login-label-row">
              <label className="login-label" htmlFor="login-password">Password</label>
              <button type="button" className="login-forgot" tabIndex={-1}>
                Forgot password?
              </button>
            </div>
            <div className="login-input-wrap">
              <Lock size={16} className="login-input-icon" />
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className="login-input login-input-pass"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="login-error" role="alert">
              <span className="login-error-dot" />
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            <span className="login-submit-bg" />
            <span className="login-submit-content">
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Signing in…
                </>
              ) : (
                'Sign in to Dashboard'
              )}
            </span>
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="login-demo">
          <span className="login-demo-label">Demo access:</span>
          <button type="button" className="login-demo-btn" onClick={fillDemo}>
            Fill demo credentials
          </button>
        </div>

        <p className="login-footer">
          By signing in you agree to our{' '}
          <span className="login-link">Terms of Service</span> and{' '}
          <span className="login-link">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
