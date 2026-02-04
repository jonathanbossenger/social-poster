const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  postToSocialMedia: (accounts, postData) => ipcRenderer.invoke('post-to-social-media', accounts, postData)
});
