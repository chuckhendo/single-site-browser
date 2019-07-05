import { app } from 'electron';
import SSBBrowserWindow from './SSBBrowserWindow';
import SSBBrowserView from './SSBBrowserView';

export default class App {
  private parentWindow: SSBBrowserWindow;
  private browserView: SSBBrowserView;
  private originalUrl: string;
  private screen: number;
  private match: string;

  createWindow = () => {
    this.parentWindow = new SSBBrowserWindow({
      screen: this.screen,
      match: this.match
    });

    this.browserView = new SSBBrowserView({
      match: this.match
    });

    this.parentWindow.addBrowserView(this.browserView.view);
    const contentSize = this.parentWindow.window.getContentSize();

    const bounds = {
      x: 0,
      y: 0,
      width: contentSize[0],
      height: contentSize[1]
    };

    this.browserView.initialize(bounds);

    this.browserView.loadUrl(this.originalUrl);

    // update window title to "[PAGE TITLE] ([URL])"
    this.browserView.webContents.on('page-title-updated', (event, title) => {
      this.parentWindow.window.setTitle(
        `${title} (${this.browserView.webContents.getURL()})`
      );
    });
  };

  constructor({ url, screen, match }) {
    this.originalUrl = url;
    this.screen = screen;
    this.match = match;

    app.on('ready', this.createWindow);

    app.on('window-all-closed', () => {
      app.quit();
    });

    app.on('activate', () => {
      if (this.parentWindow === null) {
        this.createWindow();
      }
    });
  }
}
