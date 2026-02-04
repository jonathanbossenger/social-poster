import React, { useState } from 'react';

function AccountManager({ accounts, onAddAccount, onRemoveAccount }) {
  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState('twitter');
  const [username, setUsername] = useState('');

  const platforms = [
    { id: 'twitter', name: 'Twitter/X', color: '#1DA1F2' },
    { id: 'facebook', name: 'Facebook', color: '#1877F2' },
    { id: 'linkedin', name: 'LinkedIn', color: '#0077B5' },
    { id: 'instagram', name: 'Instagram', color: '#E4405F' },
    { id: 'mastodon', name: 'Mastodon', color: '#6364FF' },
    { id: 'bluesky', name: 'Bluesky', color: '#1185FE' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onAddAccount({
        platform,
        username: username.trim(),
        connected: true
      });
      setUsername('');
      setShowForm(false);
    }
  };

  const getPlatformInfo = (platformId) => {
    return platforms.find(p => p.id === platformId) || platforms[0];
  };

  return (
    <div className="account-manager">
      <div className="section-header">
        <h2>Connected Accounts</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Account'}
        </button>
      </div>

      {showForm && (
        <form className="account-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Platform</label>
            <select 
              value={platform} 
              onChange={(e) => setPlatform(e.target.value)}
              className="form-input"
            >
              {platforms.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Username / Account Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@username"
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="btn-primary">Connect Account</button>
        </form>
      )}

      <div className="accounts-list">
        {accounts.length === 0 ? (
          <p className="empty-state">No accounts connected yet. Add an account to get started.</p>
        ) : (
          accounts.map(account => {
            const platformInfo = getPlatformInfo(account.platform);
            return (
              <div key={account.id} className="account-card">
                <div className="account-info">
                  <div 
                    className="platform-badge" 
                    style={{ backgroundColor: platformInfo.color }}
                  >
                    {platformInfo.name}
                  </div>
                  <span className="account-username">{account.username}</span>
                </div>
                <button 
                  className="btn-danger-small"
                  onClick={() => onRemoveAccount(account.id)}
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AccountManager;
