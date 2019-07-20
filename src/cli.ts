#!/usr/bin/env node

import * as meow from 'meow';
import { ssb } from '.';

const cli = meow(
  `
	Usage
	  $ ssb <url>

	Options
    --match Wildcard string to determine what should stay in single site browser or open in default browser
    --screen Index of which screen to put the window on
    --debugging-port Enable Chrome remote debugging

	Examples
    $ ssb http://localhost:3000
    $ ssb https://google.com --match *.google.com/*
    $ ssb http://localhost:3000 --screen 2
    $ ssb http://localhost:3000 --debugging-port 9222

`,
  {
    flags: {
      match: {
        type: 'string'
      },
      screen: {
        type: 'string'
      },
      debug: {
        type: 'boolean'
      },
      debuggingPort: {
        type: 'string'
      }
    }
  }
);

if (cli.input.length === 0) {
  cli.showHelp();
  process.exit();
}

const spawnStream = ssb(cli.input[0], cli.flags);

if (cli.flags.debug) {
  spawnStream.stdout.on('data', chunk => console.log(chunk.toString()));
  spawnStream.stderr.on('data', chunk => console.error(chunk.toString()));
} else {
  process.exit();
}
