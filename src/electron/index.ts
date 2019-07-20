import * as meow from 'meow';
import App from './App';

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const cli = meow(``);

const { url, screen, match, debuggingPort } = cli.flags;
new App({ url, screen, match, debuggingPort });
