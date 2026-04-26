import React, { useState } from 'react';
import { BarChart3, LineChart, PieChart, Info, MapPin, MousePointer2, Calendar } from 'lucide-react';

const analyticsSummaries = [
  { label: 'Total Clicks', value: '1,294', change: '+24%', icon: MousePointer2, color: 'var(--accent-cyan)' },
  { label: 'CTR', value: '4.8%', change: '+0.5%', icon: LineChart, color: 'var(--accent-purple)' },
  { label: 'CPC', value: '$0.42', change: '-5.2%', icon: BarChart3, color: 'var(--accent-green)' },
  { label: 'Reach', value: '1.2M', change: '+12%', icon: Info, color: 'var(--text-tertiary)' },
];

const trafficDataSets = {
  30: [
    { source: 'Direct', value: '450', percent: '35%' },
    { source: 'Referral', value: '310', percent: '24%' },
    { source: 'Search', value: '280', percent: '21%' },
    { source: 'Social', value: '254', percent: '20%' },
  ],
  7: [
    { source: 'Direct', value: '120', percent: '40%' },
    { source: 'Referral', value: '80', percent: '26%' },
    { source: 'Search', value: '60', percent: '20%' },
    { source: 'Social', value: '40', percent: '14%' },
  ],
  90: [
    { source: 'Direct', value: '1,200', percent: '30%' },
    { source: 'Referral', value: '950', percent: '24%' },
    { source: 'Search', value: '900', percent: '23%' },
    { source: 'Social', value: '910', percent: '23%' },
  ]
};

export default function Analytics() {
  const [range, setRange] = useState(30);

  return (
    <div className="analytics-container">
      <div className="panel-header" style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-cyan)' }}>Platform Analytics</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            className="form-control" 
            style={{ padding: '0.4rem 1rem', fontSize: '12px', width: '150px' }}
            value={range}
            onChange={(e) => setRange(parseInt(e.target.value))}
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="metrics-grid">
        {analyticsSummaries.map((item, idx) => (
          <div key={idx} className="metric-card">
            <div className="metric-title">{item.label}</div>
            <div className="metric-value">{item.value}</div>
            <div className="metric-change change-pos" style={{ color: item.change.startsWith('+') ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {item.change}
            </div>
            <item.icon size={80} style={{ position: 'absolute', right: '-10px', top: '10px', opacity: 0.05, color: '#f8fafc' }} />
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div className="panel-header">Traffic Acquisition Source</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
            {trafficDataSets[range].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600' }}>
                  <span>{item.source}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.value} · {item.percent}</span>
                </div>
                <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: item.percent, 
                      backgroundColor: 'var(--accent-cyan)', 
                      boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)',
                      transition: 'width 0.5s ease-in-out'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel">
          <div className="panel-header">Conversion History (Last 14 Days)</div>
          <div className="mock-chart">
            {[30, 45, 25, 60, 80, 55, 40, 65, 85, 95, 75, 60, 50, 65].map((val, idx) => (
              <div key={idx} className="chart-bar" style={{ height: `${val}%`, backgroundColor: 'var(--accent-purple)' }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
