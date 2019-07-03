import * as electron from 'electron';
import { app, BrowserWindow } from 'electron';
import * as meow from 'meow';
import * as path from 'path';
import * as open from 'open';
import * as micromatch from 'micromatch';
import * as windowStateKeeper from 'electron-window-state';

const cli = meow(``);

const { url: siteUrl, screen } = cli.flags;
const { host: siteHost } = new URL(siteUrl);
const protocolMatch = new RegExp(/.*:\/\//);

function getMatchUrl(url) {
  const { match } = cli.flags;
  if (!match) return undefined;
  const { protocol } = new URL(url);
  return protocolMatch.test(match) ? match : `${protocol}//${match}`;
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  let screenBounds = {
    x: undefined,
    y: undefined,
    width: undefined,
    height: undefined
  };
  if (screen) {
    const screens = electron.screen.getAllDisplays();
    const screenObj = screens[screen - 1];
    if (screenObj) {
      screenBounds = { ...screenObj.bounds, ...screenObj.workArea };
    }
  }

  // Create the browser window.
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  });

  // Create the window using the state information
  mainWindow = new BrowserWindow({
    x: screenBounds.x || mainWindowState.x,
    y: screenBounds.y || mainWindowState.y,
    width: screenBounds.width || mainWindowState.width,
    height: screenBounds.height || mainWindowState.height,
    webPreferences: {
      nodeIntegration: false
    }
  });

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(mainWindow);

  const { webContents } = mainWindow;
  webContents.on('will-navigate', determineIfExternal);
  webContents.on('new-window', determineIfExternal);
  webContents.on('page-title-updated', (event, title) => {
    mainWindow.setTitle(`${title} (${webContents.getURL()})`);
    event.preventDefault();
    return false;
  });

  function determineIfExternal(event, url) {
    const newUrl = new URL(url);
    let isSameSite = siteHost === newUrl.host;
    const match = getMatchUrl(url);
    if (match) {
      isSameSite = micromatch.isMatch(url, match);
    }

    if (!isSameSite) {
      event.preventDefault();
      open(url);
    }
  }

  // and load the index.html of the app.
  mainWindow.loadURL(siteUrl);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
