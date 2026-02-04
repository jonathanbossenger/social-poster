# Social Media Posting Implementation

## Overview

This document describes the implementation of actual social media posting functionality in the Social Poster application.

## Architecture

The posting system uses Electron's IPC (Inter-Process Communication) to handle posting requests:

```
React UI (Renderer Process)
    ↓ (IPC)
Electron Main Process
    ↓
Social Media Service
    ↓
Platform APIs
```

## Components

### 1. Social Media Service (`socialMediaService.js`)

A service class that handles posting to various social media platforms:

- **Supported Platforms**: Twitter/X, Facebook, LinkedIn, Instagram, Mastodon, Bluesky
- **Mock Implementation**: Currently simulates API calls with delays
- **Extensible**: Easy to add real API integration

**Key Methods**:
- `postToPlatform(platform, account, postData)` - Post to a single platform
- `postToAccounts(accounts, postData)` - Post to multiple accounts
- Platform-specific methods: `postToTwitter()`, `postToFacebook()`, etc.

### 2. Main Process Integration (`main.js`)

The main Electron process handles IPC communication:

```javascript
ipcMain.handle('post-to-social-media', async (event, accounts, postData) => {
  const results = await socialMediaService.postToAccounts(accounts, postData);
  return { success: true, results };
});
```

### 3. Preload Script (`preload.js`)

Exposes the posting API to the renderer process securely:

```javascript
contextBridge.exposeInMainWorld('electronAPI', {
  postToSocialMedia: (accounts, postData) => 
    ipcRenderer.invoke('post-to-social-media', accounts, postData)
});
```

### 4. React Components

**App.js** - Implements the `postNow` handler:
```javascript
const postNow = async (selectedAccountIds, postData) => {
  const response = await window.electronAPI.postToSocialMedia(accounts, postData);
  return response;
};
```

**PostComposer.js** - Calls posting API and shows results:
- Displays "Posting..." state while posting
- Shows detailed success/failure results per account
- Handles errors gracefully

## Post Data Structure

```javascript
{
  type: 'simple' | 'thread' | 'image' | 'link' | 'poll',
  content: 'Post text',           // For simple, image, link posts
  threadPosts: ['...'],            // For thread posts
  images: ['url1', 'url2'],        // For image posts
  linkUrl: 'https://...',          // For link posts
  pollQuestion: '...',             // For polls
  pollOptions: ['opt1', 'opt2'],   // For polls
  selectedAccounts: [id1, id2],    // Account IDs
  createdAt: '2026-02-04T...'
}
```

## Response Format

```javascript
{
  success: true,
  results: [
    {
      accountId: 123,
      platform: 'twitter',
      username: '@user',
      success: true,
      result: {
        postId: 'twitter_123_abc',
        url: 'https://twitter.com/user/status/...',
        timestamp: '2026-02-04T...'
      }
    },
    // ... more results
  ]
}
```

## Current Implementation Status

### ✅ Implemented
- IPC communication infrastructure
- Service layer architecture
- Mock posting with simulated delays
- Result tracking and reporting
- Error handling
- UI feedback (loading state, success/error messages)
- Support for all post types
- Multi-account posting

### 🚧 Production Requirements

To use this with real social media APIs, you need to:

1. **Obtain API Keys**: Register developer applications with each platform
2. **Implement OAuth**: Add authentication flows for each platform
3. **Install API Libraries**:
   ```bash
   npm install twitter-api-v2 axios @atproto/api
   ```
4. **Replace Mock Implementations**: Update each platform method in `socialMediaService.js`
5. **Add Token Storage**: Securely store OAuth tokens (use electron-store or similar)
6. **Handle Rate Limiting**: Implement rate limit handling
7. **Add Retry Logic**: Handle transient failures

## Example: Real Twitter Implementation

```javascript
// In socialMediaService.js
const { TwitterApi } = require('twitter-api-v2');

async postToTwitter(account, postData) {
  // Get OAuth tokens for this account from secure storage
  const tokens = await getAccountTokens(account.id);
  
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: tokens.accessToken,
    accessSecret: tokens.accessSecret,
  });
  
  const result = await client.v2.tweet(postData.content);
  
  return {
    postId: result.data.id,
    platform: 'twitter',
    username: account.username,
    url: `https://twitter.com/${account.username}/status/${result.data.id}`,
    timestamp: new Date().toISOString()
  };
}
```

## Testing

The current mock implementation allows testing the full posting workflow:

1. Add accounts in the Accounts tab
2. Compose a post
3. Select accounts
4. Click "Post Now"
5. View detailed results showing success for each platform

The mock service simulates network delays (500-1500ms) to provide realistic feedback.

## Error Handling

The implementation handles several error scenarios:

- **No accounts selected**: Validation before posting
- **Empty content**: Content validation per post type
- **Platform failures**: Individual account failures don't affect others
- **Browser environment**: Graceful error when running outside Electron

## Security Considerations

- Context isolation is enabled in Electron
- IPC communication uses secure channels
- Node integration is disabled in renderer
- OAuth tokens should be stored securely (not localStorage)
- API keys should be environment variables, never committed to code

## Future Enhancements

- [ ] Real OAuth authentication flows
- [ ] Token management and refresh
- [ ] Scheduled post execution (background job)
- [ ] Post analytics and tracking
- [ ] Retry failed posts
- [ ] Draft saving
- [ ] Post preview before sending
- [ ] Image upload support (not just URLs)
- [ ] Video support
- [ ] Hashtag suggestions
- [ ] @ mention autocomplete
