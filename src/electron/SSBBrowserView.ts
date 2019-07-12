import * as micromatch from 'micromatch';
import { BrowserView } from 'electron';
import * as open from 'open';

interface SSBBrowserViewOptions {
  match: string;
}

const protocolMatch = new RegExp(/.*:\/\//);

export default class SSBBrowserView {
  public webContents: Electron.WebContents;
  public view: BrowserView;
  private match: string;
  private siteHost: string;

  public constructor(options: SSBBrowserViewOptions) {
    this.view = new BrowserView();
    this.webContents = this.view.webContents;
    this.match = options.match;
  }

  public loadUrl(url: string) {
    this.webContents.loadURL(url);
    this.siteHost = new URL(url).host;
  }

  public initialize(bounds) {
    this.setSize(bounds);
    this.view.setAutoResize({ width: true, height: true });

    // events to determine if should be opened in external browser
    this.webContents.on('will-navigate', this.determineIfExternal);
    this.webContents.on('new-window', this.determineIfExternal);

    // open developer tools
    this.webContents.openDevTools();
  }

  private setSize(bounds) {
    this.view.setBounds(bounds);
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
}
