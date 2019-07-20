import { app } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
  MOBX_DEVTOOLS,
  VUEJS_DEVTOOLS,
  ANGULARJS_BATARANG,
  APOLLO_DEVELOPER_TOOLS
} from 'electron-devtools-installer';
import SSBBrowserWindow from './SSBBrowserWindow';

const devToolsTypes = {
  react: REACT_DEVELOPER_TOOLS,
  redux: REDUX_DEVTOOLS,
  mobx: MOBX_DEVTOOLS,
  vue: VUEJS_DEVTOOLS,
  angularjs: ANGULARJS_BATARANG,
  apollo: APOLLO_DEVELOPER_TOOLS
};

type DevToolsTypes =
  | 'react'
  | 'redux'
  | 'mobx'
  | 'vue'
  | 'angularjs'
  | 'apollo';

export default class App {
  private browserWindow: SSBBrowserWindow;
  private originalUrl: string;
  private screen: number;
  private match: string;
  private devTools: DevToolsTypes[];

  private createWindow = async () => {
    if (this.devTools) {
      await Promise.all(
        this.devTools.map(extension => {
          return installExtension(devToolsTypes[extension]);
        })
      );
    }
    this.browserWindow = new SSBBrowserWindow({
      screen: this.screen,
      match: this.match
    });
    this.browserWindow.loadUrl(this.originalUrl);
  };

  public constructor({ url, screen, match, debuggingPort, devTools = [] }) {
    this.originalUrl = url;
    this.screen = screen;
    this.match = match;
    this.devTools = devTools;

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
