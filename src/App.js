import React, { useState, useEffect } from 'react';
import AccountManager from './components/AccountManager';
import PostComposer from './components/PostComposer';
import ScheduledPosts from './components/ScheduledPosts';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('compose');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('accounts');
    const savedScheduledPosts = localStorage.getItem('scheduledPosts');
    
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    }
    if (savedScheduledPosts) {
      setScheduledPosts(JSON.parse(savedScheduledPosts));
    }
  }, []);

  // Save accounts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Save scheduled posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scheduledPosts', JSON.stringify(scheduledPosts));
  }, [scheduledPosts]);

  const addAccount = (account) => {
    setAccounts([...accounts, { ...account, id: Date.now() + Math.random() }]);
  };

  const removeAccount = (id) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  const addScheduledPost = (post) => {
    setScheduledPosts([...scheduledPosts, { ...post, id: Date.now() + Math.random() }]);
  };

  const removeScheduledPost = (id) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
  };

  const postNow = async (selectedAccountIds, postData) => {
    const selectedAccounts = accounts.filter(acc => selectedAccountIds.includes(acc.id));
    
    if (selectedAccounts.length === 0) {
      return { success: false, error: 'No accounts selected' };
    }

    // Check if running in Electron environment
    if (!window.electronAPI || !window.electronAPI.postToSocialMedia) {
      return { 
        success: false, 
        error: 'Posting is only available in the Electron app. Please run the application using "npm start" instead of opening in a browser.' 
      };
    }

    try {
      const response = await window.electronAPI.postToSocialMedia(selectedAccounts, postData);
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Social Poster</h1>
        <nav className="nav-tabs">
          <button
            className={activeTab === 'compose' ? 'active' : ''}
            onClick={() => setActiveTab('compose')}
          >
            Compose
          </button>
          <button
            className={activeTab === 'accounts' ? 'active' : ''}
            onClick={() => setActiveTab('accounts')}
          >
            Accounts
          </button>
          <button
            className={activeTab === 'scheduled' ? 'active' : ''}
            onClick={() => setActiveTab('scheduled')}
          >
            Scheduled
          </button>
        </nav>
      </header>

      <main className="app-content">
        {activeTab === 'compose' && (
          <PostComposer
            accounts={accounts}
            onSchedule={addScheduledPost}
            onPostNow={postNow}
          />
        )}
        {activeTab === 'accounts' && (
          <AccountManager
            accounts={accounts}
            onAddAccount={addAccount}
            onRemoveAccount={removeAccount}
          />
        )}
        {activeTab === 'scheduled' && (
          <ScheduledPosts
            posts={scheduledPosts}
            onRemovePost={removeScheduledPost}
            accounts={accounts}
          />
        )}
      </main>
    </div>
  );
}

export default App;
