import * as meow from 'meow';
import App from './App';

const cli = meow(``);

const { url, screen, match, debuggingPort } = cli.flags;
new App({ url, screen, match, debuggingPort });
