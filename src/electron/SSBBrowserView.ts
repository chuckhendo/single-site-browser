import * as micromatch from 'micromatch';
import { BrowserView } from 'electron';
import * as open from 'open';

interface ISSBBrowserViewOptions {
  match: string;
  parentWindow: Electron.BrowserWindow;
}

const protocolMatch = new RegExp(/.*:\/\//);

export default class SSBBrowserView {
  public webContents: Electron.WebContents;
  private view: BrowserView;
  private match: string;
  private parentWindow: Electron.BrowserWindow;
  private siteHost: string;

  constructor(options: ISSBBrowserViewOptions) {
    this.view = new BrowserView();
    this.webContents = this.view.webContents;
    this.match = options.match;
    this.parentWindow = options.parentWindow;

    this.initialize();
  }

  public loadUrl(url: string) {
    this.webContents.loadURL(url);
    this.siteHost = new URL(url).host;
  }

  private initialize() {
    const contentSize = this.parentWindow.getContentSize();

    const bounds = {
      x: 0,
      y: 0,
      width: contentSize[0],
      height: contentSize[1]
    };

    this.parentWindow.setBrowserView(this.view);
    this.setSize(bounds);
    this.view.setAutoResize({ width: true, height: true });

    // events to determine if should be opened in external browser
    this.webContents.on('will-navigate', this.determineIfExternal);
    this.webContents.on('new-window', this.determineIfExternal);

    // update window title to "[PAGE TITLE] ([URL])"
    this.webContents.on('page-title-updated', (event, title) => {
      this.parentWindow.setTitle(`${title} (${this.webContents.getURL()})`);
    });

    // open developer tools
    this.webContents.openDevTools();
  }

  private setSize(bounds) {
    this.view.setBounds(bounds);
  }

  determineIfExternal = (event: Electron.Event, url: string) => {
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
}
