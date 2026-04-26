/**
 * DataStore.js
 * A simple utility to manage application data in localStorage.
 */

const DEFAULT_CAMPAIGNS = [
  {
    id: 1,
    name: 'Q3 Premium Web Dev Push',
    status: 'Active',
    spend: 4250,
    cpa: 12.50,
    conversions: 340,
    impressions: 240000,
    image: '/images/image1.png',
    type: 'Premium',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 2,
    name: 'Digital Marketing Outreach',
    status: 'Under Review',
    spend: 0,
    cpa: 0,
    conversions: 0,
    impressions: 0,
    image: '/images/image2.png',
    type: 'Standard',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 3,
    name: 'E-Comm Store Launch Promo',
    status: 'Paused',
    spend: 8400,
    cpa: 15.00,
    conversions: 560,
    impressions: 480000,
    image: '/images/image3.png',
    type: 'Premium',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 4,
    name: 'Retargeting Node Alpha',
    status: 'Draft',
    spend: 0,
    cpa: 0,
    conversions: 0,
    impressions: 0,
    image: '/images/image4.png',
    type: 'Basic',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const DataStore = {
  getCampaigns: () => {
    const data = localStorage.getItem('afp_campaigns');
    return data ? JSON.parse(data) : DEFAULT_CAMPAIGNS;
  },

  setCampaigns: (campaigns) => {
    localStorage.setItem('afp_campaigns', JSON.stringify(campaigns));
    // Dispatch custom event for cross-tab or cross-component notification if needed
    window.dispatchEvent(new Event('afp_data_update'));
  },

  addCampaign: (campaign) => {
    const campaigns = DataStore.getCampaigns();
    const newCampaign = {
      ...campaign,
      id: campaigns.length > 0 ? Math.max(...campaigns.map(c => c.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    };
    DataStore.setCampaigns([newCampaign, ...campaigns]);
    return newCampaign;
  },

  updateCampaign: (id, updates) => {
    const campaigns = DataStore.getCampaigns();
    const updated = campaigns.map(c => c.id === id ? { ...c, ...updates } : c);
    DataStore.setCampaigns(updated);
  },

  deleteCampaign: (id) => {
    const campaigns = DataStore.getCampaigns();
    const filtered = campaigns.filter(c => c.id !== id);
    DataStore.setCampaigns(filtered);
  },

  getMetrics: () => {
    const campaigns = DataStore.getCampaigns();
    const totalSpend = campaigns.reduce((acc, c) => acc + (c.spend || 0), 0);
    const totalConversions = campaigns.reduce((acc, c) => acc + (c.conversions || 0), 0);
    const totalImpressions = campaigns.reduce((acc, c) => acc + (c.impressions || 0), 0);
    const avgCPA = totalConversions > 0 ? (totalSpend / totalConversions).toFixed(2) : 0;
    
    return {
      totalSpend: totalSpend.toLocaleString(),
      totalConversions: totalConversions.toLocaleString(),
      totalImpressions: (totalImpressions / 1000000).toFixed(1) + 'M',
      avgCTR: '4.8%' // Mocked for now
    };
  }
};
