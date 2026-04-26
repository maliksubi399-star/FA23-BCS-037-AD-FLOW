import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Clock, CheckCircle2, MoreVertical, X } from 'lucide-react';

const invoiceHistory = [
  { id: 'INV-00124', date: 'Oct 12, 2026', amount: '$420.00', status: 'Paid', method: 'Visa **** 4242' },
  { id: 'INV-00123', date: 'Sep 12, 2026', amount: '$420.00', status: 'Paid', method: 'Visa **** 4242' },
  { id: 'INV-00122', date: 'Aug 12, 2026', amount: '$420.00', status: 'Paid', method: 'Visa **** 4242' },
  { id: 'INV-00121', date: 'Jul 12, 2026', amount: '$420.00', status: 'Paid', method: 'Visa **** 4242' },
];

export default function Billing() {
  const [plan, setPlan] = useState('Premium');
  const [cardLast4, setCardLast4] = useState('4242');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [newCard, setNewCard] = useState('');

  const plans = [
    { name: 'Basic', price: '$99/mo', desc: 'Up to 5 active ads' },
    { name: 'Standard', price: '$199/mo', desc: 'Up to 20 active ads' },
    { name: 'Premium', price: '$420/mo', desc: 'Unlimited active ads' }
  ];

  const handleUpdateCard = (e) => {
    e.preventDefault();
    if (newCard.length === 16) {
      setCardLast4(newCard.slice(-4));
      setIsCardModalOpen(false);
      setNewCard('');
    } else {
      alert('Please enter a valid 16-digit card number');
    }
  };

  return (
    <div className="billing-container">
      <div className="panel-header" style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-purple)' }}>Billing & Subscriptions</div>
      </div>

      <div className="metrics-grid" style={{ marginBottom: '3rem' }}>
        <div className="metric-card" style={{ border: '1px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="metric-title" style={{ color: 'var(--accent-cyan)' }}>Current Plan</div>
            <ShieldCheck size={20} color="var(--accent-cyan)" />
          </div>
          <div className="metric-value">{plan}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Renews on Nov 12, 2026</div>
          <button className="btn-primary" onClick={() => setIsPlanModalOpen(true)} style={{ marginTop: '1.5rem', width: '100%', fontSize: '13px' }}>Change Plan</button>
        </div>

        <div className="metric-card">
          <div className="metric-title">Next Invoice Amount</div>
          <div className="metric-value">{plans.find(p => p.name === plan).price}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Due on Nov 12, 2026</div>
          <button className="btn-outline" style={{ marginTop: '1.5rem', width: '100%', fontSize: '13px' }}>View Details</button>
        </div>

        <div className="metric-card">
          <div className="metric-title">Payment Method</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '1rem 0' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>Visa ending in {cardLast4}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Expires 12/28</div>
            </div>
          </div>
          <button className="btn-outline" onClick={() => setIsCardModalOpen(true)} style={{ width: '100%', fontSize: '13px' }}>Edit Method</button>
        </div>
      </div>

      <div className="glass-panel">
        <div className="panel-header">Recent Invoices</div>
        <table className="campaign-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Method</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoiceHistory.map((inv) => (
              <tr key={inv.id}>
                <td><span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{inv.id}</span></td>
                <td>{inv.date}</td>
                <td style={{ fontWeight: '600' }}>{inv.amount}</td>
                <td>
                  <span className="status-badge status-active">
                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle2 size={12} /> {inv.status}</div>
                  </span>
                </td>
                <td>Visa **** {cardLast4}</td>
                <td><button className="btn-icon"><MoreVertical size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Plan Modal */}
      {isPlanModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <X className="close-btn" size={20} onClick={() => setIsPlanModalOpen(false)} />
            <h2 style={{ marginBottom: '1.5rem', fontSize: '20px' }}>Choose a Plan</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {plans.map(p => (
                <div 
                  key={p.name} 
                  className={`glass-panel ${plan === p.name ? 'active-plan' : ''}`}
                  onClick={() => setPlan(p.name)}
                  style={{ 
                    cursor: 'pointer', 
                    padding: '1rem', 
                    border: plan === p.name ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    background: plan === p.name ? 'rgba(0, 240, 255, 0.05)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                    <span>{p.name}</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>{p.price}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{p.desc}</div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => setIsPlanModalOpen(false)} style={{ width: '100%' }}>Confirm Plan Change</button>
            </div>
          </div>
        </div>
      )}

      {/* Card Modal */}
      {isCardModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <X className="close-btn" size={20} onClick={() => setIsCardModalOpen(false)} />
            <h2 style={{ marginBottom: '1.5rem', fontSize: '20px' }}>Update Payment Method</h2>
            <form onSubmit={handleUpdateCard}>
              <div className="form-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="xxxx xxxx xxxx xxxx" 
                  maxLength={16}
                  value={newCard}
                  onChange={(e) => setNewCard(e.target.value.replace(/\D/g,''))}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setIsCardModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Update Card</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
