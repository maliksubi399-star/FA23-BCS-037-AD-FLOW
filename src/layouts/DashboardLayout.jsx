import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Target,
  CreditCard, 
  Settings, 
  Calendar,
  LogOut,
  Zap,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard',  path: '/',          icon: LayoutDashboard },
  { name: 'Campaigns',  path: '/campaigns', icon: Target },
  { name: 'Analytics',  path: '/analytics', icon: Activity },
  { name: 'Billing',    path: '/billing',   icon: CreditCard },
  { name: 'Settings',   path: '/settings',  icon: Settings },
];

export default function DashboardLayout({ user, onLogout, onUpdateUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  // Derive initials from email (e.g. "admin@…" → "A")
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0] ?? 'U').toUpperCase();

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Zap size={16} strokeWidth={2.5} />
          </div>
          <div className="brand-text">Ad Flow Pro</div>
        </div>
        
        <nav className="nav-menu">
          {navItems.map((item, idx) => (
            <NavLink 
              key={idx} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end={item.path === '/'}
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout at bottom of sidebar */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name ?? 'User'}</div>
              <div className="sidebar-user-email">{user?.email}</div>
            </div>
          </div>
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="page-title">Executive Overview</div>
          <div className="top-actions">
            <button className="btn-daterange">
              <Calendar size={16} />
              Last 30 Days
            </button>
            <div className="avatar">{initials}</div>
          </div>
        </header>

        {/* Dynamic Route Rendering */}
        <Outlet context={{ user, onUpdateUser }} />
      </main>
    </div>
  );
}
