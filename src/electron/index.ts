import * as electron from 'electron';
import * as meow from 'meow';
import * as path from 'path';
import SSBBrowserView from './SSBBrowserView';
import App from './App';

const cli = meow(``);

const { url, screen, match } = cli.flags;
const app = new App({ url, screen, match });
