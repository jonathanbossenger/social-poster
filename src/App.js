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
    setAccounts([...accounts, { ...account, id: Date.now() }]);
  };

  const removeAccount = (id) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  const addScheduledPost = (post) => {
    setScheduledPosts([...scheduledPosts, { ...post, id: Date.now() }]);
  };

  const removeScheduledPost = (id) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
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
