const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const SocialMediaService = require('./socialMediaService');

let mainWindow;
const socialMediaService = new SocialMediaService();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('dist/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// IPC Handler for posting to social media
ipcMain.handle('post-to-social-media', async (event, accounts, postData) => {
  try {
    console.log('Received post request for accounts:', accounts.map(a => a.username));
    const results = await socialMediaService.postToAccounts(accounts, postData);
    return { success: true, results };
  } catch (error) {
    console.error('Error posting to social media:', error);
    return { success: false, error: error.message };
  }
});

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
