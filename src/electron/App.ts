import { app, BrowserWindow, BrowserView } from 'electron';
import SSBBrowserWindow from './SSBBrowserWindow';

export default class App {
  private parentWindow: SSBBrowserWindow;
  private originalUrl: string;
  private screen: number;
  private match: string;

  createWindow = () => {
    this.parentWindow = new SSBBrowserWindow({
      screen: this.screen,
      match: this.match
    });
    this.parentWindow.loadUrl(this.originalUrl);
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
