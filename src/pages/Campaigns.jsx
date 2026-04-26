import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, Check, AlertCircle, Save, ImageIcon } from 'lucide-react';
import { DataStore } from '../utils/DataStore';

const PRESET_IMAGES = [
  { id: 1, url: '/images/image1.png', label: 'Tech' },
  { id: 2, url: '/images/image2.png', label: 'Fashion' },
  { id: 3, url: '/images/image3.png', label: 'Food' },
  { id: 4, url: '/images/image4.png', label: 'Travel' },
];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [newAd, setNewAd] = useState({ name: '', type: 'Basic', budget: '', image: PRESET_IMAGES[0].url });

  // Load data on mount and listen for updates
  useEffect(() => {
    const load = () => setCampaigns(DataStore.getCampaigns());
    load();
    window.addEventListener('afp_data_update', load);
    return () => window.removeEventListener('afp_data_update', load);
  }, []);

  const handleCreateOrUpdateAd = (e) => {
    e.preventDefault();
    if (editingAd) {
      DataStore.updateCampaign(editingAd.id, {
        name: newAd.name,
        type: newAd.type,
        spend: parseFloat(newAd.budget || 0),
        image: newAd.image
      });
    } else {
      DataStore.addCampaign({
        name: newAd.name,
        status: 'Under Review',
        spend: 0,
        cpa: 0,
        conversions: 0,
        impressions: 0,
        image: newAd.image,
        type: newAd.type
      });
    }
    closeModal();
  };

  const openEditModal = (camp) => {
    setEditingAd(camp);
    setNewAd({ 
      name: camp.name, 
      type: camp.type, 
      budget: (camp.spend || 0).toString(),
      image: camp.image || PRESET_IMAGES[0].url
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAd(null);
    setNewAd({ name: '', type: 'Basic', budget: '', image: PRESET_IMAGES[0].url });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      DataStore.deleteCampaign(id);
    }
  };

  const handleApprove = (id) => {
    DataStore.updateCampaign(id, { status: 'Active' });
  };

  return (
    <div className="campaigns-container">
      <div className="panel-header" style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-cyan)' }}>Campaign Management</div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Create New Ad
        </button>
      </div>

      <div className="glass-panel">
        <table className="campaign-table">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Status</th>
              <th>Type</th>
              <th>Total Spend</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((camp) => (
              <tr key={camp.id}>
                <td>
                  <div className="campaign-cell">
                    <img src={camp.image} alt="" className="campaign-thumb" />
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
                <td>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    {camp.type}
                  </span>
                </td>
                <td style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                  ${(camp.spend || 0).toLocaleString()}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-icon" title="Edit" onClick={() => openEditModal(camp)}>
                      <Edit2 size={14} />
                    </button>
                    {camp.status === 'Under Review' && (
                      <button className="btn-icon btn-approve" title="Approve" onClick={() => handleApprove(camp.id)}>
                        <Check size={14} />
                      </button>
                    )}
                    <button className="btn-icon btn-reject" title="Delete" onClick={() => handleDelete(camp.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                  No campaigns found. Create one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Ad Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <X className="close-btn" size={20} onClick={closeModal} />
            <h2 style={{ marginBottom: '1.5rem', fontSize: '20px' }}>
              {editingAd ? 'Edit Ad Campaign' : 'Create New Ad Campaign'}
            </h2>
            <form onSubmit={handleCreateOrUpdateAd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>Campaign Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter campaign name..." 
                    required
                    value={newAd.name}
                    onChange={(e) => setNewAd({...newAd, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>Package Type</label>
                  <select 
                    className="form-control"
                    value={newAd.type}
                    onChange={(e) => setNewAd({...newAd, type: e.target.value})}
                  >
                    <option value="Basic">Basic (7 Days)</option>
                    <option value="Standard">Standard (15 Days)</option>
                    <option value="Premium">Premium (30 Days)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>Target Budget ($)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g. 1000" 
                    required
                    value={newAd.budget}
                    onChange={(e) => setNewAd({...newAd, budget: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Select Ad Creative</label>
                <div style={{ 
                  width: '100%', 
                  aspectRatio: '16/9', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid var(--border-color)',
                  position: 'relative'
                }}>
                  <img src={newAd.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '0', 
                    left: '0', 
                    right: '0', 
                    padding: '10px', 
                    background: 'rgba(0,0,0,0.6)', 
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                    {PRESET_IMAGES.map(img => (
                      <div 
                        key={img.id} 
                        onClick={() => setNewAd({...newAd, image: img.url})}
                        style={{ 
                          width: '40px', 
                          height: '25px', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          border: newAd.image === img.url ? '2px solid var(--accent-cyan)' : '1px solid #fff',
                          overflow: 'hidden'
                        }}
                      >
                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '5px', display: 'block' }}>Or Paste Image URL</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="https://..." 
                    value={newAd.image}
                    onChange={(e) => setNewAd({...newAd, image: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div className="modal-actions" style={{ marginTop: '0' }}>
                  <button type="button" className="btn-outline" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                    {editingAd ? 'Update Campaign' : 'Initialize Campaign'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
