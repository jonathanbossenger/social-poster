import React, { useState } from 'react';

function PostComposer({ accounts, onSchedule, onPostNow }) {
  const [postType, setPostType] = useState('simple');
  const [content, setContent] = useState('');
  const [threadPosts, setThreadPosts] = useState(['']);
  const [imageUrls, setImageUrls] = useState(['']);
  const [linkUrl, setLinkUrl] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const postTypes = [
    { id: 'simple', name: 'Simple Post' },
    { id: 'thread', name: 'Thread' },
    { id: 'image', name: 'With Images' },
    { id: 'link', name: 'With Link' },
    { id: 'poll', name: 'Poll' }
  ];

  const handleAccountToggle = (accountId) => {
    if (selectedAccounts.includes(accountId)) {
      setSelectedAccounts(selectedAccounts.filter(id => id !== accountId));
    } else {
      setSelectedAccounts([...selectedAccounts, accountId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedAccounts.length === accounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(accounts.map(acc => acc.id));
    }
  };

  const handleThreadUpdate = (index, value) => {
    const newThreadPosts = [...threadPosts];
    newThreadPosts[index] = value;
    setThreadPosts(newThreadPosts);
  };

  const addThreadPost = () => {
    setThreadPosts([...threadPosts, '']);
  };

  const removeThreadPost = (index) => {
    if (threadPosts.length > 1) {
      setThreadPosts(threadPosts.filter((_, i) => i !== index));
    }
  };

  const handleImageUpdate = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const addImage = () => {
    if (imageUrls.length < 4) {
      setImageUrls([...imageUrls, '']);
    }
  };

  const removeImage = (index) => {
    if (imageUrls.length > 1) {
      setImageUrls(imageUrls.filter((_, i) => i !== index));
    }
  };

  const handlePollOptionUpdate = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedAccounts.length === 0) {
      alert('Please select at least one account');
      return;
    }

    let postData = {
      type: postType,
      selectedAccounts,
      createdAt: new Date().toISOString()
    };

    if (scheduleDate && scheduleTime) {
      postData.scheduledFor = `${scheduleDate}T${scheduleTime}`;
    }

    switch (postType) {
      case 'simple':
        if (!content.trim()) {
          alert('Please enter post content');
          return;
        }
        postData.content = content;
        break;
      case 'thread':
        const validThreadPosts = threadPosts.filter(p => p.trim());
        if (validThreadPosts.length === 0) {
          alert('Please enter at least one thread post');
          return;
        }
        postData.threadPosts = validThreadPosts;
        break;
      case 'image':
        if (!content.trim()) {
          alert('Please enter post content');
          return;
        }
        const validImages = imageUrls.filter(url => url.trim());
        if (validImages.length === 0) {
          alert('Please enter at least one image URL');
          return;
        }
        postData.content = content;
        postData.images = validImages;
        break;
      case 'link':
        if (!content.trim() || !linkUrl.trim()) {
          alert('Please enter post content and link URL');
          return;
        }
        postData.content = content;
        postData.linkUrl = linkUrl;
        break;
      case 'poll':
        if (!pollQuestion.trim()) {
          alert('Please enter a poll question');
          return;
        }
        const validOptions = pollOptions.filter(opt => opt.trim());
        if (validOptions.length < 2) {
          alert('Please enter at least 2 poll options');
          return;
        }
        postData.pollQuestion = pollQuestion;
        postData.pollOptions = validOptions;
        break;
    }

    if (postData.scheduledFor) {
      onSchedule(postData);
      alert('Post scheduled successfully!');
      // Reset form
      resetForm();
    } else {
      // Post immediately
      setIsPosting(true);
      try {
        const response = await onPostNow(selectedAccounts, postData);
        
        if (response.success) {
          const successCount = response.results.filter(r => r.success).length;
          const failCount = response.results.filter(r => !r.success).length;
          
          let message = `Posted successfully to ${successCount} account(s)`;
          if (failCount > 0) {
            message += `\n${failCount} post(s) failed`;
          }
          
          // Show detailed results
          const details = response.results.map(r => 
            `${r.platform} (${r.username}): ${r.success ? '✓ Success' : '✗ Failed - ' + r.error}`
          ).join('\n');
          
          alert(`${message}\n\nDetails:\n${details}`);
          
          // Reset form after successful post
          resetForm();
        } else {
          alert(`Failed to post: ${response.error}`);
        }
      } catch (error) {
        alert(`Error posting: ${error.message}`);
      } finally {
        setIsPosting(false);
      }
    }
  };

  const resetForm = () => {
    setContent('');
    setThreadPosts(['']);
    setImageUrls(['']);
    setLinkUrl('');
    setPollQuestion('');
    setPollOptions(['', '']);
    setScheduleDate('');
    setScheduleTime('');
  };

  return (
    <div className="post-composer">
      <h2>Compose Post</h2>

      {accounts.length === 0 ? (
        <div className="empty-state">
          <p>No accounts connected. Please add accounts first.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Post Type Selection */}
          <div className="form-group">
            <label>Post Type</label>
            <div className="post-type-buttons">
              {postTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  className={`post-type-btn ${postType === type.id ? 'active' : ''}`}
                  onClick={() => setPostType(type.id)}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Post Content Based on Type */}
          {postType === 'simple' && (
            <div className="form-group">
              <label>Post Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="form-textarea"
                rows="6"
                required
              />
            </div>
          )}

          {postType === 'thread' && (
            <div className="form-group">
              <label>Thread Posts</label>
              {threadPosts.map((post, index) => (
                <div key={index} className="thread-item">
                  <div className="thread-number">{index + 1}</div>
                  <textarea
                    value={post}
                    onChange={(e) => handleThreadUpdate(index, e.target.value)}
                    placeholder={`Thread post ${index + 1}`}
                    className="form-textarea"
                    rows="4"
                  />
                  {threadPosts.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeThreadPost(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn-secondary" onClick={addThreadPost}>
                + Add Thread Post
              </button>
            </div>
          )}

          {postType === 'image' && (
            <>
              <div className="form-group">
                <label>Post Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write a caption for your images"
                  className="form-textarea"
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URLs (up to 4)</label>
                {imageUrls.map((url, index) => (
                  <div key={index} className="image-input-item">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleImageUpdate(index, e.target.value)}
                      placeholder={`Image URL ${index + 1}`}
                      className="form-input"
                    />
                    {imageUrls.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {imageUrls.length < 4 && (
                  <button type="button" className="btn-secondary" onClick={addImage}>
                    + Add Image
                  </button>
                )}
              </div>
            </>
          )}

          {postType === 'link' && (
            <>
              <div className="form-group">
                <label>Post Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts about this link"
                  className="form-textarea"
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>Link URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="form-input"
                  required
                />
              </div>
            </>
          )}

          {postType === 'poll' && (
            <>
              <div className="form-group">
                <label>Poll Question</label>
                <textarea
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  className="form-textarea"
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Poll Options (2-4 options)</label>
                {pollOptions.map((option, index) => (
                  <div key={index} className="poll-option-item">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handlePollOptionUpdate(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="form-input"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removePollOption(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 4 && (
                  <button type="button" className="btn-secondary" onClick={addPollOption}>
                    + Add Option
                  </button>
                )}
              </div>
            </>
          )}

          {/* Account Selection */}
          <div className="form-group">
            <div className="accounts-header">
              <label>Select Accounts</label>
              <button type="button" className="btn-text" onClick={handleSelectAll}>
                {selectedAccounts.length === accounts.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="accounts-selection">
              {accounts.map(account => (
                <label key={account.id} className="account-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(account.id)}
                    onChange={() => handleAccountToggle(account.id)}
                  />
                  <span>{account.platform} - {account.username}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Schedule Options */}
          <div className="form-group">
            <label>Schedule (Optional)</label>
            <div className="schedule-inputs">
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
              />
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="form-input"
              />
            </div>
            <small className="form-hint">
              Leave empty to post immediately
            </small>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn-primary btn-large" disabled={isPosting}>
              {isPosting ? 'Posting...' : (scheduleDate && scheduleTime ? 'Schedule Post' : 'Post Now')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PostComposer;
