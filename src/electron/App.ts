import { app } from 'electron';
import SSBBrowserWindow from './SSBBrowserWindow';

export default class App {
  private browserWindow: SSBBrowserWindow;
  private originalUrl: string;
  private screen: number;
  private match: string;

  private createWindow = () => {
    this.browserWindow = new SSBBrowserWindow({
      screen: this.screen,
      match: this.match
    });
    this.browserWindow.loadUrl(this.originalUrl);
  };

  public constructor({ url, screen, match, debuggingPort }) {
    this.originalUrl = url;
    this.screen = screen;
    this.match = match;

    if (debuggingPort) {
      app.commandLine.appendSwitch('remote-debugging-port', debuggingPort);
    }

    app.on('ready', this.createWindow);

    app.on('window-all-closed', () => {
      app.quit();
    });

    app.on('activate', () => {
      if (this.browserWindow === null) {
        this.createWindow();
      }
    });
  }
}
