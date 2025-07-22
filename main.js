const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');

// Register custom protocol as privileged
protocol.registerSchemesAsPrivileged([
  { scheme: 'csmapp', privileges: { standard: true, secure: true } }
]);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false, // Hide until ready
    frame: false, // No window frame for splash
  });

  mainWindow.loadFile('splash.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Prevent navigation to csmapp://callback
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('csmapp://')) {
      event.preventDefault();
      mainWindow.webContents.send('auth-callback', url);
    }
  });

  // Prevent redirects to csmapp://callback
  mainWindow.webContents.on('will-redirect', (event, url) => {
    if (url.startsWith('csmapp://')) {
      event.preventDefault();
      mainWindow.webContents.send('auth-callback', url);
    }
  });

  // Prevent new windows/popups to csmapp://callback
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('csmapp://')) {
      mainWindow.webContents.send('auth-callback', url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, argv) => {
    // Windows: protocol URL will be in argv
    const url = argv.find(arg => arg.startsWith('csmapp://'));
    if (url && mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.webContents.send('auth-callback', url);
    }
  });

  app.whenReady().then(() => {
    protocol.registerFileProtocol('csmapp', (request, callback) => {
      // Do nothing, just needed to register protocol
      callback({ path: '' });
    });
    createWindow();

    // Windows: handle protocol launch on first run
    if (process.platform === 'win32') {
      const url = process.argv.find(arg => arg.startsWith('csmapp://'));
      if (url) {
        // Wait for window to be ready, then send the URL
        app.once('browser-window-created', () => {
          mainWindow.webContents.once('did-finish-load', () => {
            mainWindow.webContents.send('auth-callback', url);
          });
        });
      }
    }
  });
}

// Set the app as the default protocol client
if (!app.isDefaultProtocolClient('csmapp')) {
  app.setAsDefaultProtocolClient('csmapp');
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 