import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, MousePointerClick, Eye, Target } from 'lucide-react';
import { DataStore } from '../utils/DataStore';

const mockChartData = [
  45, 60, 35, 80, 55, 90, 70, 85, 40, 65, 50, 75, 85, 95
];

export default function DashboardHome() {
  const [metrics, setMetrics] = useState({
    totalSpend: '0',
    totalConversions: '0',
    totalImpressions: '0M',
    avgCTR: '0%'
  });
  const [recentCampaigns, setRecentCampaigns] = useState([]);

  // Load data on mount and listen for updates
  useEffect(() => {
    const loadData = () => {
      setMetrics(DataStore.getMetrics());
      const all = DataStore.getCampaigns();
      // Show 4 most recent
      setRecentCampaigns(all.slice(0, 4));
    };

    loadData();
    window.addEventListener('afp_data_update', loadData);
    return () => window.removeEventListener('afp_data_update', loadData);
  }, []);

  return (
    <>
      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">Total Ad Spend</div>
          <div className="metric-value">${metrics.totalSpend}</div>
          <div className="metric-change change-pos">
            <TrendingUp size={14} /> +12.5% vs last month
          </div>
          <DollarSign size={80} style={{ position: 'absolute', right: '-10px', top: '10px', opacity: 0.05, color: '#f8fafc' }} />
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Total Impressions</div>
          <div className="metric-value">{metrics.totalImpressions}</div>
          <div className="metric-change change-pos">
            <TrendingUp size={14} /> +8.2% vs last month
          </div>
          <Eye size={80} style={{ position: 'absolute', right: '-10px', top: '10px', opacity: 0.05, color: '#f8fafc' }} />
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Avg. Click-Through Rate</div>
          <div className="metric-value">4.8%</div>
          <div className="metric-change change-neg">
            <TrendingDown size={14} /> -1.1% vs last month
          </div>
          <MousePointerClick size={80} style={{ position: 'absolute', right: '-10px', top: '10px', opacity: 0.05, color: '#f8fafc' }} />
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Total Conversions</div>
          <div className="metric-value">{metrics.totalConversions}</div>
          <div className="metric-change change-pos">
            <TrendingUp size={14} /> +24.4% vs last month
          </div>
          <Target size={80} style={{ position: 'absolute', right: '-10px', top: '10px', opacity: 0.05, color: '#f8fafc' }} />
        </div>
      </div>

      {/* Main Dashboard Area */}
      <div className="dashboard-grid">
        {/* Main Chart */}
        <div className="glass-panel">
          <div className="panel-header">Performance Over Time</div>
          <div className="mock-chart">
            {mockChartData.map((val, idx) => (
              <div 
                key={idx} 
                className="chart-bar" 
                style={{ height: `${val}%` }}
                title={`Value: ${val}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Table Area */}
        <div className="glass-panel">
          <div className="panel-header">Recent Campaigns Overview</div>
          <table className="campaign-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Status</th>
                <th>Spend</th>
                <th>CPA</th>
              </tr>
            </thead>
            <tbody>
              {recentCampaigns.map((camp) => (
                <tr key={camp.id}>
                  <td>
                    <div className="campaign-cell">
                      <img src={camp.image} alt={camp.name} className="campaign-thumb" />
                      <span className="campaign-name">{camp.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      camp.status === 'Active' ? 'status-active' : 
                      camp.status === 'Under Review' ? 'status-paused' : 'status-outline'
                    }`}>
                      {camp.status}
                    </span>
                  </td>
                  <td style={{ color: '#f8fafc', fontWeight: 600 }}>${(camp.spend || 0).toLocaleString()}</td>
                  <td>${camp.cpa || '0'}</td>
                </tr>
              ))}
              {recentCampaigns.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>
                    No campaigns yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
