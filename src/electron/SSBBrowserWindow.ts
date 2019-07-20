import * as micromatch from 'micromatch';
import electron = require('electron');
import * as windowStateKeeper from 'electron-window-state';
import { BrowserWindow } from 'electron';

const protocolMatch = new RegExp(/.*:\/\//);

const isMac = process.platform === 'darwin';

enum ShortcutType {
  None,
  Back,
  Forward,
  Home
}

const defaultShortcutValues = {
  shift: false,
  control: false,
  alt: false,
  meta: false,
  type: 'keyDown'
};

const shortcuts = [
  {
    ...defaultShortcutValues,
    shortcutType: ShortcutType.Back,
    key: 'ArrowLeft',
    meta: isMac,
    alt: !isMac
  },
  {
    ...defaultShortcutValues,
    shortcutType: ShortcutType.Forward,
    key: 'ArrowRight',
    meta: isMac,
    alt: !isMac
  },
  {
    ...defaultShortcutValues,
    shortcutType: ShortcutType.Home,
    key: 'h',
    meta: isMac,
    shift: isMac,
    alt: !isMac
  }
];

export default class SSBBrowserWindow {
  public window: Electron.BrowserWindow;
  public webContents: Electron.WebContents;
  private match: string;
  private siteHost: string;
  private baseUrl: string;

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

    this.webContents = this.window.webContents;

    mainWindowState.manage(this.window);

    this.window.webContents.openDevTools();

    this.window.on('closed', () => {
      this.window = null;
    });

    // events to determine if should be opened in external browser
    this.webContents.on('will-navigate', this.determineIfExternal);
    this.webContents.on('new-window', this.determineIfExternal);

    this.bindEvents();
  }

  public loadUrl(url: string) {
    this.baseUrl = url;
    this.webContents.loadURL(url);
    this.siteHost = new URL(url).host;
  }

  public goBack() {
    this.webContents.goBack();
  }

  public goForward() {
    this.webContents.goForward();
  }

  public goHome() {
    this.webContents.loadURL(this.baseUrl);
  }

  private determineIfExternal = (event: Electron.Event, url: string) => {
    const newUrl = new URL(url);
    let isSameSite = this.siteHost === newUrl.host;
    const match = this.getMatchUrl(url);

    if (match) {
      isSameSite = micromatch.isMatch(url, match);
    }

    if (!isSameSite) {
      event.preventDefault();
      open(url);
    }
  };

  private getMatchUrl(url: string) {
    if (!this.match) return undefined;
    const { protocol } = new URL(url);
    return protocolMatch.test(this.match)
      ? this.match
      : `${protocol}//${this.match}`;
  }

  private bindEvents() {
    this.webContents.on('before-input-event', (event, input) => {
      const type = this.getTypeForInput(input);
      if (type === ShortcutType.Back) {
        this.goBack();
      } else if (type === ShortcutType.Forward) {
        this.goForward();
      } else if (type === ShortcutType.Home) {
        this.goHome();
      }
    });
  }

  private getTypeForInput(input): ShortcutType {
    if (input.type !== 'keyDown') return;
    const foundShortcut = shortcuts.find(shortcut => {
      const keys = Object.keys(shortcut);
      return keys.every(key => {
        if (key === 'shortcutType') return true;
        return shortcut[key] === input[key];
      });
    });

    if (!foundShortcut) return ShortcutType.None;
    return foundShortcut.shortcutType;
  }

  private setupBrowserView() {}
}
