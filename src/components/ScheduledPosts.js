import React from 'react';

function ScheduledPosts({ posts, onRemovePost, accounts }) {
  const getAccountInfo = (accountId) => {
    return accounts.find(acc => acc.id === accountId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPostPreview = (post) => {
    switch (post.type) {
      case 'simple':
        return post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '');
      case 'thread':
        return `Thread (${post.threadPosts.length} posts): ${post.threadPosts[0].substring(0, 80)}...`;
      case 'image':
        return `${post.content.substring(0, 80)}... [${post.images.length} image${post.images.length > 1 ? 's' : ''}]`;
      case 'link':
        return `${post.content.substring(0, 80)}... [Link: ${post.linkUrl}]`;
      case 'poll':
        return `Poll: ${post.pollQuestion.substring(0, 80)}... [${post.pollOptions.length} options]`;
      default:
        return 'Unknown post type';
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.scheduledFor);
    const dateB = new Date(b.scheduledFor);
    return dateA - dateB;
  });

  return (
    <div className="scheduled-posts">
      <div className="section-header">
        <h2>Scheduled Posts</h2>
        <span className="post-count">{posts.length} scheduled</span>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No scheduled posts yet. Create a post and schedule it for later.</p>
        </div>
      ) : (
        <div className="posts-list">
          {sortedPosts.map(post => (
            <div key={post.id} className="scheduled-post-card">
              <div className="post-header">
                <div className="post-type-badge">{post.type}</div>
                <button
                  className="btn-danger-small"
                  onClick={() => onRemovePost(post.id)}
                >
                  Delete
                </button>
              </div>

              <div className="post-schedule">
                <strong>Scheduled for:</strong> {formatDate(post.scheduledFor)}
              </div>

              <div className="post-preview">
                {getPostPreview(post)}
              </div>

              <div className="post-accounts">
                <strong>Posting to:</strong>
                <div className="account-badges">
                  {post.selectedAccounts.map(accountId => {
                    const account = getAccountInfo(accountId);
                    return account ? (
                      <span key={accountId} className="account-badge-small">
                        {account.platform} - {account.username}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              {post.type === 'thread' && (
                <div className="post-details">
                  <strong>Thread posts:</strong>
                  <ol className="thread-preview">
                    {post.threadPosts.map((threadPost, index) => (
                      <li key={index}>{threadPost.substring(0, 60)}...</li>
                    ))}
                  </ol>
                </div>
              )}

              {post.type === 'image' && (
                <div className="post-details">
                  <strong>Images:</strong>
                  <ul className="image-list">
                    {post.images.map((img, index) => (
                      <li key={index}>{img}</li>
                    ))}
                  </ul>
                </div>
              )}

              {post.type === 'poll' && (
                <div className="post-details">
                  <strong>Poll options:</strong>
                  <ul className="poll-options-list">
                    {post.pollOptions.map((option, index) => (
                      <li key={index}>{option}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduledPosts;
