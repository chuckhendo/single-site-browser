import electron = require('electron');
import * as windowStateKeeper from 'electron-window-state';
import { BrowserWindow } from 'electron';
import SSBBrowserView from './SSBBrowserView';

export default class SSBBrowserWindow {
  private window: Electron.BrowserWindow;
  private match: string;
  private browserView: SSBBrowserView;

  constructor(options) {
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
        nodeIntegration: false
      }
    });

    this.setupBrowserView();

    mainWindowState.manage(this.window);

    this.window.on('closed', () => {
      this.window = null;
    });
  }

  public loadUrl(url: string) {
    this.browserView.loadUrl(url);
  }

  private setupBrowserView() {
    this.browserView = new SSBBrowserView({
      match: this.match,
      parentWindow: this.window
    });
  }
}
