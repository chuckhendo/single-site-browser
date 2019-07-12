import electron = require('electron');
import * as windowStateKeeper from 'electron-window-state';
import { BrowserWindow } from 'electron';

export default class SSBBrowserWindow {
  public window: Electron.BrowserWindow;
  private browserView: Electron.BrowserView;
  private match: string;

  public constructor(options) {
    this.match = options.match;
    let screenBounds = {
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined
    };

    if (options.screen) {
      const screens = electron.screen.getAllDisplays();
      const screenObj = screens[options.screen - 1];
      if (screenObj) {
        screenBounds = { ...screenObj.bounds, ...screenObj.workArea };
      }
    }

    let mainWindowState = windowStateKeeper({
      defaultWidth: 1000,
      defaultHeight: 800
    });

    this.window = new BrowserWindow({
      x: screenBounds.x || mainWindowState.x,
      y: screenBounds.y || mainWindowState.y,
      width: screenBounds.width || mainWindowState.width,
      height: screenBounds.height || mainWindowState.height,
      webPreferences: {
        nodeIntegration: true
      }
    });

    // load renderer for UI
    this.window.loadFile('../../public/index.html');
    this.window.webContents.openDevTools();

    mainWindowState.manage(this.window);

    this.window.on('closed', () => {
      this.window = null;
    });
  }

  public addBrowserView(browserView: Electron.BrowserView) {
    this.browserView = browserView;
    this.window.setBrowserView(browserView);
  }

  private setupBrowserView() {}
}
